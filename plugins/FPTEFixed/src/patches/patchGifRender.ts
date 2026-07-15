import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

import { getFPTE } from "../lib/fpteCache";
import { findElementInTree, getComponentNameFromType, isElement, type RN } from "../lib/reactNativeRenderTree";

function gifAvatarURL(channelId: string, messageId: string) {
    return `https://cdn.discordapp.com/attachments/${channelId}/${messageId}/a.gif`;
}
function gifBannerURL(channelId: string, messageId: string) {
    return `https://cdn.discordapp.com/attachments/${channelId}/${messageId}/b.gif`;
}

function swapImageSource(tree: RN.Node, uri: string) {
    // "Avatar" is the component HeaderAvatar renders; UserProfileBanner renders either
    // an "Image" or an "Avatar" depending on state. Try both names; confirm the actual
    // one on-device in Task 9 and drop whichever doesn't match if only one ever hits.
    const target = findElementInTree(tree, (el): el is RN.Element =>
        isElement(el) && (getComponentNameFromType(el.type) === "Avatar" || getComponentNameFromType(el.type) === "Image")
    );
    if (target) (target.props as { source?: unknown; }).source = { uri };
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
