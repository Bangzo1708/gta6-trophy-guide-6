// Progress and spoiler settings in localStorage, plus progress export/import.
import { SPOILER_KEY, STORAGE_KEY } from "./config.js";

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable: progress just is not kept.
  }
}

export function loadSpoilers() {
  return localStorage.getItem(SPOILER_KEY) === "1";
}

export function saveSpoilers(on) {
  try {
    localStorage.setItem(SPOILER_KEY, on ? "1" : "0");
  } catch {
    // Ignore storage failures for the spoiler setting.
  }
}

export function exportProgress(progress) {
  const earned = Object.keys(progress).filter((name) => progress[name]);
  const blob = new Blob(
    [JSON.stringify({ app: "leonida-legend", earned }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leonida-legend-progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file) {
  const data = JSON.parse(await file.text());
  const names = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(names)) {
    throw new Error("File is not a Leonida Legend export.");
  }
  const progress = {};
  for (const name of names) {
    progress[name] = true;
  }
  return progress;
}
