export const DEFAULT_MAX = 5000;

export function matchesSearch(record, query) {
	if (!query) return true;
	const q = String(query).toLowerCase();
	return (
		(record.id && String(record.id).toLowerCase().includes(q)) ||
		(record.author?.id && String(record.author.id).toLowerCase().includes(q)) ||
		(record.author?.username && String(record.author.username).toLowerCase().includes(q)) ||
		(record.content && String(record.content).toLowerCase().includes(q))
	) || false;
}

export function evict(saved, cap) {
	while (saved.length > cap) {
		const idx = saved.findIndex((r) => !r.locked);
		if (idx === -1) break; // everything left is locked
		saved.splice(idx, 1);
	}
	return saved;
}

export function serialize(message, channelId, channelName, guildId) {
	const attachments = [];
	for (const a of message.attachments ?? []) if (a?.url) attachments.push(a.url);
	for (const e of message.embeds ?? []) {
		const u = e?.image?.url ?? e?.thumbnail?.url;
		if (u) attachments.push(u);
	}
	const author = message.author ?? {};
	return {
		id: message.id,
		channelId,
		channelName: channelName ?? channelId ?? "",
		guildId: guildId ?? null,
		author: {
			id: author.id ?? "",
			username: author.username ?? "unknown",
			globalName: author.globalName ?? author.global_name ?? null,
			avatarUrl: author.avatar ? `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=64` : null,
		},
		content: message.content ?? "",
		timestamp: Date.now(),
		attachments,
		locked: false,
	};
}
