import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { IconButton, ModuleShell, Panel, PanelHeader } from "@/components/ModuleShell";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data Lens — RotVerse" },
      { name: "description", content: "Carica un CSV e visualizza grafici interattivi (linea, barre, scatter) con filtri." },
    ],
  }),
  component: DataLens,
});

type Row = Record<string, string | number>;
type ChartKind = "line" | "bar" | "scatter";

function DataLens() {
  const [rows, setRows] = useState<Row[]>([]);
  const [cols, setCols] = useState<string[]>([]);
  const [kind, setKind] = useState<ChartKind>("line");
  const [xKey, setXKey] = useState<string>("");
  const [yKeys, setYKeys] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);

  const numericCols = useMemo(() => cols.filter((c) => rows.length > 0 && typeof rows[0][c] === "number"), [cols, rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      Object.entries(filters).every(([k, v]) => !v || String(r[k]).toLowerCase().includes(v.toLowerCase()))
    );
  }, [rows, filters]);

  const onFile = (f: File) => {
    setErr(null);
    Papa.parse<Row>(f, {
      header: true, dynamicTyping: true, skipEmptyLines: true,
      complete: (res) => {
        if (!res.data.length) { setErr("CSV vuoto"); return; }
        const c = Object.keys(res.data[0] as object);
        setRows(res.data as Row[]); setCols(c);
        setXKey(c[0]);
        const nums = c.filter((k) => typeof (res.data[0] as any)[k] === "number");
        setYKeys(nums.slice(0, 2));
      },
      error: (e) => setErr(e.message),
    });
  };

  const loadDemo = () => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const data = months.map((m, i) => ({
      month: m,
      sales: Math.round(100 + Math.sin(i / 2) * 40 + Math.random() * 30),
      visits: Math.round(500 + Math.cos(i / 1.7) * 200 + Math.random() * 100),
      region: i % 2 === 0 ? "EU" : "US",
    }));
    setRows(data); setCols(["month", "sales", "visits", "region"]);
    setXKey("month"); setYKeys(["sales", "visits"]);
  };

  const palette = ["#e879f9", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"];

  return (
    <ModuleShell title="Data Lens" tag="DATA LENS" accent="from-rose-300 to-pink-500">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader><span>Source</span></PanelHeader>
            <div className="space-y-2 p-4">
              <label className="block cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 p-5 text-center transition hover:bg-white/10">
                <input type="file" accept=".csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
                <div className="text-sm font-medium">Upload CSV</div>
                <div className="mt-1 text-xs text-muted-foreground">.csv with headers</div>
              </label>
              <button onClick={loadDemo} className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs hover:bg-white/10">Load demo data</button>
              {err && <p className="text-xs text-rose-300">{err}</p>}
              {rows.length > 0 && <p className="text-xs text-muted-foreground">{filtered.length}/{rows.length} rows · {cols.length} cols</p>}
            </div>
          </Panel>

          {rows.length > 0 && (
            <>
              <Panel>
                <PanelHeader><span>Chart</span></PanelHeader>
                <div className="space-y-3 p-3">
                  <div className="grid grid-cols-3 gap-1">
                    {(["line", "bar", "scatter"] as ChartKind[]).map((k) => (
                      <IconButton key={k} active={kind === k} onClick={() => setKind(k)}>
                        <span className="text-xs capitalize">{k}</span>
                      </IconButton>
                    ))}
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">X axis</label>
                    <select value={xKey} onChange={(e) => setXKey(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm">
                      {cols.map((c) => <option key={c} value={c} className="bg-card">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">Y series</label>
                    <div className="flex flex-wrap gap-1">
                      {numericCols.map((c, i) => {
                        const on = yKeys.includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => setYKeys((arr) => on ? arr.filter((k) => k !== c) : [...arr, c])}
                            className={`rounded-full border px-2.5 py-1 text-xs transition ${on ? "border-transparent text-black" : "border-white/15 bg-white/5 text-foreground/80"}`}
                            style={on ? { background: palette[i % palette.length] } : undefined}
                          >{c}</button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelHeader><span>Filters</span></PanelHeader>
                <div className="space-y-2 p-3">
                  {cols.map((c) => (
                    <div key={c}>
                      <label className="mb-0.5 block text-[10px] uppercase tracking-widest text-muted-foreground">{c}</label>
                      <input
                        value={filters[c] || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, [c]: e.target.value }))}
                        placeholder="contains…"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </Panel>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader><span>{kind} chart</span></PanelHeader>
            <div className="h-[460px] p-4">
              {rows.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Carica un CSV o usa il dataset demo.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {kind === "line" ? (
                    <LineChart data={filtered}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey={xKey} stroke="rgba(255,255,255,0.6)" />
                      <YAxis stroke="rgba(255,255,255,0.6)" />
                      <Tooltip contentStyle={{ background: "#1f1733", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                      <Legend />
                      {yKeys.map((y, i) => <Line key={y} dataKey={y} stroke={palette[i % palette.length]} strokeWidth={2} dot={false} />)}
                    </LineChart>
                  ) : kind === "bar" ? (
                    <BarChart data={filtered}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey={xKey} stroke="rgba(255,255,255,0.6)" />
                      <YAxis stroke="rgba(255,255,255,0.6)" />
                      <Tooltip contentStyle={{ background: "#1f1733", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                      <Legend />
                      {yKeys.map((y, i) => <Bar key={y} dataKey={y} fill={palette[i % palette.length]} radius={[6, 6, 0, 0]} />)}
                    </BarChart>
                  ) : (
                    <ScatterChart>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey={xKey} type={typeof filtered[0]?.[xKey] === "number" ? "number" : "category"} stroke="rgba(255,255,255,0.6)" />
                      <YAxis stroke="rgba(255,255,255,0.6)" />
                      <Tooltip contentStyle={{ background: "#1f1733", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                      <Legend />
                      {yKeys.map((y, i) => <Scatter key={y} name={y} data={filtered.map((r) => ({ [xKey]: r[xKey], [y]: r[y] }))} dataKey={y} fill={palette[i % palette.length]} />)}
                    </ScatterChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          {rows.length > 0 && (
            <Panel>
              <PanelHeader><span>Preview · {filtered.length} rows</span></PanelHeader>
              <div className="max-h-[260px] overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card/95 backdrop-blur">
                    <tr>{cols.map((c) => <th key={c} className="border-b border-white/10 px-3 py-2 text-left font-medium text-muted-foreground">{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map((r, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        {cols.map((c) => <td key={c} className="px-3 py-1.5 font-mono">{String(r[c])}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </ModuleShell>
  );
}
