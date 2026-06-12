import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import "../_libs/mathlive.mjs";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
const appCss = "/assets/styles-DC66JRNv.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$9 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RotVerse" },
      { name: "description", content: "RotVerse Canvas is a modern web application for interactive visualization and document viewing." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "RotVerse" },
      { property: "og:description", content: "RotVerse Canvas is a modern web application for interactive visualization and document viewing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "RotVerse" },
      { name: "twitter:description", content: "RotVerse Canvas is a modern web application for interactive visualization and document viewing." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a15548c9-662d-4156-a2de-9f146f7a4046/id-preview-f7d0414c--5ce47081-8b89-41b2-bdc5-fa4d3aedf8f2.lovable.app-1781190780886.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a15548c9-662d-4156-a2de-9f146f7a4046/id-preview-f7d0414c--5ce47081-8b89-41b2-bdc5-fa4d3aedf8f2.lovable.app-1781190780886.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$9.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$7 = () => import("./youtube-BJomaNcE.mjs");
const Route$8 = createFileRoute("/youtube")({
  head: () => ({
    meta: [{
      title: "YouTube Downloader - RotVerse"
    }, {
      name: "description",
      content: "Downloader YouTube con estrazione video tramite backend locale yt-dlp."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./whiteboard-BuNnHrif.mjs");
const Route$7 = createFileRoute("/whiteboard")({
  head: () => ({
    meta: [{
      title: "Whiteboard — RotVerse"
    }, {
      name: "description",
      content: "Canvas infinito per disegnare, aggiungere forme e sticky notes."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./graph-DSeAmp8s.mjs");
const Route$6 = createFileRoute("/graph")({
  head: () => ({
    meta: [{
      title: "Graph Lab — RotVerse"
    }, {
      name: "description",
      content: "Interactive GeoGebra-style graphing with a virtual keyboard, pan, zoom and parameters."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./docs-CIyQFjGm.mjs");
const Route$5 = createFileRoute("/docs")({
  head: () => ({
    meta: [{
      title: "Doc Viewer — RotVerse"
    }, {
      name: "description",
      content: "Visualizza PDF e DOCX nel browser con zoom, ricerca e paginazione."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./data-D-S_q6Ni.mjs");
const Route$4 = createFileRoute("/data")({
  head: () => ({
    meta: [{
      title: "Data Lens — RotVerse"
    }, {
      name: "description",
      content: "Carica un CSV e visualizza grafici interattivi (linea, barre, scatter) con filtri."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./code-HgbVICuL.mjs");
const Route$3 = createFileRoute("/code")({
  head: () => ({
    meta: [{
      title: "Code Forge — RotVerse"
    }, {
      name: "description",
      content: "Editor di codice in-browser con preview live HTML/CSS/JS e snippet salvati."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./audio-B6KnHkKP.mjs");
const Route$2 = createFileRoute("/audio")({
  head: () => ({
    meta: [{
      title: "Audio Lab - RotVerse"
    }, {
      name: "description",
      content: "Editor MP3 locale con gain, trimming e spettrometro Web Audio."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-1Dkej0Lq.mjs");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "RotVerse — A universe of interactive tools"
    }, {
      name: "description",
      content: "RotVerse is a modern playground for interactive math, document viewing, and creative tools — all in one place."
    }, {
      property: "og:title",
      content: "RotVerse"
    }, {
      property: "og:description",
      content: "A universe of interactive tools: graphing, documents, and more."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const QUALITY_OPTIONS = ["360", "720", "1080"];
const AUDIO_FORMAT_OPTIONS = ["mp3", "m4a", "opus", "wav", "flac"];
const AUDIO_QUALITY_OPTIONS = ["64", "96", "128", "160", "192", "256", "320"];
const MODE_OPTIONS = ["video", "audio"];
const AUDIO_MIME_TYPES = {
  flac: "audio/flac",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  opus: "audio/ogg;codecs=opus",
  wav: "audio/wav"
};
async function getYoutubeDl() {
  const module = await import("youtube-dl-exec");
  return module.default;
}
async function getFfmpegPath() {
  try {
    const module = await import("ffmpeg-static");
    const ffmpegPath = module.default;
    return typeof ffmpegPath === "string" && ffmpegPath ? ffmpegPath : void 0;
  } catch {
    return void 0;
  }
}
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function getYoutubeVideoId(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const hostname = parsed.hostname.replace(/^www\./, "");
    if (hostname === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || "";
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
    }
  } catch {
    return "";
  }
  return "";
}
function normalizeQuality(quality) {
  if (typeof quality !== "string") return "720";
  return QUALITY_OPTIONS.includes(quality) ? quality : "720";
}
function normalizeMode(mode) {
  if (typeof mode !== "string") return "video";
  return MODE_OPTIONS.includes(mode) ? mode : "video";
}
function normalizeAudioFormat(format) {
  if (typeof format !== "string") return "mp3";
  return AUDIO_FORMAT_OPTIONS.includes(format) ? format : "mp3";
}
function normalizeAudioQuality(quality) {
  const value = typeof quality === "number" ? String(quality) : quality;
  if (typeof value !== "string") return "192";
  return AUDIO_QUALITY_OPTIONS.includes(value) ? value : "192";
}
async function getYouTubeUrl(inputUrl, quality = "720") {
  const youtubedl = await getYoutubeDl();
  const format = `best[height<=${quality}][ext=mp4]/best[height<=${quality}]/best[ext=mp4]/best`;
  return await youtubedl(
    inputUrl,
    {
      dumpSingleJson: true,
      noPlaylist: true,
      noWarnings: true,
      format,
      addHeader: ["referer:youtube.com", "user-agent:Mozilla/5.0"]
    },
    { timeout: 12e4 }
  );
}
async function extractYouTubeAudio({
  inputUrl,
  videoId,
  audioFormat,
  audioQuality
}) {
  const dir = await mkdtemp(join(tmpdir(), "mathtify-youtube-"));
  const output = join(dir, `${videoId}.%(ext)s`);
  try {
    const youtubedl = await getYoutubeDl();
    const ffmpegPath = await getFfmpegPath();
    if (!ffmpegPath) throw new Error("ffmpeg_static_not_available");
    const ytdlpOptions = {
      noPlaylist: true,
      noWarnings: true,
      extractAudio: true,
      audioFormat,
      audioQuality: Number(audioQuality),
      format: "bestaudio/best",
      output,
      ffmpegLocation: ffmpegPath,
      addHeader: ["referer:youtube.com", "user-agent:Mozilla/5.0"]
    };
    await youtubedl(inputUrl, ytdlpOptions, { timeout: 24e4 });
    const files = await readdir(dir);
    const fileName = files.find((file) => file.startsWith(videoId));
    if (!fileName) throw new Error("audio_file_not_created");
    const buffer = await readFile(join(dir, fileName));
    const extension = fileName.split(".").pop()?.toLowerCase() || audioFormat;
    return {
      buffer,
      fileName,
      mimeType: AUDIO_MIME_TYPES[extension] || AUDIO_MIME_TYPES[audioFormat] || "audio/mpeg"
    };
  } finally {
    await rm(dir, { force: true, recursive: true });
  }
}
const Route = createFileRoute("/api/youtube")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = await request.json().catch(() => null);
          const inputUrl = typeof payload?.url === "string" ? payload.url.trim() : "";
          const mode = normalizeMode(payload?.mode);
          const quality = normalizeQuality(payload?.quality);
          const audioFormat = normalizeAudioFormat(payload?.audioFormat);
          const audioQuality = normalizeAudioQuality(payload?.audioQuality);
          const videoId = getYoutubeVideoId(inputUrl);
          if (!inputUrl) {
            return jsonResponse({ status: "error", error: "missing_url" }, 400);
          }
          if (!videoId) {
            return jsonResponse({ status: "error", error: "invalid_youtube_url" }, 400);
          }
          if (mode === "audio") {
            const audio = await extractYouTubeAudio({
              inputUrl,
              videoId,
              audioFormat,
              audioQuality
            });
            return new Response(new Uint8Array(audio.buffer), {
              headers: {
                "Content-Disposition": `attachment; filename="${encodeURIComponent(audio.fileName)}"`,
                "Content-Type": audio.mimeType,
                "X-File-Name": encodeURIComponent(audio.fileName),
                "X-Quality": `${audioQuality} kbps`,
                "X-Source": "yt-dlp + ffmpeg"
              }
            });
          }
          const data = await getYouTubeUrl(inputUrl, quality);
          if (typeof data?.url !== "string") {
            return jsonResponse(
              {
                status: "error",
                error: data?.error || "stream_not_found",
                source: data
              },
              502
            );
          }
          return jsonResponse({
            status: "redirect",
            url: data.url,
            filename: `${data?.title || `youtube-${videoId}`}-${data?.height || quality}.${data?.ext || "mp4"}`,
            title: data?.title,
            author: data?.uploader || data?.channel,
            quality: data?.height ? `${data.height}p` : quality,
            mimeType: data?.requested_formats?.[0]?.mime_type || `video/${data?.ext || "mp4"}`,
            source: "yt-dlp"
          });
        } catch (error) {
          return jsonResponse(
            {
              status: "error",
              error: error instanceof Error ? error.message : "youtube_request_failed"
            },
            502
          );
        }
      }
    }
  }
});
const YoutubeRoute = Route$8.update({
  id: "/youtube",
  path: "/youtube",
  getParentRoute: () => Route$9
});
const WhiteboardRoute = Route$7.update({
  id: "/whiteboard",
  path: "/whiteboard",
  getParentRoute: () => Route$9
});
const GraphRoute = Route$6.update({
  id: "/graph",
  path: "/graph",
  getParentRoute: () => Route$9
});
const DocsRoute = Route$5.update({
  id: "/docs",
  path: "/docs",
  getParentRoute: () => Route$9
});
const DataRoute = Route$4.update({
  id: "/data",
  path: "/data",
  getParentRoute: () => Route$9
});
const CodeRoute = Route$3.update({
  id: "/code",
  path: "/code",
  getParentRoute: () => Route$9
});
const AudioRoute = Route$2.update({
  id: "/audio",
  path: "/audio",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const ApiYoutubeRoute = Route.update({
  id: "/api/youtube",
  path: "/api/youtube",
  getParentRoute: () => Route$9
});
const rootRouteChildren = {
  IndexRoute,
  AudioRoute,
  CodeRoute,
  DataRoute,
  DocsRoute,
  GraphRoute,
  WhiteboardRoute,
  YoutubeRoute,
  ApiYoutubeRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
