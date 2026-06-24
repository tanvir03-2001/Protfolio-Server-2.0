import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import defaultPortfolio from "../data/default-portfolio.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(__dirname, "content-store.json");

async function ensureStore() {
  try {
    await readFile(contentPath, "utf8");
  } catch {
    await mkdir(path.dirname(contentPath), { recursive: true });
    await writeFile(contentPath, JSON.stringify(defaultPortfolio, null, 2), "utf8");
  }
}

export async function getJsonContent() {
  await ensureStore();
  const raw = await readFile(contentPath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    profile: parsed.profile,
    site: parsed.site,
    updatedAt: parsed.updatedAt ?? new Date().toISOString(),
  };
}

export async function saveJsonContent({ profile, site }) {
  await ensureStore();
  const payload = {
    profile,
    site,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(contentPath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}
