# placeholdercord-plugins

Third-party plugins for placeholdercord.

## Bubble Chat

Configurable native chat bubbles and rounded avatars, driven through the **Native Bridge**
(`window.placeholder.native`).

### Install

> https://witorsell.github.io/placeholdercord-plugins/BubbleChat/

**Requires the built-in Native Bridge plugin to be enabled.** While it is off, Bubble Chat bails
with a toast instead of crashing.

Settings let you pick avatar corners (Square to Circle), bubble corners (Subtle to Pill), and a
bubble color, then Apply. Scroll the channel to see the change.

Bridge docs: https://witorsell.github.io/placeholdercord-docs/

---

## Virtual Camera

Show a photo instead of your real camera feed in Discord video calls. Hooks Discord's WebRTC
capturer pipeline at the native level via the **Native Bridge**.

### Install

> https://witorsell.github.io/placeholdercord-plugins/VirtualCamera/

**Requires the built-in Native Bridge plugin to be enabled.**

Only static images work (jpg/png/etc.): the native side decodes the file once into a bitmap and
loops that same frame. Video files won't decode at all, and a GIF only shows its first frame, not
an animation. Pick an image from your gallery or paste a path, then join a video call. Disable
anytime from settings.

---

## UwuifyLive

Automatically uwuifies your messages before sending. Configurable faces, actions, stutters, words,
and exclamations.

### Install

> https://witorsell.github.io/placeholdercord-plugins/UwuifyLive/

---

## NoDelete (nodelete-persist)

Intercepts and saves deleted messages locally so you can still read them. Supports locking saved
messages, filtering by user/bot, and searching.

### Install

> https://witorsell.github.io/placeholdercord-plugins/NoDelete/

---

## ClipboardGifSend

Send GIFs directly from your clipboard into Discord chats.

### Install

> https://witorsell.github.io/placeholdercord-plugins/ClipboardGifSend/

---

## FPTEFixed (Fake Profile Themes and Effects)

Fixed and maintained build of Fake Profile Themes and Effects for placeholdercord.

### Install

> https://witorsell.github.io/placeholdercord-plugins/FPTEFixed/

---

## BringBackGifLibrary

Replaces the GIF picker search with giflibrary.site.

### Install

> https://witorsell.github.io/placeholdercord-plugins/BringBackGifLibrary/
