import _Object$keys from "babel-runtime/core-js/object/keys";
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelCase(str) {
    return str.replace(/-([a-z])/gi, function (s, c, i) {
        return 0 === i ? c : c.toUpperCase();
    });
}

export function camelCaseKeys(src) {
    if (!src) return {};
    var dest = {};
    var keys = _Object$keys(src);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        dest[camelCase(key)] = src[key];
    }
    return dest;
}