// All rendering for the Leonida Legend guide: progress, next-up planner,
// checklist, detail pane, roadmap, missables and the 100% tables.
import { GRADE_ORDER } from "./config.js";

export const ROADMAP_STAGES = [
  {
    title: "Stage 1 — Play the story",
    time: "60–80 hours",
    intro: "Chapters 1–4 and the final mission. No gold medals are needed on story missions — enjoy the campaign, but do the side things below while they are in front of you.",
    steps: [
      "Finish the opening mission Gone Fishing and play Chapters 1–4 through to the final mission.",
      "After the Down to Earth mission (Chapter 1), meet Lucia at Jason's house in the morning and do the balcony meditation — the only interaction reported as potentially missable.",
      "Save manually at the start and end of every chapter. There is no mission replay.",
      "Scan new vehicles with WAiNK and study new animals with binoculars from the start — 200 base-model vehicles and 100 animals are needed later.",
      "Do optional missions as they appear, especially the ones that introduce robberies, fishing and hunting.",
    ],
    trophies: ["Just Like Paradise", "Paradise Lost", "T**s Ass Drug Money", "Vice City, Baby!", "Top of the World, Ma", "You Gotta Know When to Get Off", "Trust", "Break the Bank", "Family Matters", "DWNFALL", "Hi-Jacked", "Snow Storm", "Positive Mental Attitude"],
  },
  {
    title: "Stage 2 — Strangers & Freaks",
    time: "10–20 hours",
    intro: "Stranger mission strands across Leonida. Five character strands each end in their own trophy, and eight strands in total earn the Silver.",
    steps: [
      "Finish the final missions of Andy, Kenton, Billy, Randy and Tyrone.",
      "Complete eight qualifying stranger mission strands in total.",
      "Kenton's strand ties into treasure sets — collect treasure clues while you explore.",
    ],
    trophies: ["Road to Rehabilitation", "This Was No Boat Accident", "The Lone Rider", "Supply & Demand", "Spin On This!", "Strangers & Freaks"],
  },
  {
    title: "Stage 3 — Activities & collectibles",
    time: "around 100 hours",
    intro: "The long grind, done after the story with free roam open. Work from the 100% checklist in Progress > Stats instead of chasing everything at once.",
    steps: [
      "Earn all 42 Shooting Range gold medals — the hardest skill trophy.",
      "Complete 250 stunts (300 count toward 100%), win 20 different races, and win Top Fun drone races at all 14 locations.",
      "WAiNK It at 100 locations, finish 3 Collectible Card sets, meditate at all 18 spots, and hunt Bret's unique animal.",
      "Complete 50 Challenges (70 of 80 count toward 100%), rob 5 bank vaults, and rob one Illegal Operation per gang.",
    ],
    trophies: ["The Shootist", "Cunning Stunts", "Top Fun", "Earn Cash, Not Kudos", "You WAiNKer!", "Don't Touch My Deck", "One Last Thing", "Maximum Withdrawal", "Pest Control", "Master of None"],
  },
  {
    title: "Stage 4 — 100% and the Platinum",
    time: "cleanup",
    intro: "Open Progress > Stats > 100% Completion, finish whatever the checklist still asks for, and the Gold for 100% opens — then the Platinum follows on its own.",
    steps: [
      "Finish the remaining checklist numbers (see the 100% Completion tab).",
      "Earn any combat, driving, robbery or misc trophies still left.",
      "Check the trophy list: once A Long Road opens and nothing is missing, Vice Got a Price! is yours.",
    ],
    trophies: ["A Long Road", "Vice Got a Price!"],
  },
];

export const HUNDRED_TABLES = [
  {
    title: "Robberies for 100%",
    rows: [
      ["Main story", "All chapters"],
      ["Optional tasks", "100 completed"],
      ["Gang Operations", "39 of 39"],
      ["Bank Jobs", "22 of 22"],
      ["Payday Loan Jobs", "7 of 7"],
      ["Smash 'N' Grabs", "34 of 35"],
      ["Stick Ups", "50 of 91"],
      ["Bank Vaults", "8 of 8"],
      ["Marked Bills fenced", "$250,000"],
      ["Jewelry fenced", "$100,000"],
      ["Narcotics fenced", "$100,000"],
      ["Vehicles fenced", "$200,000"],
    ],
  },
  {
    title: "Collectibles & exploration",
    rows: [
      ["Kenton's Treasure Sets", "5 of 7"],
      ["Collectible Card Sets", "15 of 18"],
      ["WAiNK locations", "100 scans"],
      ["Underwater Discoveries", "33 of 33"],
      ["Magazines, Books, Comics", "30 of 34"],
      ["Meditations", "15 of 18"],
      ["Cocaine Flamingos", "100 of 125"],
      ["Unique Playlists", "2 of 2"],
      ["Discovered Styles", "70 of 79"],
      ["Base-model Vehicles", "200 of 277"],
      ["Standard Issue Weapons", "50 of 66"],
      ["Animals Studied", "100 of 255"],
    ],
  },
  {
    title: "Activities for 100%",
    rows: [
      ["Unique Races won", "30 of 40"],
      ["Race Challenge Golds", "10 of 13"],
      ["Shooting Range Golds", "42 of 42"],
      ["Video Games played", "All 4"],
      ["Pool Opponents beaten", "5 of 7"],
      ["Mini Golf", "2 of 3 locations"],
      ["Basketball Hoops", "90 of 100"],
      ["Drone Time Trials", "42 of 42"],
      ["Stunts", "300 of 397"],
      ["Challenges", "70 of 80"],
      ["Bret's Target Decks", "15 of 15"],
    ],
  },
];

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function isHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.hidden && !earned;
}

export function renderProgress(trophies, progress) {
  const total = trophies.length;
  const earned = trophies.filter((t) => progress[t.name]).length;
  const byGrade = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
  for (const t of trophies) {
    if (progress[t.name]) byGrade[t.grade] += 1;
  }
  const pct = total ? Math.round((earned / total) * 100) : 0;
  document.getElementById("progressCount").textContent = earned + "/" + total;
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressSub").textContent =
    earned + " earned · " + byGrade.bronze + " bronze · " + byGrade.silver + " silver · " + byGrade.gold + " gold";
  document.getElementById("progressFill").style.width = pct + "%";
}

export function renderNextUp(trophies, progress) {
  const list = document.getElementById("nextUpList");
  const rest = trophies
    .filter((t) => t.grade !== "platinum" && !progress[t.name])
    .sort((a, b) => a.difficulty - b.difficulty || GRADE_ORDER[b.grade] - GRADE_ORDER[a.grade]);
  const top = rest.slice(0, 3);
  list.innerHTML = top
    .map(
      (t) =>
        "<li><span class=\"nu-grade\">" + escapeHtml(t.name) + "</span> " +
        "<span class=\"grade-tag " + t.grade + "\">" + t.grade + "</span> " + stars(t.difficulty) +
        "<br><span class=\"nu-why\">" + escapeHtml(t.description) + " — about " + escapeHtml(t.time) + ".</span></li>",
    )
    .join("");
}

export function trophyMatches(trophy, kind, grade, status, query, progress) {
  if (kind === "missable") {
    if (!trophy.missable) return false;
  } else if (kind !== "all" && trophy.kind !== kind) {
    return false;
  }
  if (grade !== "all" && trophy.grade !== grade) return false;
  const earned = !!progress[trophy.name];
  if (status === "earned" && !earned) return false;
  if (status === "unearned" && earned) return false;
  if (query) {
    const q = query.toLowerCase();
    if (!trophy.name.toLowerCase().includes(q) && !trophy.description.toLowerCase().includes(q)) return false;
  }
  return true;
}

export function renderChecklist(trophies, progress, spoilersOn, filters, selectedName, onSelect, onToggle) {
  const list = document.getElementById("trophyList");
  const shown = trophies.filter((t) =>
    trophyMatches(t, filters.kind, filters.grade, filters.status, filters.query, progress),
  );
  const earnedCount = trophies.filter((t) => progress[t.name]).length;
  document.getElementById("listCount").textContent =
    "Showing " + shown.length + " of " + trophies.length + " trophies · " + earnedCount + " earned";
  list.innerHTML = "";
  for (const t of shown) {
    const earned = !!progress[t.name];
    const hidden = isHidden(t, spoilersOn, earned);
    const li = document.createElement("li");
    const row = document.createElement("button");
    row.type = "button";
    row.className = "trophy-row" + (earned ? " earned" : "") + (t.name === selectedName ? " selected" : "");
    row.dataset.name = t.name;
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned;
    box.dataset.check = "";
    box.setAttribute("aria-label", "Mark " + t.name + " earned");
    box.addEventListener("click", (event) => {
      event.stopPropagation();
      onToggle(t.name, box.checked);
    });
    const medal = document.createElement("span");
    medal.className = "medal " + t.grade;
    const main = document.createElement("span");
    const name = document.createElement("span");
    name.className = "trophy-name";
    name.textContent = hidden ? "Hidden story trophy — earn it to reveal" : t.name;
    main.appendChild(name);
    if (t.missable) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "MISSABLE";
      main.appendChild(badge);
    }
    if (t.hidden && !hidden) {
      const badge = document.createElement("span");
      badge.className = "badge hidden-badge";
      badge.textContent = "HIDDEN";
      main.appendChild(badge);
    }
    const desc = document.createElement("span");
    desc.className = "trophy-desc";
    desc.textContent = hidden ? "Story trophy — hidden until earned." : t.description;
    const meta = document.createElement("span");
    meta.className = "trophy-meta";
    meta.textContent = stars(t.difficulty) + " · " + t.time + " · " + t.kind;
    main.appendChild(document.createElement("br"));
    main.appendChild(desc);
    main.appendChild(document.createElement("br"));
    main.appendChild(meta);
    const grade = document.createElement("span");
    grade.className = "grade-tag " + t.grade;
    grade.textContent = t.grade;
    row.appendChild(box);
    row.appendChild(medal);
    row.appendChild(main);
    row.appendChild(grade);
    row.addEventListener("click", () => onSelect(t.name));
    li.appendChild(row);
    list.appendChild(li);
  }
}

export function renderDetail(trophy, progress, spoilersOn, onToggle) {
  const pane = document.getElementById("detailPane");
  if (!trophy) {
    pane.innerHTML = "<p class=\"detail-empty\">Select a trophy to read its guide, sources and missable note.</p>";
    return;
  }
  const earned = !!progress[trophy.name];
  const hidden = isHidden(trophy, spoilersOn, earned);
  let html = "";
  if (hidden) {
    html += "<h2>Hidden story trophy</h2>";
    html += "<p class=\"official\">This story trophy is hidden while spoilers are on. Earn it to reveal its name and guide.</p>";
    html += "<p class=\"kv\"><span>Grade: <b>" + trophy.grade + "</b></span><span>Difficulty: <b>" + stars(trophy.difficulty) + "</b></span><span>Time: <b>" + escapeHtml(trophy.time) + "</b></span></p>";
  } else {
    html += "<h2>" + escapeHtml(trophy.name) + "</h2>";
    html += "<p class=\"official\">“" + escapeHtml(trophy.description) + "” — official description</p>";
    html += "<p class=\"kv\"><span>Grade: <span class=\"grade-tag " + trophy.grade + "\">" + trophy.grade + "</span></span>" +
      "<span>Difficulty: <b>" + stars(trophy.difficulty) + "</b></span>" +
      "<span>Time: <b>" + escapeHtml(trophy.time) + "</b></span>" +
      "<span>Kind: <b>" + escapeHtml(trophy.kind) + "</b></span>" +
      (trophy.missable
        ? "<span style=\"color: var(--warn)\"><b>⚠ MISSABLE</b></span>"
        : "<span>Missable: <b>No</b></span>") + "</p>";
    html += "<h3>How to get it</h3><p>" + escapeHtml(trophy.guide) + "</p>";
    html += "<h3>Tip</h3><p>" + escapeHtml(trophy.tip) + "</p>";
    html += "<h3>When it can be missed</h3><p>" +
      (trophy.missable
        ? "Yes — this is the only trophy reported as potentially missable. See the Missables tab: the balcony meditation in Chapter 1, after the Down to Earth mission, must be done before leaving Chapter 1. Save manually at the start and end of every chapter."
        : "It cannot be missed — free roam stays open after the story. A manual save at the start and end of every chapter is still good practice.") +
      "</p>";
    html += "<p class=\"sources\">Sources: " + escapeHtml(trophy.sources) + "</p>";
  }
  html += "<button class=\"mark-btn" + (earned ? " earned" : "") + "\" id=\"markBtn\" type=\"button\">" +
    (earned ? "✓ Earned — click to unmark" : "Mark as earned") + "</button>";
  pane.innerHTML = html;
  document.getElementById("markBtn").addEventListener("click", () => onToggle(trophy.name, !earned));
}

export function renderRoadmap(trophies, progress) {
  const list = document.getElementById("stageList");
  list.innerHTML = ROADMAP_STAGES.map((stage) => {
    const names = stage.trophies.map((name) => {
      const t = trophies.find((x) => x.name === name);
      const got = t && progress[name];
      return (got ? "✓ " : "") + name;
    });
    const done = stage.trophies.filter((name) => progress[name]).length;
    return "<li class=\"stage\"><h3>" + escapeHtml(stage.title) +
      " <span class=\"stage-time\">· " + escapeHtml(stage.time) + " · " + done + "/" + stage.trophies.length + " trophies</span></h3>" +
      "<p>" + escapeHtml(stage.intro) + "</p><ul>" +
      stage.steps.map((s) => "<li>" + escapeHtml(s) + "</li>").join("") +
      "</ul><p class=\"stage-trophies\">Trophies: " + escapeHtml(names.join(" · ")) + "</p></li>";
  }).join("");
}

export function renderMissables(trophies) {
  const wrap = document.getElementById("missableList");
  const missable = trophies.filter((t) => t.missable);
  let html = "";
  for (const t of missable) {
    html += "<div class=\"missable-card\"><h3>⚠ " + escapeHtml(t.name) + " — potentially missable</h3>" +
      "<p><em>“" + escapeHtml(t.description) + "” — official description</em></p>" +
      "<p>" + escapeHtml(t.guide) + "</p>" +
      "<p class=\"sources\">Sources: " + escapeHtml(t.sources) + "</p></div>";
  }
  const others = trophies.length - missable.length;
  html += "<div class=\"missable-card safe\"><h3>Everything else: not missable</h3>" +
    "<p>The other " + others + " trophies can all be earned in free roam after the story, with no mission replay needed. Manual saves at the start and end of every chapter are still recommended.</p></div>";
  wrap.innerHTML = html;
}

export function renderHundred() {
  const grid = document.getElementById("hundredGrid");
  grid.innerHTML = HUNDRED_TABLES.map((table) =>
    "<div class=\"hundred-card\"><h3>" + escapeHtml(table.title) + "</h3><table>" +
    table.rows.map((row) => "<tr><td>" + escapeHtml(row[0]) + "</td><td>" + escapeHtml(row[1]) + "</td></tr>").join("") +
    "</table></div>",
  ).join("");
}
