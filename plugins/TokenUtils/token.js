// Pure helpers. Discord 352.17 still has getToken, but the caller has to
// accept "nothing" without destructuring it. Hermes throws
// "Cannot convert undefined value to object" on `const { x } = undefined`.

export function firstToken(candidates) {
    for (var i = 0; i < candidates.length; i++) {
        var value = candidates[i];
        if (typeof value === "string" && value.length > 0) return value;
    }
    return null;
}

export function optionValue(args, name) {
    if (!args || !args.length) return "";
    for (var i = 0; i < args.length; i++) {
        var opt = args[i];
        if (!opt || opt.name !== name) continue;
        if (opt.value == null || opt.value === "") continue;
        return String(opt.value);
    }
    return "";
}

// TokenManager.getToken(id): a missing id returns the primary token.
// A passed id indexes the multi-account map. Never pass a dummy id.
export function callTokenGetter(fn, self) {
    if (typeof fn !== "function") return undefined;
    try {
        return fn.call(self);
    } catch (e) {
        return undefined;
    }
}
