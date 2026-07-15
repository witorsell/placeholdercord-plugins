import { decodeColor, decodeColorsLegacy, decodeSku, extractFPTE } from "../lib/fpte";
import { UserProfileStore, UserStore } from "../lib/stores";

export interface DecodedFPTE {
    primary: number;
    accent: number;
    effectSku: string | null;
    decorationSku: string | null;
    nameplateSku: string | null;
    gifChannelId: string | null;
    avatarGifMessageId: string | null;
    bannerGifMessageId: string | null;
}

const cache = new Map<string, DecodedFPTE>();

function toSku(str: string): string | null {
    const id = decodeSku(str);
    return id > -1n ? id.toString() : null;
}

/**
 * Decodes an FPTE bio into its colors and collectible skus. Mirrors the slot layout of
 * {@link buildFPTE}: colors first, then effect/decoration/nameplate. Legacy strings pack both
 * colors into slot 0, shifting the collectible slots down by one.
 */
export function decodeBio(bio: string | undefined | null): DecodedFPTE {
    const fpte = extractFPTE(bio ?? "");
    const primaryRaw = decodeColor(fpte[0]);

    if (primaryRaw === -2) {
        const [primary, accent] = decodeColorsLegacy(fpte[0]);
        return {
            primary,
            accent,
            effectSku: toSku(fpte[1]),
            decorationSku: toSku(fpte[2]),
            nameplateSku: toSku(fpte[3]),
            gifChannelId: toSku(fpte[4]),
            avatarGifMessageId: toSku(fpte[5]),
            bannerGifMessageId: toSku(fpte[6])
        };
    }

    return {
        primary: primaryRaw,
        accent: decodeColor(fpte[1]),
        effectSku: toSku(fpte[2]),
        decorationSku: toSku(fpte[3]),
        nameplateSku: toSku(fpte[4]),
        gifChannelId: toSku(fpte[5]),
        avatarGifMessageId: toSku(fpte[6]),
        bannerGifMessageId: toSku(fpte[7])
    };
}

export function getFPTE(userId: string): DecodedFPTE | undefined {
    return cache.get(userId);
}

export function setFPTE(userId: string, data: DecodedFPTE): void {
    cache.set(userId, data);
}

/** Decodes and caches an FPTE bio for a user in one step. */
export function cacheBio(userId: string, bio: string | undefined | null): void {
    setFPTE(userId, decodeBio(bio));
}

/**
 * Populates the cache for the current user immediately, so their own faked decoration and
 * nameplate render app-wide without waiting for their profile to be fetched.
 */
export function primeLocalUser(): void {
    const user = UserStore.getCurrentUser();
    if (!user) return;
    const profile = UserProfileStore.getUserProfile(user.id);
    if (!profile) return;
    cacheBio(user.id, profile.bio);
}
