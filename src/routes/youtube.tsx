import { createFileRoute } from "@tanstack/react-router";

import { ModuleShell } from "@/components/ModuleShell";
import YoutubeDownloader from "@/components/YoutubeDownloader";

export const Route = createFileRoute("/youtube")({
  head: () => ({
    meta: [
      { title: "YouTube Downloader - RotVerse" },
      {
        name: "description",
        content: "Downloader YouTube con estrazione video tramite backend locale yt-dlp.",
      },
    ],
  }),
  component: YoutubeRoute,
});

function YoutubeRoute() {
  return (
    <ModuleShell title="YouTube Downloader" tag="YOUTUBE VIDEO" accent="from-red-500 to-rose-500">
      <YoutubeDownloader />
    </ModuleShell>
  );
}
