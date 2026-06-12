import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as Papa } from "../_libs/papaparse.mjs";
import { M as ModuleShell, P as Panel, a as PanelHeader, I as IconButton } from "./ModuleShell-DRa0J7Mt.mjs";
import { R as ResponsiveContainer, L as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Legend, b as Line, B as BarChart, c as Bar, S as ScatterChart, d as Scatter } from "../_libs/recharts.mjs";
import "stream";
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
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/es-toolkit.mjs";
import "../_libs/reselect.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/reduxjs__toolkit.mjs";
import "../_libs/redux.mjs";
import "../_libs/immer.mjs";
import "../_libs/redux-thunk.mjs";
import "../_libs/react-redux.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function DataLens() {
  const [rows, setRows] = reactExports.useState([]);
  const [cols, setCols] = reactExports.useState([]);
  const [kind, setKind] = reactExports.useState("line");
  const [xKey, setXKey] = reactExports.useState("");
  const [yKeys, setYKeys] = reactExports.useState([]);
  const [filters, setFilters] = reactExports.useState({});
  const [err, setErr] = reactExports.useState(null);
  const numericCols = reactExports.useMemo(() => cols.filter((c) => rows.length > 0 && typeof rows[0][c] === "number"), [cols, rows]);
  const filtered = reactExports.useMemo(() => {
    return rows.filter((r) => Object.entries(filters).every(([k, v]) => !v || String(r[k]).toLowerCase().includes(v.toLowerCase())));
  }, [rows, filters]);
  const onFile = (f) => {
    setErr(null);
    Papa.parse(f, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!res.data.length) {
          setErr("CSV vuoto");
          return;
        }
        const c = Object.keys(res.data[0]);
        setRows(res.data);
        setCols(c);
        setXKey(c[0]);
        const nums = c.filter((k) => typeof res.data[0][k] === "number");
        setYKeys(nums.slice(0, 2));
      },
      error: (e) => setErr(e.message)
    });
  };
  const loadDemo = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map((m, i) => ({
      month: m,
      sales: Math.round(100 + Math.sin(i / 2) * 40 + Math.random() * 30),
      visits: Math.round(500 + Math.cos(i / 1.7) * 200 + Math.random() * 100),
      region: i % 2 === 0 ? "EU" : "US"
    }));
    setRows(data);
    setCols(["month", "sales", "visits", "region"]);
    setXKey("month");
    setYKeys(["sales", "visits"]);
  };
  const palette = ["#e879f9", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleShell, { title: "Data Lens", tag: "DATA LENS", accent: "from-rose-300 to-pink-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Source" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 p-5 text-center transition hover:bg-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".csv", hidden: true, onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Upload CSV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: ".csv with headers" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadDemo, className: "w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs hover:bg-white/10", children: "Load demo data" }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-300", children: err }),
          rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            filtered.length,
            "/",
            rows.length,
            " rows · ",
            cols.length,
            " cols"
          ] })
        ] })
      ] }),
      rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Chart" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: ["line", "bar", "scatter"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { active: kind === k, onClick: () => setKind(k), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs capitalize", children: k }) }, k)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground", children: "X axis" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: xKey, onChange: (e) => setXKey(e.target.value), className: "w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm", children: cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, className: "bg-card", children: c }, c)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground", children: "Y series" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: numericCols.map((c, i) => {
                const on = yKeys.includes(c);
                return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setYKeys((arr) => on ? arr.filter((k) => k !== c) : [...arr, c]), className: `rounded-full border px-2.5 py-1 text-xs transition ${on ? "border-transparent text-black" : "border-white/15 bg-white/5 text-foreground/80"}`, style: on ? {
                  background: palette[i % palette.length]
                } : void 0, children: c }, c);
              }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Filters" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-3", children: cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-0.5 block text-[10px] uppercase tracking-widest text-muted-foreground", children: c }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: filters[c] || "", onChange: (e) => setFilters((f) => ({
              ...f,
              [c]: e.target.value
            })), placeholder: "contains…", className: "w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs" })
          ] }, c)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          kind,
          " chart"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[460px] p-4", children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "Carica un CSV o usa il dataset demo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: kind === "line" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: filtered, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.08)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: xKey, stroke: "rgba(255,255,255,0.6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "rgba(255,255,255,0.6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#1f1733",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          yKeys.map((y, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { dataKey: y, stroke: palette[i % palette.length], strokeWidth: 2, dot: false }, y))
        ] }) : kind === "bar" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: filtered, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.08)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: xKey, stroke: "rgba(255,255,255,0.6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "rgba(255,255,255,0.6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#1f1733",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          yKeys.map((y, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: y, fill: palette[i % palette.length], radius: [6, 6, 0, 0] }, y))
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(ScatterChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.08)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: xKey, type: typeof filtered[0]?.[xKey] === "number" ? "number" : "category", stroke: "rgba(255,255,255,0.6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "rgba(255,255,255,0.6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#1f1733",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          yKeys.map((y, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Scatter, { name: y, data: filtered.map((r) => ({
            [xKey]: r[xKey],
            [y]: r[y]
          })), dataKey: y, fill: palette[i % palette.length] }, y))
        ] }) }) })
      ] }),
      rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Preview · ",
          filtered.length,
          " rows"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[260px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-card/95 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border-b border-white/10 px-3 py-2 text-left font-medium text-muted-foreground", children: c }, c)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.slice(0, 50).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-white/5 hover:bg-white/5", children: cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono", children: String(r[c]) }, c)) }, i)) })
        ] }) })
      ] })
    ] })
  ] }) });
}
export {
  DataLens as component
};
