import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { M as ModuleShell, P as Panel, I as IconButton } from "./ModuleShell-DRa0J7Mt.mjs";
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
const COLORS = ["#ffffff", "#fb7185", "#fbbf24", "#34d399", "#22d3ee", "#a78bfa", "#f472b6"];
const NOTE_COLORS = ["#fde68a", "#fbcfe8", "#bbf7d0", "#bae6fd"];
function Whiteboard() {
  const [tool, setTool] = reactExports.useState("pen");
  const [color, setColor] = reactExports.useState(COLORS[0]);
  const [size, setSize] = reactExports.useState(3);
  const [strokes, setStrokes] = reactExports.useState([]);
  const [notes, setNotes] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [redo, setRedo] = reactExports.useState([]);
  const canvasRef = reactExports.useRef(null);
  const wrapRef = reactExports.useRef(null);
  const drawingRef = reactExports.useRef(null);
  const push = (next) => {
    setHistory((h) => [...h, strokes]);
    setRedo([]);
    setStrokes(next);
  };
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#0f0a1f";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    for (let x = 24; x < rect.width; x += 24) for (let y = 24; y < rect.height; y += 24) ctx.fillRect(x, y, 1.5, 1.5);
    const all = drawingRef.current ? [...strokes, drawingRef.current] : strokes;
    for (const s of all) renderStroke(ctx, s);
  }, [strokes]);
  reactExports.useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [draw]);
  const onDown = (e) => {
    if (tool === "note") {
      const rect2 = wrapRef.current.getBoundingClientRect();
      setNotes((n) => [...n, {
        id: id(),
        x: e.clientX - rect2.left,
        y: e.clientY - rect2.top,
        text: "Nota…",
        color: NOTE_COLORS[n.length % NOTE_COLORS.length]
      }]);
      return;
    }
    const rect = wrapRef.current.getBoundingClientRect();
    const p = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    if (tool === "erase") {
      const remaining = strokes.filter((s) => !s.points.some((pt) => Math.hypot(pt.x - p.x, pt.y - p.y) < 12));
      if (remaining.length !== strokes.length) push(remaining);
      return;
    }
    drawingRef.current = {
      id: id(),
      tool,
      color,
      size,
      points: [p]
    };
    e.target.setPointerCapture(e.pointerId);
    draw();
  };
  const onMove = (e) => {
    if (!drawingRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const p = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    const s = drawingRef.current;
    if (s.tool === "pen") s.points.push(p);
    else s.points = [s.points[0], p];
    draw();
  };
  const onUp = () => {
    const s = drawingRef.current;
    drawingRef.current = null;
    if (!s) return;
    if (s.tool !== "pen" && s.points.length < 2) return;
    push([...strokes, s]);
  };
  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setRedo((r) => [...r, strokes]);
    setHistory((h) => h.slice(0, -1));
    setStrokes(prev);
  };
  const redoFn = () => {
    if (!redo.length) return;
    const nxt = redo[redo.length - 1];
    setHistory((h) => [...h, strokes]);
    setRedo((r) => r.slice(0, -1));
    setStrokes(nxt);
  };
  const clearAll = () => {
    push([]);
    setNotes([]);
  };
  const exportPNG = () => {
    const wrap = wrapRef.current;
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const off = document.createElement("canvas");
    off.width = rect.width * dpr;
    off.height = rect.height * dpr;
    const ctx = off.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#0f0a1f";
    ctx.fillRect(0, 0, rect.width, rect.height);
    for (const s of strokes) renderStroke(ctx, s);
    for (const n of notes) {
      ctx.fillStyle = n.color;
      roundRect(ctx, n.x, n.y, 160, 110, 10);
      ctx.fill();
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "13px Inter, sans-serif";
      wrapText(ctx, n.text, n.x + 10, n.y + 22, 140, 16);
    }
    off.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rotverse-whiteboard.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  const tools = [{
    t: "pen",
    label: "Pen",
    icon: "✎"
  }, {
    t: "line",
    label: "Line",
    icon: "╱"
  }, {
    t: "arrow",
    label: "Arrow",
    icon: "↗"
  }, {
    t: "rect",
    label: "Rect",
    icon: "▭"
  }, {
    t: "ellipse",
    label: "Ellipse",
    icon: "◯"
  }, {
    t: "note",
    label: "Note",
    icon: "▤"
  }, {
    t: "erase",
    label: "Erase",
    icon: "⌫"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleShell, { title: "Whiteboard", tag: "WHITEBOARD", accent: "from-amber-300 to-orange-500", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: undo, title: "Undo", children: "↶" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: redoFn, title: "Redo", children: "↷" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: clearAll, title: "Clear", children: "⌫" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportPNG, className: "rounded-lg bg-cosmic px-3 py-1.5 text-sm font-medium text-primary-foreground", children: "Export PNG" })
  ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-[80px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row gap-1 lg:flex-col", children: [
      tools.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: () => setTool(t.t), active: tool === t.t, title: t.label, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: t.icon }) }, t.t)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 h-px bg-white/10 lg:my-2" }),
      COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setColor(c), className: `h-7 w-7 rounded-full border-2 ${color === c ? "border-white" : "border-white/10"}`, style: {
        background: c
      } }, c)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 px-1 lg:mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 1, max: 20, value: size, onChange: (e) => setSize(+e.target.value), className: "w-full accent-fuchsia-400" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapRef, className: "relative h-[calc(100vh-220px)] min-h-[500px] cursor-crosshair touch-none select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "absolute inset-0", onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp }),
      notes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        left: n.x,
        top: n.y,
        background: n.color
      }, className: "group absolute h-[110px] w-[160px] rounded-lg p-2 text-[oklch(0.18_0.03_270)] shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setNotes((arr) => arr.filter((x) => x.id !== n.id)), className: "absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white group-hover:flex", children: "×" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { defaultValue: n.text, onChange: (e) => setNotes((arr) => arr.map((x) => x.id === n.id ? {
          ...x,
          text: e.target.value
        } : x)), className: "h-full w-full resize-none bg-transparent text-sm outline-none placeholder:text-black/40" })
      ] }, n.id))
    ] }) })
  ] }) });
}
function id() {
  return Math.random().toString(36).slice(2, 9);
}
function renderStroke(ctx, s) {
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = s.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const [a, b] = [s.points[0], s.points[s.points.length - 1]];
  if (s.tool === "pen") {
    ctx.beginPath();
    s.points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.stroke();
  } else if (s.tool === "line") {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  } else if (s.tool === "arrow") {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const h = 12 + s.size;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - h * Math.cos(ang - 0.5), b.y - h * Math.sin(ang - 0.5));
    ctx.lineTo(b.x - h * Math.cos(ang + 0.5), b.y - h * Math.sin(ang + 0.5));
    ctx.closePath();
    ctx.fill();
  } else if (s.tool === "rect") {
    ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  } else if (s.tool === "ellipse") {
    const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(/\s+/);
  let line = "", cy = y;
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = w + " ";
      cy += lh;
    } else line = test;
  }
  ctx.fillText(line, x, cy);
}
export {
  Whiteboard as component
};
