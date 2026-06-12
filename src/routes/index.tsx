import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RotVerse — A universe of interactive tools" },
      {
        name: "description",
        content:
          "RotVerse is a modern playground for interactive math, document viewing, and creative tools — all in one place.",
      },
      { property: "og:title", content: "RotVerse" },
      {
        property: "og:description",
        content: "A universe of interactive tools: graphing, documents, and more.",
      },
    ],
  }),
  component: Index,
});

const modules = [
  {
    tag: "GRAPH LAB",
    title: "Plot the impossible",
    desc: "Canvas geometrico/grafico interattivo con tastiera matematica, pan, zoom e parametri live.",
    accent: "from-fuchsia-400 to-purple-500",
    to: "/graph" as const,
    soon: false,
  },
  {
    tag: "DOC VIEWER",
    title: "Read anything, anywhere",
    desc: "Visualizzatore nativo PDF & DOCX con zoom, ricerca testo e paginazione.",
    accent: "from-cyan-300 to-sky-500",
    to: "/docs" as const,
    soon: false,
  },
  {
    tag: "CODE FORGE",
    title: "Run code in orbit",
    desc: "Editor in-browser con preview live HTML/CSS/JS e snippet salvati.",
    accent: "from-emerald-300 to-teal-500",
    to: "/code" as const,
    soon: false,
  },
  {
    tag: "WHITEBOARD",
    title: "Think out loud",
    desc: "Canvas infinito per sketch, forme e sticky notes. Export PNG con un click.",
    accent: "from-amber-300 to-orange-500",
    to: "/whiteboard" as const,
    soon: false,
  },
  {
    tag: "DATA LENS",
    title: "Charts that breathe",
    desc: "Carica un CSV: grafici interattivi (linea/barre/scatter) con filtri.",
    accent: "from-rose-300 to-pink-500",
    to: "/data" as const,
    soon: false,
  },
  {
    tag: "AUDIO LAB",
    title: "Sound & Frequencies",
    desc: "Editor MP3 nel browser. Taglia tracce, regola il gain e visualizza lo spettro audio in tempo reale con le Web Audio API.",
    accent: "from-green-400 to-emerald-500",
    badgeClass: "bg-green-500/20 text-green-400",
    to: "/audio" as const,
    soon: false,
  },
  {
    tag: "YOUTUBE VIDEO",
    title: "YouTube Downloader",
    desc: "Downloader YouTube con selezione qualita e stream reale generato dal backend locale yt-dlp.",
    accent: "from-red-500 to-rose-500",
    badgeClass: "bg-red-500/20 text-red-300",
    to: "/youtube" as const,
    soon: false,
  },
  {
    tag: "AI STUDIO",
    title: "Your cosmic copilot",
    desc: "Workspace chat-first che collega ogni modulo — coming soon.",
    accent: "from-indigo-300 to-violet-500",
    to: "/" as const,
    soon: true,
  },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <Nav />
      <Hero />
      <Modules />
      <Showcase />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <a href="#" className="flex items-center gap-2">
        <LogoMark />
        <span className="font-display text-xl font-semibold tracking-tight">RotVerse</span>
      </a>
      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <a href="#modules" className="transition hover:text-foreground">
          Modules
        </a>
        <a href="#showcase" className="transition hover:text-foreground">
          Showcase
        </a>
        <a href="#" className="transition hover:text-foreground">
          Docs
        </a>
      </nav>
      <Link
        to="/graph"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/10"
      >
        Launch app →
      </Link>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-cosmic shadow-glow">
      <div className="absolute inset-[2px] rounded-[10px] bg-background/80 backdrop-blur" />
      <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="currentColor"
          strokeWidth="1.4"
          transform="rotate(60 12 12)"
        />
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          v0.1 · public preview
        </div>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
          A universe of <span className="text-gradient">interactive</span> tools.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          RotVerse riunisce un graphing lab tipo GeoGebra, un visualizzatore di documenti e tanti
          altri strumenti — in un'unica interfaccia, fluida e bellissima.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#modules"
            className="group relative overflow-hidden rounded-full bg-cosmic px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
          >
            Esplora i moduli
          </a>
          <Link
            to="/graph"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10"
          >
            Apri Graph Lab →
          </Link>
        </div>
      </motion.div>

      <HeroPreview />
    </section>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      className="relative mx-auto mt-20 max-w-5xl"
    >
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-cosmic opacity-30 blur-3xl" />
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/60 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-300/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-xs text-muted-foreground">rotverse / graph-lab</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
          <div className="border-b border-white/10 bg-black/20 p-4 md:border-b-0 md:border-r">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Equations</p>
            <ul className="mt-4 space-y-3 text-sm">
              <EqRow color="bg-fuchsia-400" text="y = sin(x) · cos(x/2)" />
              <EqRow color="bg-cyan-300" text="r = 1 + sin(3θ)" />
              <EqRow color="bg-emerald-300" text="y = x² − 3x + 1" />
            </ul>
            <button className="mt-6 w-full rounded-lg border border-dashed border-white/15 py-2 text-xs text-muted-foreground transition hover:bg-white/5">
              + Add equation
            </button>
          </div>
          <GraphCanvas />
        </div>
      </div>
    </motion.div>
  );
}

function EqRow({ color, text }: { color: string; text: string }) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 transition hover:bg-white/10">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <code className="font-mono text-[12px] text-foreground/90">{text}</code>
    </li>
  );
}

function GraphCanvas() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setT((v) => v + 0.012);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 600,
    H = 340;
  const cx = W / 2,
    cy = H / 2;
  const scale = 40;

  const path1 = buildPath((x) => Math.sin(x + t) * Math.cos(x / 2), -7, 7, 0.05, cx, cy, scale);
  const path2 = buildPath((x) => 0.3 * x * x - 1.5, -4, 4, 0.05, cx, cy, scale);
  const polar = buildPolar(
    (th) => 1 + Math.sin(3 * th + t * 0.6),
    0,
    Math.PI * 2,
    0.02,
    cx,
    cy,
    scale * 1.5,
  );

  return (
    <div className="relative aspect-[16/9] w-full bg-[radial-gradient(circle_at_center,oklch(0.22_0.04_270),oklch(0.14_0.03_270))]">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="oklch(1 0 0 / 0.06)" strokeWidth="1" />
          </pattern>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.78 0.20 320)" />
            <stop offset="1" stopColor="oklch(0.78 0.20 280)" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        <line x1="0" y1={cy} x2={W} y2={cy} stroke="oklch(1 0 0 / 0.2)" />
        <line x1={cx} y1="0" x2={cx} y2={H} stroke="oklch(1 0 0 / 0.2)" />
        <path d={polar} fill="none" stroke="oklch(0.85 0.18 200)" strokeWidth="2" opacity="0.9" />
        <path d={path2} fill="none" stroke="oklch(0.82 0.18 150)" strokeWidth="2" opacity="0.8" />
        <path d={path1} fill="none" stroke="url(#g1)" strokeWidth="2.5" />
      </svg>
      <div className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur">
        t = {t.toFixed(2)}
      </div>
    </div>
  );
}

function buildPath(
  f: (x: number) => number,
  xMin: number,
  xMax: number,
  step: number,
  cx: number,
  cy: number,
  scale: number,
) {
  let d = "";
  for (let x = xMin; x <= xMax; x += step) {
    const px = cx + x * scale;
    const py = cy - f(x) * scale;
    d += (d ? " L" : "M") + px.toFixed(2) + " " + py.toFixed(2);
  }
  return d;
}

function buildPolar(
  f: (th: number) => number,
  tMin: number,
  tMax: number,
  step: number,
  cx: number,
  cy: number,
  scale: number,
) {
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
  return (
    <section id="modules" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Moduli</p>
          <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
            Tutto quello che ti serve, <br className="hidden md:block" />
            <span className="text-gradient">in un solo posto</span>.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ogni modulo è progettato per essere veloce, bello e potente. Inizia da uno, scoprili
          tutti.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((m, i) => (
          <ModuleCard key={m.tag} {...m} index={i} />
        ))}
      </div>
    </section>
  );
}

function ModuleCard({
  tag,
  title,
  desc,
  accent,
  badgeClass,
  soon,
  to,
  index,
}: (typeof modules)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const Inner = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, oklch(0.78 0.20 310 / 0.18), transparent 40%)`,
        }}
      />
      <div className="flex items-center justify-between">
        <span
          className={`inline-block rounded-full ${badgeClass ?? `bg-gradient-to-r ${accent} text-black/80`} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest`}
        >
          {tag}
        </span>
        {soon && (
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            soon
          </span>
        )}
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground/80 transition group-hover:text-foreground">
        {soon ? "Coming soon" : "Apri modulo"}{" "}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </motion.div>
  );
  if (soon) return <div>{Inner}</div>;
  return (
    <Link to={to} className="block h-full">
      {Inner}
    </Link>
  );
}

function Showcase() {
  return (
    <section id="showcase" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DocPreview />
        <StatsPanel />
      </div>
    </section>
  );
}

function DocPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-200">
            PDF
          </span>
          <span className="text-xs text-muted-foreground">cosmology-notes.pdf · page 3 / 24</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <button className="rounded-md px-2 py-1 hover:bg-white/10">−</button>
          <span>100%</span>
          <button className="rounded-md px-2 py-1 hover:bg-white/10">+</button>
        </div>
      </div>
      <div className="space-y-3 bg-[oklch(0.97_0.005_270)] p-8 text-[oklch(0.18_0.03_270)]">
        <h4 className="font-display text-xl font-bold">Chapter 3 — Rotational dynamics</h4>
        <p className="text-sm leading-relaxed">
          When a rigid body rotates about a fixed axis, every particle within the body moves in a
          circle. The angular velocity ω relates linear and angular quantities through v = ω × r.
        </p>
        <div className="my-4 h-px bg-black/10" />
        <p className="text-sm leading-relaxed">
          The moment of inertia I = Σ mᵢ rᵢ² quantifies an object's resistance to angular
          acceleration — a cosmic analog of mass for rotation.
        </p>
        <div className="rounded-lg border border-black/10 bg-black/5 p-3 font-mono text-[12px]">
          τ = I · α &nbsp;&nbsp;|&nbsp;&nbsp; L = I · ω &nbsp;&nbsp;|&nbsp;&nbsp; E = ½ I ω²
        </div>
      </div>
    </motion.div>
  );
}

function StatsPanel() {
  const stats = [
    { k: "Moduli interattivi", v: "6+" },
    { k: "Formati supportati", v: "12" },
    { k: "Latency UI", v: "<16ms" },
    { k: "Open source", v: "Sì" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col justify-between rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Manifesto</p>
        <h3 className="mt-3 font-display text-3xl font-semibold leading-tight">
          Strumenti che dovrebbero esistere già — finalmente in un'unica galassia.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          RotVerse non è un'altra suite gonfia. È un insieme di micro-app curate maniacalmente,
          collegate da un'estetica e un linguaggio comuni.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-display text-3xl font-semibold text-gradient">{s.v}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.k}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-6 py-10">
      <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="font-display text-base font-semibold text-foreground">RotVerse</span>
          <span className="ml-2">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
