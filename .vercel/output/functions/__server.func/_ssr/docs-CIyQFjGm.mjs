import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { M as ModuleShell, P as Panel, a as PanelHeader, I as IconButton } from "./ModuleShell-DRa0J7Mt.mjs";
import { c as ChevronLeft, d as ChevronRight, Z as ZoomOut, e as ZoomIn, f as MousePointer2, P as PenLine, H as Highlighter, T as Type, E as Eraser } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function DocViewer() {
  const [loaded, setLoaded] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(1);
  const [zoom, setZoom] = reactExports.useState(1.2);
  const [query, setQuery] = reactExports.useState("");
  const [matches, setMatches] = reactExports.useState([]);
  const [matchIdx, setMatchIdx] = reactExports.useState(0);
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const [editMode, setEditMode] = reactExports.useState(false);
  const [annotationTool, setAnnotationTool] = reactExports.useState("pen");
  const [penColor, setPenColor] = reactExports.useState("#ef4444");
  const canvasRef = reactExports.useRef(null);
  const annotationCanvasRef = reactExports.useRef(null);
  const annotationsRef = reactExports.useRef({});
  const activeStrokeRef = reactExports.useRef(null);
  const docxRef = reactExports.useRef(null);
  const getAnnotationPoint = reactExports.useCallback((event) => {
    const canvas = annotationCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    };
  }, []);
  const drawAnnotation = reactExports.useCallback((ctx, annotation, width, height) => {
    if (annotation.tool === "text") {
      ctx.save();
      ctx.font = `${Math.max(14, width * 0.022)}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = annotation.color;
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 2;
      ctx.fillText(annotation.text, annotation.x * width, annotation.y * height);
      ctx.restore();
      return;
    }
    if (annotation.points.length < 2) return;
    ctx.save();
    ctx.globalAlpha = annotation.tool === "highlight" ? 0.42 : 1;
    ctx.globalCompositeOperation = annotation.tool === "highlight" ? "multiply" : "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = annotation.width;
    ctx.strokeStyle = annotation.color;
    ctx.beginPath();
    annotation.points.forEach((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  }, []);
  const redrawAnnotations = reactExports.useCallback(() => {
    const canvas = annotationCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const annotations = annotationsRef.current[page] || [];
    annotations.forEach((annotation) => drawAnnotation(ctx, annotation, canvas.width, canvas.height));
    if (activeStrokeRef.current) {
      drawAnnotation(ctx, activeStrokeRef.current, canvas.width, canvas.height);
    }
  }, [drawAnnotation, page]);
  const resizeAnnotationCanvas = reactExports.useCallback((width, height) => {
    const canvas = annotationCanvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    redrawAnnotations();
  }, [redrawAnnotations]);
  const addAnnotation = reactExports.useCallback((annotation) => {
    annotationsRef.current[page] = [...annotationsRef.current[page] || [], annotation];
    redrawAnnotations();
  }, [page, redrawAnnotations]);
  const clearAnnotations = reactExports.useCallback(() => {
    annotationsRef.current[page] = [];
    activeStrokeRef.current = null;
    redrawAnnotations();
  }, [page, redrawAnnotations]);
  const onFile = reactExports.useCallback(async (file) => {
    setErr(null);
    setBusy(true);
    setPage(1);
    setQuery("");
    setMatches([]);
    annotationsRef.current = {};
    activeStrokeRef.current = null;
    setEditMode(false);
    try {
      if (/\.pdf$/i.test(file.name)) {
        const pdfjs = await import("../_libs/pdfjs-dist.mjs");
        const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const buf = await file.arrayBuffer();
        const doc = await pdfjs.getDocument({
          data: buf
        }).promise;
        setLoaded({
          kind: "pdf",
          name: file.name,
          pages: doc.numPages,
          doc
        });
      } else if (/\.docx$/i.test(file.name)) {
        const mammoth = await import("../_libs/mammoth.mjs").then(function(n) {
          return n.m;
        });
        const buf = await file.arrayBuffer();
        const res = await mammoth.convertToHtml({
          arrayBuffer: buf
        });
        setLoaded({
          kind: "docx",
          name: file.name,
          html: res.value
        });
      } else {
        throw new Error("Formato non supportato. Carica un .pdf o .docx");
      }
    } catch (e) {
      setErr(e.message);
      setLoaded(null);
    } finally {
      setBusy(false);
    }
  }, []);
  reactExports.useEffect(() => {
    if (!loaded || loaded.kind !== "pdf") return;
    let cancelled = false;
    (async () => {
      const pg = await loaded.doc.getPage(page);
      if (cancelled) return;
      const viewport = pg.getViewport({
        scale: zoom
      });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = viewport.width + "px";
      canvas.style.height = viewport.height + "px";
      await pg.render({
        canvasContext: ctx,
        viewport,
        canvas
      }).promise;
      if (!cancelled) resizeAnnotationCanvas(viewport.width, viewport.height);
    })();
    return () => {
      cancelled = true;
    };
  }, [loaded, page, resizeAnnotationCanvas, zoom]);
  const runSearch = reactExports.useCallback(async () => {
    if (!loaded || !query.trim()) {
      setMatches([]);
      return;
    }
    if (loaded.kind === "pdf") {
      const q = query.toLowerCase();
      const hits = [];
      for (let i = 1; i <= loaded.pages; i++) {
        const pg = await loaded.doc.getPage(i);
        const tc = await pg.getTextContent();
        const text = tc.items.map((it) => it.str ?? "").join(" ").toLowerCase();
        if (text.includes(q)) hits.push(i);
      }
      setMatches(hits);
      setMatchIdx(0);
      if (hits.length) setPage(hits[0]);
    } else if (loaded.kind === "docx") {
      const el = docxRef.current;
      if (!el) return;
      el.querySelectorAll("mark[data-rv]").forEach((m) => {
        const parent = m.parentNode;
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
      const toWrap = [];
      let n;
      while (n = walker.nextNode()) {
        if (n.nodeValue && re.test(n.nodeValue)) {
          toWrap.push(n);
          re.lastIndex = 0;
        }
      }
      let count = 0;
      for (const t of toWrap) {
        const frag = document.createDocumentFragment();
        const parts = t.nodeValue.split(re);
        const found = t.nodeValue.match(re) || [];
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
        t.parentNode.replaceChild(frag, t);
      }
      setMatches(Array.from({
        length: count
      }, (_, i) => i + 1));
      setMatchIdx(0);
      const first = el.querySelector("mark[data-rv]");
      first?.scrollIntoView({
        block: "center"
      });
    }
  }, [loaded, query]);
  const goMatch = (dir) => {
    if (!matches.length) return;
    const ni = (matchIdx + dir + matches.length) % matches.length;
    setMatchIdx(ni);
    if (loaded?.kind === "pdf") setPage(matches[ni]);
    else if (loaded?.kind === "docx" && docxRef.current) {
      const marks = docxRef.current.querySelectorAll("mark[data-rv]");
      marks.forEach((m, i) => m.style.background = i === ni ? "#fde047" : "#fef08a");
      marks[ni]?.scrollIntoView({
        block: "center"
      });
    }
  };
  const onAnnotationPointerDown = (event) => {
    if (!editMode || loaded?.kind !== "pdf") return;
    const point = getAnnotationPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (annotationTool === "text") {
      const text = window.prompt("Testo annotazione");
      if (text?.trim()) {
        addAnnotation({
          color: penColor,
          text: text.trim(),
          tool: "text",
          x: point.x,
          y: point.y
        });
      }
      return;
    }
    activeStrokeRef.current = {
      color: annotationTool === "highlight" ? "rgba(250, 204, 21, 0.95)" : penColor,
      points: [point],
      tool: annotationTool,
      width: annotationTool === "highlight" ? 18 : 4
    };
    redrawAnnotations();
  };
  const onAnnotationPointerMove = (event) => {
    if (!activeStrokeRef.current || !editMode) return;
    const point = getAnnotationPoint(event);
    if (!point) return;
    activeStrokeRef.current.points.push(point);
    redrawAnnotations();
  };
  const onAnnotationPointerUp = (event) => {
    if (!activeStrokeRef.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const stroke = activeStrokeRef.current;
    activeStrokeRef.current = null;
    if (stroke.points.length > 1) addAnnotation(stroke);
    else redrawAnnotations();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleShell, { title: "Doc Viewer", tag: "DOC VIEWER", accent: "from-cyan-300 to-sky-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "File" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:bg-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,.docx", hidden: true, onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Drop or click to upload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: ".pdf or .docx" })
          ] }),
          busy && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Loading…" }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-rose-300", children: err }),
          loaded && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 truncate text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: loaded.name }),
            loaded.kind === "pdf" && ` · ${loaded.pages} pages`
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: (e) => {
              if (e.key === "Enter") runSearch();
            }, placeholder: "Find in document…", className: "flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-primary/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runSearch, className: "rounded-lg bg-cosmic px-3 text-sm font-medium text-primary-foreground", children: "Go" })
          ] }),
          matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              matchIdx + 1,
              " of ",
              matches.length,
              loaded?.kind === "pdf" ? " pages" : " hits"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: () => goMatch(-1), children: "↑" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: () => goMatch(1), children: "↓" })
            ] })
          ] })
        ] })
      ] }),
      loaded?.kind === "pdf" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pages" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: () => setPage((p) => Math.max(1, p - 1)), children: "‹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: loaded.pages, value: page, onChange: (e) => setPage(Math.min(loaded.pages, Math.max(1, parseInt(e.target.value || "1")))), className: "w-14 rounded bg-white/5 px-2 py-1 text-center" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              " / ",
              loaded.pages
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: () => setPage((p) => Math.min(loaded.pages, p + 1)), children: "›" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { className: "relative min-h-[60vh] w-full lg:mx-auto", children: [
      loaded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-card/80 px-2 py-2 shadow-2xl backdrop-blur-xl lg:bottom-auto lg:top-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolbarButton, { label: "Pagina precedente", disabled: loaded.kind !== "pdf" || page <= 1, onClick: () => {
          if (loaded.kind === "pdf") setPage((p) => Math.max(1, p - 1));
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-16 px-2 text-center font-mono text-[11px] text-muted-foreground", children: loaded.kind === "pdf" ? `${page}/${loaded.pages}` : "DOCX" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolbarButton, { label: "Pagina successiva", disabled: loaded.kind !== "pdf" || page >= loaded.pages, onClick: () => {
          if (loaded.kind === "pdf") setPage((p) => Math.min(loaded.pages, p + 1));
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 h-5 w-px bg-white/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolbarButton, { label: "Zoom out", disabled: zoom <= 0.4, onClick: () => setZoom((z) => Math.max(0.4, z - 0.2)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-12 px-1 text-center font-mono text-[11px] text-muted-foreground", children: [
          Math.round(zoom * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolbarButton, { label: "Zoom in", disabled: zoom >= 3, onClick: () => setZoom((z) => Math.min(3, z + 0.2)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" }) }),
        loaded.kind === "pdf" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 h-5 w-px bg-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolbarButton, { label: editMode ? "Modalita lettura" : "Modalita modifica", onClick: () => setEditMode((value) => !value), children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4" }) })
        ] })
      ] }),
      loaded?.kind === "pdf" && editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-2xl border border-white/10 bg-card/85 p-2 shadow-2xl backdrop-blur-xl lg:bottom-auto lg:left-auto lg:right-4 lg:top-16 lg:translate-x-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolButton, { active: annotationTool === "pen", label: "Disegna a mano libera", onClick: () => setAnnotationTool("pen"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolButton, { active: annotationTool === "highlight", label: "Evidenziatore", onClick: () => setAnnotationTool("highlight"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlighter, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolButton, { active: annotationTool === "text", label: "Aggiungi testo", onClick: () => setAnnotationTool("text"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 hidden h-6 w-px bg-white/10 sm:block" }),
        ["#ef4444", "#3b82f6", "#111827"].map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `Colore ${color}`, onClick: () => setPenColor(color), className: `h-8 w-8 rounded-full border transition hover:scale-105 ${penColor === color ? "border-white" : "border-white/20"}`, style: {
          background: color
        } }, color)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 hidden h-6 w-px bg-white/10 sm:block" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PdfToolButton, { label: "Pulisci annotazioni", onClick: clearAnnotations, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-[calc(100vh-220px)] min-h-[500px] w-full items-start justify-center overflow-auto bg-[oklch(0.10_0.02_270)] px-3 pb-24 pt-6 sm:px-6 lg:max-w-6xl lg:pb-6 lg:pt-20", children: [
        !loaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-center text-sm text-muted-foreground", children: "Carica un PDF o un DOCX per iniziare." }),
        loaded?.kind === "pdf" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-none rounded-lg shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "max-w-none rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: annotationCanvasRef, className: `absolute inset-0 max-w-none rounded-lg ${editMode ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"}`, onPointerDown: onAnnotationPointerDown, onPointerMove: onAnnotationPointerMove, onPointerUp: onAnnotationPointerUp, onPointerCancel: onAnnotationPointerUp })
        ] }),
        loaded?.kind === "docx" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: docxRef, style: {
          zoom
        }, className: "docx-content min-h-full w-full max-w-3xl rounded-lg bg-white p-5 text-[oklch(0.18_0.03_270)] shadow-2xl sm:p-10", dangerouslySetInnerHTML: {
          __html: loaded.html
        } })
      ] })
    ] })
  ] }) });
}
function PdfToolbarButton({
  children,
  disabled,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": label, disabled, onClick, className: "flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35", type: "button", children });
}
function PdfToolButton({
  active,
  children,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": label, onClick, className: `flex h-9 w-9 items-center justify-center rounded-full transition ${active ? "bg-cyan-300 text-black" : "text-foreground hover:bg-white/10"}`, type: "button", title: label, children });
}
function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export {
  DocViewer as component
};
