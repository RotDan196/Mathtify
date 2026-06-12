import { createFileRoute } from "@tanstack/react-router";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import youtubedl from "youtube-dl-exec";

const QUALITY_OPTIONS = ["360", "720", "1080"];
const AUDIO_FORMAT_OPTIONS = ["mp3", "m4a", "opus", "wav", "flac"];
const AUDIO_QUALITY_OPTIONS = ["64", "96", "128", "160", "192", "256", "320"];
const MODE_OPTIONS = ["video", "audio"];
const AUDIO_MIME_TYPES: Record<string, string> = {
  flac: "audio/flac",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  opus: "audio/ogg;codecs=opus",
  wav: "audio/wav",
};

type YoutubeDlResult = {
  url?: string;
  title?: string;
  height?: number;
  ext?: string;
  uploader?: string;
  channel?: string;
  error?: string;
  requested_formats?: Array<{ mime_type?: string }>;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getYoutubeVideoId(inputUrl: string) {
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

function normalizeQuality(quality: unknown) {
  if (typeof quality !== "string") return "720";
  return QUALITY_OPTIONS.includes(quality) ? quality : "720";
}

function normalizeMode(mode: unknown) {
  if (typeof mode !== "string") return "video";
  return MODE_OPTIONS.includes(mode) ? mode : "video";
}

function normalizeAudioFormat(format: unknown) {
  if (typeof format !== "string") return "mp3";
  return AUDIO_FORMAT_OPTIONS.includes(format) ? format : "mp3";
}

function normalizeAudioQuality(quality: unknown) {
  const value = typeof quality === "number" ? String(quality) : quality;
  if (typeof value !== "string") return "192";
  return AUDIO_QUALITY_OPTIONS.includes(value) ? value : "192";
}

async function getYouTubeUrl(inputUrl: string, quality = "720") {
  const format = `best[height<=${quality}][ext=mp4]/best[height<=${quality}]/best[ext=mp4]/best`;
  return await youtubedl(
    inputUrl,
    {
      dumpSingleJson: true,
      noPlaylist: true,
      noWarnings: true,
      format,
      addHeader: ["referer:youtube.com", "user-agent:Mozilla/5.0"],
    },
    { timeout: 120000 },
  );
}

async function extractYouTubeAudio({
  inputUrl,
  videoId,
  audioFormat,
  audioQuality,
}: {
  inputUrl: string;
  videoId: string;
  audioFormat: string;
  audioQuality: string;
}) {
  const dir = await mkdtemp(join(tmpdir(), "mathtify-youtube-"));
  const output = join(dir, `${videoId}.%(ext)s`);

  try {
    const ytdlpOptions = {
      noPlaylist: true,
      noWarnings: true,
      extractAudio: true,
      audioFormat,
      audioQuality: `${audioQuality}K`,
      format: "bestaudio/best",
      output,
      addHeader: ["referer:youtube.com", "user-agent:Mozilla/5.0"],
    } as any;

    await youtubedl(inputUrl, ytdlpOptions, { timeout: 240000 });

    const files = await readdir(dir);
    const fileName = files.find((file) => file.startsWith(videoId));
    if (!fileName) throw new Error("audio_file_not_created");

    const buffer = await readFile(join(dir, fileName));
    const extension = fileName.split(".").pop()?.toLowerCase() || audioFormat;

    return {
      buffer,
      fileName,
      mimeType: AUDIO_MIME_TYPES[extension] || AUDIO_MIME_TYPES[audioFormat] || "audio/mpeg",
    };
  } finally {
    await rm(dir, { force: true, recursive: true });
  }
}

export const Route = createFileRoute("/api/youtube")({
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
              audioQuality,
            });

            return new Response(new Uint8Array(audio.buffer), {
              headers: {
                "Content-Disposition": `attachment; filename="${encodeURIComponent(audio.fileName)}"`,
                "Content-Type": audio.mimeType,
                "X-File-Name": encodeURIComponent(audio.fileName),
                "X-Quality": `${audioQuality} kbps`,
                "X-Source": "yt-dlp + ffmpeg",
              },
            });
          }

          const data = (await getYouTubeUrl(inputUrl, quality)) as YoutubeDlResult;

          if (typeof data?.url !== "string") {
            return jsonResponse(
              {
                status: "error",
                error: data?.error || "stream_not_found",
                source: data,
              },
              502,
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
            source: "yt-dlp",
          });
        } catch (error) {
          return jsonResponse(
            {
              status: "error",
              error: error instanceof Error ? error.message : "youtube_request_failed",
            },
            502,
          );
        }
      },
    },
  },
});
