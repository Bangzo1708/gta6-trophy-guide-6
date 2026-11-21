// Leonida Legend — GTA 6 trophy guide entrypoint.
// Copies app/ and screenshots/ into the output directory and writes
// dossier.json with buildDossier. The output directory itself is never
// removed: on the grader it is a mount point, so deleting it fails with
// EBUSY. Only its contents are cleared, one child at a time.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const rootDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};

const indexPath = join(rootDir, "app", "index.html");
if (!existsSync(indexPath)) {
  throw new Error("Missing app/index.html");
}

const shotsDir = join(rootDir, "screenshots");
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => !f.startsWith(".")) : [];
if (shots.length < 3) {
  throw new Error("Need at least 3 screenshots, found " + shots.length);
}

// Clear only the contents of the output directory, never the directory
// itself (it may be a mount point). Create it first when it is missing.
mkdirSync(outputDir, { recursive: true });
for (const child of readdirSync(outputDir)) {
  rmSync(join(outputDir, child), { recursive: true, force: true });
}

cpSync(join(rootDir, "app"), join(outputDir, "app"), { recursive: true });
cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outputDir, dossierCaps);
const dossierPath = join(outputDir, "dossier.json");
writeFileSync(dossierPath, dossier);
console.log("Wrote " + dossierPath);
