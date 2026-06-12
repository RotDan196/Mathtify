import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
  desc: "Visualizzatore nativo PDF & DOCX con zoom, ricerca testo e paginazione.",
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
  desc: "Carica un CSV: grafici interattivi (linea/barre/scatter) con filtri.",
  accent: "from-rose-300 to-pink-500",
  to: "/data",
  soon: false
}, {
  tag: "AUDIO LAB",
  title: "Sound & Frequencies",
  desc: "Editor MP3 nel browser. Taglia tracce, regola il gain e visualizza lo spettro audio in tempo reale con le Web Audio API.",
  accent: "from-green-400 to-emerald-500",
  badgeClass: "bg-green-500/20 text-green-400",
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
  desc: "Workspace chat-first che collega ogni modulo — coming soon.",
  accent: "from-indigo-300 to-violet-500",
  to: "/",
  soon: true
}];
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-x-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-aurora" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modules, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Showcase, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogoMark, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold tracking-tight", children: "RotVerse" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 text-sm text-muted-foreground md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#modules", className: "transition hover:text-foreground", children: "Modules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#showcase", className: "transition hover:text-foreground", children: "Showcase" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "transition hover:text-foreground", children: "Docs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/graph", className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/10", children: "Launch app →" })
  ] });
}
function LogoMark() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-9 w-9 place-items-center rounded-xl bg-cosmic shadow-glow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-[2px] rounded-[10px] bg-background/80 backdrop-blur" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "relative h-5 w-5", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3", fill: "currentColor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "12", rx: "10", ry: "4", stroke: "currentColor", strokeWidth: "1.4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "12", rx: "10", ry: "4", stroke: "currentColor", strokeWidth: "1.4", transform: "rotate(60 12 12)" })
    ] })
  ] });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.8,
      ease: "easeOut"
    }, className: "mx-auto max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-accent" }),
        "v0.1 · public preview"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-semibold leading-[1.05] md:text-7xl", children: [
        "A universe of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "interactive" }),
        " tools."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg", children: "RotVerse riunisce un graphing lab tipo GeoGebra, un visualizzatore di documenti e tanti altri strumenti — in un'unica interfaccia, fluida e bellissima." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#modules", className: "group relative overflow-hidden rounded-full bg-cosmic px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]", children: "Esplora i moduli" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/graph", className: "rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10", children: "Apri Graph Lab →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroPreview, {})
  ] });
}
function HeroPreview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 40
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    duration: 1,
    delay: 0.2,
    ease: "easeOut"
  }, className: "relative mx-auto mt-20 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 -z-10 rounded-[2rem] bg-cosmic opacity-30 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-white/10 bg-card/60 shadow-2xl backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full bg-rose-400/80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full bg-amber-300/80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full bg-emerald-400/80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-xs text-muted-foreground", children: "rotverse / graph-lab" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[260px_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-white/10 bg-black/20 p-4 md:border-b-0 md:border-r", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Equations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(EqRow, { color: "bg-fuchsia-400", text: "y = sin(x) · cos(x/2)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(EqRow, { color: "bg-cyan-300", text: "r = 1 + sin(3θ)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(EqRow, { color: "bg-emerald-300", text: "y = x² − 3x + 1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-6 w-full rounded-lg border border-dashed border-white/15 py-2 text-xs text-muted-foreground transition hover:bg-white/5", children: "+ Add equation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraphCanvas, {})
      ] })
    ] })
  ] });
}
function EqRow({
  color,
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 transition hover:bg-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2.5 w-2.5 rounded-full ${color}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-[12px] text-foreground/90", children: text })
  ] });
}
function GraphCanvas() {
  const [t, setT] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let raf = 0;
    const loop = () => {
      setT((v) => v + 0.012);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const W = 600, H = 340;
  const cx = W / 2, cy = H / 2;
  const scale = 40;
  const path1 = buildPath((x) => Math.sin(x + t) * Math.cos(x / 2), -7, 7, 0.05, cx, cy, scale);
  const path2 = buildPath((x) => 0.3 * x * x - 1.5, -4, 4, 0.05, cx, cy, scale);
  const polar = buildPolar((th) => 1 + Math.sin(3 * th + t * 0.6), 0, Math.PI * 2, 0.02, cx, cy, scale * 1.5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/9] w-full bg-[radial-gradient(circle_at_center,oklch(0.22_0.04_270),oklch(0.14_0.03_270))]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, className: "absolute inset-0 h-full w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: "grid", width: "30", height: "30", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 30 0 L 0 0 0 30", fill: "none", stroke: "oklch(1 0 0 / 0.06)", strokeWidth: "1" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "g1", x1: "0", x2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0", stopColor: "oklch(0.78 0.20 320)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "1", stopColor: "oklch(0.78 0.20 280)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: W, height: H, fill: "url(#grid)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: cy, x2: W, y2: cy, stroke: "oklch(1 0 0 / 0.2)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: cx, y1: "0", x2: cx, y2: H, stroke: "oklch(1 0 0 / 0.2)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: polar, fill: "none", stroke: "oklch(0.85 0.18 200)", strokeWidth: "2", opacity: "0.9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: path2, fill: "none", stroke: "oklch(0.82 0.18 150)", strokeWidth: "2", opacity: "0.8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: path1, fill: "none", stroke: "url(#g1)", strokeWidth: "2.5" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur", children: [
      "t = ",
      t.toFixed(2)
    ] })
  ] });
}
function buildPath(f, xMin, xMax, step, cx, cy, scale) {
  let d = "";
  for (let x = xMin; x <= xMax; x += step) {
    const px = cx + x * scale;
    const py = cy - f(x) * scale;
    d += (d ? " L" : "M") + px.toFixed(2) + " " + py.toFixed(2);
  }
  return d;
}
function buildPolar(f, tMin, tMax, step, cx, cy, scale) {
  let d = "";
  for (let th = tMin; th <= tMax; th += step) {
    const r = f(th);
    const px = cx + Math.cos(th) * r * scale;
    const py = cy - Math.sin(th) * r * scale;
    d += (d ? " L" : "M") + px.toFixed(2) + " " + py.toFixed(2);
  }
  return d + " Z";
}
function Modules() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "modules", className: "relative z-10 mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-muted-foreground", children: "Moduli" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-2 font-display text-4xl font-semibold md:text-5xl", children: [
          "Tutto quello che ti serve, ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden md:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "in un solo posto" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "Ogni modulo è progettato per essere veloce, bello e potente. Inizia da uno, scoprili tutti." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3", children: modules.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { ...m, index: i }, m.tag)) })
  ] });
}
function ModuleCard({
  tag,
  title,
  desc,
  accent,
  badgeClass,
  soon,
  to,
  index
}) {
  const ref = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState({
    x: -200,
    y: -200
  });
  const Inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { ref, initial: {
    opacity: 0,
    y: 20
  }, whileInView: {
    opacity: 1,
    y: 0
  }, viewport: {
    once: true,
    margin: "-80px"
  }, transition: {
    duration: 0.5,
    delay: index * 0.05
  }, onMouseMove: (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({
      x: e.clientX - r.left,
      y: e.clientY - r.top
    });
  }, className: "group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition hover:border-white/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100", style: {
      background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, oklch(0.78 0.20 310 / 0.18), transparent 40%)`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block rounded-full ${badgeClass ?? `bg-gradient-to-r ${accent} text-black/80`} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest`, children: tag }),
      soon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground", children: "soon" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-2xl font-semibold leading-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2 text-sm font-medium text-foreground/80 transition group-hover:text-foreground", children: [
      soon ? "Coming soon" : "Apri modulo",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition group-hover:translate-x-1", children: "→" })
    ] })
  ] });
  if (soon) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: Inner });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, className: "block h-full", children: Inner });
}
function Showcase() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "showcase", className: "relative z-10 mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DocPreview, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsPanel, {})
  ] }) });
}
function DocPreview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 30
  }, whileInView: {
    opacity: 1,
    y: 0
  }, viewport: {
    once: true
  }, transition: {
    duration: 0.6
  }, className: "overflow-hidden rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-200", children: "PDF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "cosmology-notes.pdf · page 3 / 24" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-md px-2 py-1 hover:bg-white/10", children: "−" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-md px-2 py-1 hover:bg-white/10", children: "+" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 bg-[oklch(0.97_0.005_270)] p-8 text-[oklch(0.18_0.03_270)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-xl font-bold", children: "Chapter 3 — Rotational dynamics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: "When a rigid body rotates about a fixed axis, every particle within the body moves in a circle. The angular velocity ω relates linear and angular quantities through v = ω × r." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-4 h-px bg-black/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: "The moment of inertia I = Σ mᵢ rᵢ² quantifies an object's resistance to angular acceleration — a cosmic analog of mass for rotation." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-black/10 bg-black/5 p-3 font-mono text-[12px]", children: "τ = I · α   |   L = I · ω   |   E = ½ I ω²" })
    ] })
  ] });
}
function StatsPanel() {
  const stats = [{
    k: "Moduli interattivi",
    v: "6+"
  }, {
    k: "Formati supportati",
    v: "12"
  }, {
    k: "Latency UI",
    v: "<16ms"
  }, {
    k: "Open source",
    v: "Sì"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 30
  }, whileInView: {
    opacity: 1,
    y: 0
  }, viewport: {
    once: true
  }, transition: {
    duration: 0.6,
    delay: 0.1
  }, className: "flex flex-col justify-between rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-muted-foreground", children: "Manifesto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-3xl font-semibold leading-tight", children: "Strumenti che dovrebbero esistere già — finalmente in un'unica galassia." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-relaxed text-muted-foreground", children: "RotVerse non è un'altra suite gonfia. È un insieme di micro-app curate maniacalmente, collegate da un'estetica e un linguaggio comuni." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid grid-cols-2 gap-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-semibold text-gradient", children: s.v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: s.k })
    ] }, s.k)) })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-10 mx-auto max-w-7xl border-t border-white/10 px-6 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogoMark, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold text-foreground", children: "RotVerse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground", children: "Twitter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground", children: "GitHub" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground", children: "Contact" })
    ] })
  ] }) });
}
export {
  Index as component
};
