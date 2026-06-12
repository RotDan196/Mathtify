import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { M as ModuleShell } from "./ModuleShell-DRa0J7Mt.mjs";
import { Y as Youtube, L as Link2, C as CircleCheck, A as AudioLines, M as MonitorDown, a as CircleAlert, b as LoaderCircle, S as Sparkles, D as Download } from "../_libs/lucide-react.mjs";
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
const YOUTUBE_URL_RE = /^https?:\/\/(?:(?:www\.)?youtube\.com\/watch\?v=|(?:www\.)?youtube\.com\/shorts\/|youtu\.be\/)[\w-]{6,}(?:[?&].*)?$/i;
const qualities = [
  { label: "360p", value: "360" },
  { label: "720p", value: "720", suffix: "HD" },
  { label: "1080p", value: "1080", suffix: "Full HD" }
];
const audioQualities = [
  { label: "128 kbps", value: "128" },
  { label: "192 kbps", value: "192" },
  { label: "256 kbps", value: "256" },
  { label: "320 kbps", value: "320", suffix: "High" }
];
const audioFormats = [
  { label: "MP3", value: "mp3" },
  { label: "M4A", value: "m4a" },
  { label: "OPUS", value: "opus" },
  { label: "WAV", value: "wav" },
  { label: "FLAC", value: "flac" }
];
function isHttpUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}
async function convertYoutubeDownload({ inputUrl, mode, quality, audioFormat, audioQuality, signal }) {
  const response = await fetch("/api/youtube", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: inputUrl, mode, quality, audioFormat, audioQuality }),
    signal
  });
  if (mode === "audio" && response.ok) {
    const blob = await response.blob();
    const fileName = decodeURIComponent(response.headers.get("X-File-Name") || "") || `youtube-audio-${audioQuality}.${audioFormat}`;
    const mediaUrl2 = URL.createObjectURL(blob);
    return {
      mediaUrl: mediaUrl2,
      isObjectUrl: true,
      data: {
        format: audioFormat.toUpperCase(),
        quality: response.headers.get("X-Quality") || `${audioQuality} kbps`,
        source: response.headers.get("X-Source") || "yt-dlp + ffmpeg",
        title: fileName
      },
      fileName
    };
  }
  const data = await response.json().catch(() => null);
  console.log("YouTube stream API response:", data);
  if (!response.ok || data?.status === "error") {
    const detail = data?.error?.code || data?.error || data?.message || data?.status || "Nessuno stream disponibile.";
    const error = new Error(`Estrazione non riuscita (${response.status}): ${detail}`);
    error.data = data;
    throw error;
  }
  const mediaUrl = data?.url;
  if (!isHttpUrl(mediaUrl)) {
    const error = new Error("Nessun link video valido trovato nella risposta.");
    error.data = data;
    throw error;
  }
  return {
    mediaUrl,
    isObjectUrl: false,
    data,
    fileName: data?.filename || `youtube-video-${data?.quality || quality}.mp4`
  };
}
function YoutubeDownloader({ onAudioReady }) {
  const [url, setUrl] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("video");
  const [quality, setQuality] = reactExports.useState("720");
  const [audioQuality, setAudioQuality] = reactExports.useState("192");
  const [audioFormat, setAudioFormat] = reactExports.useState("mp3");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [mediaInfo, setMediaInfo] = reactExports.useState(null);
  const [mediaFileUrl, setMediaFileUrl] = reactExports.useState("");
  const [downloadLink, setDownloadLink] = reactExports.useState("");
  const [downloadName, setDownloadName] = reactExports.useState("");
  const abortControllerRef = reactExports.useRef(null);
  const objectUrlRef = reactExports.useRef("");
  const isValid = reactExports.useMemo(() => YOUTUBE_URL_RE.test(url.trim()), [url]);
  const resetResult = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
    setMediaInfo(null);
    setMediaFileUrl("");
    setDownloadLink("");
    setDownloadName("");
  };
  reactExports.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);
  const handleDownload = async () => {
    if (!isValid || isLoading) return;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError("");
    resetResult();
    try {
      const result = await convertYoutubeDownload({
        inputUrl: url.trim(),
        mode,
        quality,
        audioFormat,
        audioQuality,
        signal: abortControllerRef.current.signal
      });
      if (result.isObjectUrl) objectUrlRef.current = result.mediaUrl;
      setMediaFileUrl(result.mediaUrl);
      setMediaInfo(result.data);
      setDownloadLink(result.mediaUrl);
      setDownloadName(result.fileName);
      onAudioReady?.(result.mediaUrl);
    } catch (err) {
      setMediaInfo(null);
      if (err?.name !== "AbortError") {
        setError(err?.message || "Errore durante l'estrazione video.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto grid w-full max-w-5xl gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-white/10 bg-red-500/10 px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-red-300", children: "YouTube Stream" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-2 flex items-center gap-2 text-xl font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "h-5 w-5 text-[#FF0000]" }),
        "Downloader Lab"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-xs uppercase tracking-widest text-muted-foreground", children: "URL YouTube" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex min-h-14 items-center gap-3 rounded-xl border bg-black/20 px-4 transition ${!url ? "border-white/10" : isValid ? "border-red-400/70" : "border-rose-400/60"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-5 w-5 shrink-0 text-red-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: url,
                  onChange: (event) => {
                    setUrl(event.target.value);
                    setError("");
                    setMediaInfo(null);
                    setMediaFileUrl("");
                    setDownloadLink("");
                    setDownloadName("");
                  },
                  placeholder: "https://www.youtube.com/watch?v=...",
                  className: "min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/50"
                }
              ),
              isValid && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 shrink-0 text-red-300" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AudioLines, { className: "h-4 w-4 text-red-300" }),
            "Tipo estrazione"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: [
            { label: "Video", value: "video" },
            { label: "Solo audio", value: "audio" }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setMode(item.value);
                setError("");
                resetResult();
              },
              className: `h-11 rounded-lg border text-sm font-semibold transition ${mode === item.value ? "border-red-400 bg-red-500/20 text-red-100" : "border-white/10 bg-black/20 text-muted-foreground hover:bg-white/10"}`,
              children: item.label
            },
            item.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorDown, { className: "h-4 w-4 text-red-300" }),
            mode === "audio" ? "Qualita audio" : "Qualita video"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid gap-2 ${mode === "audio" ? "sm:grid-cols-4" : "sm:grid-cols-3"}`, children: (mode === "audio" ? audioQualities : qualities).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                if (mode === "audio") setAudioQuality(item.value);
                else setQuality(item.value);
                setError("");
                resetResult();
              },
              className: `h-11 rounded-lg border text-sm font-semibold transition ${(mode === "audio" ? audioQuality : quality) === item.value ? "border-red-400 bg-red-500/20 text-red-100" : "border-white/10 bg-black/20 text-muted-foreground hover:bg-white/10"}`,
              children: [
                item.label,
                item.suffix && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-red-400/20 px-2 py-0.5 text-[10px] text-red-200", children: item.suffix })
              ]
            },
            item.value
          )) })
        ] }),
        mode === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block uppercase tracking-widest", children: "Formato audio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: audioFormat,
              onChange: (event) => {
                setAudioFormat(event.target.value);
                setError("");
                resetResult();
              },
              className: "h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground outline-none focus:border-red-300",
              children: audioFormats.map((format) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: format.value, children: format.label }, format.value))
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 shrink-0" }),
        error
      ] }),
      mediaFileUrl && mode === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx("video", { controls: true, src: mediaFileUrl, className: "w-full rounded-xl bg-black/20" }),
      mediaFileUrl && mode === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { controls: true, src: mediaFileUrl, className: "w-full rounded-xl bg-black/20" }),
      mediaInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-muted-foreground sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "uppercase tracking-widest text-muted-foreground/70", children: "Titolo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-semibold text-foreground", children: mediaInfo.title || "Video" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "uppercase tracking-widest text-muted-foreground/70", children: "Qualita" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-semibold text-foreground", children: mediaInfo.quality || (mode === "audio" ? `${audioQuality} kbps` : `${quality}p`) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "uppercase tracking-widest text-muted-foreground/70", children: "Motore" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-semibold text-foreground", children: mediaInfo.source || "yt-dlp" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: mode === "audio" ? "Estrazione audio" : "Estrazione video" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: onAudioReady ? "Il link completato viene inviato automaticamente al modulo collegato." : "Il file completato sara disponibile per il download." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            disabled: !isValid || isLoading,
            onClick: handleDownload,
            className: "inline-flex h-11 items-center gap-2 rounded-lg bg-[#FF0000] px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:pointer-events-none disabled:opacity-40",
            children: [
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              isLoading ? "Estrazione in corso..." : mode === "audio" ? "Estrai Audio" : "Estrai Video"
            ]
          }
        )
      ] }),
      downloadLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-red-100", children: downloadName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: onAudioReady ? "File pronto e inviato al modulo collegato" : "File pronto per il download" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: downloadLink,
            download: downloadName || (mode === "audio" ? `youtube-audio-${audioQuality}.${audioFormat}` : `youtube-video-${quality}.mp4`),
            className: "inline-flex h-10 items-center gap-2 rounded-lg border border-red-300/30 bg-red-400/15 px-4 text-sm font-semibold text-red-100 hover:bg-red-400/25",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              mode === "audio" ? "Download audio" : "Download video"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function YoutubeRoute() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleShell, { title: "YouTube Downloader", tag: "YOUTUBE VIDEO", accent: "from-red-500 to-rose-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(YoutubeDownloader, {}) });
}
export {
  YoutubeRoute as component
};
