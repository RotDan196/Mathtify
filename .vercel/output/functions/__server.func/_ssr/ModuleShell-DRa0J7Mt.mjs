import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
function ModuleShell({
  title,
  tag,
  accent = "from-fuchsia-400 to-purple-500",
  children,
  actions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-aurora opacity-60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-20 mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm backdrop-blur transition hover:bg-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition group-hover:-translate-x-0.5", children: "←" }),
          " RotVerse"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block rounded-full bg-gradient-to-r ${accent} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black/80`, children: tag }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-semibold tracking-tight", children: title })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: actions })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative z-10 mx-auto max-w-[1500px] px-6 pb-10", children })
  ] });
}
function Panel({ children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl ${className}`, children });
}
function PanelHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5 text-xs uppercase tracking-widest text-muted-foreground", children });
}
function IconButton({
  children,
  onClick,
  title,
  active,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      title,
      className: `inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-sm transition ${active ? "border-primary/40 bg-primary/20 text-foreground" : "border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10"} ${className}`,
      children
    }
  );
}
export {
  IconButton as I,
  ModuleShell as M,
  Panel as P,
  PanelHeader as a
};
