import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, Link2, Loader2, Music, Sparkles, Youtube } from "lucide-react";

const YOUTUBE_URL_RE =
  /^https?:\/\/(?:(?:www\.)?youtube\.com\/watch\?v=|(?:www\.)?youtube\.com\/shorts\/|youtu\.be\/)[\w-]{6,}(?:[?&].*)?$/i;

const qualities = [
  { label: "128 kbps", value: "128" },
  { label: "192 kbps", value: "192" },
  { label: "320 kbps", value: "320", suffix: "High" },
];

export default function YoutubeDownloader() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("192");
  const [status, setStatus] = useState("idle");
  const timeoutRef = useRef(0);
  const isValid = useMemo(() => YOUTUBE_URL_RE.test(url.trim()), [url]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const extractAudio = () => {
    if (!isValid || status === "loading") return;

    setStatus("loading");

    // Future backend call: await fetch("/api/youtube/extract", { method: "POST", body: ... })
    timeoutRef.current = window.setTimeout(() => {
      setStatus("ready");
    }, 2000);
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-5">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl">
        <div className="border-b border-white/10 bg-red-500/10 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-300">
            YouTube to MP3
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold">
            <Youtube className="h-5 w-5 text-[#FF0000]" />
            Downloader Lab
          </h2>
        </div>

        <div className="grid gap-5 p-5">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              URL YouTube
            </span>
            <div
              className={`flex min-h-14 items-center gap-3 rounded-xl border bg-black/20 px-4 transition ${
                !url ? "border-white/10" : isValid ? "border-red-400/70" : "border-rose-400/60"
              }`}
            >
              <Link2 className="h-5 w-5 shrink-0 text-red-300" />
              <input
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  setStatus("idle");
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/50"
              />
              {isValid && <CheckCircle2 className="h-5 w-5 shrink-0 text-red-300" />}
            </div>
          </label>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Music className="h-4 w-4 text-red-300" />
              Qualita audio
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {qualities.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setQuality(item.value)}
                  className={`h-11 rounded-lg border text-sm font-semibold transition ${
                    quality === item.value
                      ? "border-red-400 bg-red-500/20 text-red-100"
                      : "border-white/10 bg-black/20 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {item.label}
                  {item.suffix && (
                    <span className="ml-2 rounded-full bg-red-400/20 px-2 py-0.5 text-[10px] text-red-200">
                      {item.suffix}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm font-medium">Estrazione simulata</p>
              <p className="text-xs text-muted-foreground">
                Pronto per collegarsi a un backend Node.js con yt-dlp o a una API esterna.
              </p>
            </div>
            <button
              type="button"
              disabled={!isValid || status === "loading"}
              onClick={extractAudio}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#FF0000] px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:pointer-events-none disabled:opacity-40"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {status === "loading" ? "Parsing video..." : "Estrai Audio"}
            </button>
          </div>

          {status === "ready" && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4">
              <div>
                <p className="text-sm font-semibold text-red-100">audio-preview-{quality}.mp3</p>
                <p className="text-xs text-muted-foreground">
                  File simulato pronto per il download
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-300/30 bg-red-400/15 px-4 text-sm font-semibold text-red-100 hover:bg-red-400/25"
              >
                <Download className="h-4 w-4" />
                Download MP3
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
