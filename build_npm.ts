import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  scriptModule: false,
  rootTestDir: "./tests",
  package: {
    name: "@i-xi-dev/mimetype",
    version: "1.1.4",
    description: "A JavaScript MIME type parser and serializer, implements the MIME type defined in WHATWG MIME Sniffing Standard.",
    license: "MIT",
    author: "i-xi-dev",
    homepage: "https://github.com/i-xi-dev/mimetype.es#readme",
    keywords: [
      "mimetype",
      "mediatype",
      "browser",
      "deno",
      "nodejs"
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/i-xi-dev/mimetype.es.git"
    },
    bugs: {
      url: "https://github.com/i-xi-dev/mimetype.es/issues"
    },
    publishConfig: {
      access: "public"
    },
    files: [
      "esm",
      "types"
    ],
  },
  importMap: "./import_map.json"
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
