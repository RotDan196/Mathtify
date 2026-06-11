import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { IconButton, ModuleShell, Panel, PanelHeader } from "@/components/ModuleShell";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Doc Viewer — RotVerse" },
      {
        name: "description",
        content: "Visualizza PDF e DOCX nel browser con zoom, ricerca e paginazione.",
      },
    ],
  }),
  component: DocViewer,
});

type Loaded =
  | { kind: "pdf"; name: string; pages: number; doc: PdfDocument }
  | { kind: "docx"; name: string; html: string }
  | null;

type PdfViewport = {
  width: number;
  height: number;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => PdfViewport;
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
  render: (options: {
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }) => { promise: Promise<void> };
};

type PdfDocument = {
  numPages: number;
  getPage: (page: number) => Promise<PdfPage>;
};

type PdfTextItem = {
  str?: string;
};

type PdfJsModule = {
  version: string;
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (options: { data: ArrayBuffer }) => { promise: Promise<PdfDocument> };
};

type MammothModule = {
  convertToHtml: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
};

function DocViewer() {
  const [loaded, setLoaded] = useState<Loaded>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<number[]>([]);
  const [matchIdx, setMatchIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docxRef = useRef<HTMLDivElement>(null);

  const onFile = useCallback(async (file: File) => {
    setErr(null);
    setBusy(true);
    setPage(1);
    setQuery("");
    setMatches([]);
    try {
      if (/\.pdf$/i.test(file.name)) {
        const pdfjs = (await import("pdfjs-dist")) as PdfJsModule;
        // worker via cdn for v6
        const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const buf = await file.arrayBuffer();
        const doc = await pdfjs.getDocument({ data: buf }).promise;
        setLoaded({ kind: "pdf", name: file.name, pages: doc.numPages, doc });
      } else if (/\.docx$/i.test(file.name)) {
        const mammoth = (await import("mammoth/mammoth.browser")) as MammothModule;
        const buf = await file.arrayBuffer();
        const res = await mammoth.convertToHtml({ arrayBuffer: buf });
        setLoaded({ kind: "docx", name: file.name, html: res.value });
      } else {
        throw new Error("Formato non supportato. Carica un .pdf o .docx");
      }
    } catch (e) {
      setErr((e as Error).message);
      setLoaded(null);
    } finally {
      setBusy(false);
    }
  }, []);

  // Render PDF page
  useEffect(() => {
    if (!loaded || loaded.kind !== "pdf") return;
    let cancelled = false;
    (async () => {
      const pg = await loaded.doc.getPage(page);
      if (cancelled) return;
      const viewport = pg.getViewport({ scale: zoom });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = viewport.width + "px";
      canvas.style.height = viewport.height + "px";
      await pg.render({ canvasContext: ctx, viewport, canvas }).promise;
    })();
    return () => {
      cancelled = true;
    };
  }, [loaded, page, zoom]);

  // Search in PDF
  const runSearch = useCallback(async () => {
    if (!loaded || !query.trim()) {
      setMatches([]);
      return;
    }
    if (loaded.kind === "pdf") {
      const q = query.toLowerCase();
      const hits: number[] = [];
      for (let i = 1; i <= loaded.pages; i++) {
        const pg = await loaded.doc.getPage(i);
        const tc = await pg.getTextContent();
        const text = tc.items
          .map((it) => it.str ?? "")
          .join(" ")
          .toLowerCase();
        if (text.includes(q)) hits.push(i);
      }
      setMatches(hits);
      setMatchIdx(0);
      if (hits.length) setPage(hits[0]);
    } else if (loaded.kind === "docx") {
      const el = docxRef.current;
      if (!el) return;
      // remove old marks
      el.querySelectorAll("mark[data-rv]").forEach((m) => {
        const parent = m.parentNode!;
        parent.replaceChild(document.createTextNode(m.textContent || ""), m);
        parent.normalize();
      });
      const q = query.trim();
      if (!q) {
        setMatches([]);
        return;
      }
      const re = new RegExp(escapeReg(q), "gi");
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const toWrap: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if (n.nodeValue && re.test(n.nodeValue)) {
          toWrap.push(n as Text);
          re.lastIndex = 0;
        }
      }
      let count = 0;
      for (const t of toWrap) {
        const frag = document.createDocumentFragment();
        const parts = t.nodeValue!.split(re);
        const found = t.nodeValue!.match(re) || [];
        parts.forEach((p, i) => {
          frag.appendChild(document.createTextNode(p));
          if (i < found.length) {
            const m = document.createElement("mark");
            m.setAttribute("data-rv", "1");
            m.textContent = found[i];
            frag.appendChild(m);
            count++;
          }
        });
        t.parentNode!.replaceChild(frag, t);
      }
      setMatches(Array.from({ length: count }, (_, i) => i + 1));
      setMatchIdx(0);
      const first = el.querySelector("mark[data-rv]");
      first?.scrollIntoView({ block: "center" });
    }
  }, [loaded, query]);

  const goMatch = (dir: 1 | -1) => {
    if (!matches.length) return;
    const ni = (matchIdx + dir + matches.length) % matches.length;
    setMatchIdx(ni);
    if (loaded?.kind === "pdf") setPage(matches[ni]);
    else if (loaded?.kind === "docx" && docxRef.current) {
      const marks = docxRef.current.querySelectorAll("mark[data-rv]");
      marks.forEach(
        (m, i) => ((m as HTMLElement).style.background = i === ni ? "#fde047" : "#fef08a"),
      );
      (marks[ni] as HTMLElement)?.scrollIntoView({ block: "center" });
    }
  };

  return (
    <ModuleShell title="Doc Viewer" tag="DOC VIEWER" accent="from-cyan-300 to-sky-500">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader>
              <span>File</span>
            </PanelHeader>
            <div className="p-4">
              <label className="block cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:bg-white/10">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
                <div className="text-sm font-medium">Drop or click to upload</div>
                <div className="mt-1 text-xs text-muted-foreground">.pdf or .docx</div>
              </label>
              {busy && <p className="mt-3 text-xs text-muted-foreground">Loading…</p>}
              {err && <p className="mt-3 text-xs text-rose-300">{err}</p>}
              {loaded && (
                <p className="mt-3 truncate text-xs text-muted-foreground">
                  <span className="text-foreground">{loaded.name}</span>
                  {loaded.kind === "pdf" && ` · ${loaded.pages} pages`}
                </p>
              )}
            </div>
          </Panel>

          <Panel>
            <PanelHeader>
              <span>Search</span>
            </PanelHeader>
            <div className="space-y-2 p-3">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                  placeholder="Find in document…"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-primary/40"
                />
                <button
                  onClick={runSearch}
                  className="rounded-lg bg-cosmic px-3 text-sm font-medium text-primary-foreground"
                >
                  Go
                </button>
              </div>
              {matches.length > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {matchIdx + 1} of {matches.length}
                    {loaded?.kind === "pdf" ? " pages" : " hits"}
                  </span>
                  <div className="flex gap-1">
                    <IconButton onClick={() => goMatch(-1)}>↑</IconButton>
                    <IconButton onClick={() => goMatch(1)}>↓</IconButton>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {loaded?.kind === "pdf" && (
            <Panel>
              <PanelHeader>
                <span>Pages</span>
              </PanelHeader>
              <div className="flex items-center justify-between p-3 text-sm">
                <IconButton onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</IconButton>
                <span className="font-mono">
                  <input
                    type="number"
                    min={1}
                    max={loaded.pages}
                    value={page}
                    onChange={(e) =>
                      setPage(Math.min(loaded.pages, Math.max(1, parseInt(e.target.value || "1"))))
                    }
                    className="w-14 rounded bg-white/5 px-2 py-1 text-center"
                  />
                  <span className="text-muted-foreground"> / {loaded.pages}</span>
                </span>
                <IconButton onClick={() => setPage((p) => Math.min(loaded.pages, p + 1))}>
                  ›
                </IconButton>
              </div>
            </Panel>
          )}
        </div>

        <Panel className="relative min-h-[60vh] w-full lg:mx-auto">
          {loaded && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-card/80 px-2 py-2 shadow-2xl backdrop-blur-xl lg:bottom-auto lg:top-4">
              <PdfToolbarButton
                label="Pagina precedente"
                disabled={loaded.kind !== "pdf" || page <= 1}
                onClick={() => {
                  if (loaded.kind === "pdf") setPage((p) => Math.max(1, p - 1));
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </PdfToolbarButton>
              <span className="min-w-16 px-2 text-center font-mono text-[11px] text-muted-foreground">
                {loaded.kind === "pdf" ? `${page}/${loaded.pages}` : "DOCX"}
              </span>
              <PdfToolbarButton
                label="Pagina successiva"
                disabled={loaded.kind !== "pdf" || page >= loaded.pages}
                onClick={() => {
                  if (loaded.kind === "pdf") setPage((p) => Math.min(loaded.pages, p + 1));
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </PdfToolbarButton>
              <span className="mx-1 h-5 w-px bg-white/10" />
              <PdfToolbarButton
                label="Zoom out"
                disabled={zoom <= 0.4}
                onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
              >
                <ZoomOut className="h-4 w-4" />
              </PdfToolbarButton>
              <span className="min-w-12 px-1 text-center font-mono text-[11px] text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <PdfToolbarButton
                label="Zoom in"
                disabled={zoom >= 3}
                onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              >
                <ZoomIn className="h-4 w-4" />
              </PdfToolbarButton>
            </div>
          )}

          <div className="mx-auto flex h-[calc(100vh-220px)] min-h-[500px] w-full items-start justify-center overflow-auto bg-[oklch(0.10_0.02_270)] px-3 pb-24 pt-6 sm:px-6 lg:max-w-6xl lg:pb-6 lg:pt-20">
            {!loaded && (
              <div className="flex h-full w-full items-center justify-center text-center text-sm text-muted-foreground">
                Carica un PDF o un DOCX per iniziare.
              </div>
            )}
            {loaded?.kind === "pdf" && (
              <canvas ref={canvasRef} className="max-w-none rounded-lg shadow-2xl" />
            )}
            {loaded?.kind === "docx" && (
              <div
                ref={docxRef}
                style={{ zoom }}
                className="docx-content min-h-full w-full max-w-3xl rounded-lg bg-white p-5 text-[oklch(0.18_0.03_270)] shadow-2xl sm:p-10"
                dangerouslySetInnerHTML={{ __html: loaded.html }}
              />
            )}
          </div>
        </Panel>
      </div>
    </ModuleShell>
  );
}

function PdfToolbarButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
      type="button"
    >
      {children}
    </button>
  );
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
