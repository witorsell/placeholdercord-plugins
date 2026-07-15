import { findByName, findByProps } from "@vendetta/metro";
import { after, instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

import { buildFPTE, hasFPTE, stripFPTE } from "../lib/fpte";
import { decodeBio, setFPTE } from "../lib/fpteCache";
import { uploadGifToSelfDM, type GifUploadDeps } from "../lib/gifUpload";
import { UserProfileStore, UserStore } from "../lib/stores";

type AssetType = "avatar" | "banner";

/** Set by the button-component patches below, immediately before the shared picker opens. */
let pendingAssetType: AssetType | null = null;

const ANIMATED_GIF_PREFIX = "data:image/gif;base64,";
const UserProfileActionCreators = findByProps("saveProfileChanges");

function isAnimatedGifDataUri(value: unknown): value is string {
    return typeof value === "string" && value.startsWith(ANIMATED_GIF_PREFIX);
}

function patchAssetTypeFlag(componentName: string, assetType: AssetType) {
    const Component = findByName(componentName, false);
    if (!Component) return () => true;
    return after("default", Component, (_args: unknown[], tree: unknown) => {
        pendingAssetType = assetType;
        return tree;
    });
}

function buildDeps(): GifUploadDeps {
    const channelActions = findByProps("ensurePrivateChannel", "getOrEnsurePrivateChannel");
    const cloudUploader = findByProps("uploadFiles");
    const messageActions = findByProps("sendMessage");

    return {
        ensurePrivateChannel: (userId: string) => channelActions.getOrEnsurePrivateChannel(userId),
        uploadFile: (channelId: string, filename: string, mimeType: string, base64DataUri: string) =>
            new Promise((resolve, reject) => {
                // First attempt: pass the data URI straight through as the file's uri, the
                // same shape CloudUpload expects from a native picker result. If uploads
                // silently fail on-device (see Task 9), switch to writing the decoded bytes
                // to a temp file via the RN filesystem module and pass a file:// uri instead.
                const upload = cloudUploader.uploadFiles([
                    { file: { uri: base64DataUri, name: filename, type: mimeType }, filename }
                ]);
                upload.once("complete", (id: string) => resolve({ id, filename, uploadedFilename: filename }));
                upload.once("error", (err: unknown) => reject(err instanceof Error ? err : new Error(String(err))));
            }),
        sendMessage: (channelId: string, message: { attachments: Array<{ id: string; filename: string; uploaded_filename: string; }>; }) =>
            messageActions.sendMessage(channelId, message)
    };
}

function applyGifReference(assetType: AssetType, channelId: string, messageId: string) {
    const currentUser = UserStore.getCurrentUser();
    if (!currentUser) return;
    const profile = UserProfileStore.getUserProfile(currentUser.id);
    if (!profile) return;

    const decoded = decodeBio(profile.bio);
    const fpteString = buildFPTE(
        decoded.primary,
        decoded.accent,
        decoded.effectSku ?? "",
        decoded.decorationSku ?? "",
        decoded.nameplateSku ?? "",
        channelId,
        assetType === "avatar" ? messageId : (decoded.avatarGifMessageId ?? ""),
        assetType === "banner" ? messageId : (decoded.bannerGifMessageId ?? ""),
        false
    );

    // Strip any existing FPTE region first, exactly like Builder.tsx's applyFPTE,
    // so the rebuilt string replaces it instead of appending a second one.
    let newBio = profile.bio ?? "";
    if (hasFPTE(newBio)) newBio = stripFPTE(newBio);
    if (newBio.length > 0) newBio += " ";
    newBio += fpteString;

    UserProfileActionCreators.saveProfileChanges({ ...profile, bio: newBio }).then(() => {
        setFPTE(currentUser.id, decodeBio(newBio));
        showToast(`GIF ${assetType} applied!`);
    }).catch((err: unknown) => {
        console.error(err);
        showToast(`Failed to save GIF ${assetType} reference!`);
    });
}

export const patchGifUpload = () => {
    const unpatchAvatarFlag = patchAssetTypeFlag("EditUserProfileAvatar", "avatar");
    const unpatchBannerFlag = patchAssetTypeFlag("UserProfileEditBannerButton", "banner");

    const pickerModule = findByProps("openImagePicker");
    const unpatchPicker = pickerModule
        ? instead("openImagePicker", pickerModule, (args: unknown[], orig: (...a: unknown[]) => Promise<any>) =>
            orig(...args).then((result: { base64?: string; } | null | undefined) => {
                const assetType = pendingAssetType;
                const toggleOn = assetType === "avatar" ? storage.gifAvatarRedirect : storage.gifBannerRedirect;

                if (assetType && toggleOn && isAnimatedGifDataUri(result?.base64)) {
                    const currentUser = UserStore.getCurrentUser();
                    if (currentUser) {
                        uploadGifToSelfDM(currentUser.id, assetType === "avatar" ? "a.gif" : "b.gif", result!.base64!, buildDeps())
                            .then(({ channelId, messageId }) => applyGifReference(assetType, channelId, messageId))
                            .catch((err: unknown) => {
                                console.error(err);
                                showToast(`Failed to upload GIF ${assetType}!`);
                            });
                    }
                }

                // Always return the original result unchanged. Discord's own animated-check
                // and Nitro upsell block still runs on the caller's side exactly as before,
                // so the real avatar/banner is untouched for non-Nitro accounts either way.
                return result;
            }))
        : () => true;

    return () => unpatchAvatarFlag() && unpatchBannerFlag() && unpatchPicker();
};
