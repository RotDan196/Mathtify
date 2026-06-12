declare module "@/components/AudioTools" {
  import type { ComponentType } from "react";

  const AudioTools: ComponentType;
  export default AudioTools;
}

declare module "@/components/YoutubeDownloader" {
  import type { ComponentType } from "react";

  const YoutubeDownloader: ComponentType<{ onAudioReady?: (url: string) => void }>;
  export default YoutubeDownloader;
}

declare module "mammoth/mammoth.browser" {
  const mammoth: {
    convertToHtml: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  };
  export default mammoth;
}
