import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { IconButton, ModuleShell, Panel, PanelHeader } from "@/components/ModuleShell";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Code Forge — RotVerse" },
      { name: "description", content: "Editor di codice in-browser con preview live HTML/CSS/JS e snippet salvati." },
    ],
  }),
  component: CodeForge,
});

type Snippet = { id: string; name: string; html: string; css: string; js: string; updated: number };

const STORAGE = "rotverse.snippets";
const DEFAULT_HTML = `<div class="card">
  <h1>RotVerse</h1>
  <p>Edit me and hit <b>Run</b> ⌘+S</p>
  <button id="btn">Click ✨</button>
</div>`;
const DEFAULT_CSS = `body { font-family: Inter, sans-serif; background: #0f0a1f; color: #fff; display: grid; place-items: center; min-height: 100vh; margin: 0; }
.card { padding: 32px 40px; border-radius: 20px; background: linear-gradient(135deg, #c026d3, #06b6d4); box-shadow: 0 20px 60px -20px rgba(192,38,211,.6); text-align: center; }
button { margin-top: 12px; padding: 10px 20px; border-radius: 999px; border: 0; font-weight: 600; cursor: pointer; }`;
const DEFAULT_JS = `document.getElementById('btn').addEventListener('click', () => {
  document.body.style.background = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
});`;

function CodeForge() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [autorun, setAutorun] = useState(true);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setSnippets(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(snippets)); } catch {}
  }, [snippets]);

  const build = () => {
    const doc = `<!doctype html><html><head><meta charset="utf-8"/><style>${css}</style></head><body>${html}<script>try{${js}}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style="color:#f87171;padding:12px;font-family:monospace">'+e+'</pre>')}<\/script></body></html>`;
    setSrcDoc(doc);
  };
  useEffect(() => {
    if (!autorun) return;
    const t = setTimeout(build, 400);
    return () => clearTimeout(t);
  }, [html, css, js, autorun]);
  useEffect(() => { build(); /* initial */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    const name = prompt("Snippet name?", "Untitled");
    if (!name) return;
    const s: Snippet = { id: Math.random().toString(36).slice(2, 9), name, html, css, js, updated: Date.now() };
    setSnippets((arr) => [s, ...arr]);
    setActiveId(s.id);
  };
  const update = () => {
    if (!activeId) { save(); return; }
    setSnippets((arr) => arr.map((s) => s.id === activeId ? { ...s, html, css, js, updated: Date.now() } : s));
  };
  const load = (s: Snippet) => { setHtml(s.html); setCss(s.css); setJs(s.js); setActiveId(s.id); };
  const del = (id: string) => { setSnippets((arr) => arr.filter((s) => s.id !== id)); if (activeId === id) setActiveId(null); };

  // ⌘+S / Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); build(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [html, css, js]);

  const value = tab === "html" ? html : tab === "css" ? css : js;
  const setValue = (v: string) => tab === "html" ? setHtml(v) : tab === "css" ? setCss(v) : setJs(v);
  const lang = tab === "html" ? "html" : tab === "css" ? "css" : "javascript";

  return (
    <ModuleShell
      title="Code Forge"
      tag="CODE FORGE"
      accent="from-emerald-300 to-teal-500"
      actions={
        <>
          <label className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={autorun} onChange={(e) => setAutorun(e.target.checked)} /> autorun
          </label>
          <IconButton onClick={build} title="Run">▶ Run</IconButton>
          <IconButton onClick={update} title="Save">💾 Save</IconButton>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr_1fr]">
        <Panel>
          <PanelHeader><span>Snippets</span></PanelHeader>
          <div className="max-h-[calc(100vh-220px)] space-y-1 overflow-auto p-2">
            <button onClick={save} className="w-full rounded-lg border border-dashed border-white/15 px-2 py-2 text-xs text-muted-foreground hover:bg-white/5">+ New snippet</button>
            {snippets.length === 0 && <p className="px-2 py-3 text-xs text-muted-foreground">No saved snippets yet.</p>}
            {snippets.map((s) => (
              <div key={s.id}
                className={`group flex items-center gap-1 rounded-lg border px-2 py-1.5 transition ${activeId === s.id ? "border-primary/40 bg-primary/10" : "border-transparent hover:bg-white/5"}`}>
                <button onClick={() => load(s)} className="flex-1 truncate text-left text-sm">{s.name}</button>
                <button onClick={() => del(s.id)} className="opacity-0 transition group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-2 py-1.5">
            <div className="flex gap-1">
              {(["html", "css", "js"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1 text-xs font-mono uppercase transition ${tab === t ? "bg-white/15 text-foreground" : "text-muted-foreground hover:bg-white/5"}`}
                >{t}</button>
              ))}
            </div>
            <span className="px-2 text-[10px] text-muted-foreground">⌘+S to run</span>
          </div>
          <div className="h-[calc(100vh-260px)] min-h-[420px]">
            <Editor
              key={tab}
              defaultLanguage={lang}
              language={lang}
              value={value}
              onChange={(v) => setValue(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false,
                fontFamily: "ui-monospace, monospace", padding: { top: 10 },
                automaticLayout: true, wordWrap: "on", tabSize: 2,
              }}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader>
            <span>Preview</span>
            <button onClick={build} className="rounded px-2 py-0.5 text-[10px] hover:bg-white/10">Reload</button>
          </PanelHeader>
          <iframe
            title="preview"
            sandbox="allow-scripts allow-modals"
            srcDoc={srcDoc}
            className="h-[calc(100vh-260px)] min-h-[420px] w-full bg-white"
          />
        </Panel>
      </div>
    </ModuleShell>
  );
}
