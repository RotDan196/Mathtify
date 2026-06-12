import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "mathlive";
import type { MathfieldElement } from "mathlive";
import { parse, type MathNode } from "mathjs";
import { IconButton, ModuleShell, Panel, PanelHeader } from "@/components/ModuleShell";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Graph Lab — RotVerse" },
      {
        name: "description",
        content:
          "Interactive GeoGebra-style graphing with a virtual keyboard, pan, zoom and parameters.",
      },
    ],
  }),
  component: GraphLab,
});

type Eq = {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
  kind: "function" | "polar" | "parametric";
};

const COLORS = [
  "#f43f5e",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function GraphLab() {
  const [eqs, setEqs] = useState<Eq[]>([
    { id: newId(), expr: "sin(x)", color: COLORS[0], visible: true, kind: "function" },
    { id: newId(), expr: "x^2 - 2", color: COLORS[1], visible: true, kind: "function" },
  ]);
  const [selected, setSelected] = useState<string>(eqs[0].id);
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [params, setParams] = useState<Record<string, number>>({ a: 1, k: 1 });

  const [view, setView] = useState({ cx: 0, cy: 0, scale: 60 }); // world->px
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pan & zoom
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let dragging = false;
    let last = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x,
        dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      setView((v) => ({ ...v, cx: v.cx - dx / v.scale, cy: v.cy + dy / v.scale }));
    };
    const onUp = () => {
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left,
        my = e.clientY - rect.top;
      const factor = Math.exp(-e.deltaY * 0.0015);
      setView((v) => {
        const newScale = Math.min(400, Math.max(8, v.scale * factor));
        const wx = (mx - rect.width / 2) / v.scale + v.cx;
        const wy = -(my - rect.height / 2) / v.scale + v.cy;
        const ncx = wx - (mx - rect.width / 2) / newScale;
        const ncy = wy + (my - rect.height / 2) / newScale;
        return { cx: ncx, cy: ncy, scale: newScale };
      });
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const compiled = useMemo(() => {
    return eqs.map((e) => {
      try {
        const node: MathNode = parse(e.expr);
        return { eq: e, code: node.compile(), error: null as string | null };
      } catch (err) {
        return { eq: e, code: null, error: (err as Error).message };
      }
    });
  }, [eqs]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = rect.width,
        H = rect.height;

      // background
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.clearRect(0, 0, W, H);

      const w2px = (x: number) => (x - view.cx) * view.scale + W / 2;
      const w2py = (y: number) => -(y - view.cy) * view.scale + H / 2;
      const px2wx = (px: number) => (px - W / 2) / view.scale + view.cx;
      const px2wy = (py: number) => -(py - H / 2) / view.scale + view.cy;

      // grid step in world units
      const targetPxStep = 70;
      const rawStep = targetPxStep / view.scale;
      const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
      const norm = rawStep / pow;
      const step = (norm < 2 ? 1 : norm < 5 ? 2 : 5) * pow;
      const minor = step / 5;

      const xMinW = px2wx(0),
        xMaxW = px2wx(W);
      const yMinW = px2wy(H),
        yMaxW = px2wy(0);

      // minor grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(xMinW / minor) * minor; x <= xMaxW; x += minor) {
        const px = w2px(x);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, H);
      }
      for (let y = Math.ceil(yMinW / minor) * minor; y <= yMaxW; y += minor) {
        const py = w2py(y);
        ctx.moveTo(0, py);
        ctx.lineTo(W, py);
      }
      ctx.stroke();

      // major grid
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.beginPath();
      for (let x = Math.ceil(xMinW / step) * step; x <= xMaxW; x += step) {
        const px = w2px(x);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, H);
      }
      for (let y = Math.ceil(yMinW / step) * step; y <= yMaxW; y += step) {
        const py = w2py(y);
        ctx.moveTo(0, py);
        ctx.lineTo(W, py);
      }
      ctx.stroke();

      // axes
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const px0 = w2px(0),
        py0 = w2py(0);
      ctx.moveTo(0, py0);
      ctx.lineTo(W, py0);
      ctx.moveTo(px0, 0);
      ctx.lineTo(px0, H);
      ctx.stroke();

      // labels
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "11px ui-monospace,monospace";
      for (let x = Math.ceil(xMinW / step) * step; x <= xMaxW; x += step) {
        if (Math.abs(x) < step / 2) continue;
        ctx.fillText(formatNum(x), w2px(x) + 3, py0 + 12);
      }
      for (let y = Math.ceil(yMinW / step) * step; y <= yMaxW; y += step) {
        if (Math.abs(y) < step / 2) continue;
        ctx.fillText(formatNum(y), px0 + 4, w2py(y) - 3);
      }

      // curves
      for (const { eq, code, error } of compiled) {
        if (!eq.visible || !code || error) continue;
        ctx.strokeStyle = eq.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (eq.kind === "polar") {
          let started = false;
          const N = 1500;
          for (let i = 0; i <= N; i++) {
            const th = (i / N) * Math.PI * 4;
            let r: number;
            try {
              r = code.evaluate({ ...params, theta: th, t: th });
            } catch {
              continue;
            }
            if (!Number.isFinite(r)) {
              started = false;
              continue;
            }
            const xw = r * Math.cos(th),
              yw = r * Math.sin(th);
            const px = w2px(xw),
              py = w2py(yw);
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
          }
        } else {
          const N = Math.max(600, Math.floor(W));
          let prevY: number | null = null;
          let started = false;
          for (let i = 0; i <= N; i++) {
            const px = (i / N) * W;
            const xw = px2wx(px);
            let yw: number;
            try {
              yw = code.evaluate({ ...params, x: xw, t: xw });
            } catch {
              started = false;
              prevY = null;
              continue;
            }
            if (!Number.isFinite(yw)) {
              started = false;
              prevY = null;
              continue;
            }
            const py = w2py(yw);
            // break on huge jumps (asymptotes)
            if (prevY !== null && Math.abs(py - prevY) > H * 1.5) {
              started = false;
            }
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
            prevY = py;
          }
        }
        ctx.stroke();
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [compiled, view, params]);

  const updateExpr = (id: string, expr: string) => {
    setEqs((arr) => arr.map((e) => (e.id === id ? { ...e, expr } : e)));
  };

  const updateColor = (id: string, color: string) => {
    setEqs((arr) => arr.map((e) => (e.id === id ? { ...e, color } : e)));
    setOpenColorPicker(null);
  };

  const addEq = (kind: Eq["kind"] = "function") => {
    const e: Eq = {
      id: newId(),
      expr: kind === "polar" ? "1 + sin(3 theta)" : "",
      color: COLORS[eqs.length % COLORS.length],
      visible: true,
      kind,
    };
    setEqs((a) => [...a, e]);
    setSelected(e.id);
  };

  const removeEq = (id: string) => setEqs((a) => a.filter((e) => e.id !== id));

  const resetView = () => setView({ cx: 0, cy: 0, scale: 60 });

  return (
    <ModuleShell
      title="Graph Lab"
      tag="GRAPH LAB"
      accent="from-fuchsia-400 to-purple-500"
      actions={
        <>
          <IconButton
            onClick={() => setView((v) => ({ ...v, scale: Math.min(400, v.scale * 1.2) }))}
            title="Zoom in"
          >
            +
          </IconButton>
          <IconButton
            onClick={() => setView((v) => ({ ...v, scale: Math.max(8, v.scale / 1.2) }))}
            title="Zoom out"
          >
            −
          </IconButton>
          <IconButton onClick={resetView} title="Reset view">
            ⌖
          </IconButton>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader>
              <span>Equations</span>
              <div className="flex gap-1">
                <button
                  onClick={() => addEq("function")}
                  className="rounded px-2 py-0.5 text-[10px] hover:bg-white/10"
                >
                  + f(x)
                </button>
                <button
                  onClick={() => addEq("polar")}
                  className="rounded px-2 py-0.5 text-[10px] hover:bg-white/10"
                >
                  + r(θ)
                </button>
              </div>
            </PanelHeader>
            <div className="space-y-2 p-3">
              {eqs.map((e) => {
                const err = compiled.find((c) => c.eq.id === e.id)?.error;
                const prefix = e.kind === "polar" ? "r =" : "y =";
                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      setSelected(e.id);
                      setOpenColorPicker(null);
                    }}
                    className={`rounded-lg border p-2 transition ${
                      selected === e.id
                        ? "border-primary/40 bg-primary/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelected(e.id);
                            setOpenColorPicker((current) => (current === e.id ? null : e.id));
                          }}
                          onDoubleClick={(ev) => {
                            ev.stopPropagation();
                            setEqs((a) =>
                              a.map((x) => (x.id === e.id ? { ...x, visible: !x.visible } : x)),
                            );
                          }}
                          aria-label="Change graph color"
                          className="h-4 w-4 rounded-full border border-white/30 shadow-sm shadow-black/30 transition hover:scale-110 hover:border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                          style={{ background: e.visible ? e.color : "transparent" }}
                        />
                        {openColorPicker === e.id && (
                          <div
                            onClick={(ev) => ev.stopPropagation()}
                            className="absolute left-0 top-6 z-30 grid w-36 grid-cols-4 gap-2 rounded-lg border border-white/10 bg-background/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
                          >
                            {COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                aria-label={`Use color ${color}`}
                                onClick={() => updateColor(e.id, color)}
                                className={`h-7 w-7 rounded-full border transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                                  e.color === color ? "border-white" : "border-white/20"
                                }`}
                                style={{ background: color }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">{prefix}</span>
                      <MathExpressionInput
                        value={e.expr}
                        onChange={(value) => updateExpr(e.id, value)}
                        onFocus={() => setSelected(e.id)}
                        placeholder={e.kind === "polar" ? "1 + \\sin(3\\theta)" : "\\sin(x)"}
                      />
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          removeEq(e.id);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                    {err && <div className="mt-1 font-mono text-[10px] text-rose-300">{err}</div>}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <PanelHeader>
              <span>Parameters</span>
            </PanelHeader>
            <div className="space-y-3 p-3">
              {Object.entries(params).map(([k, v]) => (
                <div key={k}>
                  <div className="mb-1 flex justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground">{k}</span>
                    <span>{v.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    step={0.01}
                    value={v}
                    onChange={(e) => setParams((p) => ({ ...p, [k]: parseFloat(e.target.value) }))}
                    className="w-full accent-fuchsia-400"
                  />
                </div>
              ))}
              <p className="font-mono text-[10px] text-muted-foreground">
                Use <code>a</code> and <code>k</code> in your equations.
              </p>
            </div>
          </Panel>
        </div>

        {/* Canvas */}
        <div className="flex flex-col gap-4">
          <Panel className="relative">
            <div
              ref={wrapRef}
              className="relative h-[calc(100vh-220px)] min-h-[500px] cursor-grab active:cursor-grabbing select-none"
            >
              <canvas ref={canvasRef} className="absolute inset-0" />
              <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur">
                scale {view.scale.toFixed(0)} px/u · center ({view.cx.toFixed(2)},{" "}
                {view.cy.toFixed(2)})
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </ModuleShell>
  );
}

function MathExpressionInput({
  value,
  onChange,
  onFocus,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  placeholder: string;
}) {
  const localRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    const keyboard = window.mathVirtualKeyboard;
    if (!keyboard) return;

    keyboard.layouts = ["numeric", "symbols", "alphabetic", "greek"];
    keyboard.editToolbar = "default";
    keyboard.setKeycap("[left]", {
      class: "action hide-shift",
      label: "←",
      command: "performWithFeedback(moveToPreviousChar)",
    });
    keyboard.setKeycap("[right]", {
      class: "action hide-shift",
      label: "→",
      command: "performWithFeedback(moveToNextChar)",
    });
  }, []);

  useEffect(() => {
    const field = localRef.current;
    if (!field) return;
    if (field.getValue("ascii-math") === value) return;

    field.setValue(value, {
      format: "ascii-math",
      insertionMode: "replaceAll",
      selectionMode: "after",
      silenceNotifications: true,
    });
  }, [value]);

  return (
    <math-field
      ref={(field) => {
        localRef.current = field;
        if (field) {
          field.mathVirtualKeyboardPolicy = "auto";
          field.menuItems = [];
        }
      }}
      default-mode="math"
      letter-shape-style="tex"
      math-virtual-keyboard-policy="auto"
      placeholder={placeholder}
      remove-extraneous-parentheses="true"
      smart-fence="true"
      smart-mode="true"
      smart-superscript="true"
      className="min-h-10 w-full min-w-0 flex-1 rounded-md border border-input bg-black/20 px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring [&::part(menu-toggle)]:hidden"
      style={
        {
          "--caret-color": "var(--color-primary)",
          "--selection-background-color": "oklch(0.75 0.20 310 / 0.35)",
          "--selection-color": "var(--color-foreground)",
        } as CSSProperties
      }
      onFocus={() => {
        onFocus();
        if (window.matchMedia("(pointer: coarse)").matches) {
          window.mathVirtualKeyboard?.show({ animate: true });
        }
      }}
      onInput={(event) => onChange(event.currentTarget.getValue("ascii-math"))}
    />
  );
}

function formatNum(n: number) {
  if (Math.abs(n) < 1e-9) return "0";
  if (Math.abs(n) >= 1000 || Math.abs(n) < 0.01) return n.toExponential(1);
  return (+n.toFixed(3)).toString();
}
