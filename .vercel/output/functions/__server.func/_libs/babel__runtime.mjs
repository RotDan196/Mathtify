import { g as getDefaultExportFromCjs } from "./react.mjs";
var _extends$1 = { exports: {} };
var hasRequired_extends;
function require_extends() {
  if (hasRequired_extends) return _extends$1.exports;
  hasRequired_extends = 1;
  (function(module) {
    function _extends2() {
      return module.exports = _extends2 = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends2.apply(null, arguments);
    }
    module.exports = _extends2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(_extends$1);
  return _extends$1.exports;
}
var _extendsExports = require_extends();
const _extends = /* @__PURE__ */ getDefaultExportFromCjs(_extendsExports);
var defineProperty = { exports: {} };
var toPropertyKey = { exports: {} };
var _typeof = { exports: {} };
var hasRequired_typeof;
function require_typeof() {
  if (hasRequired_typeof) return _typeof.exports;
  hasRequired_typeof = 1;
  (function(module) {
    function _typeof2(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof2(o);
    }
    module.exports = _typeof2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(_typeof);
  return _typeof.exports;
}
var toPrimitive = { exports: {} };
var hasRequiredToPrimitive;
function requireToPrimitive() {
  if (hasRequiredToPrimitive) return toPrimitive.exports;
  hasRequiredToPrimitive = 1;
  (function(module) {
    var _typeof2 = require_typeof()["default"];
    function toPrimitive2(t, r) {
      if ("object" != _typeof2(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof2(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    module.exports = toPrimitive2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(toPrimitive);
  return toPrimitive.exports;
}
var hasRequiredToPropertyKey;
function requireToPropertyKey() {
  if (hasRequiredToPropertyKey) return toPropertyKey.exports;
  hasRequiredToPropertyKey = 1;
  (function(module) {
    var _typeof2 = require_typeof()["default"];
    var toPrimitive2 = requireToPrimitive();
    function toPropertyKey2(t) {
      var i = toPrimitive2(t, "string");
      return "symbol" == _typeof2(i) ? i : i + "";
    }
    module.exports = toPropertyKey2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(toPropertyKey);
  return toPropertyKey.exports;
}
var hasRequiredDefineProperty;
function requireDefineProperty() {
  if (hasRequiredDefineProperty) return defineProperty.exports;
  hasRequiredDefineProperty = 1;
  (function(module) {
    var toPropertyKey2 = requireToPropertyKey();
    function _defineProperty2(e, r, t) {
      return (r = toPropertyKey2(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(defineProperty);
  return defineProperty.exports;
}
var definePropertyExports = requireDefineProperty();
const _defineProperty = /* @__PURE__ */ getDefaultExportFromCjs(definePropertyExports);
export {
  _extends as _,
  _defineProperty as a
};
