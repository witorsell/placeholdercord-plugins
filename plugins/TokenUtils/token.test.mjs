import assert from "node:assert/strict";
import test from "node:test";
import { callTokenGetter, firstToken, optionValue } from "./token.js";

test("firstToken skips empty values and keeps the first real string", () => {
    assert.equal(firstToken([undefined, null, "", "abc.def.ghi"]), "abc.def.ghi");
    assert.equal(firstToken([undefined, 12, {}]), null);
    assert.equal(firstToken([]), null);
});

test("optionValue reads a named slash-command option", () => {
    assert.equal(optionValue([{ name: "token", value: "mfa.tok" }], "token"), "mfa.tok");
    assert.equal(optionValue([{ name: "token", value: "" }, { name: "other", value: "x" }], "token"), "");
    assert.equal(optionValue(null, "token"), "");
});

test("callTokenGetter invokes with the owner and swallows throws", () => {
    assert.equal(callTokenGetter(function () { return this.token; }, { token: "stored" }), "stored");
    assert.equal(callTokenGetter(undefined, {}), undefined);
    assert.equal(callTokenGetter(function () { throw new Error("nope"); }, {}), undefined);
});
