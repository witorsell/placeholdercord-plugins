# placeholdercord-plugins

Third-party plugins for placeholdercord.

## Install

In placeholdercord, open Plugins and add this repo URL:

```
https://raw.githubusercontent.com/witorsell/placeholdercord-plugins/main/
```

## Plugins

### Bubble Chat

Configurable native chat bubbles and rounded avatars. It drives the bubble knobs through the
**Native Bridge** (`window.placeholder.native`), so it ships no native code of its own.

**Requires the built-in Native Bridge plugin to be enabled.** While that is off,
`window.placeholder` is undefined and Bubble Chat bails with a toast instead of crashing.

Settings let you pick avatar corners (Square to Circle), bubble corners (Subtle to Pill), and a
bubble color, then Apply. Scroll the channel to see the change.

See the bridge docs: https://witorsell.github.io/placeholdercord-docs/
