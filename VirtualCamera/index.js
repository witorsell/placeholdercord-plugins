(o => {
    "use strict";
    return {
        onLoad() {
            try {
                o.showToast("VIRTUAL CAMERA BAREBONES LOADED!");
            } catch (o) {
                console.error("VIRTUALCAMERA CRASH:", o);
            }
        },
        onUnload() {}
    };
})(vendetta.ui.toasts);
