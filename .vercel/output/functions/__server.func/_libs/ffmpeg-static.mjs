import require$$1 from "os";
import require$$2 from "path";
import { g as getDefaultExportFromCjs } from "./react.mjs";
var ffmpegStatic = { exports: {} };
const name = "ffmpeg-static";
const version = "5.3.0";
const description = "ffmpeg binaries for macOS, Linux and Windows";
const scripts = { "install": "node install.js", "prepublishOnly": "npm run install" };
const repository = { "type": "git", "url": "https://github.com/eugeneware/ffmpeg-static" };
const keywords = ["ffmpeg", "static", "binary", "binaries", "mac", "linux", "windows"];
const authors = ["Eugene Ware <eugene@noblesamurai.com>", "Jannis R <mail@jannisr.de>"];
const contributors = ["Thefrank (https://github.com/Thefrank)", "Emil Sivervik <emil@sivervik.com>"];
const license = "GPL-3.0-or-later";
const bugs = { "url": "https://github.com/eugeneware/ffmpeg-static/issues" };
const engines = { "node": ">=16" };
const dependencies = { "@derhuerst/http-basic": "^8.2.0", "env-paths": "^2.2.0", "https-proxy-agent": "^5.0.0", "progress": "^2.0.3" };
const devDependencies = { "any-shell-escape": "^0.1.1" };
const main = "index.js";
const files = ["index.js", "install.js", "example.js", "types"];
const types = "types/index.d.ts";
const require$$0 = {
  name,
  version,
  description,
  scripts,
  "ffmpeg-static": { "binary-path-env-var": "FFMPEG_BIN", "binary-release-tag-env-var": "FFMPEG_BINARY_RELEASE", "binary-release-tag": "b6.1.1", "binaries-url-env-var": "FFMPEG_BINARIES_URL", "executable-base-name": "ffmpeg" },
  repository,
  keywords,
  authors,
  contributors,
  license,
  bugs,
  engines,
  dependencies,
  devDependencies,
  main,
  files,
  types
};
var hasRequiredFfmpegStatic;
function requireFfmpegStatic() {
  if (hasRequiredFfmpegStatic) return ffmpegStatic.exports;
  hasRequiredFfmpegStatic = 1;
  const pkg = require$$0;
  const {
    "binary-path-env-var": BINARY_PATH_ENV_VAR,
    "executable-base-name": executableBaseName
  } = pkg[pkg.name];
  if (process.env[BINARY_PATH_ENV_VAR]) {
    ffmpegStatic.exports = process.env[BINARY_PATH_ENV_VAR];
  } else {
    var os = require$$1;
    var path = require$$2;
    var binaries = Object.assign(/* @__PURE__ */ Object.create(null), {
      darwin: ["x64", "arm64"],
      freebsd: ["x64"],
      linux: ["x64", "ia32", "arm64", "arm"],
      win32: ["x64", "ia32"]
    });
    var platform = process.env.npm_config_platform || os.platform();
    var arch = process.env.npm_config_arch || os.arch();
    let binaryPath = path.join(
      __dirname,
      executableBaseName + (platform === "win32" ? ".exe" : "")
    );
    if (!binaries[platform] || binaries[platform].indexOf(arch) === -1) {
      binaryPath = null;
    }
    ffmpegStatic.exports = binaryPath;
  }
  return ffmpegStatic.exports;
}
var ffmpegStaticExports = requireFfmpegStatic();
const ffmpegPath = /* @__PURE__ */ getDefaultExportFromCjs(ffmpegStaticExports);
export {
  ffmpegPath as f
};
