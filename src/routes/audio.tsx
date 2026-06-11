import { createFileRoute } from "@tanstack/react-router";

import AudioTools from "@/components/AudioTools";
import { ModuleShell } from "@/components/ModuleShell";

export const Route = createFileRoute("/audio")({
  head: () => ({
    meta: [
      { title: "Audio Lab - RotVerse" },
      {
        name: "description",
        content: "Editor MP3 locale con gain, trimming e spettrometro Web Audio.",
      },
    ],
  }),
  component: AudioLab,
});

function AudioLab() {
  return (
    <ModuleShell title="Audio Lab" tag="AUDIO LAB" accent="from-green-400 to-emerald-500">
      <AudioTools />
    </ModuleShell>
  );
}
