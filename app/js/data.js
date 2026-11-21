// Loads the trophy list from app/data/trophies.json.
import { DATA_URL } from "./config.js";

export async function loadTrophies() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error("Could not load " + DATA_URL);
  }
  const data = await response.json();
  const list = Array.isArray(data) ? data : data.trophies;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("No trophies in data file.");
  }
  return list;
}
