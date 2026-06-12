import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d, w } from "../_libs/wavesurfer.js.mjs";
import { M as ModuleShell } from "./ModuleShell-DRa0J7Mt.mjs";
import { F as FileHeadphone, g as CloudUpload, a as CircleAlert, h as Pause, i as Play, j as Square, k as Activity, l as Scissors, V as Volume2, m as SlidersHorizontal, D as Download, G as Gauge } from "../_libs/lucide-react.mjs";
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
const TRIM_REGION_ID = "active-trim-region";
const TRIM_REGION_COLOR = "rgba(255, 0, 150, 0.3)";
const INPUT_AUDIO_ACCEPT = "audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.webm,.opus,.aiff,.aif,.amr,.wma";
const EXPORT_FORMATS = [
  { value: "mp3", label: "MP3", extension: "mp3", mimeType: "audio/mpeg" },
  { value: "wav", label: "WAV", extension: "wav", mimeType: "audio/wav" },
  { value: "webm", label: "WebM / Opus", extension: "webm", mimeType: "audio/webm;codecs=opus" },
  { value: "ogg", label: "OGG / Opus", extension: "ogg", mimeType: "audio/ogg;codecs=opus" },
  { value: "m4a", label: "M4A / AAC", extension: "m4a", mimeType: "audio/mp4" }
];
const BITRATE_OPTIONS = [64, 96, 128, 160, 192, 256, 320];
const WAV_BIT_DEPTH_OPTIONS = [16, 24, 32];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width || canvas.parentElement?.clientWidth || 720));
  const height = Math.max(
    120,
    Math.floor(rect.height || canvas.parentElement?.clientHeight || 180)
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
function styleTrimRegion(region) {
  const element = region?.element;
  if (!element) return;
  Object.assign(element.style, {
    backgroundColor: TRIM_REGION_COLOR,
    borderLeft: "4px solid rgba(255, 0, 150, 0.95)",
    borderRight: "4px solid rgba(255, 0, 150, 0.95)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.28), 0 0 20px rgba(255,0,150,0.35)"
  });
  element.querySelectorAll('[part*="region-handle"]').forEach((handle) => {
    Object.assign(handle.style, {
      background: "rgba(255, 255, 255, 0.22)",
      borderColor: "rgba(255, 0, 150, 0.95)",
      width: "10px"
    });
  });
}
function floatTo16BitPcm(channel, gain) {
  const pcm = new Int16Array(channel.length);
  for (let i = 0; i < channel.length; i += 1) {
    const sample = clamp(channel[i] * gain, -1, 1);
    pcm[i] = sample < 0 ? sample * 32768 : sample * 32767;
  }
  return pcm;
}
function fileBaseName(name) {
  return (name || "audio").replace(/\.[^.]+$/, "") || "audio";
}
function writeAscii(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}
function writePcmSample(view, offset, sample, bytesPerSample) {
  const value = clamp(sample, -1, 1);
  if (bytesPerSample === 2) {
    view.setInt16(offset, value < 0 ? value * 32768 : value * 32767, true);
    return;
  }
  if (bytesPerSample === 3) {
    const int = Math.round(value < 0 ? value * 8388608 : value * 8388607);
    view.setUint8(offset, int & 255);
    view.setUint8(offset + 1, int >> 8 & 255);
    view.setUint8(offset + 2, int >> 16 & 255);
    return;
  }
  view.setInt32(offset, value < 0 ? value * 2147483648 : value * 2147483647, true);
}
function encodeWav(audioBuffer, bitDepth) {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = channels * bytesPerSample;
  const dataSize = audioBuffer.length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  const channelData = Array.from(
    { length: channels },
    (_, index) => audioBuffer.getChannelData(index)
  );
  for (let i = 0; i < audioBuffer.length; i += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      writePcmSample(view, offset, channelData[channel][i], bytesPerSample);
      offset += bytesPerSample;
    }
  }
  return new Blob([buffer], { type: "audio/wav" });
}
async function renderProcessedAudioBuffer({
  audioBuffer,
  trimStart,
  trimEnd,
  gain,
  threshold,
  ratio,
  lowEq,
  midEq,
  highEq,
  playbackRate
}) {
  const sampleRate = audioBuffer.sampleRate;
  const channelCount = Math.min(2, audioBuffer.numberOfChannels);
  const startFrame = Math.floor(trimStart * sampleRate);
  const endFrame = Math.max(startFrame + 1, Math.floor(trimEnd * sampleRate));
  const sourceFrames = endFrame - startFrame;
  const outputFrames = Math.max(1, Math.ceil(sourceFrames / playbackRate));
  const offline = new OfflineAudioContext(channelCount, outputFrames, sampleRate);
  const segment = offline.createBuffer(channelCount, sourceFrames, sampleRate);
  for (let channel = 0; channel < channelCount; channel += 1) {
    const source2 = audioBuffer.getChannelData(channel).slice(startFrame, endFrame);
    segment.copyToChannel(source2, channel);
  }
  const source = offline.createBufferSource();
  const gainNode = offline.createGain();
  const compressor = offline.createDynamicsCompressor();
  const lowFilter = offline.createBiquadFilter();
  const midFilter = offline.createBiquadFilter();
  const highFilter = offline.createBiquadFilter();
  source.buffer = segment;
  source.playbackRate.value = playbackRate;
  gainNode.gain.value = gain;
  compressor.threshold.value = threshold;
  compressor.ratio.value = ratio;
  lowFilter.type = "lowshelf";
  lowFilter.frequency.value = 250;
  lowFilter.gain.value = lowEq;
  midFilter.type = "peaking";
  midFilter.frequency.value = 1e3;
  midFilter.Q.value = 1;
  midFilter.gain.value = midEq;
  highFilter.type = "highshelf";
  highFilter.frequency.value = 4e3;
  highFilter.gain.value = highEq;
  source.connect(compressor);
  compressor.connect(lowFilter);
  lowFilter.connect(midFilter);
  midFilter.connect(highFilter);
  highFilter.connect(gainNode);
  gainNode.connect(offline.destination);
  source.start(0);
  return offline.startRendering();
}
async function encodeMp3(audioBuffer, kbps) {
  const lameModule = await import("../_libs/breezystack__lamejs.mjs");
  const Mp3Encoder = lameModule.Mp3Encoder || lameModule.default?.Mp3Encoder;
  const sampleRate = audioBuffer.sampleRate;
  const channelCount = Math.min(2, audioBuffer.numberOfChannels);
  const left = floatTo16BitPcm(audioBuffer.getChannelData(0), 1);
  const right = channelCount > 1 ? floatTo16BitPcm(audioBuffer.getChannelData(1), 1) : null;
  const encoder = new Mp3Encoder(channelCount, sampleRate, kbps);
  const chunks = [];
  const blockSize = 1152;
  for (let i = 0; i < left.length; i += blockSize) {
    const leftChunk = left.subarray(i, i + blockSize);
    const mp3Buffer = right ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + blockSize)) : encoder.encodeBuffer(leftChunk);
    if (mp3Buffer.length) chunks.push(mp3Buffer);
  }
  const finalBuffer = encoder.flush();
  if (finalBuffer.length) chunks.push(finalBuffer);
  return new Blob(chunks, { type: "audio/mpeg" });
}
function pickMediaRecorderMimeType(format) {
  const candidates = {
    webm: ["audio/webm;codecs=opus", "audio/webm"],
    ogg: ["audio/ogg;codecs=opus", "audio/ogg"],
    m4a: ["audio/mp4;codecs=mp4a.40.2", "audio/mp4"]
  }[format];
  if (!candidates || typeof MediaRecorder === "undefined") return "";
  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || "";
}
async function encodeWithMediaRecorder(audioBuffer, format, kbps) {
  const mimeType = pickMediaRecorderMimeType(format);
  if (!mimeType) {
    throw new Error("Questo formato non è supportato dal browser corrente.");
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass({ sampleRate: audioBuffer.sampleRate });
  const destination = context.createMediaStreamDestination();
  const source = context.createBufferSource();
  const recorder = new MediaRecorder(destination.stream, {
    mimeType,
    audioBitsPerSecond: kbps * 1e3
  });
  const chunks = [];
  source.buffer = audioBuffer;
  source.connect(destination);
  if (context.state === "suspended") await context.resume();
  return new Promise((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => {
      context.close();
      reject(new Error("Registrazione del formato selezionato non riuscita."));
    };
    recorder.onstop = () => {
      context.close();
      resolve(new Blob(chunks, { type: mimeType }));
    };
    source.onended = () => {
      if (recorder.state !== "inactive") recorder.stop();
    };
    recorder.start();
    source.start();
  });
}
function AudioTools() {
  const [audioBuffer, setAudioBuffer] = reactExports.useState(null);
  const [audioUrl, setAudioUrl] = reactExports.useState("");
  const [duration, setDuration] = reactExports.useState(0);
  const [fileName, setFileName] = reactExports.useState("");
  const [gain, setGain] = reactExports.useState(1);
  const [threshold, setThreshold] = reactExports.useState(-24);
  const [ratio, setRatio] = reactExports.useState(4);
  const [lowEq, setLowEq] = reactExports.useState(0);
  const [midEq, setMidEq] = reactExports.useState(0);
  const [highEq, setHighEq] = reactExports.useState(0);
  const [playbackRate, setPlaybackRate] = reactExports.useState(1);
  const [trimStart, setTrimStart] = reactExports.useState(0);
  const [trimEnd, setTrimEnd] = reactExports.useState(0);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [isExporting, setIsExporting] = reactExports.useState(false);
  const [exportFormat, setExportFormat] = reactExports.useState("mp3");
  const [exportQuality, setExportQuality] = reactExports.useState(192);
  const [wavBitDepth, setWavBitDepth] = reactExports.useState(16);
  const [exportUrl, setExportUrl] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const audioContextRef = reactExports.useRef(null);
  const mediaSourceRef = reactExports.useRef(null);
  const mediaElementRef = reactExports.useRef(null);
  const gainRef = reactExports.useRef(null);
  const compressorRef = reactExports.useRef(null);
  const lowEqRef = reactExports.useRef(null);
  const midEqRef = reactExports.useRef(null);
  const highEqRef = reactExports.useRef(null);
  const analyserRef = reactExports.useRef(null);
  const animationRef = reactExports.useRef(0);
  const spectrumCanvasRef = reactExports.useRef(null);
  const waveformContainerRef = reactExports.useRef(null);
  const waveSurferRef = reactExports.useRef(null);
  const regionsRef = reactExports.useRef(null);
  const trimRegionRef = reactExports.useRef(null);
  const syncingRegionRef = reactExports.useRef(false);
  const pauseOffsetRef = reactExports.useRef(0);
  const durationRef = reactExports.useRef(0);
  const trimStartRef = reactExports.useRef(0);
  const trimEndRef = reactExports.useRef(0);
  const fileInputRef = reactExports.useRef(null);
  const exportUrlRef = reactExports.useRef("");
  const audioUrlRef = reactExports.useRef("");
  const selectedLength = reactExports.useMemo(() => Math.max(0, trimEnd - trimStart), [trimEnd, trimStart]);
  const selectedFormat = reactExports.useMemo(
    () => EXPORT_FORMATS.find((format) => format.value === exportFormat) || EXPORT_FORMATS[0],
    [exportFormat]
  );
  const canPlay = Boolean(audioBuffer && selectedLength > 0.05);
  const connectProcessingChain = reactExports.useCallback(() => {
    const compressor = compressorRef.current;
    const lowFilter = lowEqRef.current;
    const midFilter = midEqRef.current;
    const highFilter = highEqRef.current;
    const gainNode = gainRef.current;
    const analyser = analyserRef.current;
    const context = audioContextRef.current;
    if (!compressor || !lowFilter || !midFilter || !highFilter || !gainNode || !analyser || !context) {
      return;
    }
    [compressor, lowFilter, midFilter, highFilter, gainNode, analyser].forEach((node) => {
      try {
        node.disconnect();
      } catch {
      }
    });
    compressor.connect(lowFilter);
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    highFilter.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(context.destination);
  }, []);
  const ensureAudioGraph = reactExports.useCallback(async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let context = audioContextRef.current;
    if (!context || context.state === "closed") {
      context = new AudioContextClass();
      audioContextRef.current = context;
      mediaSourceRef.current = null;
      mediaElementRef.current = null;
      gainRef.current = context.createGain();
      compressorRef.current = context.createDynamicsCompressor();
      lowEqRef.current = context.createBiquadFilter();
      midEqRef.current = context.createBiquadFilter();
      highEqRef.current = context.createBiquadFilter();
      analyserRef.current = context.createAnalyser();
      analyserRef.current.fftSize = 2048;
      lowEqRef.current.type = "lowshelf";
      lowEqRef.current.frequency.value = 250;
      midEqRef.current.type = "peaking";
      midEqRef.current.frequency.value = 1e3;
      midEqRef.current.Q.value = 1;
      highEqRef.current.type = "highshelf";
      highEqRef.current.frequency.value = 4e3;
      connectProcessingChain();
    }
    if (context.state === "suspended") await context.resume();
    gainRef.current.gain.setTargetAtTime(gain, context.currentTime, 0.01);
    compressorRef.current.threshold.setTargetAtTime(threshold, context.currentTime, 0.01);
    compressorRef.current.ratio.setTargetAtTime(ratio, context.currentTime, 0.01);
    lowEqRef.current.gain.setTargetAtTime(lowEq, context.currentTime, 0.01);
    midEqRef.current.gain.setTargetAtTime(midEq, context.currentTime, 0.01);
    highEqRef.current.gain.setTargetAtTime(highEq, context.currentTime, 0.01);
    return context;
  }, [connectProcessingChain, gain, highEq, lowEq, midEq, ratio, threshold]);
  const connectWaveSurferToAudioGraph = reactExports.useCallback(
    async (waveSurfer) => {
      const context = await ensureAudioGraph();
      const media = waveSurfer.getMediaElement();
      if (mediaElementRef.current !== media || !mediaSourceRef.current) {
        mediaSourceRef.current?.disconnect();
        mediaSourceRef.current = context.createMediaElementSource(media);
        mediaElementRef.current = media;
      }
      try {
        mediaSourceRef.current.disconnect();
      } catch {
      }
      mediaSourceRef.current.connect(compressorRef.current);
    },
    [ensureAudioGraph]
  );
  const stopPlayback = reactExports.useCallback((resetOffset = true) => {
    const waveSurfer = waveSurferRef.current;
    if (waveSurfer) {
      waveSurfer.pause();
      if (resetOffset) waveSurfer.setTime(trimStartRef.current);
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = 0;
    if (resetOffset) pauseOffsetRef.current = trimStartRef.current;
    setIsPlaying(false);
  }, []);
  const syncTrimRegion = reactExports.useCallback((start, end) => {
    const region = trimRegionRef.current;
    if (!region) return;
    syncingRegionRef.current = true;
    region.setOptions({ start, end });
    requestAnimationFrame(() => {
      syncingRegionRef.current = false;
    });
  }, []);
  const drawIdleSpectrum = reactExports.useCallback(() => {
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
  const drawSpectrum = reactExports.useCallback(() => {
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
        const barHeight = Math.max(2, value / 255 * (height - 10));
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
  reactExports.useEffect(() => {
    durationRef.current = duration;
  }, [duration]);
  reactExports.useEffect(() => {
    trimStartRef.current = trimStart;
  }, [trimStart]);
  reactExports.useEffect(() => {
    trimEndRef.current = trimEnd;
  }, [trimEnd]);
  reactExports.useEffect(() => {
    exportUrlRef.current = exportUrl;
  }, [exportUrl]);
  reactExports.useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);
  reactExports.useEffect(() => {
    if (!isPlaying) drawIdleSpectrum();
  }, [drawIdleSpectrum, isPlaying]);
  reactExports.useEffect(() => {
    const onResize = () => {
      if (!isPlaying) drawIdleSpectrum();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawIdleSpectrum, isPlaying]);
  reactExports.useEffect(() => {
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.setTargetAtTime(gain, audioContextRef.current.currentTime, 0.01);
    }
  }, [gain]);
  reactExports.useEffect(() => {
    if (compressorRef.current && audioContextRef.current) {
      compressorRef.current.threshold.setTargetAtTime(
        threshold,
        audioContextRef.current.currentTime,
        0.01
      );
    }
  }, [threshold]);
  reactExports.useEffect(() => {
    if (compressorRef.current && audioContextRef.current) {
      compressorRef.current.ratio.setTargetAtTime(ratio, audioContextRef.current.currentTime, 0.01);
    }
  }, [ratio]);
  reactExports.useEffect(() => {
    waveSurferRef.current?.setPlaybackRate(playbackRate, false);
  }, [playbackRate]);
  reactExports.useEffect(() => {
    const context = audioContextRef.current;
    if (!context) return;
    lowEqRef.current?.gain.setTargetAtTime(lowEq, context.currentTime, 0.01);
    midEqRef.current?.gain.setTargetAtTime(midEq, context.currentTime, 0.01);
    highEqRef.current?.gain.setTargetAtTime(highEq, context.currentTime, 0.01);
  }, [highEq, lowEq, midEq]);
  reactExports.useEffect(() => {
    if (!waveformContainerRef.current || !audioUrl) return void 0;
    trimRegionRef.current = null;
    const regions = d.create();
    const waveSurfer = w.create({
      container: waveformContainerRef.current,
      height: 154,
      dragToSeek: true,
      normalize: true,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorColor: "#facc15",
      cursorWidth: 2,
      waveColor: createWaveGradient(),
      progressColor: "#1DB954",
      plugins: [regions]
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
          color: TRIM_REGION_COLOR,
          drag: true,
          minLength: 0.05,
          resize: true
        });
        requestAnimationFrame(() => styleTrimRegion(trimRegionRef.current));
      }),
      regions.on("region-created", (region) => {
        requestAnimationFrame(() => styleTrimRegion(region));
      }),
      regions.on("region-updated", (region) => {
        styleTrimRegion(region);
        if (region.id !== TRIM_REGION_ID || syncingRegionRef.current) return;
        const total = durationRef.current || waveSurfer.getDuration();
        const nextStart = clamp(region.start, 0, Math.max(0, total - 0.05));
        const nextEnd = clamp(region.end, nextStart + 0.05, total);
        setTrimStart(nextStart);
        setTrimEnd(nextEnd);
        pauseOffsetRef.current = nextStart;
      }),
      waveSurfer.on("play", () => {
        connectWaveSurferToAudioGraph(waveSurfer).then(() => {
          setIsPlaying(true);
          drawSpectrum();
        }).catch((err) => setError(err?.message || "Playback audio non riuscito."));
      }),
      waveSurfer.on("pause", () => {
        setIsPlaying(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        drawIdleSpectrum();
      }),
      waveSurfer.on("finish", () => {
        setIsPlaying(false);
        waveSurfer.setTime(trimStartRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        drawIdleSpectrum();
      }),
      waveSurfer.on("audioprocess", (time) => {
        if (time >= trimEndRef.current - 0.01) {
          waveSurfer.pause();
          waveSurfer.setTime(trimStartRef.current);
        }
      })
    ];
    return () => {
      disposers.forEach((dispose) => dispose());
      if (mediaElementRef.current === waveSurfer.getMediaElement()) {
        mediaSourceRef.current?.disconnect();
        mediaSourceRef.current = null;
        mediaElementRef.current = null;
      }
      waveSurfer.destroy();
      waveSurferRef.current = null;
      regionsRef.current = null;
      trimRegionRef.current = null;
    };
  }, [audioUrl, connectWaveSurferToAudioGraph, drawIdleSpectrum, drawSpectrum]);
  reactExports.useEffect(() => {
    return () => {
      if (mediaSourceRef.current) {
        mediaSourceRef.current.disconnect();
        mediaSourceRef.current = null;
        mediaElementRef.current = null;
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioContextRef.current?.close();
    };
  }, []);
  const loadAudioFile = reactExports.useCallback(
    async (file) => {
      if (!file) return;
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
        setError("Impossibile decodificare questo audio nel browser.");
      }
    },
    [ensureAudioGraph, stopPlayback]
  );
  const startPlayback = reactExports.useCallback(async () => {
    const waveSurfer = waveSurferRef.current;
    if (!waveSurfer || !audioBuffer || !canPlay) return;
    await connectWaveSurferToAudioGraph(waveSurfer);
    waveSurfer.setPlaybackRate(playbackRate, false);
    const currentTime = waveSurfer.getCurrentTime();
    if (currentTime < trimStart || currentTime >= trimEnd - 0.02) {
      waveSurfer.setTime(trimStart);
    }
    await waveSurfer.play();
  }, [audioBuffer, canPlay, connectWaveSurferToAudioGraph, playbackRate, trimEnd, trimStart]);
  const pausePlayback = reactExports.useCallback(() => {
    waveSurferRef.current?.pause();
  }, []);
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
  const exportAudio = reactExports.useCallback(async () => {
    if (!audioBuffer || selectedLength <= 0.05) return;
    setIsExporting(true);
    setError("");
    try {
      const safeBitrate = clamp(Number(exportQuality) || 192, 32, 512);
      const processedBuffer = await renderProcessedAudioBuffer({
        audioBuffer,
        trimStart,
        trimEnd,
        gain,
        threshold,
        lowEq,
        midEq,
        highEq,
        ratio,
        playbackRate
      });
      const blob = exportFormat === "mp3" ? await encodeMp3(processedBuffer, safeBitrate) : exportFormat === "wav" ? encodeWav(processedBuffer, wavBitDepth) : await encodeWithMediaRecorder(processedBuffer, exportFormat, safeBitrate);
      const url = URL.createObjectURL(blob);
      const outputName = `${fileBaseName(fileName)}-converted.${selectedFormat.extension}`;
      const anchor = document.createElement("a");
      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
      setExportUrl(url);
      anchor.href = url;
      anchor.download = outputName;
      anchor.click();
    } catch (err) {
      setError(err?.message || "Esportazione audio non riuscita.");
    } finally {
      setIsExporting(false);
    }
  }, [
    audioBuffer,
    exportFormat,
    exportQuality,
    fileName,
    gain,
    highEq,
    lowEq,
    midEq,
    playbackRate,
    ratio,
    selectedFormat.extension,
    selectedLength,
    threshold,
    trimEnd,
    trimStart,
    wavBitDepth
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[360px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Universal audio input" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-base font-semibold", children: "Upload & Convert" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileHeadphone, { className: "h-5 w-5 text-cyan-300" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            onDragEnter: (event) => {
              event.preventDefault();
              setIsDragging(true);
            },
            onDragOver: (event) => event.preventDefault(),
            onDragLeave: () => setIsDragging(false),
            onDrop: (event) => {
              event.preventDefault();
              setIsDragging(false);
              loadAudioFile(event.dataTransfer.files?.[0]);
            },
            className: `flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition ${isDragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/20 bg-white/5 hover:bg-white/10"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "mb-3 h-8 w-8 text-cyan-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: fileName || "Trascina qui qualsiasi file audio o clicca per caricarlo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 text-xs text-muted-foreground", children: "MP3, WAV, M4A, AAC, OGG, FLAC, WebM e altri formati supportati dal browser" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  hidden: true,
                  type: "file",
                  accept: INPUT_AUDIO_ACCEPT,
                  onChange: (event) => loadAudioFile(event.target.files?.[0])
                }
              )
            ]
          }
        ),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          error
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Durata", value: formatTime(duration) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Taglio", value: formatTime(selectedLength) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Gain", value: `${gain.toFixed(2)}x` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Rate", value: `${playbackRate.toFixed(2)}x` })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Editor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-base font-semibold", children: "Waveform, trim e spettrometro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ControlButton,
            {
              disabled: !canPlay,
              onClick: isPlaying ? pausePlayback : startPlayback,
              children: [
                isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
                isPlaying ? "Pause" : "Play"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(ControlButton, { disabled: !audioBuffer, onClick: () => stopPlayback(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4" }),
            "Stop"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-black/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-cyan-300" }),
              "Spettrometro"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FFT 2048" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: spectrumCanvasRef, className: "h-44 w-full rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-black/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-4 w-4 text-fuchsia-300" }),
              "Waveform Regions"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              formatTime(trimStart),
              " - ",
              formatTime(trimEnd)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-[154px] overflow-hidden rounded-lg border border-white/10 bg-black/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: waveformContainerRef, className: "h-[154px] w-full" }),
            !audioBuffer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 grid place-items-center text-xs text-muted-foreground", children: "Carica un audio per attivare la waveform trascinabile" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { title: "Gain & Speed", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 text-cyan-300" }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderRow,
              {
                label: "Gain",
                value: gain,
                display: `${gain.toFixed(2)}x`,
                min: 0,
                max: 3,
                step: 0.01,
                accent: "accent-cyan-300",
                onChange: setGain
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderRow,
              {
                label: "Pitch / Speed",
                value: playbackRate,
                display: `${playbackRate.toFixed(2)}x`,
                min: 0.5,
                max: 2,
                step: 0.01,
                accent: "accent-emerald-400",
                onChange: setPlaybackRate
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              title: "Dynamics Compressor",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4 text-amber-300" }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SliderRow,
                  {
                    label: "Threshold",
                    value: threshold,
                    display: `${threshold.toFixed(0)} dB`,
                    min: -50,
                    max: 0,
                    step: 1,
                    accent: "accent-amber-300",
                    onChange: setThreshold
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SliderRow,
                  {
                    label: "Ratio",
                    value: ratio,
                    display: `${ratio.toFixed(1)}:1`,
                    min: 1,
                    max: 20,
                    step: 0.1,
                    accent: "accent-rose-300",
                    onChange: setRatio
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              title: "EQ (Equalizer)",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4 text-emerald-300" }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SliderRow,
                  {
                    label: "Bassi",
                    value: lowEq,
                    display: `${lowEq.toFixed(1)} dB`,
                    min: -12,
                    max: 12,
                    step: 0.5,
                    accent: "accent-emerald-400",
                    onChange: setLowEq
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SliderRow,
                  {
                    label: "Medi",
                    value: midEq,
                    display: `${midEq.toFixed(1)} dB`,
                    min: -12,
                    max: 12,
                    step: 0.5,
                    accent: "accent-cyan-300",
                    onChange: setMidEq
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SliderRow,
                  {
                    label: "Alti",
                    value: highEq,
                    display: `${highEq.toFixed(1)} dB`,
                    min: -12,
                    max: 12,
                    step: 0.5,
                    accent: "accent-rose-300",
                    onChange: setHighEq
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Trim", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-4 w-4 text-fuchsia-300" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TrimRow,
            {
              label: "Inizio",
              value: trimStart,
              min: 0,
              max: trimEnd,
              duration,
              disabled: !audioBuffer,
              accent: "accent-emerald-400",
              onChange: onTrimStartChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TrimRow,
            {
              label: "Fine",
              value: trimEnd,
              min: trimStart,
              max: duration,
              duration,
              disabled: !audioBuffer,
              accent: "accent-rose-400",
              onChange: onTrimEndChange
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid w-full gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Output audio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Scegli formato e qualità, poi esporta il file processato." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              exportUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: exportUrl,
                  download: `${fileBaseName(fileName)}-converted.${selectedFormat.extension}`,
                  className: "inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
                    "Scarica"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  disabled: !canPlay || isExporting,
                  onClick: exportAudio,
                  className: "inline-flex h-10 items-center gap-2 rounded-lg bg-[#1DB954] px-4 text-sm font-semibold text-black transition hover:bg-[#34d66f] disabled:pointer-events-none disabled:opacity-40",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
                    isExporting ? "Converto..." : "Converti audio"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block uppercase tracking-widest", children: "Formato" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: exportFormat,
                  onChange: (event) => setExportFormat(event.target.value),
                  className: "h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground outline-none focus:border-cyan-300",
                  children: EXPORT_FORMATS.map((format) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: format.value, children: format.label }, format.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block uppercase tracking-widest", children: "Qualità" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: exportFormat === "wav" ? wavBitDepth : exportQuality,
                  onChange: (event) => {
                    if (exportFormat === "wav") {
                      setWavBitDepth(Number(event.target.value));
                    } else {
                      setExportQuality(Number(event.target.value));
                    }
                  },
                  className: "h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground outline-none focus:border-cyan-300",
                  children: exportFormat === "wav" ? WAV_BIT_DEPTH_OPTIONS.map((bitDepth) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: bitDepth, children: [
                    bitDepth,
                    "-bit PCM"
                  ] }, bitDepth)) : BITRATE_OPTIONS.map((bitrate) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: bitrate, children: [
                    bitrate,
                    " kbps"
                  ] }, bitrate))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block uppercase tracking-widest", children: "Bitrate custom" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: 32,
                  max: 512,
                  step: 1,
                  value: exportQuality,
                  disabled: exportFormat === "wav",
                  onChange: (event) => setExportQuality(Number(event.target.value) || 192),
                  className: "h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground outline-none focus:border-cyan-300 disabled:opacity-40"
                }
              )
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
}
function Metric({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-white/10 bg-white/5 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-sm", children: value })
  ] });
}
function Panel({ title, icon, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex items-center justify-between text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 font-medium", children: [
      icon,
      title
    ] }) }),
    children
  ] });
}
function SliderRow({ label, value, display, min, max, step, accent, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mb-4 block last:mb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mb-2 flex items-center justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-3.5 w-3.5" }),
        label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: display })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        onChange: (event) => onChange(Number(event.target.value)),
        className: `w-full ${accent}`
      }
    )
  ] });
}
function TrimRow({ label, value, min, max, duration, disabled, accent, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid grid-cols-[64px_1fr_76px] items-center gap-3 text-xs text-muted-foreground", children: [
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: duration,
        step: 0.01,
        value,
        disabled,
        onChange: (event) => onChange(event.target.value),
        className: `w-full ${accent}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "number",
        min,
        max,
        step: 0.01,
        value: value.toFixed(2),
        disabled,
        onChange: (event) => onChange(event.target.value),
        className: "rounded-md border border-white/10 bg-black/20 px-2 py-1 text-right font-mono text-foreground outline-none focus:border-emerald-300 disabled:opacity-40"
      }
    )
  ] });
}
function ControlButton({ children, disabled, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      disabled,
      onClick,
      className: "inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40",
      children
    }
  );
}
function AudioLab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleShell, { title: "Audio Lab", tag: "AUDIO LAB", accent: "from-green-400 to-emerald-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AudioTools, {}) });
}
export {
  AudioLab as component
};
