/* Minimal subset of meqativ/dumsane common used by this plugin.
 * Ensures the properties from "defaults" exist on "object" (recursively).
 */
export function makeDefaults(object, defaults) {
	if (object === undefined) throw new Error("No object passed to make defaults for");
	if (defaults === undefined) throw new Error("No defaults object passed to make defaults off of");

	for (const key in defaults) {
		if (typeof defaults[key] === "object" && !Array.isArray(defaults?.[key])) {
			if (typeof object?.[key] !== "object") object[key] = {};
			makeDefaults(object[key], defaults[key]);
		} else {
			object[key] ??= defaults[key];
		}
	}
	return object;
}
