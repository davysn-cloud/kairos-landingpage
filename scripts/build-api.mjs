/**
 * Bundles api/index.ts into a single api/index.mjs file
 * so Vercel's serverless runtime has all dependencies resolved.
 */
import { build } from "esbuild";

await build({
  entryPoints: ["api/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.js",
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
  external: [
    // Native/binary modules that Vercel provides
    "pg-native",
    "better-sqlite3",
  ],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  minify: false,
  sourcemap: false,
});

// Remove .ts so Vercel uses the bundled .js
import { unlinkSync } from "fs";
try { unlinkSync("api/index.ts"); } catch {}

console.log("[build-api] api/index.js built successfully");
