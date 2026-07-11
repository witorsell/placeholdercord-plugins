import assert from "node:assert";
import { matchesSearch, evict, serialize } from "../persist.helpers.mjs";

// search
const rec = { id: "111", author: { id: "222", username: "Bob" }, content: "hello world", locked: false };
assert.equal(matchesSearch(rec, "111"), true, "match by message id");
assert.equal(matchesSearch(rec, "222"), true, "match by author id");
assert.equal(matchesSearch(rec, "bob"), true, "match by username ci");
assert.equal(matchesSearch(rec, "WORLD"), true, "match by content ci");
assert.equal(matchesSearch(rec, "nope"), false, "no match");
assert.equal(matchesSearch(rec, ""), true, "empty query matches all");

// evict: oldest unlocked first, locked protected
const saved = [
	{ id: "a", locked: false }, { id: "b", locked: true },
	{ id: "c", locked: false }, { id: "d", locked: false },
];
evict(saved, 2);
assert.deepEqual(saved.map((r) => r.id), ["b", "d"], "evicts oldest unlocked, keeps locked");

// evict: all locked over cap -> keep all
const allLocked = [{ id: "a", locked: true }, { id: "b", locked: true }];
evict(allLocked, 1);
assert.deepEqual(allLocked.map((r) => r.id), ["a", "b"], "locked never dropped");

// serialize
const msg = { id: "9", author: { id: "7", username: "Ann", avatar: "abc" }, content: "hi", attachments: [{ url: "u1" }], embeds: [{ image: { url: "u2" } }] };
const out = serialize(msg, "chan1", "general", "guild1");
assert.equal(out.id, "9");
assert.equal(out.channelId, "chan1");
assert.equal(out.channelName, "general");
assert.equal(out.author.username, "Ann");
assert.equal(out.content, "hi");
assert.equal(out.locked, false);
assert.deepEqual(out.attachments, ["u1", "u2"]);
assert.ok(out.author.avatarUrl.includes("/avatars/7/abc.png"));
console.log("persist helpers OK");
