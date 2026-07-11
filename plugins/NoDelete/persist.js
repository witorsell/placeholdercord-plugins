import { storage } from "@vendetta/plugin";
import { findByStoreName } from "@vendetta/metro";
import { DEFAULT_MAX, matchesSearch, evict, serialize } from "./persist.helpers.mjs";

export { DEFAULT_MAX, matchesSearch, evict, serialize };

export function saveDeleted(message, channelId) {
	try {
		if (storage.savePersistent === false) return;
		if (!Array.isArray(storage.saved)) storage.saved = [];
		if (storage.saved.some((r) => r.id === message.id)) return;

		let channelName = channelId;
		let guildId = null;
		try {
			const ChannelStore = findByStoreName("ChannelStore");
			const chan = ChannelStore?.getChannel?.(channelId);
			channelName = chan?.name ?? channelId;
			guildId = chan?.guild_id ?? null;
		} catch (_) { /* best effort */ }

		// The message author object often lacks the global display name and avatar hash.
		// Resolve the full user record so we store the display name, @handle, and pfp.
		let author = message.author ?? {};
		try {
			const UserStore = findByStoreName("UserStore");
			const full = UserStore?.getUser?.(author.id);
			if (full) author = {
				...author,
				username: full.username ?? author.username,
				globalName: full.globalName ?? full.global_name ?? author.globalName ?? null,
				avatar: full.avatar ?? author.avatar,
			};
		} catch (_) { /* best effort */ }

		storage.saved.push(serialize({ ...message, author }, channelId, channelName, guildId));
		evict(storage.saved, storage.maxSaved ?? DEFAULT_MAX);
	} catch (e) {
		console.error("[NoDelete] saveDeleted failed", e);
	}
}
