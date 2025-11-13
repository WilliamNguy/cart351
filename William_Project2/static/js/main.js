const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const stateLine = document.getElementById("stateLine");
const timeLine = document.getElementById("timeLine");
const msg = document.getElementById("msg");
const playerName = document.getElementById("playerName");

const leaderboard = document.getElementById("leaderboard");
const latest = document.getElementById("latest");

let state = "idle";      // idle | waiting | ready | too-soon
let waitTimer = null;
let readyAt = 0;

function setState(s) {
    state = s;
    gameArea.className = "game " + s;

    if (s === "idle") {
        stateLine.innerHTML = "press <b>start</b> to begin";
        timeLine.textContent = "";
    }
    if (s === "waiting") {
        stateLine.textContent = "wait for green…";
    }
    if (s === "ready") {
        stateLine.textContent = "go!";
    }
    if (s === "too-soon") {
        stateLine.textContent = "too soon. press start again.";
    }
}

async function loadBoards() {
    try {
        const r = await fetch("/api/data");
        const j = await r.json();
        if (!j.ok) return;

        leaderboard.innerHTML = (j.fastest || [])
            .map((e, i) => `<li>${i + 1}. <b>${escapeHTML(e.name)}</b> — ${e.ms} ms</li>`)
            .join("");

        latest.innerHTML = (j.latest || [])
            .map(e => `<li><b>${escapeHTML(e.name)}</b> — ${e.ms} ms</li>`)
            .join("");
    } catch (err) {
        console.log(err);
    }
}

startBtn.addEventListener("click", () => {
    clearTimeout(waitTimer);
    msg.textContent = "";
    setState("waiting");
    const delay = 1500 + Math.random() * 2500;
    waitTimer = setTimeout(() => {
        readyAt = performance.now();
        setState("ready");
    }, delay);
});

gameArea.addEventListener("click", async () => {
    if (state === "waiting") {
        clearTimeout(waitTimer);
        setState("too-soon");
        return;
    }
    if (state === "ready") {
        const end = performance.now();
        const ms = Math.round(end - readyAt);
        setState("idle");
        timeLine.textContent = ms + " ms";

        const name = (playerName.value || "player").trim().slice(0, 24);
        try {
            const r = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name, ms: ms })
            });
            const j = await r.json();
            if (j.ok) {
                msg.textContent = "saved";
                loadBoards();
            } else {
                msg.textContent = j.error || "save error";
            }
        } catch (e) {
            msg.textContent = "network error";
        }
    }
});

function escapeHTML(s) {
    return (s || "").replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[m]));
}

window.addEventListener("DOMContentLoaded", () => {
    setState("idle");
    loadBoards();
});
