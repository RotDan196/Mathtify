import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    traceDeps: ["youtube-dl-exec*", "ffmpeg-static*"],
  } as any,
  tanstackStart: {
    server: { entry: "server" },
  },
});
