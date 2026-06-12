var isUnix;
var hasRequiredIsUnix;
function requireIsUnix() {
  if (hasRequiredIsUnix) return isUnix;
  hasRequiredIsUnix = 1;
  isUnix = (platform = "") => {
    platform = platform.toLowerCase();
    return [
      "aix",
      "android",
      "darwin",
      "freebsd",
      "linux",
      "openbsd",
      "sunos"
    ].indexOf(platform) !== -1;
  };
  return isUnix;
}
export {
  requireIsUnix as r
};
