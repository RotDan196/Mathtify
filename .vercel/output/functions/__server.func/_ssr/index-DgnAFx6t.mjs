import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
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
const modules = [{
  tag: "GRAPH LAB",
  title: "Plot the impossible",
  desc: "Canvas geometrico/grafico interattivo con tastiera matematica, pan, zoom e parametri live.",
  accent: "from-fuchsia-400 to-purple-500",
  to: "/graph",
  soon: false
}, {
  tag: "DOC VIEWER",
  title: "Read anything, anywhere",
  desc: "Visualizzatore nativo PDF e DOCX con zoom, ricerca testo e paginazione.",
  accent: "from-cyan-300 to-sky-500",
  to: "/docs",
  soon: false
}, {
  tag: "CODE FORGE",
  title: "Run code in orbit",
  desc: "Editor in-browser con preview live HTML/CSS/JS e snippet salvati.",
  accent: "from-emerald-300 to-teal-500",
  to: "/code",
  soon: false
}, {
  tag: "WHITEBOARD",
  title: "Think out loud",
  desc: "Canvas infinito per sketch, forme e sticky notes. Export PNG con un click.",
  accent: "from-amber-300 to-orange-500",
  to: "/whiteboard",
  soon: false
}, {
  tag: "DATA LENS",
  title: "Charts that breathe",
  desc: "Carica un CSV: grafici interattivi linea, barre e scatter con filtri.",
  accent: "from-rose-300 to-pink-500",
  to: "/data",
  soon: false
}, {
  tag: "AUDIO LAB",
  title: "Sound & Frequencies",
  desc: "Editor MP3 nel browser. Taglia tracce, regola il gain e visualizza lo spettro audio in tempo reale.",
  accent: "from-green-400 to-emerald-500",
  badgeClass: "bg-green-500/20 text-green-300",
  to: "/audio",
  soon: false
}, {
  tag: "YOUTUBE VIDEO",
  title: "YouTube Downloader",
  desc: "Downloader YouTube con selezione qualita e stream reale generato dal backend locale yt-dlp.",
  accent: "from-red-500 to-rose-500",
  badgeClass: "bg-red-500/20 text-red-300",
  to: "/youtube",
  soon: false
}, {
  tag: "AI STUDIO",
  title: "Your cosmic copilot",
  desc: "Workspace chat-first che collega ogni modulo. Coming soon.",
  accent: "from-indigo-300 to-violet-500",
  to: "/",
  soon: true
}];
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-x-hidden bg-[#0a0a0f] text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_-10%,rgba(168,85,247,0.30),transparent_42%),radial-gradient(ellipse_at_84%_12%,rgba(6,182,212,0.18),transparent_42%),radial-gradient(ellipse_at_48%_100%,rgba(236,72,153,0.18),transparent_46%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_24%,rgba(0,0,0,0.45))]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 grid-bg opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modules, {})
  ] });
}
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogoMark, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold tracking-tight text-white", children: "RotVerse" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-8 text-sm text-white/50 md:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#modules", className: "transition hover:text-white", children: "Modules" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/graph", className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 shadow-2xl backdrop-blur-2xl transition hover:bg-white/10 hover:text-white", children: "Launch app ->" })
  ] });
}
function LogoMark() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-[2px] rounded-[10px] bg-black/35" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "relative h-5 w-5 text-cyan-200", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3", fill: "currentColor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "12", rx: "10", ry: "4", stroke: "currentColor", strokeWidth: "1.4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "12", rx: "10", ry: "4", stroke: "currentColor", strokeWidth: "1.4", transform: "rotate(60 12 12)" })
    ] })
  ] });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-6 md:pb-14 md:pt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50 shadow-2xl backdrop-blur-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" }),
      "v0.1 - public preview"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-semibold leading-[1.02] text-white/95 md:text-7xl", children: [
      "A universe of ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan-200/95", children: "interactive" }),
      " tools."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/55 md:text-lg", children: "RotVerse riunisce graphing, documenti, audio e strumenti creativi in un hub scuro, minimale e fluido." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#modules", className: "group relative overflow-hidden rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-2xl transition hover:scale-[1.02] hover:bg-white/15", children: "Esplora i moduli" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/graph", className: "rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 shadow-2xl backdrop-blur-2xl transition hover:bg-white/10 hover:text-white", children: "Apri Graph Lab ->" })
    ] })
  ] }) });
}
function Modules() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "modules", className: "relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-6 md:pt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: modules.map((module, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { ...module, index }, module.tag)) }) });
}
function ModuleCard({
  tag,
  title,
  desc,
  accent,
  badgeClass,
  soon,
  to
}) {
  const ref = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState({
    x: -200,
    y: -200
  });
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, onMouseMove: (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }, className: "group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100", style: {
      background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.16), transparent 42%)`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block rounded-full ${badgeClass ?? `bg-gradient-to-r ${accent} text-black/80`} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest`, children: tag }),
      soon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/45", children: "soon" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "relative mt-5 font-display text-2xl font-semibold leading-tight text-white", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative mt-2 text-sm leading-relaxed text-white/55", children: desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-6 flex items-center gap-2 text-sm font-medium text-white/75 transition group-hover:text-white", children: [
      soon ? "Coming soon" : "Apri modulo",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition group-hover:translate-x-1", children: "->" })
    ] })
  ] });
  if (soon) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: inner });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, className: "block h-full", children: inner });
}
export {
  Index as component
};
