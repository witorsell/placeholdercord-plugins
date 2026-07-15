import { findByName, findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

import { getFPTE } from "../lib/fpteCache";
import { findElementInTree, getComponentNameFromType, isElement, type RN } from "../lib/reactNativeRenderTree";

function gifAvatarURL(channelId: string, messageId: string) {
    return `https://cdn.discordapp.com/attachments/${channelId}/${messageId}/a.gif`;
}
function gifBannerURL(channelId: string, messageId: string) {
    return `https://cdn.discordapp.com/attachments/${channelId}/${messageId}/b.gif`;
}

// Discord's CDN rejects attachment URLs that don't carry a signed ?ex=&is=&hm=
// query, and the raw URLs built above never have one. maybeRefreshAttachmentUrl
// is the native helper that signs them, but it's async and this file's render
// patches must return synchronously, so resolved signatures are cached here and
// reused on the next render instead of being awaited in place.
const signedUrlCache = new Map<string, string>();
const pendingRefreshes = new Set<string>();

function resolveDisplayUrl(rawUrl: string): string {
    const cached = signedUrlCache.get(rawUrl);
    if (cached) return cached;

    if (!pendingRefreshes.has(rawUrl)) {
        pendingRefreshes.add(rawUrl);
        const attachmentUrlUtils = findByProps("maybeRefreshAttachmentUrl") as
            { maybeRefreshAttachmentUrl?: (url: string) => Promise<string>; } | undefined;
        Promise.resolve()
            .then(() => attachmentUrlUtils?.maybeRefreshAttachmentUrl?.(rawUrl) ?? rawUrl)
            .then((signed: string) => {
                signedUrlCache.set(rawUrl, signed);
            })
            .catch(() => { /* leave uncached, next render retries */ })
            .then(() => {
                pendingRefreshes.delete(rawUrl);
            });
    }

    // Best effort for this render pass. Known, accepted limitation: the very
    // first render of a given profile in a session may briefly show a broken
    // image because the signed URL hasn't come back from the refresh above yet.
    // Profile popouts re-render often on Flux updates, so a subsequent render of
    // the same profile picks up the now-cached signed URL. Not worth forcing a
    // re-render from a render patch just to close that first-view gap.
    return rawUrl;
}

function swapImageSource(tree: RN.Node, uri: string) {
    // "Avatar" is the component HeaderAvatar renders; UserProfileBanner renders either
    // an "Image" or an "Avatar" depending on state. Try both names; confirm the actual
    // one on-device in Task 9 and drop whichever doesn't match if only one ever hits.
    const target = findElementInTree(tree, (el): el is RN.Element =>
        isElement(el) && (getComponentNameFromType(el.type) === "Avatar" || getComponentNameFromType(el.type) === "Image")
    );
    if (target) (target.props as { source?: unknown; }).source = { uri: resolveDisplayUrl(uri) };
}

export const patchGifAvatarRender = () => {
    const HeaderAvatar = findByName("HeaderAvatar", false);
    if (!HeaderAvatar) return () => true;
    return after("default", HeaderAvatar, (args: unknown[], tree: RN.Node) => {
        const userId = (args[0] as { user?: { id?: string; }; } | undefined)?.user?.id;
        if (!userId) return tree;
        const decoded = getFPTE(userId);
        if (!decoded?.gifChannelId || !decoded.avatarGifMessageId) return tree;
        swapImageSource(tree, gifAvatarURL(decoded.gifChannelId, decoded.avatarGifMessageId));
        return tree;
    });
};

export const patchGifBannerRender = () => {
    const UserProfileBanner = findByName("UserProfileBanner", false);
    if (!UserProfileBanner) return () => true;
    return after("default", UserProfileBanner, (args: unknown[], tree: RN.Node) => {
        const userId = (args[0] as { displayProfile?: { userId?: string; }; } | undefined)?.displayProfile?.userId;
        if (!userId) return tree;
        const decoded = getFPTE(userId);
        if (!decoded?.gifChannelId || !decoded.bannerGifMessageId) return tree;
        swapImageSource(tree, gifBannerURL(decoded.gifChannelId, decoded.bannerGifMessageId));
        return tree;
    });
};
