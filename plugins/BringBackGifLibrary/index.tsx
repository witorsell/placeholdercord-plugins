import { instead } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { plugin } from "@vendetta";

import Settings from "./settings";

interface GifLibItem {
    key: string;
    url: string;
    tags?: string[];
    slug?: string;
    shortKey?: string;
    // Optional dimensions, if the API ever returns them.
    w?: number;
    h?: number;
    isNsfwPlaceholder?: boolean;
    isHidden?: boolean;
}

interface GifsResponse {
    gifs?: GifLibItem[];
    total?: number;
    totalPages?: number;
    currentPage?: number;
}

const API = "https://giflibrary.site/api/gifs";
const PAGE = "https://giflibrary.site/gif";

// Tags that make bad category tiles (too generic, filenames, mentions).
const GENERIC_TAGS = new Set(["discord", "nsfw", "gif", "webp", "everyone", "here", "@everyone", "@here"]);

// The site dropped the old single nsfw=true/false flag for four independent category
// switches (suggestive, offensive, sexual, and a generic "other nsfw" catch-all still
// tagged "nsfw" server-side). A gif is only unlocked if every category it's tagged with
// is in this list, so this has to send the full set, not just one matching category.
const NSFW_STORAGE_KEYS = {
    suggestive: "nsfwSuggestive",
    offensive: "nsfwOffensive",
    sexual: "nsfwSexual",
    nsfw: "nsfwOther",
} as const;

const patches: (() => void)[] = [];

function enabledNsfwCategories() {
    return Object.entries(NSFW_STORAGE_KEYS)
        .filter(([, storageKey]) => plugin.storage[storageKey] !== false)
        .map(([category]) => category);
}

function apiUrl(q: string | undefined, page: number, limit: number) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (q) params.set("q", q);
    const categories = enabledNsfwCategories();
    if (categories.length) params.set("nsfw_categories", categories.join(","));
    return `${API}?${params.toString()}`;
}

function toDiscordGif(item: GifLibItem) {
    if (!item?.url || item.url.startsWith("data:")) return null; // skip placeholders
    const width = item.w || 200;
    const height = item.h || 200;
    const slug = item.slug || item.shortKey || item.key.replace(/\.[a-z0-9]+$/i, "");
    return {
        id: item.key,
        title: (item.tags || []).slice(0, 4).join(" "),
        // What gets inserted on select: the branded giflibrary.site page URL. It ends in .webp so
        // Discord treats it as media (embeds + favoritable), redirects the embed crawler to the raw
        // file, and opens a proper viewer page in a browser.
        url: `${PAGE}/${slug}.webp`,
        // Grid rendering uses the direct R2 file so tiles load without a redirect hop.
        src: item.url,
        gif_src: item.url,
        width,
        height,
        preview: item.url,
    };
}

async function fetchRaw(q: string | undefined, limit: number, page: number, signal?: AbortSignal): Promise<GifLibItem[]> {
    try {
        const r = await fetch(apiUrl(q, page, limit), { signal });
        if (!r.ok) return [];
        const data = await r.json() as GifsResponse;
        return data.gifs || [];
    } catch {
        return [];
    }
}

async function fetchGifs(q: string | undefined, limit: number, signal?: AbortSignal) {
    return (await fetchRaw(q, limit, 1, signal)).map(toDiscordGif).filter(Boolean);
}

async function loadCategories(signal?: AbortSignal) {
    const items = await fetchRaw("", 120, 1, signal);
    const tally = new Map<string, { count: number; src: string }>();
    for (const item of items) {
        if (!item.url || item.url.startsWith("data:")) continue;
        for (const raw of item.tags || []) {
            const tag = raw.toLowerCase().trim();
            if (tag.length < 2 || tag.includes(".") || tag.startsWith("@") || GENERIC_TAGS.has(tag)) continue;
            const entry = tally.get(tag);
            if (entry) entry.count++;
            else tally.set(tag, { count: 1, src: item.url });
        }
    }
    return [...tally.entries()]
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 12)
        .map(([name, v]) => ({ name, src: v.src }));
}

let lastSearchController: AbortController | null = null;
let lastTrendingController: AbortController | null = null;

export default {
    onLoad() {
        // One-time migration from the old single nsfw boolean to the four category
        // switches, so existing users keep whatever they already had (on by default).
        if (plugin.storage.nsfwSuggestive === undefined) {
            const legacy = plugin.storage.nsfw ?? true;
            plugin.storage.nsfwSuggestive = legacy;
            plugin.storage.nsfwOffensive = legacy;
            plugin.storage.nsfwSexual = legacy;
            plugin.storage.nsfwOther = legacy;
        }

        const httpModule = findByProps("HTTP", "get", "post", "put", "patch", "del");
        if (!httpModule?.HTTP) {
            console.warn("[BringBackGifLibrary] HTTP module not found, plugin disabled");
            return;
        }

        // Route the GIF picker's requests through the provider we intercept below.
        const ProviderConfig = findByProps("getProviderForAPIRequest");
        if (ProviderConfig) {
            patches.push(instead("getProviderForAPIRequest", ProviderConfig, () => "tenor"));
        }

        patches.push(
            instead("get", httpModule.HTTP, (args: any[], orig: Function) => {
                const opts = args[0];
                if (!opts?.url || typeof opts.url !== "string") return orig(...args);

                const url = opts.url.toLowerCase();
                const q = opts.query?.q;
                const limit = opts.query?.limit || 50;

                if (url.endsWith("/trending-search") || url.endsWith("/trending_search")) {
                    return Promise.resolve({ body: [] });
                }

                if (url.endsWith("/trending-gifs") || url.endsWith("/trending_gifs")) {
                    lastTrendingController?.abort();
                    const controller = new AbortController();
                    lastTrendingController = controller;
                    return fetchGifs("", limit, controller.signal)
                        .then(gifs => ({ body: gifs }))
                        .catch(() => ({ body: [] }));
                }

                if (url.endsWith("/search")) {
                    lastSearchController?.abort();
                    const controller = new AbortController();
                    lastSearchController = controller;
                    return fetchGifs(q || "", limit, controller.signal)
                        .then(gifs => ({ body: gifs }))
                        .catch(() => ({ body: [] }));
                }

                if (url.endsWith("/trending")) {
                    lastTrendingController?.abort();
                    const controller = new AbortController();
                    lastTrendingController = controller;
                    return Promise.all([
                        loadCategories(controller.signal),
                        fetchGifs("", 1, controller.signal),
                    ])
                        .then(([categories, gifs]) => ({
                            body: {
                                categories,
                                gifs: gifs.length ? gifs : [{ src: "" }],
                            },
                        }))
                        .catch(() => ({ body: { categories: [], gifs: [{ src: "" }] } }));
                }

                if (url.endsWith("/suggest")) {
                    if (!q) return orig(...args);
                    return fetchRaw(q, 20)
                        .then(items => {
                            const seen = new Set<string>();
                            const suggestions: string[] = [];
                            for (const item of items) {
                                for (const raw of item.tags || []) {
                                    const tag = raw.toLowerCase();
                                    if (tag.includes(q.toLowerCase()) && !seen.has(tag) && !tag.includes(".") && !tag.startsWith("@")) {
                                        seen.add(tag);
                                        suggestions.push(tag);
                                    }
                                    if (suggestions.length >= 5) break;
                                }
                                if (suggestions.length >= 5) break;
                            }
                            return { body: suggestions };
                        })
                        .catch(() => ({ body: [] }));
                }

                if (url.endsWith("/select")) {
                    // giflibrary has no share-registration endpoint.
                    return Promise.resolve({ body: {} });
                }

                return orig(...args);
            }),
        );
    },
    onUnload() {
        lastSearchController?.abort();
        lastSearchController = null;
        lastTrendingController?.abort();
        lastTrendingController = null;
        for (const p of patches) {
            try { p(); } catch (e) { console.warn("[BringBackGifLibrary] failed to unpatch", e); }
        }
        patches.length = 0;
    },
    settings: Settings,
};
