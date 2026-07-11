import { findByStoreName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

import { getFPTE } from "../lib/fpteCache";
import { AvatarDecorationStore, NameplateStore, UserStore } from "../lib/stores";

function resolveDecoration(sku: string) {
    if (!AvatarDecorationStore.isLoaded) { AvatarDecorationStore.fetch(); return null; }
    return AvatarDecorationStore.decorations.find((d: any) => d.skuId === sku)?.config ?? null;
}

function resolveNameplate(sku: string) {
    if (!NameplateStore.isLoaded) { NameplateStore.fetch(); return null; }
    return NameplateStore.nameplates.find((n: any) => n.skuId === sku)?.config ?? null;
}

// Avatar decoration and nameplate render off the user record (user.avatarDecoration /
// user.avatarDecorationData and user.collectibles.nameplate), not the profile. Inject the faked
// values onto the record returned by getUser so they render everywhere the user appears.
export const patchUserCollectibles = () => after("getUser", UserStore, ([, ]: unknown[], user: any) => {
    try {
        if (!user?.id) return user;
        const fpte = getFPTE(user.id);
        if (!fpte) return user;

        if (fpte.decorationSku) {
            const deco = resolveDecoration(fpte.decorationSku);
            if (deco) {
                user.avatarDecorationData = { asset: deco.asset, skuId: deco.skuId, sku_id: deco.sku_id ?? deco.skuId };
                try { user.avatarDecoration = deco; } catch { /* getter-only */ }
            }
        }

        if (fpte.nameplateSku) {
            const np = resolveNameplate(fpte.nameplateSku);
            if (np) user.collectibles = { ...(user.collectibles ?? {}), nameplate: np };
        }
    } catch { /* never break getUser */ }
    return user;
});
