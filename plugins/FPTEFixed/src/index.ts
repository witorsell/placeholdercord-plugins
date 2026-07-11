import { FluxDispatcher } from "./lib/flux";
import { primeLocalUser } from "./lib/fpteCache";
import { UserProfileStore, UserStore } from "./lib/stores";
import {
    patchGetPurchase,
    patchGetUserProfile,
    //patchGuildProfileEditForm,
    patchUseProfileEffectSections,
    patchUseProfileTheme,
    patchUserCollectibles,
    patchUserProfileEditForm,
    patchNitroUpsellCard
} from "./patches/index";
import { Settings } from "./ui/pages";

/** Updates the profile theme and effect used by YouScreen and BottomTabBar. */
function updateProfileThemeAndEffect() {
    const user = UserStore.getCurrentUser();
    if (!user) return;
    const user_profile = UserProfileStore.getUserProfile(user.id);
    if (!user_profile) return;
    FluxDispatcher.dispatch({
        type: "USER_PROFILE_FETCH_SUCCESS",
        user,
        user_profile,
        connected_accounts: user_profile.connectedAccounts
    });
}

const patches: (() => boolean)[] = [];

export default {
    onLoad() {
        patches.push(
            patchGetPurchase(),
            patchGetUserProfile(),
            //patchGuildProfileEditForm(),
            ...patchUseProfileEffectSections(),
            patchUseProfileTheme(),
            patchUserProfileEditForm(),
            patchNitroUpsellCard(),
            patchUserCollectibles()
        );
        primeLocalUser();
        updateProfileThemeAndEffect();
    },
    onUnload() {
        patches.forEach(unpatch => {
            unpatch();
        });
        updateProfileThemeAndEffect();
    },
    settings: Settings
};
