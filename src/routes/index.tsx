import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RotVerse - A universe of interactive tools" },
      {
        name: "description",
        content:
          "RotVerse is a modern playground for interactive math, document viewing, audio tools, and creative utilities.",
      },
      { property: "og:title", content: "RotVerse" },
      {
        property: "og:description",
        content: "A universe of interactive tools: graphing, documents, audio, and more.",
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
    desc: "Visualizzatore nativo PDF e DOCX con zoom, ricerca testo e paginazione.",
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
    desc: "Carica un CSV: grafici interattivi linea, barre e scatter con filtri.",
    accent: "from-rose-300 to-pink-500",
    to: "/data" as const,
    soon: false,
  },
  {
    tag: "AUDIO LAB",
    title: "Sound & Frequencies",
    desc: "Editor MP3 nel browser. Taglia tracce, regola il gain e visualizza lo spettro audio in tempo reale.",
    accent: "from-green-400 to-emerald-500",
    badgeClass: "bg-green-500/20 text-green-300",
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
    desc: "Workspace chat-first che collega ogni modulo. Coming soon.",
    accent: "from-indigo-300 to-violet-500",
    to: "/" as const,
    soon: true,
  },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_-10%,rgba(168,85,247,0.30),transparent_42%),radial-gradient(ellipse_at_84%_12%,rgba(6,182,212,0.18),transparent_42%),radial-gradient(ellipse_at_48%_100%,rgba(236,72,153,0.18),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_24%,rgba(0,0,0,0.45))]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />

      <Nav />
      <Hero />
      <Modules />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
      <a href="#" className="flex items-center gap-2">
        <LogoMark />
        <span className="font-display text-xl font-semibold tracking-tight text-white">RotVerse</span>
      </a>
      <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
        <a href="#modules" className="transition hover:text-white">
          Modules
        </a>
      </nav>
      <Link
        to="/graph"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 shadow-2xl backdrop-blur-2xl transition hover:bg-white/10 hover:text-white"
      >
        Launch app -&gt;
      </Link>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl">
      <div className="absolute inset-[2px] rounded-[10px] bg-black/35" />
      <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-cyan-200" fill="none">
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
    <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-6 md:pb-14 md:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50 shadow-2xl backdrop-blur-2xl">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
          v0.1 - public preview
        </div>
        <h1 className="font-display text-5xl font-semibold leading-[1.02] text-white/95 md:text-7xl">
          A universe of <span className="text-cyan-200/95">interactive</span> tools.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/55 md:text-lg">
          RotVerse riunisce graphing, documenti, audio e strumenti creativi in un hub scuro,
          minimale e fluido.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#modules"
            className="group relative overflow-hidden rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-2xl transition hover:scale-[1.02] hover:bg-white/15"
          >
            Esplora i moduli
          </a>
          <Link
            to="/graph"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 shadow-2xl backdrop-blur-2xl transition hover:bg-white/10 hover:text-white"
          >
            Apri Graph Lab -&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section id="modules" className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-6 md:pt-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <ModuleCard key={module.tag} {...module} index={index} />
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
}: (typeof modules)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const inner = (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.16), transparent 42%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35" />
      <div className="relative flex items-center justify-between">
        <span
          className={`inline-block rounded-full ${
            badgeClass ?? `bg-gradient-to-r ${accent} text-black/80`
          } px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest`}
        >
          {tag}
        </span>
        {soon && (
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/45">
            soon
          </span>
        )}
      </div>
      <h3 className="relative mt-5 font-display text-2xl font-semibold leading-tight text-white">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-white/55">{desc}</p>
      <div className="relative mt-6 flex items-center gap-2 text-sm font-medium text-white/75 transition group-hover:text-white">
        {soon ? "Coming soon" : "Apri modulo"}{" "}
        <span className="transition group-hover:translate-x-1">-&gt;</span>
      </div>
    </div>
  );

  if (soon) return <div>{inner}</div>;

  return (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  );
}
