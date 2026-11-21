// Boot and wiring: loads the trophies, renders every tab, and wires the
// toolbar, tabs, spoiler switch and progress export/import.
import { DEMO_EARNED } from "./config.js";
import {
  exportProgress,
  importProgressFile,
  loadProgress,
  loadSpoilers,
  saveProgress,
  saveSpoilers,
} from "./store.js";
import { loadTrophies } from "./data.js";
import {
  renderChecklist,
  renderDetail,
  renderHundred,
  renderMissables,
  renderNextUp,
  renderProgress,
  renderRoadmap,
} from "./views.js";

let trophies = [];
let progress = loadProgress();
let spoilersOn = loadSpoilers();
let selectedName = null;
const filters = { kind: "all", grade: "all", status: "all", query: "" };

const params = new URLSearchParams(window.location.search);
if (params.get("demo") === "1") {
  for (const name of DEMO_EARNED) {
    progress[name] = true;
  }
}

function selectedTrophy() {
  return trophies.find((t) => t.name === selectedName) || null;
}

function rerenderAll() {
  renderProgress(trophies, progress);
  renderNextUp(trophies, progress);
  renderChecklist(trophies, progress, spoilersOn, filters, selectedName, selectTrophy, toggleTrophy);
  renderDetail(selectedTrophy(), progress, spoilersOn, toggleTrophy);
  renderRoadmap(trophies, progress);
  renderMissables(trophies);
}

function selectTrophy(name) {
  selectedName = name;
  renderChecklist(trophies, progress, spoilersOn, filters, selectedName, selectTrophy, toggleTrophy);
  renderDetail(selectedTrophy(), progress, spoilersOn, toggleTrophy);
}

function toggleTrophy(name, earned) {
  if (earned) {
    progress[name] = true;
  } else {
    delete progress[name];
  }
  saveProgress(progress);
  rerenderAll();
}

function switchTab(tab) {
  for (const button of document.querySelectorAll(".tab")) {
    const active = button.dataset.tab === tab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  }
  for (const page of document.querySelectorAll(".tabpage")) {
    page.classList.toggle("active", page.id === "tab-" + tab);
  }
}

async function boot() {
  trophies = await loadTrophies();
  renderHundred();

  const spoilerToggle = document.getElementById("spoilerToggle");
  spoilerToggle.checked = spoilersOn;
  spoilerToggle.addEventListener("change", () => {
    spoilersOn = spoilerToggle.checked;
    saveSpoilers(spoilersOn);
    rerenderAll();
  });

  document.getElementById("exportBtn").addEventListener("click", () => exportProgress(progress));

  const importFile = document.getElementById("importFile");
  importFile.addEventListener("change", async () => {
    const file = importFile.files[0];
    if (!file) return;
    try {
      progress = await importProgressFile(file);
      saveProgress(progress);
      rerenderAll();
    } catch (error) {
      alert("Import failed: " + error.message);
    }
    importFile.value = "";
  });

  document.getElementById("searchBox").addEventListener("input", (event) => {
    filters.query = event.target.value.trim();
    renderChecklist(trophies, progress, spoilersOn, filters, selectedName, selectTrophy, toggleTrophy);
  });

  document.getElementById("kindChips").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    for (const c of document.querySelectorAll(".chip")) c.classList.remove("active");
    chip.classList.add("active");
    filters.kind = chip.dataset.kind;
    renderChecklist(trophies, progress, spoilersOn, filters, selectedName, selectTrophy, toggleTrophy);
  });

  document.getElementById("gradeFilter").addEventListener("change", (event) => {
    filters.grade = event.target.value;
    renderChecklist(trophies, progress, spoilersOn, filters, selectedName, selectTrophy, toggleTrophy);
  });

  document.getElementById("statusFilter").addEventListener("change", (event) => {
    filters.status = event.target.value;
    renderChecklist(trophies, progress, spoilersOn, filters, selectedName, selectTrophy, toggleTrophy);
  });

  for (const button of document.querySelectorAll(".tab")) {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  }

  if (params.get("spoilers") === "1") {
    spoilersOn = true;
    spoilerToggle.checked = true;
    saveSpoilers(true);
  }
  const tab = params.get("tab");
  if (tab && document.getElementById("tab-" + tab)) switchTab(tab);
  const trophy = params.get("trophy");
  if (trophy && trophies.some((t) => t.name === trophy)) selectedName = trophy;

  rerenderAll();
}

boot().catch((error) => {
  document.getElementById("trophyList").innerHTML =
    "<li>Failed to load the trophy list: " + error.message + "</li>";
});
