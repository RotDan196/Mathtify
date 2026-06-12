import { g as getDefaultExportFromCjs } from "./react.mjs";
var dist;
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  var defaultEscapes = {
    "{": "\\{",
    "}": "\\}",
    "\\": "\\textbackslash{}",
    "#": "\\#",
    $: "\\$",
    "%": "\\%",
    "&": "\\&",
    "^": "\\textasciicircum{}",
    _: "\\_",
    "~": "\\textasciitilde{}"
  };
  var formatEscapes = {
    "–": "\\--",
    "—": "\\---",
    " ": "~",
    "	": "\\qquad{}",
    "\r\n": "\\newline{}",
    "\n": "\\newline{}"
  };
  var defaultEscapeMapFn = function defaultEscapeMapFn2(defaultEscapes2, formatEscapes2) {
    return _extends({}, defaultEscapes2, formatEscapes2);
  };
  dist = function(str) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$preserveFormatti = _ref.preserveFormatting, preserveFormatting = _ref$preserveFormatti === void 0 ? false : _ref$preserveFormatti, _ref$escapeMapFn = _ref.escapeMapFn, escapeMapFn = _ref$escapeMapFn === void 0 ? defaultEscapeMapFn : _ref$escapeMapFn;
    var runningStr = String(str);
    var result = "";
    var escapes = escapeMapFn(_extends({}, defaultEscapes), preserveFormatting ? _extends({}, formatEscapes) : {});
    var escapeKeys = Object.keys(escapes);
    var _loop = function _loop2() {
      var specialCharFound = false;
      escapeKeys.forEach(function(key, index) {
        if (specialCharFound) {
          return;
        }
        if (runningStr.length >= key.length && runningStr.slice(0, key.length) === key) {
          result += escapes[escapeKeys[index]];
          runningStr = runningStr.slice(key.length, runningStr.length);
          specialCharFound = true;
        }
      });
      if (!specialCharFound) {
        result += runningStr.slice(0, 1);
        runningStr = runningStr.slice(1, runningStr.length);
      }
    };
    while (runningStr) {
      _loop();
    }
    return result;
  };
  return dist;
}
var distExports = requireDist();
const escapeLatexLib = /* @__PURE__ */ getDefaultExportFromCjs(distExports);
export {
  escapeLatexLib as e
};
