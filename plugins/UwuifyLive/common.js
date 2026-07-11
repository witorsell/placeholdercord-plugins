/* Minimal subset of meqativ/dumsane common used by this plugin. */
import { findByProps, findByStoreName } from "@vendetta/metro";

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

export function cmdDisplays(obj, translations, locale) {
	if (!obj?.name || !obj?.description) throw new Error(`No name(${obj?.name}) or description(${obj?.description}) in the passed command`);
	obj.displayName ??= translations?.names?.[locale] ?? obj.name;
	obj.displayDescription ??= translations?.names?.[locale] ?? obj.description;
	if (obj.options) {
		for (let i = 0; i < obj.options.length; i++) {
			const option = obj.options[i];
			option.displayName ??= translations?.options?.[i]?.names?.[locale] ?? option.name;
			option.displayDescription ??= translations?.options?.[i]?.descriptions?.[locale] ?? option.description;
			if (option?.choices) {
				for (let c = 0; c < option.choices.length; c++) {
					const choice = option.choices[c];
					choice.displayName ??= translations?.options?.[i]?.choices?.[c]?.names?.[locale] ?? choice.name;
				}
			}
		}
	}
	return obj;
}

export function resolvePath(obj, path) {
	const keys = path.split(".");
	let current = obj;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (current === null || typeof current !== "object") throw new Error(`Cannot resolve key "${key}" because the previous property is not an object.`);
		if (!(key in current)) throw new Error(`Key "${key}" was not found in the path.`);
		if (i === keys.length - 1) return { parent: current, key };
		current = current[key];
	}
}
export function getValueAtPath(obj, path) {
	const { parent, key } = resolvePath(obj, path);
	return parent[key];
}
export function setValueAtPath(obj, path, value) {
	const { parent, key } = resolvePath(obj, path);
	parent[key] = value;
	return obj;
}

let _sel, _msg;
export function sendTextMessage(channel, message, ephemeral) {
	_sel ??= findByStoreName("SelectedChannelStore");
	_msg ??= findByProps("sendBotMessage");
	if (channel === "currentChannel") channel = _sel.getChannelId();
	if (typeof message !== "string") {
		message = message?.content;
		if (!message) throw new Error("No text to send");
	}
	if (ephemeral) return _msg.sendBotMessage(channel, message);
	_msg.sendMessage(channel, { content: message, _command_output: true }, void 0, { nonce: Date.now().toString() });
}
