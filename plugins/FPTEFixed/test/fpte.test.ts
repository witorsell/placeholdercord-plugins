/// <reference types="node" />
import test from "node:test";
import assert from "node:assert";
import { buildFPTE, extractFPTE, decodeSku } from "../src/lib/fpte";

test("buildFPTE/extractFPTE round-trips gif fields alone (non-legacy)", () => {
    const str = buildFPTE(-1, -1, "", "", "", "111222333444555666", "777888999000111222", "333444555666777888", false);
    const fpte = extractFPTE(str);
    assert.equal(decodeSku(fpte[5]).toString(), "111222333444555666");
    assert.equal(decodeSku(fpte[6]).toString(), "777888999000111222");
    assert.equal(decodeSku(fpte[7]).toString(), "333444555666777888");
});

test("buildFPTE/extractFPTE round-trips gif fields alone (legacy, no colors set falls back to non-legacy slots)", () => {
    const str = buildFPTE(-1, -1, "", "", "", "111222333444555666", "777888999000111222", "333444555666777888", true);
    const fpte = extractFPTE(str);
    assert.equal(decodeSku(fpte[5]).toString(), "111222333444555666");
    assert.equal(decodeSku(fpte[6]).toString(), "777888999000111222");
    assert.equal(decodeSku(fpte[7]).toString(), "333444555666777888");
});

test("buildFPTE combines colors, effect, decoration, nameplate, and gif fields", () => {
    const str = buildFPTE(0xff0000, 0x00ff00, "1001", "1002", "1003", "2001", "2002", "2003", false);
    const fpte = extractFPTE(str);
    assert.equal(decodeSku(fpte[2]).toString(), "1001", "effect");
    assert.equal(decodeSku(fpte[3]).toString(), "1002", "decoration");
    assert.equal(decodeSku(fpte[4]).toString(), "1003", "nameplate");
    assert.equal(decodeSku(fpte[5]).toString(), "2001", "gif channel");
    assert.equal(decodeSku(fpte[6]).toString(), "2002", "avatar gif message");
    assert.equal(decodeSku(fpte[7]).toString(), "2003", "banner gif message");
});

test("only banner gif set leaves avatar gif field empty in the middle", () => {
    const str = buildFPTE(-1, -1, "", "", "", "2001", "", "2003", false);
    const fpte = extractFPTE(str);
    assert.equal(fpte[6], "", "avatar gif message stays empty");
    assert.equal(decodeSku(fpte[5]).toString(), "2001");
    assert.equal(decodeSku(fpte[7]).toString(), "2003");
});

test("no gif fields set drops trailing empty fields (zero bio cost)", () => {
    const str = buildFPTE(0xff0000, -1, "1001", "", "", "", "", "", false);
    const fpte = extractFPTE(str);
    assert.equal(decodeSku(fpte[2]).toString(), "1001", "effect still encoded");
    assert.equal(fpte[3], "", "decoration empty");
    assert.equal(fpte[4], "", "nameplate empty");
    assert.equal(fpte[5], "", "gif channel empty");
    assert.equal(fpte[6], "", "avatar gif message empty");
    assert.equal(fpte[7], "", "banner gif message empty");
});

console.log("fpte gif field tests defined, run via node:test runner");
