import { g as getDefaultExportFromCjs } from "./react.mjs";
var naturalSort$1;
var hasRequiredNaturalSort;
function requireNaturalSort() {
  if (hasRequiredNaturalSort) return naturalSort$1;
  hasRequiredNaturalSort = 1;
  naturalSort$1 = function naturalSort2(a, b) {
    var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi, sre = /(^[ ]*|[ ]*$)/g, dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/, hre = /^0x[0-9a-f]+$/i, ore = /^0/, i = function(s) {
      return naturalSort2.insensitive && ("" + s).toLowerCase() || "" + s;
    }, x = i(a).replace(sre, "") || "", y = i(b).replace(sre, "") || "", xN = x.replace(re, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"), yN = y.replace(re, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"), xD = parseInt(x.match(hre), 16) || xN.length !== 1 && x.match(dre) && Date.parse(x), yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null, oFxNcL, oFyNcL;
    if (yD) {
      if (xD < yD) {
        return -1;
      } else if (xD > yD) {
        return 1;
      }
    }
    for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
      oFxNcL = !(xN[cLoc] || "").match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
      oFyNcL = !(yN[cLoc] || "").match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
        return isNaN(oFxNcL) ? 1 : -1;
      } else if (typeof oFxNcL !== typeof oFyNcL) {
        oFxNcL += "";
        oFyNcL += "";
      }
      if (oFxNcL < oFyNcL) {
        return -1;
      }
      if (oFxNcL > oFyNcL) {
        return 1;
      }
    }
    return 0;
  };
  return naturalSort$1;
}
var naturalSortExports = requireNaturalSort();
const naturalSort = /* @__PURE__ */ getDefaultExportFromCjs(naturalSortExports);
export {
  naturalSort as n
};
