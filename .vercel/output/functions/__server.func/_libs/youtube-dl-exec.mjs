import { g as getDefaultExportFromCjs } from "./react.mjs";
import { r as requireDargs } from "./dargs.mjs";
import { r as requireSrc$1 } from "./tinyspawn.mjs";
import { r as requireIsUnix } from "./is-unix.mjs";
import require$$2 from "path";
var src = { exports: {} };
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const isUnix = requireIsUnix();
  const path = require$$2;
  const PLATFORM_WIN = "win32";
  const PLATFORM_UNIX = "unix";
  const YOUTUBE_DL_HOST = process.env.YOUTUBE_DL_HOST ?? "https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest";
  const YOUTUBE_DL_DIR = process.env.YOUTUBE_DL_DIR ?? path.join(__dirname, "..", "bin");
  const YOUTUBE_DL_PLATFORM = process.env.YOUTUBE_DL_PLATFORM ?? isUnix(process.platform) ? PLATFORM_UNIX : PLATFORM_WIN;
  const YOUTUBE_DL_FILENAME = process.env.YOUTUBE_DL_FILENAME || "yt-dlp";
  const YOUTUBE_DL_FILE = !YOUTUBE_DL_FILENAME.endsWith(".exe") && YOUTUBE_DL_PLATFORM === "win32" ? `${YOUTUBE_DL_FILENAME}.exe` : YOUTUBE_DL_FILENAME;
  const YOUTUBE_DL_PATH = path.join(YOUTUBE_DL_DIR, YOUTUBE_DL_FILE);
  const YOUTUBE_DL_SKIP_DOWNLOAD = process.env.YOUTUBE_DL_SKIP_DOWNLOAD;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  constants = {
    GITHUB_TOKEN,
    YOUTUBE_DL_DIR,
    YOUTUBE_DL_FILE,
    YOUTUBE_DL_FILENAME,
    YOUTUBE_DL_HOST,
    YOUTUBE_DL_PATH,
    YOUTUBE_DL_PLATFORM,
    YOUTUBE_DL_SKIP_DOWNLOAD
  };
  return constants;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  const dargs = requireDargs();
  const $ = requireSrc$1();
  const constants2 = requireConstants();
  const args = (flags = {}) => dargs(flags, { useEquals: false }).filter(Boolean);
  const isJSON = (str = "") => str.startsWith("{");
  const parse = ({ stdout, stderr, ...details }) => {
    if (details.exitCode === 0) {
      return isJSON(stdout) ? JSON.parse(stdout) : stdout;
    }
    throw Object.assign(new Error(stderr), { stderr, stdout }, details);
  };
  const create = (binaryPath) => {
    const needsQuoting = process.platform === "win32" && /\s/.test(binaryPath);
    const safeBinaryPath = needsQuoting ? `"${binaryPath}"` : binaryPath;
    const fn = (...args2) => fn.exec(...args2).then(parse).catch(parse);
    fn.exec = (url, flags, opts = {}) => {
      const fullArgs = [url].concat(args(flags));
      if (needsQuoting) opts.shell = true;
      return $(safeBinaryPath, fullArgs, opts);
    };
    return fn;
  };
  const update = (binaryPath = constants2.YOUTUBE_DL_PATH) => $(binaryPath, ["-U"]);
  const defaultInstance = create(constants2.YOUTUBE_DL_PATH);
  src.exports = defaultInstance;
  src.exports.youtubeDl = defaultInstance;
  src.exports.create = create;
  src.exports.update = update;
  src.exports.args = args;
  src.exports.isJSON = isJSON;
  src.exports.constants = constants2;
  return src.exports;
}
var srcExports = requireSrc();
const youtubedl = /* @__PURE__ */ getDefaultExportFromCjs(srcExports);
export {
  youtubedl as y
};
