function t$1(t2, e3, i2, n2) {
  return new (i2 || (i2 = Promise))((function(s2, r2) {
    function o2(t3) {
      try {
        l2(n2.next(t3));
      } catch (t4) {
        r2(t4);
      }
    }
    function a2(t3) {
      try {
        l2(n2.throw(t3));
      } catch (t4) {
        r2(t4);
      }
    }
    function l2(t3) {
      var e4;
      t3.done ? s2(t3.value) : (e4 = t3.value, e4 instanceof i2 ? e4 : new i2((function(t4) {
        t4(e4);
      }))).then(o2, a2);
    }
    l2((n2 = n2.apply(t2, e3 || [])).next());
  }));
}
"function" == typeof SuppressedError && SuppressedError;
let e$1 = class e {
  constructor() {
    this.listeners = {};
  }
  on(t2, e3, i2) {
    if (this.listeners[t2] || (this.listeners[t2] = /* @__PURE__ */ new Set()), null == i2 ? void 0 : i2.once) {
      const i3 = (...n2) => {
        this.un(t2, i3), e3(...n2);
      };
      return this.listeners[t2].add(i3), () => this.un(t2, i3);
    }
    return this.listeners[t2].add(e3), () => this.un(t2, e3);
  }
  un(t2, e3) {
    var i2;
    null === (i2 = this.listeners[t2]) || void 0 === i2 || i2.delete(e3);
  }
  once(t2, e3) {
    return this.on(t2, e3, { once: true });
  }
  unAll() {
    this.listeners = {};
  }
  emit(t2, ...e3) {
    this.listeners[t2] && this.listeners[t2].forEach(((t3) => t3(...e3)));
  }
};
const i$1 = { decode: function(e3, i2) {
  return t$1(this, void 0, void 0, (function* () {
    const t2 = new AudioContext({ sampleRate: i2 });
    try {
      return yield t2.decodeAudioData(e3);
    } finally {
      t2.close();
    }
  }));
}, createBuffer: function(t2, e3) {
  if (!t2 || 0 === t2.length) throw new Error("channelData must be a non-empty array");
  if (e3 <= 0) throw new Error("duration must be greater than 0");
  if ("number" == typeof t2[0] && (t2 = [t2]), !t2[0] || 0 === t2[0].length) throw new Error("channelData must contain non-empty channel arrays");
  !(function(t3) {
    const e4 = t3[0];
    if (e4.some(((t4) => t4 > 1 || t4 < -1))) {
      const i3 = e4.length;
      let n2 = 0;
      for (let t4 = 0; t4 < i3; t4++) {
        const i4 = Math.abs(e4[t4]);
        i4 > n2 && (n2 = i4);
      }
      for (const e5 of t3) for (let t4 = 0; t4 < i3; t4++) e5[t4] /= n2;
    }
  })(t2);
  const i2 = t2.map(((t3) => t3 instanceof Float32Array ? t3 : Float32Array.from(t3)));
  return { duration: e3, length: i2[0].length, sampleRate: i2[0].length / e3, numberOfChannels: i2.length, getChannelData: (t3) => {
    const e4 = i2[t3];
    if (!e4) throw new Error(`Channel ${t3} not found`);
    return e4;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function n$1(t2, e3) {
  const i2 = e3.xmlns ? document.createElementNS(e3.xmlns, t2) : document.createElement(t2);
  for (const [t3, s2] of Object.entries(e3)) if ("children" === t3 && s2) for (const [t4, e4] of Object.entries(s2)) e4 instanceof Node ? i2.appendChild(e4) : "string" == typeof e4 ? i2.appendChild(document.createTextNode(e4)) : i2.appendChild(n$1(t4, e4));
  else "style" === t3 ? Object.assign(i2.style, s2) : "textContent" === t3 ? i2.textContent = s2 : i2.setAttribute(t3, s2.toString());
  return i2;
}
function s$1(t2, e3, i2) {
  const s2 = n$1(t2, e3 || {});
  return null == i2 || i2.appendChild(s2), s2;
}
var r$1 = Object.freeze({ __proto__: null, createElement: s$1, default: s$1 });
const o$1 = { fetchBlob: function(e3, i2, n2) {
  return t$1(this, void 0, void 0, (function* () {
    const s2 = yield fetch(e3, n2);
    if (s2.status >= 400) throw new Error(`Failed to fetch ${e3}: ${s2.status} (${s2.statusText})`);
    return (function(e4, i3) {
      t$1(this, void 0, void 0, (function* () {
        if (!e4.body || !e4.headers) return;
        const t2 = e4.body.getReader(), n3 = Number(e4.headers.get("Content-Length")) || 0;
        let s3 = 0;
        const r2 = (t3) => {
          s3 += (null == t3 ? void 0 : t3.length) || 0;
          const e5 = Math.round(s3 / n3 * 100);
          i3(e5);
        };
        try {
          for (; ; ) {
            const e5 = yield t2.read();
            if (e5.done) break;
            r2(e5.value);
          }
        } catch (t3) {
          console.warn("Progress tracking error:", t3);
        }
      }));
    })(s2.clone(), i2), s2.blob();
  }));
} };
function a$1(t2) {
  let e3 = t2;
  const i2 = /* @__PURE__ */ new Set();
  return { get value() {
    return e3;
  }, set(t3) {
    Object.is(e3, t3) || (e3 = t3, i2.forEach(((t4) => t4(e3))));
  }, update(t3) {
    this.set(t3(e3));
  }, subscribe: (t3) => (i2.add(t3), () => i2.delete(t3)) };
}
function l$1(t2, e3) {
  const i2 = a$1(t2());
  return e3.forEach(((e4) => e4.subscribe((() => {
    const e5 = t2();
    Object.is(i2.value, e5) || i2.set(e5);
  })))), { get value() {
    return i2.value;
  }, subscribe: (t3) => i2.subscribe(t3) };
}
function h$1(t2, e3) {
  let i2;
  const n2 = () => {
    i2 && (i2(), i2 = void 0), i2 = t2();
  }, s2 = e3.map(((t3) => t3.subscribe(n2)));
  return n2(), () => {
    i2 && (i2(), i2 = void 0), s2.forEach(((t3) => t3()));
  };
}
class c extends e$1 {
  get isPlayingSignal() {
    return this._isPlaying;
  }
  get currentTimeSignal() {
    return this._currentTime;
  }
  get durationSignal() {
    return this._duration;
  }
  get volumeSignal() {
    return this._volume;
  }
  get mutedSignal() {
    return this._muted;
  }
  get playbackRateSignal() {
    return this._playbackRate;
  }
  get seekingSignal() {
    return this._seeking;
  }
  constructor(t2) {
    super(), this.isExternalMedia = false, this.reactiveMediaEventCleanups = [], t2.media ? (this.media = t2.media, this.isExternalMedia = true) : this.media = document.createElement("audio"), this._isPlaying = a$1(false), this._currentTime = a$1(0), this._duration = a$1(0), this._volume = a$1(this.media.volume), this._muted = a$1(this.media.muted), this._playbackRate = a$1(this.media.playbackRate || 1), this._seeking = a$1(false), this.setupReactiveMediaEvents(), t2.mediaControls && (this.media.controls = true), t2.autoplay && (this.media.autoplay = true), null != t2.playbackRate && this.onMediaEvent("canplay", (() => {
      null != t2.playbackRate && (this.media.playbackRate = t2.playbackRate);
    }), { once: true });
  }
  setupReactiveMediaEvents() {
    this.reactiveMediaEventCleanups.push(this.onMediaEvent("play", (() => {
      this._isPlaying.set(true);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause", (() => {
      this._isPlaying.set(false);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended", (() => {
      this._isPlaying.set(false);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate", (() => {
      this._currentTime.set(this.media.currentTime);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange", (() => {
      this._duration.set(this.media.duration || 0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata", (() => {
      this._duration.set(this.media.duration || 0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking", (() => {
      this._seeking.set(true);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked", (() => {
      this._seeking.set(false);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange", (() => {
      this._volume.set(this.media.volume), this._muted.set(this.media.muted);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange", (() => {
      this._playbackRate.set(this.media.playbackRate);
    })));
  }
  onMediaEvent(t2, e3, i2) {
    return this.media.addEventListener(t2, e3, i2), () => this.media.removeEventListener(t2, e3, i2);
  }
  getSrc() {
    return this.media.currentSrc || this.media.src || "";
  }
  revokeSrc() {
    const t2 = this.getSrc();
    t2.startsWith("blob:") && URL.revokeObjectURL(t2);
  }
  canPlayType(t2) {
    return "" !== this.media.canPlayType(t2);
  }
  setSrc(t2, e3) {
    const i2 = this.getSrc();
    if (t2 && i2 === t2) return;
    this.revokeSrc();
    const n2 = e3 instanceof Blob && (this.canPlayType(e3.type) || !t2) ? URL.createObjectURL(e3) : t2;
    if (i2 && this.media.removeAttribute("src"), n2 || t2) try {
      this.media.src = n2;
    } catch (e4) {
      this.media.src = t2;
    }
  }
  destroy() {
    this.reactiveMediaEventCleanups.forEach(((t2) => t2())), this.reactiveMediaEventCleanups = [], this.isExternalMedia || (this.media.pause(), this.revokeSrc(), this.media.removeAttribute("src"), this.media.load(), this.media.remove());
  }
  setMediaElement(t2) {
    this.reactiveMediaEventCleanups.forEach(((t3) => t3())), this.reactiveMediaEventCleanups = [], this.media = t2, this.setupReactiveMediaEvents();
  }
  play() {
    return t$1(this, void 0, void 0, (function* () {
      try {
        return yield this.media.play();
      } catch (t2) {
        if (t2 instanceof DOMException && "AbortError" === t2.name) return;
        throw t2;
      }
    }));
  }
  pause() {
    this.media.pause();
  }
  isPlaying() {
    return !this.media.paused && !this.media.ended;
  }
  setTime(t2) {
    this.media.currentTime = Math.max(0, Math.min(t2, this.getDuration()));
  }
  getDuration() {
    return this.media.duration;
  }
  getCurrentTime() {
    return this.media.currentTime;
  }
  getVolume() {
    return this.media.volume;
  }
  setVolume(t2) {
    this.media.volume = t2;
  }
  getMuted() {
    return this.media.muted;
  }
  setMuted(t2) {
    this.media.muted = t2;
  }
  getPlaybackRate() {
    return this.media.playbackRate;
  }
  isSeeking() {
    return this.media.seeking;
  }
  setPlaybackRate(t2, e3) {
    null != e3 && (this.media.preservesPitch = e3), this.media.playbackRate = t2;
  }
  getMediaElement() {
    return this.media;
  }
  setSinkId(t2) {
    return this.media.setSinkId(t2);
  }
}
function u({ maxTop: t2, maxBottom: e3, halfHeight: i2, vScale: n2, barMinHeight: s2 = 0, barAlign: r2 }) {
  let o2 = Math.round(t2 * i2 * n2);
  let a2 = o2 + Math.round(e3 * i2 * n2) || 1;
  return a2 < s2 && (a2 = s2, r2 || (o2 = a2 / 2)), { topHeight: o2, totalHeight: a2 };
}
function d$1({ barAlign: t2, halfHeight: e3, topHeight: i2, totalHeight: n2, canvasHeight: s2 }) {
  return "top" === t2 ? 0 : "bottom" === t2 ? s2 - n2 : e3 - i2;
}
function p(t2, e3, i2) {
  const n2 = e3 - t2.left, s2 = i2 - t2.top;
  return [n2 / t2.width, s2 / t2.height];
}
function m(t2) {
  return Boolean(t2.barWidth || t2.barGap || t2.barAlign);
}
function g(t2, e3) {
  if (!m(e3)) return t2;
  const i2 = e3.barWidth || 0.5, n2 = i2 + (e3.barGap || i2 / 2);
  return 0 === n2 ? t2 : Math.floor(t2 / n2) * n2;
}
function v({ scrollLeft: t2, totalWidth: e3, numCanvases: i2 }) {
  if (0 === e3) return [0];
  const n2 = t2 / e3, s2 = Math.floor(n2 * i2);
  return [s2 - 1, s2, s2 + 1];
}
function f(t2) {
  const e3 = t2._cleanup;
  "function" == typeof e3 && e3();
}
function b(t2) {
  const e3 = a$1({ scrollLeft: t2.scrollLeft, scrollWidth: t2.scrollWidth, clientWidth: t2.clientWidth }), i2 = l$1((() => (function(t3) {
    const { scrollLeft: e4, scrollWidth: i3, clientWidth: n3 } = t3;
    if (0 === i3) return { startX: 0, endX: 1 };
    const s3 = e4 / i3, r2 = (e4 + n3) / i3;
    return { startX: Math.max(0, Math.min(1, s3)), endX: Math.max(0, Math.min(1, r2)) };
  })(e3.value)), [e3]), n2 = l$1((() => (function(t3) {
    return { left: t3.scrollLeft, right: t3.scrollLeft + t3.clientWidth };
  })(e3.value)), [e3]), s2 = () => {
    e3.set({ scrollLeft: t2.scrollLeft, scrollWidth: t2.scrollWidth, clientWidth: t2.clientWidth });
  };
  t2.addEventListener("scroll", s2, { passive: true });
  return { scrollData: e3, percentages: i2, bounds: n2, cleanup: () => {
    t2.removeEventListener("scroll", s2), f(e3);
  } };
}
class y extends e$1 {
  constructor(t2, e3) {
    super(), this.timeouts = [], this.isScrollable = false, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = false, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.containerInlinePadding = 0, this.subscriptions = [], this.options = t2;
    const i2 = this.parentFromOptionsContainer(t2.container);
    this.parent = i2;
    const [n2, s2] = this.initHtml();
    i2.appendChild(n2), this.container = n2, this.scrollContainer = s2.querySelector(".scroll"), this.wrapper = s2.querySelector(".wrapper"), this.canvasWrapper = s2.querySelector(".canvases"), this.progressWrapper = s2.querySelector(".progress"), this.cursor = s2.querySelector(".cursor"), this.calculateInlinePadding(), e3 && s2.appendChild(e3), this.initEvents();
  }
  parentFromOptionsContainer(t2) {
    let e3;
    if ("string" == typeof t2 ? e3 = document.querySelector(t2) : t2 instanceof HTMLElement && (e3 = t2), !e3) throw new Error("Container not found");
    return e3;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t3) => {
      const e3 = this.wrapper.getBoundingClientRect(), [i2, n2] = p(e3, t3.clientX, t3.clientY);
      this.emit("click", i2, n2);
    })), this.wrapper.addEventListener("dblclick", ((t3) => {
      const e3 = this.wrapper.getBoundingClientRect(), [i2, n2] = p(e3, t3.clientX, t3.clientY);
      this.emit("dblclick", i2, n2);
    })), true !== this.options.dragToSeek && "object" != typeof this.options.dragToSeek || this.initDrag(), this.scrollStream = b(this.scrollContainer);
    const t2 = h$1((() => {
      const { startX: t3, endX: e3 } = this.scrollStream.percentages.value, { left: i2, right: n2 } = this.scrollStream.bounds.value;
      this.emit("scroll", t3, e3, i2, n2);
    }), [this.scrollStream.percentages, this.scrollStream.bounds]);
    if (this.subscriptions.push(t2), "function" == typeof ResizeObserver) {
      const t3 = this.createDelay(100);
      this.resizeObserver = new ResizeObserver((() => {
        t3().then((() => this.onContainerResize())).catch((() => {
        }));
      })), this.resizeObserver.observe(this.scrollContainer);
    }
  }
  onContainerResize() {
    const t2 = this.parent.clientWidth;
    this.calculateInlinePadding(), t2 === this.lastContainerWidth && "auto" !== this.options.height || (this.lastContainerWidth = t2, this.reRender(), this.emit("resize"));
  }
  initDrag() {
    if (this.dragStream) return;
    this.dragStream = (function(t3, e3 = {}) {
      const { threshold: i2 = 3, mouseButton: n2 = 0, touchDelay: s2 = 100 } = e3, r2 = a$1(null), o2 = /* @__PURE__ */ new Map(), l2 = matchMedia("(pointer: coarse)").matches;
      let h2 = () => {
      };
      const c2 = (e4) => {
        if (e4.button !== n2) return;
        if (o2.set(e4.pointerId, e4), o2.size > 1) return;
        let a2 = e4.clientX, c3 = e4.clientY, u2 = false;
        const d2 = Date.now(), p2 = t3.getBoundingClientRect(), { left: m2, top: g2 } = p2, v2 = (t4) => {
          if (t4.defaultPrevented || o2.size > 1) return;
          if (l2 && Date.now() - d2 < s2) return;
          const e5 = t4.clientX, n3 = t4.clientY, h3 = e5 - a2, p3 = n3 - c3;
          (u2 || Math.abs(h3) > i2 || Math.abs(p3) > i2) && (t4.preventDefault(), t4.stopPropagation(), u2 || (r2.set({ type: "start", x: a2 - m2, y: c3 - g2 }), u2 = true), r2.set({ type: "move", x: e5 - m2, y: n3 - g2, deltaX: h3, deltaY: p3 }), a2 = e5, c3 = n3);
        }, f2 = (t4) => {
          if (o2.delete(t4.pointerId), u2) {
            const e5 = t4.clientX, i3 = t4.clientY;
            r2.set({ type: "end", x: e5 - m2, y: i3 - g2 });
          }
          h2();
        }, b2 = (t4) => {
          o2.delete(t4.pointerId), t4.relatedTarget && t4.relatedTarget !== document.documentElement || f2(t4);
        }, y2 = (t4) => {
          u2 && (t4.stopPropagation(), t4.preventDefault());
        }, C2 = (t4) => {
          t4.defaultPrevented || o2.size > 1 || u2 && t4.preventDefault();
        };
        document.addEventListener("pointermove", v2), document.addEventListener("pointerup", f2), document.addEventListener("pointerout", b2), document.addEventListener("pointercancel", b2), document.addEventListener("touchmove", C2, { passive: false }), document.addEventListener("click", y2, { capture: true }), h2 = () => {
          document.removeEventListener("pointermove", v2), document.removeEventListener("pointerup", f2), document.removeEventListener("pointerout", b2), document.removeEventListener("pointercancel", b2), document.removeEventListener("touchmove", C2), setTimeout((() => {
            document.removeEventListener("click", y2, { capture: true });
          }), 10);
        };
      };
      return t3.addEventListener("pointerdown", c2), { signal: r2, cleanup: () => {
        h2(), t3.removeEventListener("pointerdown", c2), o2.clear(), f(r2);
      } };
    })(this.wrapper);
    const t2 = h$1((() => {
      const t3 = this.dragStream.signal.value;
      if (!t3) return;
      const e3 = this.wrapper.getBoundingClientRect().width, i2 = (n2 = t3.x / e3) < 0 ? 0 : n2 > 1 ? 1 : n2;
      var n2;
      "start" === t3.type ? (this.isDragging = true, this.emit("dragstart", i2)) : "move" === t3.type ? this.emit("drag", i2) : "end" === t3.type && (this.isDragging = false, this.emit("dragend", i2));
    }), [this.dragStream.signal]);
    this.subscriptions.push(t2);
  }
  calculateInlinePadding() {
    const { paddingLeft: t2, paddingRight: e3 } = getComputedStyle(this.scrollContainer), i2 = parseFloat(t2) + parseFloat(e3);
    this.containerInlinePadding = Number.isNaN(i2) ? 0 : i2;
  }
  initHtml() {
    const t2 = document.createElement("div"), e3 = t2.attachShadow({ mode: "open" }), i2 = this.options.cspNonce && "string" == typeof this.options.cspNonce ? this.options.cspNonce.replace(/"/g, "") : "";
    return e3.innerHTML = `
      <style${i2 ? ` nonce="${i2}"` : ""}>
        :host {
          user-select: none;
          min-width: 1px;
        }
        :host audio {
          display: block;
          width: 100%;
        }
        :host .scroll {
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
          position: relative;
        }
        :host .noScrollbar {
          scrollbar-color: transparent;
          scrollbar-width: none;
        }
        :host .noScrollbar::-webkit-scrollbar {
          display: none;
          -webkit-appearance: none;
        }
        :host .wrapper {
          position: relative;
          overflow: visible;
          z-index: 2;
        }
        :host .canvases {
          min-height: ${this.getHeight(this.options.height, this.options.splitChannels)}px;
          pointer-events: none;
        }
        :host .canvases > div {
          position: relative;
        }
        :host canvas {
          display: block;
          position: absolute;
          top: 0;
          image-rendering: pixelated;
        }
        :host .progress {
          pointer-events: none;
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          overflow: hidden;
        }
        :host .progress > div {
          position: relative;
        }
        :host .cursor {
          pointer-events: none;
          position: absolute;
          z-index: 5;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 2px;
        }
      </style>

      <div class="scroll" part="scroll">
        <div class="wrapper" part="wrapper">
          <div class="canvases" part="canvases"></div>
          <div class="progress" part="progress"></div>
          <div class="cursor" part="cursor"></div>
        </div>
      </div>
    `, [t2, e3];
  }
  setOptions(t2) {
    var e3;
    if (this.options.container !== t2.container) {
      const e4 = this.parentFromOptionsContainer(t2.container);
      e4.appendChild(this.container), this.parent = e4;
    }
    true === t2.dragToSeek || "object" == typeof this.options.dragToSeek ? this.initDrag() : (null === (e3 = this.dragStream) || void 0 === e3 || e3.cleanup(), this.dragStream = null), this.options = t2, this.reRender();
  }
  getWrapper() {
    return this.wrapper;
  }
  getWidth() {
    return this.scrollContainer.clientWidth - this.containerInlinePadding;
  }
  getScroll() {
    return this.scrollContainer.scrollLeft;
  }
  setScroll(t2) {
    this.scrollContainer.scrollLeft = t2;
  }
  setScrollPercentage(t2) {
    const { scrollWidth: e3 } = this.scrollContainer, i2 = e3 * t2;
    this.setScroll(i2);
  }
  destroy() {
    var t2;
    this.subscriptions.forEach(((t3) => t3())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), null === (t2 = this.unsubscribeOnScroll) || void 0 === t2 || t2.forEach(((t3) => t3())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(t2 = 10) {
    let e3, i2;
    const n2 = () => {
      e3 && (clearTimeout(e3), e3 = void 0), i2 && (i2(), i2 = void 0);
    };
    return this.timeouts.push(n2), () => new Promise(((s2, r2) => {
      n2(), i2 = r2, e3 = setTimeout((() => {
        e3 = void 0, i2 = void 0, s2();
      }), t2);
    }));
  }
  getHeight(t2, e3) {
    var i2;
    const n2 = (null === (i2 = this.audioData) || void 0 === i2 ? void 0 : i2.numberOfChannels) || 1;
    return (function({ optionsHeight: t3, optionsSplitChannels: e4, parentHeight: i3, numberOfChannels: n3, defaultHeight: s2 = 128 }) {
      if (null == t3) return s2;
      const r2 = Number(t3);
      if (!isNaN(r2)) return r2;
      if ("auto" === t3) {
        const t4 = i3 || s2;
        return (null == e4 ? void 0 : e4.every(((t5) => !t5.overlay))) ? t4 / n3 : t4;
      }
      return s2;
    })({ optionsHeight: t2, optionsSplitChannels: e3, parentHeight: this.parent.clientHeight, numberOfChannels: n2, defaultHeight: 128 });
  }
  convertColorValues(t2, e3) {
    return (function(t3, e4, i2) {
      if (!Array.isArray(t3)) return t3 || "";
      if (0 === t3.length) return "#999";
      if (t3.length < 2) return t3[0] || "";
      const n2 = document.createElement("canvas"), s2 = n2.getContext("2d"), r2 = null != i2 ? i2 : n2.height * e4, o2 = s2.createLinearGradient(0, 0, 0, r2 || e4), a2 = 1 / (t3.length - 1);
      return t3.forEach(((t4, e5) => {
        o2.addColorStop(e5 * a2, t4);
      })), o2;
    })(t2, this.getPixelRatio(), null == e3 ? void 0 : e3.canvas.height);
  }
  getPixelRatio() {
    return t2 = window.devicePixelRatio, Math.max(1, t2 || 1);
    var t2;
  }
  renderBarWaveform(t2, e3, i2, n2) {
    const { width: s2, height: r2 } = i2.canvas, { halfHeight: o2, barWidth: a2, barRadius: l2, barIndexScale: h2, barSpacing: c2, barMinHeight: p2 } = (function({ width: t3, height: e4, length: i3, options: n3, pixelRatio: s3 }) {
      const r3 = e4 / 2, o3 = n3.barWidth ? n3.barWidth * s3 : 1, a3 = n3.barGap ? n3.barGap * s3 : n3.barWidth ? o3 / 2 : 0, l3 = o3 + a3 || 1;
      return { halfHeight: r3, barWidth: o3, barGap: a3, barRadius: n3.barRadius || 0, barMinHeight: n3.barMinHeight ? n3.barMinHeight * s3 : 0, barIndexScale: i3 > 0 ? t3 / l3 / i3 : 0, barSpacing: l3 };
    })({ width: s2, height: r2, length: (t2[0] || []).length, options: e3, pixelRatio: this.getPixelRatio() }), m2 = (function({ channelData: t3, barIndexScale: e4, barSpacing: i3, barWidth: n3, halfHeight: s3, vScale: r3, canvasHeight: o3, barAlign: a3, barMinHeight: l3 }) {
      const h3 = t3[0] || [], c3 = t3[1] || h3, p3 = h3.length, m3 = [];
      let g2 = 0, v2 = 0, f2 = 0;
      for (let t4 = 0; t4 <= p3; t4++) {
        const p4 = Math.round(t4 * e4);
        if (p4 > g2) {
          const { topHeight: t5, totalHeight: e5 } = u({ maxTop: v2, maxBottom: f2, halfHeight: s3, vScale: r3, barMinHeight: l3, barAlign: a3 }), h4 = d$1({ barAlign: a3, halfHeight: s3, topHeight: t5, totalHeight: e5, canvasHeight: o3 });
          m3.push({ x: g2 * i3, y: h4, width: n3, height: e5 }), g2 = p4, v2 = 0, f2 = 0;
        }
        const b2 = Math.abs(h3[t4] || 0), y2 = Math.abs(c3[t4] || 0);
        b2 > v2 && (v2 = b2), y2 > f2 && (f2 = y2);
      }
      return m3;
    })({ channelData: t2, barIndexScale: h2, barSpacing: c2, barWidth: a2, halfHeight: o2, vScale: n2, canvasHeight: r2, barAlign: e3.barAlign, barMinHeight: p2 });
    i2.beginPath();
    for (const t3 of m2) l2 && "roundRect" in i2 ? i2.roundRect(t3.x, t3.y, t3.width, t3.height, l2) : i2.rect(t3.x, t3.y, t3.width, t3.height);
    i2.fill(), i2.closePath();
  }
  renderLineWaveform(t2, e3, i2, n2) {
    const { width: s2, height: r2 } = i2.canvas, o2 = (function({ channelData: t3, width: e4, height: i3, vScale: n3 }) {
      const s3 = i3 / 2, r3 = t3[0] || [];
      return [r3, t3[1] || r3].map(((t4, i4) => {
        const r4 = t4.length, o3 = r4 ? e4 / r4 : 0, a2 = s3, l2 = 0 === i4 ? -1 : 1, h2 = [{ x: 0, y: a2 }];
        let c2 = 0, u2 = 0;
        for (let e5 = 0; e5 <= r4; e5++) {
          const i5 = Math.round(e5 * o3);
          if (i5 > c2) {
            const t5 = a2 + (Math.round(u2 * s3 * n3) || 1) * l2;
            h2.push({ x: c2, y: t5 }), c2 = i5, u2 = 0;
          }
          const r5 = Math.abs(t4[e5] || 0);
          r5 > u2 && (u2 = r5);
        }
        return h2.push({ x: c2, y: a2 }), h2;
      }));
    })({ channelData: t2, width: s2, height: r2, vScale: n2 });
    i2.beginPath();
    for (const t3 of o2) if (t3.length) {
      i2.moveTo(t3[0].x, t3[0].y);
      for (let e4 = 1; e4 < t3.length; e4++) {
        const n3 = t3[e4];
        i2.lineTo(n3.x, n3.y);
      }
    }
    i2.fill(), i2.closePath();
  }
  renderWaveform(t2, e3, i2) {
    if (i2.fillStyle = this.convertColorValues(e3.waveColor, i2), e3.renderFunction) return void e3.renderFunction(t2, i2);
    const n2 = (function({ channelData: t3, barHeight: e4, normalize: i3, maxPeak: n3 }) {
      var s2;
      const r2 = e4 || 1;
      if (!i3) return r2;
      const o2 = t3[0];
      if (!o2 || 0 === o2.length) return r2;
      let a2 = null != n3 ? n3 : 0;
      if (!n3) for (let t4 = 0; t4 < o2.length; t4++) {
        const e5 = null !== (s2 = o2[t4]) && void 0 !== s2 ? s2 : 0, i4 = Math.abs(e5);
        i4 > a2 && (a2 = i4);
      }
      return a2 ? r2 / a2 : r2;
    })({ channelData: t2, barHeight: e3.barHeight, normalize: e3.normalize, maxPeak: e3.maxPeak });
    m(e3) ? this.renderBarWaveform(t2, e3, i2, n2) : this.renderLineWaveform(t2, e3, i2, n2);
  }
  renderSingleCanvas(t2, e3, i2, n2, s2, r2, o2) {
    const a2 = this.getPixelRatio(), l2 = document.createElement("canvas");
    l2.width = Math.round(i2 * a2), l2.height = Math.round(n2 * a2), l2.style.width = `${i2}px`, l2.style.height = `${n2}px`, l2.style.left = `${Math.round(s2)}px`, r2.appendChild(l2);
    const h2 = l2.getContext("2d");
    if (e3.renderFunction ? (h2.fillStyle = this.convertColorValues(e3.waveColor, h2), e3.renderFunction(t2, h2)) : this.renderWaveform(t2, e3, h2), l2.width > 0 && l2.height > 0) {
      const t3 = l2.cloneNode(), i3 = t3.getContext("2d");
      i3.drawImage(l2, 0, 0), i3.globalCompositeOperation = "source-in", i3.fillStyle = this.convertColorValues(e3.progressColor, i3), i3.fillRect(0, 0, l2.width, l2.height), o2.appendChild(t3);
    }
  }
  renderMultiCanvas(t2, e3, i2, n2, s2, r2) {
    const o2 = this.getPixelRatio(), { clientWidth: a2 } = this.scrollContainer, l2 = i2 / o2, h2 = (function({ clientWidth: t3, totalWidth: e4, options: i3 }) {
      return g(Math.min(8e3, t3, e4), i3);
    })({ clientWidth: a2, totalWidth: l2, options: e3 });
    let c2 = {};
    if (0 === h2) return;
    const u2 = (i3) => {
      if (i3 < 0 || i3 >= d2) return;
      if (c2[i3]) return;
      c2[i3] = true;
      const o3 = i3 * h2;
      let a3 = Math.min(l2 - o3, h2);
      if (a3 = g(a3, e3), a3 <= 0) return;
      const u3 = (function({ channelData: t3, offset: e4, clampedWidth: i4, totalWidth: n3 }) {
        return t3.map(((t4) => {
          const s3 = Math.floor(e4 / n3 * t4.length), r3 = Math.floor((e4 + i4) / n3 * t4.length);
          return t4.slice(s3, r3);
        }));
      })({ channelData: t2, offset: o3, clampedWidth: a3, totalWidth: l2 });
      this.renderSingleCanvas(u3, e3, a3, n2, o3, s2, r2);
    }, d2 = Math.ceil(l2 / h2);
    if (!this.isScrollable) {
      for (let t3 = 0; t3 < d2; t3++) u2(t3);
      return;
    }
    if (v({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: l2, numCanvases: d2 }).forEach(((t3) => u2(t3))), d2 > 1) {
      const t3 = this.on("scroll", (() => {
        const { scrollLeft: t4 } = this.scrollContainer;
        Object.keys(c2).length > 10 && (s2.innerHTML = "", r2.innerHTML = "", c2 = {}), v({ scrollLeft: t4, totalWidth: l2, numCanvases: d2 }).forEach(((t5) => u2(t5)));
      }));
      this.unsubscribeOnScroll.push(t3);
    }
  }
  renderChannel(t2, e3, i2, n2) {
    var { overlay: s2 } = e3, r2 = (function(t3, e4) {
      var i3 = {};
      for (var n3 in t3) Object.prototype.hasOwnProperty.call(t3, n3) && e4.indexOf(n3) < 0 && (i3[n3] = t3[n3]);
      if (null != t3 && "function" == typeof Object.getOwnPropertySymbols) {
        var s3 = 0;
        for (n3 = Object.getOwnPropertySymbols(t3); s3 < n3.length; s3++) e4.indexOf(n3[s3]) < 0 && Object.prototype.propertyIsEnumerable.call(t3, n3[s3]) && (i3[n3[s3]] = t3[n3[s3]]);
      }
      return i3;
    })(e3, ["overlay"]);
    const o2 = document.createElement("div"), a2 = this.getHeight(r2.height, r2.splitChannels);
    o2.style.height = `${a2}px`, s2 && n2 > 0 && (o2.style.marginTop = `-${a2}px`), this.canvasWrapper.style.minHeight = `${a2}px`, this.canvasWrapper.appendChild(o2);
    const l2 = o2.cloneNode();
    this.progressWrapper.appendChild(l2), this.renderMultiCanvas(t2, r2, i2, a2, o2, l2);
  }
  render(e3) {
    return t$1(this, void 0, void 0, (function* () {
      var t2;
      this.timeouts.forEach(((t3) => t3())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", null != this.options.width && (this.scrollContainer.style.width = "number" == typeof this.options.width ? `${this.options.width}px` : this.options.width);
      const i2 = this.getPixelRatio(), n2 = this.scrollContainer.clientWidth - this.containerInlinePadding, { scrollWidth: s2, isScrollable: r2, useParentWidth: o2, width: a2 } = (function({ duration: t3, minPxPerSec: e4 = 0, parentWidth: i3, fillParent: n3, pixelRatio: s3 }) {
        const r3 = Math.ceil(t3 * e4), o3 = r3 > i3, a3 = Boolean(n3 && !o3);
        return { scrollWidth: r3, isScrollable: o3, useParentWidth: a3, width: (a3 ? i3 : r3) * s3 };
      })({ duration: e3.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: n2, fillParent: this.options.fillParent, pixelRatio: i2 });
      if (this.isScrollable = r2, this.wrapper.style.width = o2 ? "100%" : `${s2}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e3, this.emit("render"), this.options.splitChannels) for (let i3 = 0; i3 < e3.numberOfChannels; i3++) {
        const n3 = Object.assign(Object.assign({}, this.options), null === (t2 = this.options.splitChannels) || void 0 === t2 ? void 0 : t2[i3]);
        this.renderChannel([e3.getChannelData(i3)], n3, a2, i3);
      }
      else {
        const t3 = [e3.getChannelData(0)];
        e3.numberOfChannels > 1 && t3.push(e3.getChannelData(1)), this.renderChannel(t3, this.options, a2, 0);
      }
      Promise.resolve().then((() => this.emit("rendered")));
    }));
  }
  reRender() {
    if (this.unsubscribeOnScroll.forEach(((t3) => t3())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: t2 } = this.scrollContainer, { right: e3 } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), !this.isScrollable && this.scrollContainer.scrollLeft) this.scrollContainer.scrollLeft = 0;
    else if (this.isScrollable && t2 !== this.scrollContainer.scrollWidth) {
      const { right: t3 } = this.progressWrapper.getBoundingClientRect(), i2 = (function(t4) {
        const e4 = 2 * t4;
        return (e4 < 0 ? Math.floor(e4) : Math.ceil(e4)) / 2;
      })(t3 - e3);
      this.scrollContainer.scrollLeft += i2;
    }
  }
  zoom(t2) {
    this.options.minPxPerSec = t2, this.reRender();
  }
  scrollIntoView(t2, e3 = false) {
    var i2;
    const { scrollLeft: n2, scrollWidth: s2, clientWidth: r2 } = this.scrollContainer, o2 = t2 * s2, a2 = n2, l2 = n2 + r2, h2 = r2 / 2;
    if (this.isDragging) {
      const t3 = 30;
      o2 + t3 > l2 ? this.scrollContainer.scrollLeft += t3 : o2 - t3 < a2 && (this.scrollContainer.scrollLeft -= t3);
    } else {
      (o2 < a2 || o2 > l2) && (this.scrollContainer.scrollLeft = o2 - (this.options.autoCenter ? h2 : 0));
      const t3 = o2 - n2 - h2;
      if (e3 && this.options.autoCenter && t3 > 0) {
        const e4 = null === (i2 = this.audioData) || void 0 === i2 ? void 0 : i2.duration;
        if (void 0 === e4 || e4 <= 0) return void (this.scrollContainer.scrollLeft += t3);
        const n3 = s2 / e4;
        this.scrollContainer.scrollLeft += n3 <= 600 ? Math.min(t3, 10) : t3;
      }
    }
  }
  renderProgress(t2, e3) {
    if (isNaN(t2)) return;
    const i2 = 100 * t2;
    this.canvasWrapper.style.clipPath = `polygon(${i2}% 0%, 100% 0%, 100% 100%, ${i2}% 100%)`, this.progressWrapper.style.width = `${i2}%`, this.cursor.style.left = `${i2}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${t2 * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(t2, e3);
  }
  exportImage(e3, i2, n2) {
    return t$1(this, void 0, void 0, (function* () {
      const t2 = this.canvasWrapper.querySelectorAll("canvas");
      if (!t2.length) throw new Error("No waveform data");
      if ("dataURL" === n2) {
        const n3 = Array.from(t2).map(((t3) => t3.toDataURL(e3, i2)));
        return Promise.resolve(n3);
      }
      return Promise.all(Array.from(t2).map(((t3) => new Promise(((n3, s2) => {
        t3.toBlob(((t4) => {
          t4 ? n3(t4) : s2(new Error("Could not export image"));
        }), e3, i2);
      })))));
    }));
  }
}
class C extends e$1 {
  constructor() {
    super(...arguments), this.animationFrameId = null, this.isRunning = false;
  }
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const t2 = () => {
      this.isRunning && (this.emit("tick"), this.animationFrameId = requestAnimationFrame(t2));
    };
    t2();
  }
  stop() {
    this.isRunning = false, null !== this.animationFrameId && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
  destroy() {
    this.stop();
  }
}
class S extends e$1 {
  constructor(t2) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playbackPosition = 0, this._muted = false, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = true, this.crossOrigin = null, this.seeking = false, this.autoplay = false, this.addEventListener = this.on, this.removeEventListener = this.un, (function() {
      const t3 = globalThis.navigator;
      if (null == t3 ? void 0 : t3.audioSession) try {
        t3.audioSession.type = "playback";
      } catch (t4) {
        console.warn("Setting navigator.audioSession.type failed:", t4);
      }
    })(), this.audioContext = t2 || new AudioContext(), this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return t$1(this, void 0, void 0, (function* () {
    }));
  }
  get src() {
    return this.currentSrc;
  }
  set src(t2) {
    if (this.currentSrc = t2, this._duration = void 0, !t2) return this.buffer = null, void this.emit("emptied");
    fetch(t2).then(((e3) => {
      if (e3.status >= 400) throw new Error(`Failed to fetch ${t2}: ${e3.status} (${e3.statusText})`);
      return e3.arrayBuffer();
    })).then(((e3) => this.currentSrc !== t2 ? null : this.audioContext.decodeAudioData(e3))).then(((e3) => {
      this.currentSrc === t2 && (this.buffer = e3, this.emit("loadedmetadata"), this.emit("canplay"), this.autoplay && this.play());
    })).catch(((t3) => {
      console.error("WebAudioPlayer load error:", t3);
    }));
  }
  _play() {
    if (!this.paused) return;
    this.paused = false, this.bufferNode && (this.bufferNode.onended = null, this.bufferNode.disconnect()), this.bufferNode = this.audioContext.createBufferSource(), this.buffer && (this.bufferNode.buffer = this.buffer), this.bufferNode.playbackRate.value = this._playbackRate, this.bufferNode.connect(this.gainNode);
    let t2 = this.playbackPosition;
    (t2 >= this.duration || t2 < 0) && (t2 = 0, this.playbackPosition = 0), this.bufferNode.start(this.audioContext.currentTime, t2), this.playStartTime = this.audioContext.currentTime, this.bufferNode.onended = () => {
      !this.paused && this.duration - this.currentTime < 0.01 && (this.pause(), this.emit("ended"));
    };
  }
  _pause() {
    var t2;
    this.paused = true, null === (t2 = this.bufferNode) || void 0 === t2 || t2.stop(), this.playbackPosition += (this.audioContext.currentTime - this.playStartTime) * this._playbackRate;
  }
  play() {
    return t$1(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(t2) {
    const e3 = t2 - this.currentTime, i2 = this.bufferNode;
    null == i2 || i2.stop(this.audioContext.currentTime + e3), null == i2 || i2.addEventListener("ended", (() => {
      i2 === this.bufferNode && (this.bufferNode = null, this.pause());
    }), { once: true });
  }
  setSinkId(e3) {
    return t$1(this, void 0, void 0, (function* () {
      return this.audioContext.setSinkId(e3);
    }));
  }
  get playbackRate() {
    return this._playbackRate;
  }
  set playbackRate(t2) {
    const e3 = !this.paused;
    e3 && this._pause(), this._playbackRate = t2, e3 && this._play(), this.bufferNode && (this.bufferNode.playbackRate.value = t2);
  }
  get currentTime() {
    return this.paused ? this.playbackPosition : this.playbackPosition + (this.audioContext.currentTime - this.playStartTime) * this._playbackRate;
  }
  set currentTime(t2) {
    const e3 = !this.paused;
    e3 && this._pause(), this.playbackPosition = t2, e3 && this._play(), this.emit("seeking"), this.emit("timeupdate");
  }
  get duration() {
    var t2, e3;
    return null !== (t2 = this._duration) && void 0 !== t2 ? t2 : (null === (e3 = this.buffer) || void 0 === e3 ? void 0 : e3.duration) || 0;
  }
  set duration(t2) {
    this._duration = t2;
  }
  get volume() {
    return this.gainNode.gain.value;
  }
  set volume(t2) {
    this.gainNode.gain.value = t2, this.emit("volumechange");
  }
  get muted() {
    return this._muted;
  }
  set muted(t2) {
    this._muted !== t2 && (this._muted = t2, this._muted ? this.gainNode.disconnect() : this.gainNode.connect(this.audioContext.destination));
  }
  canPlayType(t2) {
    return /^(audio|video)\//.test(t2);
  }
  getGainNode() {
    return this.gainNode;
  }
  getChannelData() {
    const t2 = [];
    if (!this.buffer) return t2;
    const e3 = this.buffer.numberOfChannels;
    for (let i2 = 0; i2 < e3; i2++) t2.push(this.buffer.getChannelData(i2));
    return t2;
  }
  removeAttribute(t2) {
    switch (t2) {
      case "src":
        this.src = "";
        break;
      case "playbackRate":
        this.playbackRate = 0;
        break;
      case "currentTime":
        this.currentTime = 0;
        break;
      case "duration":
        this.duration = 0;
        break;
      case "volume":
        this.volume = 0;
        break;
      case "muted":
        this.muted = false;
    }
  }
}
const P = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: true, interact: true, dragToSeek: false, autoScroll: true, autoCenter: true, sampleRate: 8e3 };
class E extends c {
  static create(t2) {
    return new E(t2);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(t2) {
    const e3 = t2.media || ("WebAudio" === t2.backend ? new S() : void 0);
    super({ media: e3, mediaControls: t2.mediaControls, autoplay: t2.autoplay, playbackRate: t2.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, P, t2);
    const { state: i2, actions: n2 } = (function(t3) {
      var e4, i3, n3, s3, r3, o2;
      const h2 = null !== (e4 = null == t3 ? void 0 : t3.currentTime) && void 0 !== e4 ? e4 : a$1(0), c2 = null !== (i3 = null == t3 ? void 0 : t3.duration) && void 0 !== i3 ? i3 : a$1(0), u2 = null !== (n3 = null == t3 ? void 0 : t3.isPlaying) && void 0 !== n3 ? n3 : a$1(false), d2 = null !== (s3 = null == t3 ? void 0 : t3.isSeeking) && void 0 !== s3 ? s3 : a$1(false), p2 = null !== (r3 = null == t3 ? void 0 : t3.volume) && void 0 !== r3 ? r3 : a$1(1), m2 = null !== (o2 = null == t3 ? void 0 : t3.playbackRate) && void 0 !== o2 ? o2 : a$1(1), g2 = a$1(null), v2 = a$1(null), f2 = a$1(""), b2 = a$1(0), y2 = a$1(0), C2 = l$1((() => !u2.value), [u2]), S2 = l$1((() => null !== g2.value), [g2]), P2 = l$1((() => S2.value && c2.value > 0), [S2, c2]), E2 = l$1((() => h2.value), [h2]), w = l$1((() => c2.value > 0 ? h2.value / c2.value : 0), [h2, c2]);
      return { state: { currentTime: h2, duration: c2, isPlaying: u2, isPaused: C2, isSeeking: d2, volume: p2, playbackRate: m2, audioBuffer: g2, peaks: v2, url: f2, zoom: b2, scrollPosition: y2, canPlay: S2, isReady: P2, progress: E2, progressPercent: w }, actions: { setCurrentTime: (t4) => {
        const e5 = Math.max(0, Math.min(c2.value || 1 / 0, t4));
        h2.set(e5);
      }, setDuration: (t4) => {
        c2.set(Math.max(0, t4));
      }, setPlaying: (t4) => {
        u2.set(t4);
      }, setSeeking: (t4) => {
        d2.set(t4);
      }, setVolume: (t4) => {
        const e5 = Math.max(0, Math.min(1, t4));
        p2.set(e5);
      }, setPlaybackRate: (t4) => {
        const e5 = Math.max(0.1, Math.min(16, t4));
        m2.set(e5);
      }, setAudioBuffer: (t4) => {
        g2.set(t4), t4 && c2.set(t4.duration);
      }, setPeaks: (t4) => {
        v2.set(t4);
      }, setUrl: (t4) => {
        f2.set(t4);
      }, setZoom: (t4) => {
        b2.set(Math.max(0, t4));
      }, setScrollPosition: (t4) => {
        y2.set(Math.max(0, t4));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i2, this.wavesurferActions = n2, this.timer = new C();
    const s2 = e3 ? void 0 : this.getMediaElement();
    this.renderer = new y(this.options, s2), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const r2 = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: t3, duration: e4 } = this.options;
      (r2 || t3 && e4) && this.load(r2, t3, e4).catch(((t4) => {
        this.emit("error", t4 instanceof Error ? t4 : new Error(String(t4)));
      }));
    }));
  }
  updateProgress(t2 = this.getCurrentTime()) {
    return this.renderer.renderProgress(t2 / this.getDuration(), this.isPlaying()), t2;
  }
  initTimerEvents() {
    this.subscriptions.push(this.timer.on("tick", (() => {
      if (!this.isSeeking()) {
        const t2 = this.updateProgress();
        this.emit("timeupdate", t2), this.emit("audioprocess", t2), null != this.stopAtPosition && this.isPlaying() && t2 >= this.stopAtPosition && this.pause();
      }
    })));
  }
  initReactiveState() {
    this.reactiveCleanups.push((function(t2, e3) {
      const i2 = [];
      i2.push(h$1((() => {
        const i3 = t2.isPlaying.value;
        e3.emit(i3 ? "play" : "pause");
      }), [t2.isPlaying])), i2.push(h$1((() => {
        const i3 = t2.currentTime.value;
        e3.emit("timeupdate", i3), t2.isPlaying.value && e3.emit("audioprocess", i3);
      }), [t2.currentTime, t2.isPlaying])), i2.push(h$1((() => {
        t2.isSeeking.value && e3.emit("seeking", t2.currentTime.value);
      }), [t2.isSeeking, t2.currentTime]));
      let n2 = false;
      i2.push(h$1((() => {
        t2.isReady.value && !n2 && (n2 = true, e3.emit("ready", t2.duration.value));
      }), [t2.isReady, t2.duration]));
      let s2 = false;
      return i2.push(h$1((() => {
        const i3 = t2.isPlaying.value, n3 = t2.currentTime.value, r2 = t2.duration.value, o2 = r2 > 0 && n3 >= r2;
        s2 && !i3 && o2 && e3.emit("finish"), s2 = i3 && o2;
      }), [t2.isPlaying, t2.currentTime, t2.duration])), i2.push(h$1((() => {
        const i3 = t2.zoom.value;
        i3 > 0 && e3.emit("zoom", i3);
      }), [t2.zoom])), () => {
        i2.forEach(((t3) => t3()));
      };
    })(this.wavesurferState, { emit: this.emit.bind(this) }));
  }
  initPlayerEvents() {
    this.isPlaying() && (this.emit("play"), this.timer.start()), this.mediaSubscriptions.push(this.onMediaEvent("timeupdate", (() => {
      const t2 = this.updateProgress();
      this.emit("timeupdate", t2);
    })), this.onMediaEvent("play", (() => {
      this.emit("play"), this.timer.start();
    })), this.onMediaEvent("pause", (() => {
      this.emit("pause"), this.timer.stop(), this.stopAtPosition = null;
    })), this.onMediaEvent("emptied", (() => {
      this.timer.stop(), this.stopAtPosition = null;
    })), this.onMediaEvent("ended", (() => {
      this.emit("timeupdate", this.getDuration()), this.emit("finish"), this.stopAtPosition = null;
    })), this.onMediaEvent("seeking", (() => {
      this.emit("seeking", this.getCurrentTime());
    })), this.onMediaEvent("error", (() => {
      var t2;
      this.emit("error", null !== (t2 = this.getMediaElement().error) && void 0 !== t2 ? t2 : new Error("Media error")), this.stopAtPosition = null;
    })));
  }
  initRendererEvents() {
    this.subscriptions.push(this.renderer.on("click", ((t2, e3) => {
      this.options.interact && (this.seekTo(t2), this.emit("interaction", t2 * this.getDuration()), this.emit("click", t2, e3));
    })), this.renderer.on("dblclick", ((t2, e3) => {
      this.emit("dblclick", t2, e3);
    })), this.renderer.on("scroll", ((t2, e3, i2, n2) => {
      const s2 = this.getDuration();
      this.emit("scroll", t2 * s2, e3 * s2, i2, n2);
    })), this.renderer.on("render", (() => {
      this.emit("redraw");
    })), this.renderer.on("rendered", (() => {
      this.emit("redrawcomplete");
    })), this.renderer.on("dragstart", ((t2) => {
      this.emit("dragstart", t2);
    })), this.renderer.on("dragend", ((t2) => {
      this.emit("dragend", t2);
    })), this.renderer.on("resize", (() => {
      this.emit("resize");
    })));
    {
      let t2;
      const e3 = this.renderer.on("drag", ((e4) => {
        var i2;
        if (!this.options.interact) return;
        this.renderer.renderProgress(e4), clearTimeout(t2);
        let n2 = 0;
        const s2 = this.options.dragToSeek;
        this.isPlaying() ? n2 = 0 : true === s2 ? n2 = 200 : s2 && "object" == typeof s2 && (n2 = null !== (i2 = s2.debounceTime) && void 0 !== i2 ? i2 : 200), t2 = setTimeout((() => {
          this.seekTo(e4);
        }), n2), this.emit("interaction", e4 * this.getDuration()), this.emit("drag", e4);
      }));
      this.subscriptions.push((() => {
        clearTimeout(t2), e3();
      }));
    }
  }
  initPlugins() {
    var t2;
    (null === (t2 = this.options.plugins) || void 0 === t2 ? void 0 : t2.length) && this.options.plugins.forEach(((t3) => {
      this.registerPlugin(t3);
    }));
  }
  unsubscribePlayerEvents() {
    this.mediaSubscriptions.forEach(((t2) => t2())), this.mediaSubscriptions = [];
  }
  setOptions(t2) {
    this.options = Object.assign({}, this.options, t2), t2.duration && !t2.peaks && (this.decodedData = i$1.createBuffer(this.exportPeaks(), t2.duration)), t2.peaks && t2.duration && (this.decodedData = i$1.createBuffer(t2.peaks, t2.duration)), this.renderer.setOptions(this.options), t2.audioRate && this.setPlaybackRate(t2.audioRate), null != t2.mediaControls && (this.getMediaElement().controls = t2.mediaControls);
  }
  registerPlugin(t2) {
    if (this.plugins.includes(t2)) return t2;
    t2._init(this), this.plugins.push(t2);
    const e3 = t2.once("destroy", (() => {
      this.plugins = this.plugins.filter(((e4) => e4 !== t2)), this.subscriptions = this.subscriptions.filter(((t3) => t3 !== e3));
    }));
    return this.subscriptions.push(e3), t2;
  }
  unregisterPlugin(t2) {
    this.plugins = this.plugins.filter(((e3) => e3 !== t2)), t2.destroy();
  }
  getWrapper() {
    return this.renderer.getWrapper();
  }
  getWidth() {
    return this.renderer.getWidth();
  }
  getScroll() {
    return this.renderer.getScroll();
  }
  setScroll(t2) {
    return this.renderer.setScroll(t2);
  }
  setScrollTime(t2) {
    const e3 = t2 / this.getDuration();
    this.renderer.setScrollPercentage(e3);
  }
  getActivePlugins() {
    return this.plugins;
  }
  loadAudio(e3, n2, s2, r2) {
    return t$1(this, void 0, void 0, (function* () {
      var t2;
      if (this.emit("load", e3), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, null === (t2 = this.abortController) || void 0 === t2 || t2.abort(), this.abortController = null, !n2 && !s2) {
        const t3 = this.options.fetchParams || {};
        window.AbortController && !t3.signal && (this.abortController = new AbortController(), t3.signal = this.abortController.signal);
        const i2 = (t4) => this.emit("loading", t4);
        n2 = yield o$1.fetchBlob(e3, i2, t3);
        const s3 = this.options.blobMimeType;
        s3 && (n2 = new Blob([n2], { type: s3 }));
      }
      this.setSrc(e3, n2);
      const a2 = yield new Promise(((t3) => {
        const e4 = r2 || this.getDuration();
        e4 ? t3(e4) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => t3(this.getDuration())), { once: true }));
      }));
      if (!e3 && !n2) {
        const t3 = this.getMediaElement();
        t3 instanceof S && (t3.duration = a2);
      }
      if (s2) this.decodedData = i$1.createBuffer(s2, a2 || 0);
      else if (n2) {
        const t3 = yield n2.arrayBuffer();
        this.decodedData = yield i$1.decode(t3, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e3, i2, n2) {
    return t$1(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e3, void 0, i2, n2);
      } catch (t2) {
        throw this.emit("error", t2), t2;
      }
    }));
  }
  loadBlob(e3, i2, n2) {
    return t$1(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e3, i2, n2);
      } catch (t2) {
        throw this.emit("error", t2), t2;
      }
    }));
  }
  zoom(t2) {
    if (!this.decodedData) throw new Error("No audio loaded");
    this.renderer.zoom(t2), this.emit("zoom", t2);
  }
  getDecodedData() {
    return this.decodedData;
  }
  exportPeaks({ channels: t2 = 2, maxLength: e3 = 8e3, precision: i2 = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const n2 = Math.min(t2, this.decodedData.numberOfChannels), s2 = [];
    for (let t3 = 0; t3 < n2; t3++) {
      const n3 = this.decodedData.getChannelData(t3), r2 = [], o2 = n3.length / e3;
      for (let t4 = 0; t4 < e3; t4++) {
        const e4 = n3.slice(Math.floor(t4 * o2), Math.ceil((t4 + 1) * o2));
        let s3 = 0;
        for (let t5 = 0; t5 < e4.length; t5++) {
          const i3 = e4[t5];
          Math.abs(i3) > Math.abs(s3) && (s3 = i3);
        }
        r2.push(Math.round(s3 * i2) / i2);
      }
      s2.push(r2);
    }
    return s2;
  }
  getDuration() {
    let t2 = super.getDuration() || 0;
    return 0 !== t2 && t2 !== 1 / 0 || !this.decodedData || (t2 = this.decodedData.duration), t2;
  }
  toggleInteraction(t2) {
    this.options.interact = t2;
  }
  setTime(t2) {
    this.stopAtPosition = null, super.setTime(t2), this.updateProgress(t2), this.emit("timeupdate", t2);
  }
  seekTo(t2) {
    const e3 = this.getDuration() * t2;
    this.setTime(e3);
  }
  play(e3, i2) {
    const n2 = Object.create(null, { play: { get: () => super.play } });
    return t$1(this, void 0, void 0, (function* () {
      null != e3 && this.setTime(e3);
      const t2 = yield n2.play.call(this);
      return null != i2 && (this.media instanceof S ? this.media.stopAt(i2) : this.stopAtPosition = i2), t2;
    }));
  }
  playPause() {
    return t$1(this, void 0, void 0, (function* () {
      return this.isPlaying() ? this.pause() : this.play();
    }));
  }
  stop() {
    this.pause(), this.setTime(0);
  }
  skip(t2) {
    this.setTime(this.getCurrentTime() + t2);
  }
  empty() {
    this.load("", [[0]], 1e-3);
  }
  setMediaElement(t2) {
    this.unsubscribePlayerEvents(), super.setMediaElement(t2), this.initPlayerEvents();
  }
  exportImage() {
    return t$1(this, arguments, void 0, (function* (t2 = "image/png", e3 = 1, i2 = "dataURL") {
      return this.renderer.exportImage(t2, e3, i2);
    }));
  }
  destroy() {
    var t2;
    this.emit("destroy"), null === (t2 = this.abortController) || void 0 === t2 || t2.abort(), this.plugins.forEach(((t3) => t3.destroy())), this.subscriptions.forEach(((t3) => t3())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t3) => t3())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
E.BasePlugin = class extends e$1 {
  constructor(t2) {
    super(), this.subscriptions = [], this.isDestroyed = false, this.options = t2;
  }
  onInit() {
  }
  _init(t2) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = false), this.wavesurfer = t2, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((t2) => t2())), this.subscriptions = [], this.isDestroyed = true, this.wavesurfer = void 0;
  }
}, E.dom = r$1;
class t {
  constructor() {
    this.listeners = {};
  }
  on(t2, e3, i2) {
    if (this.listeners[t2] || (this.listeners[t2] = /* @__PURE__ */ new Set()), null == i2 ? void 0 : i2.once) {
      const i3 = (...n2) => {
        this.un(t2, i3), e3(...n2);
      };
      return this.listeners[t2].add(i3), () => this.un(t2, i3);
    }
    return this.listeners[t2].add(e3), () => this.un(t2, e3);
  }
  un(t2, e3) {
    var i2;
    null === (i2 = this.listeners[t2]) || void 0 === i2 || i2.delete(e3);
  }
  once(t2, e3) {
    return this.on(t2, e3, { once: true });
  }
  unAll() {
    this.listeners = {};
  }
  emit(t2, ...e3) {
    this.listeners[t2] && this.listeners[t2].forEach(((t3) => t3(...e3)));
  }
}
class e2 extends t {
  constructor(t2) {
    super(), this.subscriptions = [], this.isDestroyed = false, this.options = t2;
  }
  onInit() {
  }
  _init(t2) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = false), this.wavesurfer = t2, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((t2) => t2())), this.subscriptions = [], this.isDestroyed = true, this.wavesurfer = void 0;
  }
}
function i(t2, e3) {
  const n2 = e3.xmlns ? document.createElementNS(e3.xmlns, t2) : document.createElement(t2);
  for (const [t3, s2] of Object.entries(e3)) if ("children" === t3 && s2) for (const [t4, e4] of Object.entries(s2)) e4 instanceof Node ? n2.appendChild(e4) : "string" == typeof e4 ? n2.appendChild(document.createTextNode(e4)) : n2.appendChild(i(t4, e4));
  else "style" === t3 ? Object.assign(n2.style, s2) : "textContent" === t3 ? n2.textContent = s2 : n2.setAttribute(t3, s2.toString());
  return n2;
}
function n(t2, e3, n2) {
  const s2 = i(t2, e3 || {});
  return null == n2 || n2.appendChild(s2), s2;
}
function s(t2) {
  let e3 = t2;
  const i2 = /* @__PURE__ */ new Set();
  return { get value() {
    return e3;
  }, set(t3) {
    Object.is(e3, t3) || (e3 = t3, i2.forEach(((t4) => t4(e3))));
  }, update(t3) {
    this.set(t3(e3));
  }, subscribe: (t3) => (i2.add(t3), () => i2.delete(t3)) };
}
function r(t2, e3) {
  let i2;
  const n2 = () => {
    i2 && (i2(), i2 = void 0), i2 = t2();
  }, s2 = e3.map(((t3) => t3.subscribe(n2)));
  return n2(), () => {
    i2 && (i2(), i2 = void 0), s2.forEach(((t3) => t3()));
  };
}
function o(t2, e3) {
  const i2 = s(null), n2 = (t3) => {
    i2.set(t3);
  };
  return t2.addEventListener(e3, n2), i2._cleanup = () => {
    t2.removeEventListener(e3, n2);
  }, i2;
}
function l(t2) {
  const e3 = t2._cleanup;
  "function" == typeof e3 && e3();
}
function h(t2, e3 = {}) {
  const { threshold: i2 = 3, mouseButton: n2 = 0, touchDelay: r2 = 100 } = e3, o2 = s(null), h2 = /* @__PURE__ */ new Map(), a2 = matchMedia("(pointer: coarse)").matches;
  let d2 = () => {
  };
  const c2 = (e4) => {
    if (e4.button !== n2) return;
    if (h2.set(e4.pointerId, e4), h2.size > 1) return;
    let s2 = e4.clientX, l2 = e4.clientY, c3 = false;
    const u2 = Date.now(), v2 = t2.getBoundingClientRect(), { left: p2, top: g2 } = v2, m2 = (t3) => {
      if (t3.defaultPrevented || h2.size > 1) return;
      if (a2 && Date.now() - u2 < r2) return;
      const e5 = t3.clientX, n3 = t3.clientY, d3 = e5 - s2, v3 = n3 - l2;
      (c3 || Math.abs(d3) > i2 || Math.abs(v3) > i2) && (t3.preventDefault(), t3.stopPropagation(), c3 || (o2.set({ type: "start", x: s2 - p2, y: l2 - g2 }), c3 = true), o2.set({ type: "move", x: e5 - p2, y: n3 - g2, deltaX: d3, deltaY: v3 }), s2 = e5, l2 = n3);
    }, f2 = (t3) => {
      if (h2.delete(t3.pointerId), c3) {
        const e5 = t3.clientX, i3 = t3.clientY;
        o2.set({ type: "end", x: e5 - p2, y: i3 - g2 });
      }
      d2();
    }, b2 = (t3) => {
      h2.delete(t3.pointerId), t3.relatedTarget && t3.relatedTarget !== document.documentElement || f2(t3);
    }, E2 = (t3) => {
      c3 && (t3.stopPropagation(), t3.preventDefault());
    }, C2 = (t3) => {
      t3.defaultPrevented || h2.size > 1 || c3 && t3.preventDefault();
    };
    document.addEventListener("pointermove", m2), document.addEventListener("pointerup", f2), document.addEventListener("pointerout", b2), document.addEventListener("pointercancel", b2), document.addEventListener("touchmove", C2, { passive: false }), document.addEventListener("click", E2, { capture: true }), d2 = () => {
      document.removeEventListener("pointermove", m2), document.removeEventListener("pointerup", f2), document.removeEventListener("pointerout", b2), document.removeEventListener("pointercancel", b2), document.removeEventListener("touchmove", C2), setTimeout((() => {
        document.removeEventListener("click", E2, { capture: true });
      }), 10);
    };
  };
  t2.addEventListener("pointerdown", c2);
  return { signal: o2, cleanup: () => {
    d2(), t2.removeEventListener("pointerdown", c2), h2.clear(), l(o2);
  } };
}
class a extends t {
  constructor(t2, e3, i2 = 0) {
    var n2, s2, r2, o2, l2, h2, a2, d2, c2, u2;
    super(), this.totalDuration = e3, this.numberOfChannels = i2, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = false, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = false, this.subscriptions = [], this.id = t2.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(t2.start), this.end = this.clampPosition(null !== (n2 = t2.end) && void 0 !== n2 ? n2 : t2.start), this.drag = null === (s2 = t2.drag) || void 0 === s2 || s2, this.resize = null === (r2 = t2.resize) || void 0 === r2 || r2, this.resizeStart = null === (o2 = t2.resizeStart) || void 0 === o2 || o2, this.resizeEnd = null === (l2 = t2.resizeEnd) || void 0 === l2 || l2, this.color = null !== (h2 = t2.color) && void 0 !== h2 ? h2 : "rgba(0, 0, 0, 0.1)", this.minLength = null !== (a2 = t2.minLength) && void 0 !== a2 ? a2 : this.minLength, this.maxLength = null !== (d2 = t2.maxLength) && void 0 !== d2 ? d2 : this.maxLength, this.channelIdx = null !== (c2 = t2.channelIdx) && void 0 !== c2 ? c2 : -1, this.contentEditable = null !== (u2 = t2.contentEditable) && void 0 !== u2 ? u2 : this.contentEditable, this.element = this.initElement(), this.setContent(t2.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
  }
  clampPosition(t2) {
    return Math.max(0, Math.min(this.totalDuration, t2));
  }
  setPart() {
    var t2;
    const e3 = this.start === this.end;
    null === (t2 = this.element) || void 0 === t2 || t2.setAttribute("part", `${e3 ? "marker" : "region"} ${this.id}`);
  }
  addResizeHandles(t2) {
    const e3 = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i2 = n("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, e3), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, t2), s2 = n("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, e3), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, t2), o2 = h(i2, { threshold: 1 }), l2 = h(s2, { threshold: 1 }), a2 = r((() => {
      const t3 = o2.signal.value;
      t3 && ("move" === t3.type && void 0 !== t3.deltaX ? this.onResize(t3.deltaX, "start") : "end" === t3.type && this.onEndResizing("start"));
    }), [o2.signal]), d2 = r((() => {
      const t3 = l2.signal.value;
      t3 && ("move" === t3.type && void 0 !== t3.deltaX ? this.onResize(t3.deltaX, "end") : "end" === t3.type && this.onEndResizing("end"));
    }), [l2.signal]);
    this.subscriptions.push((() => {
      a2(), d2(), o2.cleanup(), l2.cleanup();
    }));
  }
  removeResizeHandles(t2) {
    const e3 = t2.querySelector('[part*="region-handle-left"]'), i2 = t2.querySelector('[part*="region-handle-right"]');
    e3 && t2.removeChild(e3), i2 && t2.removeChild(i2);
  }
  initElement() {
    if (this.isRemoved) return null;
    const t2 = this.start === this.end;
    let e3 = 0, i2 = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (i2 = 100 / this.numberOfChannels, e3 = i2 * this.channelIdx);
    const s2 = n("div", { style: { position: "absolute", top: `${e3}%`, height: `${i2}%`, backgroundColor: t2 ? "none" : this.color, borderLeft: t2 ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !t2 && this.resize && this.addResizeHandles(s2), s2;
  }
  renderPosition() {
    if (!this.element) return;
    const t2 = this.start / this.totalDuration, e3 = (this.totalDuration - this.end) / this.totalDuration;
    this.element.style.left = 100 * t2 + "%", this.element.style.right = 100 * e3 + "%";
  }
  toggleCursor(t2) {
    var e3;
    this.drag && (null === (e3 = this.element) || void 0 === e3 ? void 0 : e3.style) && (this.element.style.cursor = t2 ? "grabbing" : "grab");
  }
  initMouseEvents() {
    const { element: t2 } = this;
    if (!t2) return;
    const e3 = o(t2, "click"), i2 = o(t2, "mouseenter"), n2 = o(t2, "mouseleave"), s2 = o(t2, "dblclick"), a2 = o(t2, "pointerdown"), d2 = o(t2, "pointerup"), c2 = e3.subscribe(((t3) => t3 && this.emit("click", t3))), u2 = i2.subscribe(((t3) => t3 && this.emit("over", t3))), v2 = n2.subscribe(((t3) => t3 && this.emit("leave", t3))), p2 = s2.subscribe(((t3) => t3 && this.emit("dblclick", t3))), g2 = a2.subscribe(((t3) => t3 && this.toggleCursor(true))), m2 = d2.subscribe(((t3) => t3 && this.toggleCursor(false)));
    this.subscriptions.push((() => {
      c2(), u2(), v2(), p2(), g2(), m2(), l(e3), l(i2), l(n2), l(s2), l(a2), l(d2);
    }));
    const f2 = h(t2), b2 = r((() => {
      const t3 = f2.signal.value;
      t3 && ("start" === t3.type ? this.toggleCursor(true) : "move" === t3.type && void 0 !== t3.deltaX ? this.onMove(t3.deltaX) : "end" === t3.type && (this.toggleCursor(false), this.drag && this.emit("update-end")));
    }), [f2.signal]);
    this.subscriptions.push((() => {
      b2(), f2.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (t3) => this.onContentClick(t3), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(t2, e3, i2) {
    var n2;
    if (!(null === (n2 = this.element) || void 0 === n2 ? void 0 : n2.parentElement)) return;
    const { width: s2 } = this.element.parentElement.getBoundingClientRect(), r2 = t2 / s2 * this.totalDuration;
    let o2 = e3 && "start" !== e3 ? this.start : this.start + r2, l2 = e3 && "end" !== e3 ? this.end : this.end + r2;
    const h2 = void 0 !== i2;
    h2 && this.updatingSide && this.updatingSide !== e3 && ("start" === this.updatingSide ? o2 = i2 : l2 = i2), o2 = Math.max(0, o2), l2 = Math.min(this.totalDuration, l2);
    const a2 = l2 - o2;
    this.updatingSide = e3;
    const d2 = a2 >= this.minLength && a2 <= this.maxLength;
    o2 <= l2 && (d2 || h2) && (this.start = o2, this.end = l2, this.renderPosition(), this.emit("update", e3));
  }
  onMove(t2) {
    this.drag && this._onUpdate(t2);
  }
  onResize(t2, e3) {
    this.resize && (this.resizeStart || "start" !== e3) && (this.resizeEnd || "end" !== e3) && this._onUpdate(t2, e3);
  }
  onEndResizing(t2) {
    this.resize && (this.emit("update-end", t2), this.updatingSide = void 0);
  }
  onContentClick(t2) {
    t2.stopPropagation();
    t2.target.focus(), this.emit("click", t2);
  }
  onContentBlur() {
    this.emit("update-end");
  }
  _setTotalDuration(t2) {
    this.totalDuration = t2, this.renderPosition();
  }
  play(t2) {
    this.emit("play", t2 && this.end !== this.start ? this.end : void 0);
  }
  getContent(t2 = false) {
    var e3;
    return t2 ? this.content || void 0 : this.element instanceof HTMLElement ? (null === (e3 = this.content) || void 0 === e3 ? void 0 : e3.innerHTML) || void 0 : "";
  }
  setContent(t2) {
    var e3;
    if (this.element) if (this.content && this.contentEditable && (this.contentClickListener && this.content.removeEventListener("click", this.contentClickListener), this.contentBlurListener && this.content.removeEventListener("blur", this.contentBlurListener)), null === (e3 = this.content) || void 0 === e3 || e3.remove(), t2) {
      if ("string" == typeof t2) {
        const e4 = this.start === this.end;
        this.content = n("div", { style: { padding: `0.2em ${e4 ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: t2 });
      } else this.content = t2;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (t3) => this.onContentClick(t3), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(t2) {
    var e3, i2;
    if (this.element) {
      if (t2.color && (this.color = t2.color, this.element.style.backgroundColor = this.color), void 0 !== t2.drag && (this.drag = t2.drag, this.element.style.cursor = this.drag ? "grab" : "default"), void 0 !== t2.start || void 0 !== t2.end) {
        const n2 = this.start === this.end;
        this.start = this.clampPosition(null !== (e3 = t2.start) && void 0 !== e3 ? e3 : this.start), this.end = this.clampPosition(null !== (i2 = t2.end) && void 0 !== i2 ? i2 : n2 ? this.start : this.end), this.renderPosition(), this.setPart(), this.emit("render");
      }
      if (t2.content && this.setContent(t2.content), t2.id && (this.id = t2.id, this.setPart()), void 0 !== t2.resize && t2.resize !== this.resize) {
        const e4 = this.start === this.end;
        this.resize = t2.resize, this.resize && !e4 ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      void 0 !== t2.resizeStart && (this.resizeStart = t2.resizeStart), void 0 !== t2.resizeEnd && (this.resizeEnd = t2.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = true, this.emit("remove"), this.subscriptions.forEach(((t2) => t2())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
}
class d extends e2 {
  constructor(t2) {
    super(t2), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(t2) {
    return new d(t2);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t3) => {
      this.regions.forEach(((e3) => e3._setTotalDuration(t3)));
    })));
    let t2 = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((e3) => {
      const i2 = this.regions.filter(((t3) => t3.start <= e3 && (t3.end === t3.start ? t3.start + 0.05 : t3.end) >= e3));
      i2.forEach(((e4) => {
        t2.includes(e4) || this.emit("region-in", e4);
      })), t2.forEach(((t3) => {
        i2.includes(t3) || this.emit("region-out", t3);
      })), t2 = i2;
    })));
  }
  initRegionsContainer() {
    return n("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(t2) {
    t2.content && !t2.isRemoved && setTimeout((() => {
      const e3 = t2.content, i2 = e3.getBoundingClientRect(), n2 = this.regions.indexOf(t2), s2 = this.regions.slice(0, n2).filter(((t3) => !t3.isRemoved)).map(((e4) => {
        if (e4 === t2 || !e4.content) return 0;
        const n3 = e4.content.getBoundingClientRect();
        return i2.left < n3.left + n3.width && n3.left < i2.left + i2.width ? n3.height + 2 : 0;
      })).reduce(((t3, e4) => t3 + e4), 0);
      e3.style.marginTop = `${s2}px`;
    }), 10);
  }
  adjustScroll(t2) {
    var e3, i2;
    if (!t2.element) return;
    const n2 = null === (i2 = null === (e3 = this.wavesurfer) || void 0 === e3 ? void 0 : e3.getWrapper()) || void 0 === i2 ? void 0 : i2.parentElement;
    if (!n2) return;
    const { clientWidth: s2, scrollWidth: r2 } = n2;
    if (r2 <= s2) return;
    const o2 = n2.getBoundingClientRect(), l2 = t2.element.getBoundingClientRect(), h2 = l2.left - o2.left, a2 = l2.right - o2.left;
    h2 < 0 ? n2.scrollLeft += h2 : a2 > s2 && (n2.scrollLeft += a2 - s2);
  }
  virtualAppend(t2, e3, i2) {
    const n2 = () => {
      if (!this.wavesurfer) return;
      const n3 = this.wavesurfer.getWidth(), s2 = this.wavesurfer.getScroll(), r2 = e3.clientWidth, o2 = this.wavesurfer.getDuration(), l2 = Math.round(t2.start / o2 * r2), h2 = l2 + (Math.round((t2.end - t2.start) / o2 * r2) || 1) > s2 && l2 < s2 + n3;
      h2 && !i2.parentElement ? e3.appendChild(i2) : !h2 && i2.parentElement && i2.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !t2.element) return;
      n2();
      const e4 = this.wavesurfer.on("scroll", n2), i3 = this.wavesurfer.on("zoom", n2), s2 = this.wavesurfer.on("resize", n2), r2 = t2.on("render", n2);
      this.subscriptions.push(e4, i3, s2, r2), t2.once("remove", (() => {
        e4(), i3(), s2(), r2();
      }));
    }), 0);
  }
  saveRegion(t2) {
    if (!t2.element) return;
    this.virtualAppend(t2, this.regionsContainer, t2.element), this.avoidOverlapping(t2), this.regions.push(t2);
    const e3 = [t2.on("update", ((e4) => {
      e4 || this.adjustScroll(t2), this.emit("region-update", t2, e4);
    })), t2.on("update-end", ((e4) => {
      this.avoidOverlapping(t2), this.emit("region-updated", t2, e4);
    })), t2.on("play", ((e4) => {
      var i2;
      null === (i2 = this.wavesurfer) || void 0 === i2 || i2.play(t2.start, e4);
    })), t2.on("click", ((e4) => {
      this.emit("region-clicked", t2, e4);
    })), t2.on("dblclick", ((e4) => {
      this.emit("region-double-clicked", t2, e4);
    })), t2.on("content-changed", (() => {
      this.emit("region-content-changed", t2);
    })), t2.once("remove", (() => {
      e3.forEach(((t3) => t3())), this.regions = this.regions.filter(((e4) => e4 !== t2)), this.emit("region-removed", t2);
    }))];
    this.subscriptions.push(...e3), this.emit("region-created", t2);
  }
  addRegion(t2) {
    var e3, i2;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const n2 = this.wavesurfer.getDuration(), s2 = null === (i2 = null === (e3 = this.wavesurfer) || void 0 === e3 ? void 0 : e3.getDecodedData()) || void 0 === i2 ? void 0 : i2.numberOfChannels, r2 = new a(t2, n2, s2);
    return this.emit("region-initialized", r2), n2 ? this.saveRegion(r2) : this.subscriptions.push(this.wavesurfer.once("ready", ((t3) => {
      r2._setTotalDuration(t3), this.saveRegion(r2);
    }))), r2;
  }
  enableDragSelection(t2, e3 = 3) {
    var i2;
    const n2 = null === (i2 = this.wavesurfer) || void 0 === i2 ? void 0 : i2.getWrapper();
    if (!(n2 && n2 instanceof HTMLElement)) return () => {
    };
    let s2 = null, o2 = 0, l2 = 0;
    const d2 = h(n2, { threshold: e3 }), c2 = r((() => {
      var e4, i3;
      const n3 = d2.signal.value;
      if (n3) if ("start" === n3.type) {
        if (o2 = n3.x, !this.wavesurfer) return;
        const r2 = this.wavesurfer.getDuration(), h2 = null === (i3 = null === (e4 = this.wavesurfer) || void 0 === e4 ? void 0 : e4.getDecodedData()) || void 0 === i3 ? void 0 : i3.numberOfChannels, { width: d3 } = this.wavesurfer.getWrapper().getBoundingClientRect();
        l2 = o2 / d3 * r2;
        const c3 = n3.x / d3 * r2, u2 = (n3.x + 5) / d3 * r2;
        s2 = new a(Object.assign(Object.assign({}, t2), { start: c3, end: u2 }), r2, h2), this.emit("region-initialized", s2), s2.element && this.regionsContainer.appendChild(s2.element);
      } else "move" === n3.type && void 0 !== n3.deltaX ? s2 && s2._onUpdate(n3.deltaX, n3.x > o2 ? "end" : "start", l2) : "end" === n3.type && s2 && (this.saveRegion(s2), s2.updatingSide = void 0, s2 = null);
    }), [d2.signal]);
    return () => {
      c2(), d2.cleanup();
    };
  }
  clearRegions() {
    this.regions.slice().forEach(((t2) => t2.remove())), this.regions = [];
  }
  destroy() {
    this.clearRegions(), super.destroy(), this.regionsContainer.remove();
  }
}
export {
  E,
  d
};
