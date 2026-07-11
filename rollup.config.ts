import { createHash } from "crypto";
import { readdirSync } from "fs";
import { readFile } from "fs/promises";

import terser from "@rollup/plugin-terser";
import type { RollupOptions } from "rollup";
import { swc } from "rollup-plugin-swc3";

const vendettaImport = /^@vendetta(\/|$)/;

const globals: Record<string, string> = {
    react: "React",
    "react-native": "vendetta.metro.common.ReactNative"
};

export default (await Promise.all(readdirSync("./plugins", { withFileTypes: true }).map(async dirent => {
    if (dirent.isFile()) return;

    let manifest;
    try {
        manifest = JSON.parse(await readFile(`./plugins/${dirent.name}/manifest.json`, "utf8"));
        if (!manifest.main)
            throw new Error("Missing entry point.");
    } catch (error) {
        console.error(`Plugin at './plugins/${dirent.name}' does not have a valid manifest.\n`, error);
        return;
    }

    return {
        external: [vendettaImport, ...Object.keys(globals)],
        input: `plugins/${dirent.name}/${manifest.main}`,
        output: {
            file: `dist/${dirent.name}/index.js`,
            format: "iife",
            exports: "default",
            globals: (id: string) => vendettaImport.test(id) ? id.substring(1).replaceAll("/", ".") : globals[id] ?? id
        },
        plugins: [
            swc({
                jsc: { target: undefined },
                env: {
                    targets: "fully supports es6",
                    include: [
                        "transform-block-scoping",
                        "transform-classes"
                    ],
                    exclude: [
                        "transform-async-to-generator",
                        "transform-exponentiation-operator",
                        "transform-named-capturing-groups-regex",
                        "transform-nullish-coalescing-operator",
                        "transform-object-rest-spread",
                        "transform-optional-chaining"
                    ]
                }
            }),
            terser({
                compress: {
                    ecma: 2015,
                    expression: true,
                    passes: 4,
                    unsafe: true,
                    unsafe_arrows: true,
                    unsafe_comps: true,
                    unsafe_methods: true
                },
                mangle: { eval: true }
            }),
            {
                name: "manifest",
                renderChunk(code: string) {
                    manifest.main = "index.js";
                    manifest.hash = createHash("sha256").update(code).digest("base64");
                    this.emitFile({
                        type: "asset",
                        fileName: "manifest.json",
                        source: JSON.stringify(manifest)
                    });
                }
            }
        ]
    } satisfies RollupOptions;
}))).filter(Boolean);
