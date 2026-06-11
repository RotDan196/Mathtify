import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function ModuleShell({
  title,
  tag,
  accent = "from-fuchsia-400 to-purple-500",
  children,
  actions,
}: {
  title: string;
  tag: string;
  accent?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-4">
          <Link to="/" className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm backdrop-blur transition hover:bg-white/10">
            <span className="transition group-hover:-translate-x-0.5">←</span> RotVerse
          </Link>
          <div className="flex items-center gap-3">
            <span className={`inline-block rounded-full bg-gradient-to-r ${accent} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black/80`}>
              {tag}
            </span>
            <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1500px] px-6 pb-10">{children}</main>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

export function PanelHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5 text-xs uppercase tracking-widest text-muted-foreground">
      {children}
    </div>
  );
}

export function IconButton({
  children, onClick, title, active, className = "",
}: {
  children: ReactNode; onClick?: () => void; title?: string; active?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-sm transition ${
        active
          ? "border-primary/40 bg-primary/20 text-foreground"
          : "border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10"
      } ${className}`}
    >
      {children}
    </button>
  );
}
