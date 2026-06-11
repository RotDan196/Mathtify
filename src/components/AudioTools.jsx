import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Download,
  FileAudio2,
  Gauge,
  Link2,
  Music2,
  Pause,
  Play,
  Scissors,
  SlidersHorizontal,
  Square,
  UploadCloud,
  Volume2,
} from "lucide-react";

const SPOTIFY_URL_RE =
  /^https?:\/\/(?:open\.)?spotify\.com\/(?:intl-[a-z]{2}\/)?(track|playlist|album|artist)\/([a-zA-Z0-9]+)(?:\?.*)?$/i;

const TRIM_REGION_ID = "active-trim-region";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width || canvas.parentElement?.clientWidth || 720));
  const height = Math.max(
    120,
    Math.floor(rect.height || canvas.parentElement?.clientHeight || 180),
  );
  const dpr = window.devicePixelRatio || 1;

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function createWaveGradient() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 160);

  gradient.addColorStop(0, "#67e8f9");
  gradient.addColorStop(0.45, "#1DB954");
  gradient.addColorStop(1, "#22d3ee");

  return gradient;
}

function floatTo16BitPcm(channel, gain) {
  const pcm = new Int16Array(channel.length);

  for (let i = 0; i < channel.length; i += 1) {
    const sample = clamp(channel[i] * gain, -1, 1);
    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  return pcm;
}

export default function AudioTools() {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [fileName, setFileName] = useState("");
  const [gain, setGain] = useState(1);
  const [threshold, setThreshold] = useState(-24);
  const [ratio, setRatio] = useState(4);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState("");
  const [error, setError] = useState("");

  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const compressorRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(0);
  const spectrumCanvasRef = useRef(null);
  const waveformContainerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const regionsRef = useRef(null);
  const trimRegionRef = useRef(null);
  const syncingRegionRef = useRef(false);
  const playbackStartedAtRef = useRef(0);
  const playbackOffsetRef = useRef(0);
  const pauseOffsetRef = useRef(0);
  const durationRef = useRef(0);
  const fileInputRef = useRef(null);
  const exportUrlRef = useRef("");
  const audioUrlRef = useRef("");

  const selectedLength = useMemo(() => Math.max(0, trimEnd - trimStart), [trimEnd, trimStart]);
  const canPlay = Boolean(audioBuffer && selectedLength > 0.05);

  const ensureAudioGraph = useCallback(async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let context = audioContextRef.current;

    if (!context || context.state === "closed") {
      context = new AudioContextClass();
      audioContextRef.current = context;
      gainRef.current = context.createGain();
      compressorRef.current = context.createDynamicsCompressor();
      analyserRef.current = context.createAnalyser();
      analyserRef.current.fftSize = 2048;
      gainRef.current.connect(compressorRef.current);
      compressorRef.current.connect(analyserRef.current);
      analyserRef.current.connect(context.destination);
    }

    if (context.state === "suspended") await context.resume();

    gainRef.current.gain.setTargetAtTime(gain, context.currentTime, 0.01);
    compressorRef.current.threshold.setTargetAtTime(threshold, context.currentTime, 0.01);
    compressorRef.current.ratio.setTargetAtTime(ratio, context.currentTime, 0.01);

    return context;
  }, [gain, ratio, threshold]);

  const stopPlayback = useCallback(
    (resetOffset = true) => {
      if (sourceRef.current) {
        sourceRef.current.onended = null;
        try {
          sourceRef.current.stop();
        } catch {
          /* source may already be stopped */
        }
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
      if (resetOffset) pauseOffsetRef.current = trimStart;
      setIsPlaying(false);
    },
    [trimStart],
  );

  const syncTrimRegion = useCallback((start, end) => {
    const region = trimRegionRef.current;
    if (!region) return;

    syncingRegionRef.current = true;
    region.setOptions({ start, end });
    requestAnimationFrame(() => {
      syncingRegionRef.current = false;
    });
  }, []);

  const drawIdleSpectrum = useCallback(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;

    const { ctx, width, height } = fitCanvas(canvas);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(29,185,84,0.22)";
    ctx.beginPath();
    ctx.moveTo(0, height - 22);
    ctx.lineTo(width, height - 22);
    ctx.stroke();
  }, []);

  const drawSpectrum = useCallback(() => {
    const canvas = spectrumCanvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const { ctx, width, height } = fitCanvas(canvas);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, "#22d3ee");
    gradient.addColorStop(0.35, "#1DB954");
    gradient.addColorStop(0.66, "#facc15");
    gradient.addColorStop(1, "#ff1744");

    const render = () => {
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, width, height);

      const barCount = Math.min(112, data.length);
      const step = Math.max(1, Math.floor(data.length / barCount));
      const gap = 2;
      const barWidth = Math.max(2, width / barCount - gap);

      for (let i = 0; i < barCount; i += 1) {
        let sum = 0;
        for (let j = 0; j < step; j += 1) sum += data[i * step + j] || 0;
        const value = sum / step;
        const barHeight = Math.max(2, (value / 255) * (height - 10));
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        if (value > 242) {
          ctx.fillStyle = "rgba(255,23,68,0.42)";
          ctx.fillRect(x, 0, barWidth, 8);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
  }, []);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    exportUrlRef.current = exportUrl;
  }, [exportUrl]);

  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  useEffect(() => {
    if (!isPlaying) drawIdleSpectrum();
  }, [drawIdleSpectrum, isPlaying]);

  useEffect(() => {
    const onResize = () => {
      if (!isPlaying) drawIdleSpectrum();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawIdleSpectrum, isPlaying]);

  useEffect(() => {
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.setTargetAtTime(gain, audioContextRef.current.currentTime, 0.01);
    }
  }, [gain]);

  useEffect(() => {
    if (compressorRef.current && audioContextRef.current) {
      compressorRef.current.threshold.setTargetAtTime(
        threshold,
        audioContextRef.current.currentTime,
        0.01,
      );
    }
  }, [threshold]);

  useEffect(() => {
    if (compressorRef.current && audioContextRef.current) {
      compressorRef.current.ratio.setTargetAtTime(ratio, audioContextRef.current.currentTime, 0.01);
    }
  }, [ratio]);

  useEffect(() => {
    if (sourceRef.current && audioContextRef.current) {
      sourceRef.current.playbackRate.setTargetAtTime(
        playbackRate,
        audioContextRef.current.currentTime,
        0.01,
      );
    }
  }, [playbackRate]);

  useEffect(() => {
    if (!waveformContainerRef.current || !audioUrl) return undefined;

    trimRegionRef.current = null;
    const regions = RegionsPlugin.create();
    const waveSurfer = WaveSurfer.create({
      container: waveformContainerRef.current,
      height: 154,
      normalize: true,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorColor: "#facc15",
      cursorWidth: 2,
      waveColor: createWaveGradient(),
      progressColor: "#1DB954",
      plugins: [regions],
    });

    waveSurferRef.current = waveSurfer;
    regionsRef.current = regions;
    waveSurfer.load(audioUrl);

    const disposers = [
      waveSurfer.on("ready", () => {
        const total = waveSurfer.getDuration() || durationRef.current;
        durationRef.current = total;
        setDuration(total);

        regions.clearRegions();
        trimRegionRef.current = regions.addRegion({
          id: TRIM_REGION_ID,
          start: 0,
          end: total,
          color: "rgba(29,185,84,0.18)",
          drag: true,
          resize: true,
        });
      }),
      regions.on("region-updated", (region) => {
        if (region.id !== TRIM_REGION_ID || syncingRegionRef.current) return;
        const total = durationRef.current || waveSurfer.getDuration();
        const nextStart = clamp(region.start, 0, Math.max(0, total - 0.05));
        const nextEnd = clamp(region.end, nextStart + 0.05, total);

        setTrimStart(nextStart);
        setTrimEnd(nextEnd);
        pauseOffsetRef.current = nextStart;
      }),
    ];

    return () => {
      disposers.forEach((dispose) => dispose());
      waveSurfer.destroy();
      waveSurferRef.current = null;
      regionsRef.current = null;
      trimRegionRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.onended = null;
        try {
          sourceRef.current.stop();
        } catch {
          /* source may already be stopped */
        }
        sourceRef.current.disconnect();
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  const loadAudioFile = useCallback(
    async (file) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".mp3")) {
        setError("Carica un file .mp3 valido.");
        return;
      }

      setError("");
      stopPlayback();

      try {
        const context = await ensureAudioGraph();
        const arrayBuffer = await file.arrayBuffer();
        const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
        const nextUrl = URL.createObjectURL(file);

        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        if (exportUrlRef.current) {
          URL.revokeObjectURL(exportUrlRef.current);
          setExportUrl("");
        }

        setAudioBuffer(decoded);
        setAudioUrl(nextUrl);
        setFileName(file.name);
        setDuration(decoded.duration);
        setTrimStart(0);
        setTrimEnd(decoded.duration);
        pauseOffsetRef.current = 0;
      } catch {
        setError("Impossibile decodificare questo MP3 nel browser.");
      }
    },
    [ensureAudioGraph, stopPlayback],
  );

  const startPlayback = useCallback(async () => {
    if (!audioBuffer || !canPlay) return;

    stopPlayback(false);

    const context = await ensureAudioGraph();
    const source = context.createBufferSource();
    const offset = clamp(pauseOffsetRef.current || trimStart, trimStart, trimEnd - 0.02);
    const playDuration = trimEnd - offset;

    source.buffer = audioBuffer;
    source.playbackRate.setValueAtTime(playbackRate, context.currentTime);
    source.connect(gainRef.current);
    source.onended = () => {
      if (sourceRef.current === source) {
        sourceRef.current = null;
        pauseOffsetRef.current = trimStart;
        setIsPlaying(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        drawIdleSpectrum();
      }
    };

    playbackStartedAtRef.current = context.currentTime;
    playbackOffsetRef.current = offset;
    sourceRef.current = source;
    source.start(0, offset, playDuration);
    setIsPlaying(true);
    drawSpectrum();
  }, [
    audioBuffer,
    canPlay,
    drawIdleSpectrum,
    drawSpectrum,
    ensureAudioGraph,
    playbackRate,
    stopPlayback,
    trimEnd,
    trimStart,
  ]);

  const pausePlayback = useCallback(() => {
    const context = audioContextRef.current;
    if (context) {
      const elapsed = (context.currentTime - playbackStartedAtRef.current) * playbackRate;
      pauseOffsetRef.current = clamp(playbackOffsetRef.current + elapsed, trimStart, trimEnd);
    }
    stopPlayback(false);
  }, [playbackRate, stopPlayback, trimEnd, trimStart]);

  const onTrimStartChange = (nextValue) => {
    const next = clamp(Number(nextValue) || 0, 0, Math.max(0, trimEnd - 0.05));
    setTrimStart(next);
    pauseOffsetRef.current = next;
    syncTrimRegion(next, trimEnd);
    stopPlayback(false);
  };

  const onTrimEndChange = (nextValue) => {
    const next = clamp(Number(nextValue) || 0, trimStart + 0.05, duration);
    setTrimEnd(next);
    if (pauseOffsetRef.current > next) pauseOffsetRef.current = trimStart;
    syncTrimRegion(trimStart, next);
    stopPlayback(false);
  };

  const exportMp3 = useCallback(async () => {
    if (!audioBuffer || selectedLength <= 0.05) return;

    setIsExporting(true);
    setError("");

    try {
      const lameModule = await import("lamejs");
      const lamejs = lameModule.default || lameModule;
      const sampleRate = audioBuffer.sampleRate;
      const startFrame = Math.floor(trimStart * sampleRate);
      const endFrame = Math.floor(trimEnd * sampleRate);
      const channelCount = Math.min(2, audioBuffer.numberOfChannels);
      const left = floatTo16BitPcm(audioBuffer.getChannelData(0).slice(startFrame, endFrame), gain);
      const right =
        channelCount > 1
          ? floatTo16BitPcm(audioBuffer.getChannelData(1).slice(startFrame, endFrame), gain)
          : null;
      const encoder = new lamejs.Mp3Encoder(channelCount, sampleRate, 192);
      const chunks = [];
      const blockSize = 1152;

      for (let i = 0; i < left.length; i += blockSize) {
        const leftChunk = left.subarray(i, i + blockSize);
        const mp3Buffer = right
          ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + blockSize))
          : encoder.encodeBuffer(leftChunk);
        if (mp3Buffer.length) chunks.push(mp3Buffer);
      }

      const finalBuffer = encoder.flush();
      if (finalBuffer.length) chunks.push(finalBuffer);

      const blob = new Blob(chunks, { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const outputName = `${fileName.replace(/\.mp3$/i, "") || "audio"}-trimmed.mp3`;
      const anchor = document.createElement("a");

      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
      setExportUrl(url);
      anchor.href = url;
      anchor.download = outputName;
      anchor.click();
    } catch {
      setError("Esportazione MP3 non riuscita.");
    } finally {
      setIsExporting(false);
    }
  }, [audioBuffer, fileName, gain, selectedLength, trimEnd, trimStart]);

  return (
    <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <div className="flex flex-col gap-4">
        <SpotifyLinkAnalyzer />

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                MP3 local tools
              </p>
              <h2 className="mt-1 text-base font-semibold">Audio Cutter & Studio Rack</h2>
            </div>
            <FileAudio2 className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="space-y-4 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                loadAudioFile(event.dataTransfer.files?.[0]);
              }}
              className={`flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-cyan-300 bg-cyan-300/10"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              <UploadCloud className="mb-3 h-8 w-8 text-cyan-300" />
              <span className="text-sm font-medium">
                {fileName || "Trascina qui un MP3 o clicca per caricarlo"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                Processing locale nel browser
              </span>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept=".mp3,audio/mpeg"
                onChange={(event) => loadAudioFile(event.target.files?.[0])}
              />
            </button>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
              <Metric label="Durata" value={formatTime(duration)} />
              <Metric label="Taglio" value={formatTime(selectedLength)} />
              <Metric label="Gain" value={`${gain.toFixed(2)}x`} />
              <Metric label="Rate" value={`${playbackRate.toFixed(2)}x`} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Editor
            </p>
            <h2 className="mt-1 text-base font-semibold">Waveform, trim e spettrometro</h2>
          </div>
          <div className="flex gap-2">
            <ControlButton disabled={!canPlay || isPlaying} onClick={startPlayback}>
              <Play className="h-4 w-4" />
              Play
            </ControlButton>
            <ControlButton disabled={!isPlaying} onClick={pausePlayback}>
              <Pause className="h-4 w-4" />
              Pause
            </ControlButton>
            <ControlButton disabled={!audioBuffer} onClick={() => stopPlayback()}>
              <Square className="h-4 w-4" />
              Stop
            </ControlButton>
          </div>
        </div>

        <div className="space-y-5 p-4">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-300" />
                Spettrometro
              </span>
              <span>FFT 2048</span>
            </div>
            <canvas ref={spectrumCanvasRef} className="h-44 w-full rounded-lg" />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Scissors className="h-4 w-4 text-fuchsia-300" />
                Waveform Regions
              </span>
              <span>
                {formatTime(trimStart)} - {formatTime(trimEnd)}
              </span>
            </div>
            <div className="relative min-h-[154px] overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <div ref={waveformContainerRef} className="h-[154px] w-full" />
              {!audioBuffer && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                  Carica un MP3 per attivare la waveform trascinabile
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Gain & Speed" icon={<Volume2 className="h-4 w-4 text-cyan-300" />}>
              <SliderRow
                label="Gain"
                value={gain}
                display={`${gain.toFixed(2)}x`}
                min={0}
                max={3}
                step={0.01}
                accent="accent-cyan-300"
                onChange={setGain}
              />
              <SliderRow
                label="Pitch / Speed"
                value={playbackRate}
                display={`${playbackRate.toFixed(2)}x`}
                min={0.5}
                max={2}
                step={0.01}
                accent="accent-emerald-400"
                onChange={setPlaybackRate}
              />
            </Panel>

            <Panel
              title="Dynamics Compressor"
              icon={<SlidersHorizontal className="h-4 w-4 text-amber-300" />}
            >
              <SliderRow
                label="Threshold"
                value={threshold}
                display={`${threshold.toFixed(0)} dB`}
                min={-50}
                max={0}
                step={1}
                accent="accent-amber-300"
                onChange={setThreshold}
              />
              <SliderRow
                label="Ratio"
                value={ratio}
                display={`${ratio.toFixed(1)}:1`}
                min={1}
                max={20}
                step={0.1}
                accent="accent-rose-300"
                onChange={setRatio}
              />
            </Panel>
          </div>

          <Panel title="Trim" icon={<Scissors className="h-4 w-4 text-fuchsia-300" />}>
            <div className="space-y-3">
              <TrimRow
                label="Inizio"
                value={trimStart}
                min={0}
                max={trimEnd}
                duration={duration}
                disabled={!audioBuffer}
                accent="accent-emerald-400"
                onChange={onTrimStartChange}
              />
              <TrimRow
                label="Fine"
                value={trimEnd}
                min={trimStart}
                max={duration}
                duration={duration}
                disabled={!audioBuffer}
                accent="accent-rose-400"
                onChange={onTrimEndChange}
              />
            </div>
          </Panel>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm">
              <p className="font-medium">Output MP3</p>
              <p className="text-xs text-muted-foreground">
                Applica taglio e gain al file caricato, poi scarica il nuovo MP3.
              </p>
            </div>
            <div className="flex gap-2">
              {exportUrl && (
                <a
                  href={exportUrl}
                  download={`${fileName.replace(/\.mp3$/i, "") || "audio"}-trimmed.mp3`}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />
                  Scarica
                </a>
              )}
              <button
                type="button"
                disabled={!canPlay || isExporting}
                onClick={exportMp3}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1DB954] px-4 text-sm font-semibold text-black transition hover:bg-[#34d66f] disabled:pointer-events-none disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Esporto..." : "Esporta MP3"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotifyLinkAnalyzer() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const match = value.trim().match(SPOTIFY_URL_RE);
  const isValid = Boolean(match);
  const kind = match?.[1] || "track";
  const id = match?.[2] || "";
  const previewTitle =
    kind === "playlist"
      ? "Playlist importata"
      : kind === "artist"
        ? "Artista rilevato"
        : "Brano rilevato";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl">
      <div className="border-b border-white/10 bg-[#1DB954]/10 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1DB954]">
          Spotify Link Analyzer
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-base font-semibold">
          <Music2 className="h-4 w-4 text-[#1DB954]" />
          Link intake
        </h2>
      </div>

      <div className="space-y-4 p-4">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            URL Spotify
          </span>
          <div
            className={`flex items-center gap-2 rounded-xl border bg-black/20 px-3 py-2 transition ${
              !value ? "border-white/10" : isValid ? "border-[#1DB954]/60" : "border-rose-400/60"
            }`}
          >
            <Link2 className="h-4 w-4 text-[#1DB954]" />
            <input
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setSent(false);
              }}
              placeholder="https://open.spotify.com/intl-it/track/..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
            {value &&
              (isValid ? (
                <CheckCircle2 className="h-4 w-4 text-[#1DB954]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-300" />
              ))}
          </div>
        </label>

        {value && !isValid && (
          <p className="text-xs text-rose-300">
            Inserisci un link Spotify valido per track, playlist, album o artist.
          </p>
        )}

        {isValid && (
          <div className="rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/10 p-3">
            <div className="flex gap-3">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#1DB954,#22d3ee,#e879f9)] font-bold text-black shadow-lg">
                SP
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{previewTitle}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">Artista demo</p>
                <p className="mt-2 rounded-full bg-black/25 px-2 py-1 font-mono text-[10px] text-[#1DB954]">
                  {kind.toUpperCase()} / {id.slice(0, 10)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSent(true)}
              className="mt-3 w-full rounded-lg bg-[#1DB954] px-3 py-2 text-sm font-semibold text-black transition hover:bg-[#34d66f]"
            >
              Invia all'Editor
            </button>
            {sent && (
              <p className="mt-2 text-center text-xs text-[#1DB954]">
                Link pronto. Carica il file audio locale per continuare.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          {icon}
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function SliderRow({ label, value, display, min, max, step, accent, onChange }) {
  return (
    <label className="mb-4 block last:mb-0">
      <span className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-mono">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full ${accent}`}
      />
    </label>
  );
}

function TrimRow({ label, value, min, max, duration, disabled, accent, onChange }) {
  return (
    <label className="grid grid-cols-[64px_1fr_76px] items-center gap-3 text-xs text-muted-foreground">
      {label}
      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full ${accent}`}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={0.01}
        value={value.toFixed(2)}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-right font-mono text-foreground outline-none focus:border-emerald-300 disabled:opacity-40"
      />
    </label>
  );
}

function ControlButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
