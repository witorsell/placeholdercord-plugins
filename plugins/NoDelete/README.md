# NoDelete (persistent)

Keeps deleted messages visible in chat, and now also saves them to disk so they survive app restarts until you clear them. Fork of [NoDelete](https://github.com/meqativ/dumsane/tree/master/plugins/NoDelete) by meqativ.

## Install

Paste this URL into the Plugins page of Kettu/Vendetta:

> https://witorsell.github.io/nodelete-persist/

## What is new

- Every captured deletion is saved to disk (respecting your ignore lists).
- A "Saved deleted messages" viewer in settings: search by message id, user id, username, or text.
- Lock messages so they are never evicted or removed by Clear all.
- Storage is capped at 5000 (configurable), evicting the oldest unlocked first. Locked messages are always kept.

The live in-chat behavior is unchanged.
