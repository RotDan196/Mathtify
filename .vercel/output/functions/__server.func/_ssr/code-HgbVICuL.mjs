import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { F as Ft } from "../_libs/monaco-editor__react.mjs";
import { M as ModuleShell, P as Panel, a as PanelHeader, I as IconButton } from "./ModuleShell-DRa0J7Mt.mjs";
import "../_libs/monaco-editor__loader.mjs";
import "../_libs/state-local.mjs";
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
  const [html, setHtml] = reactExports.useState(DEFAULT_HTML);
  const [css, setCss] = reactExports.useState(DEFAULT_CSS);
  const [js, setJs] = reactExports.useState(DEFAULT_JS);
  const [tab, setTab] = reactExports.useState("html");
  const [autorun, setAutorun] = reactExports.useState(true);
  const [snippets, setSnippets] = reactExports.useState([]);
  const [activeId, setActiveId] = reactExports.useState(null);
  const [srcDoc, setSrcDoc] = reactExports.useState("");
  reactExports.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setSnippets(JSON.parse(raw));
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(snippets));
    } catch {
    }
  }, [snippets]);
  const build = () => {
    const doc = `<!doctype html><html><head><meta charset="utf-8"/><style>${css}</style></head><body>${html}<script>try{${js}}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style="color:#f87171;padding:12px;font-family:monospace">'+e+'</pre>')}<\/script></body></html>`;
    setSrcDoc(doc);
  };
  reactExports.useEffect(() => {
    if (!autorun) return;
    const t = setTimeout(build, 400);
    return () => clearTimeout(t);
  }, [html, css, js, autorun]);
  reactExports.useEffect(() => {
    build();
  }, []);
  const save = () => {
    const name = prompt("Snippet name?", "Untitled");
    if (!name) return;
    const s = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      html,
      css,
      js,
      updated: Date.now()
    };
    setSnippets((arr) => [s, ...arr]);
    setActiveId(s.id);
  };
  const update = () => {
    if (!activeId) {
      save();
      return;
    }
    setSnippets((arr) => arr.map((s) => s.id === activeId ? {
      ...s,
      html,
      css,
      js,
      updated: Date.now()
    } : s));
  };
  const load = (s) => {
    setHtml(s.html);
    setCss(s.css);
    setJs(s.js);
    setActiveId(s.id);
  };
  const del = (id) => {
    setSnippets((arr) => arr.filter((s) => s.id !== id));
    if (activeId === id) setActiveId(null);
  };
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        build();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [html, css, js]);
  const value = tab === "html" ? html : tab === "css" ? css : js;
  const setValue = (v) => tab === "html" ? setHtml(v) : tab === "css" ? setCss(v) : setJs(v);
  const lang = tab === "html" ? "html" : tab === "css" ? "css" : "javascript";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleShell, { title: "Code Forge", tag: "CODE FORGE", accent: "from-emerald-300 to-teal-500", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 px-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: autorun, onChange: (e) => setAutorun(e.target.checked) }),
      " autorun"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: build, title: "Run", children: "▶ Run" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: update, title: "Save", children: "💾 Save" })
  ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Snippets" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[calc(100vh-220px)] space-y-1 overflow-auto p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "w-full rounded-lg border border-dashed border-white/15 px-2 py-2 text-xs text-muted-foreground hover:bg-white/5", children: "+ New snippet" }),
        snippets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-3 text-xs text-muted-foreground", children: "No saved snippets yet." }),
        snippets.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `group flex items-center gap-1 rounded-lg border px-2 py-1.5 transition ${activeId === s.id ? "border-primary/40 bg-primary/10" : "border-transparent hover:bg-white/5"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => load(s), className: "flex-1 truncate text-left text-sm", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del(s.id), className: "opacity-0 transition group-hover:opacity-100", children: "×" })
        ] }, s.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 bg-white/5 px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["html", "css", "js"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `rounded-md px-3 py-1 text-xs font-mono uppercase transition ${tab === t ? "bg-white/15 text-foreground" : "text-muted-foreground hover:bg-white/5"}`, children: t }, t)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 text-[10px] text-muted-foreground", children: "⌘+S to run" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[calc(100vh-260px)] min-h-[420px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ft, { defaultLanguage: lang, language: lang, value, onChange: (v) => setValue(v ?? ""), theme: "vs-dark", options: {
        fontSize: 13,
        minimap: {
          enabled: false
        },
        scrollBeyondLastLine: false,
        fontFamily: "ui-monospace, monospace",
        padding: {
          top: 10
        },
        automaticLayout: true,
        wordWrap: "on",
        tabSize: 2
      } }, tab) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: build, className: "rounded px-2 py-0.5 text-[10px] hover:bg-white/10", children: "Reload" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "preview", sandbox: "allow-scripts allow-modals", srcDoc, className: "h-[calc(100vh-260px)] min-h-[420px] w-full bg-white" })
    ] })
  ] }) });
}
export {
  CodeForge as component
};
