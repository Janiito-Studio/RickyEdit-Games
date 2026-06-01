const BLUR_LEVELS = {
    normal: [50, 40, 30, 22, 15, 8],
    easy: [35, 30, 25, 22, 15, 8],
    extreme: [70, 58, 48, 38, 30, 22],
};
const MAX_ATTEMPTS = 6;

let allVideos = [];
let secondaryVideos = [];
let state = {
    current: null,
    score: 0,
    streak: 0,
    maxStreak: parseInt(localStorage.getItem("thumb_max_streak") || "0", 10),
    round: 0,
    revealed: false,
    activeSearchIndex: -1,
    pool: [],
    isEasyMode: false,
    isExtreme: false,
    maxAttempts: 6,
};

const $ = (id) => document.getElementById(id);
const els = {
    thumbCanvas: $("thumbCanvas"),
    guessInput: $("guessInput"),
    guessBtn: $("guessBtn"),
    newBtn: $("newBtn"),
    skipBtn: $("skipBtn"),
    status: $("status"),
    score: $("score"),
    streak: $("streak"),
    maxStreak: $("maxStreak"),
    rank: $("rank"),
    attempt: $("attempt"),
    videoCount: $("videoCount"),
    rounds: $("rounds"),
    reveal: $("reveal"),
    revealMedia: $("revealMedia"),
    revealTitle: $("revealTitle"),
    revealLinkText: $("revealLinkText"),
    watchLink: $("watchLink"),
    againBtn: $("againBtn"),
    searchResults: $("searchResults"),
    changeModeBtn: $("changeModeBtn"),
};

let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}
['click','touchstart','keydown','mousedown','pointerdown'].forEach(evt =>
    document.addEventListener(evt, () => { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }, { once: true })
);

function playSound(type) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'success') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
    } else if (type === 'fail') {
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(165, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    }
}

function normalize(text) {
    return String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenScore(guess, answer) {
    const guessWords = new Set(guess.split(" ").filter(Boolean));
    const answerWords = new Set(answer.split(" ").filter(Boolean));
    let hits = 0;
    guessWords.forEach((word) => { if (answerWords.has(word)) hits += 1; });
    return hits / Math.max(1, Math.min(6, answerWords.size), guessWords.size);
}

function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function formatDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function getRank(streak) {
    if (streak >= 12) return "RickyLord";
    if (streak >= 9) return "Élite";
    if (streak >= 6) return "Experto";
    if (streak >= 4) return "Ultra Fan";
    if (streak >= 2) return "Fan";
    return "Novato";
}

function updateStats() {
    els.score.textContent = state.score;
    els.streak.textContent = state.streak;
    els.maxStreak.textContent = state.maxStreak;
    els.rank.textContent = getRank(state.streak);
    els.attempt.textContent = `${Math.min(state.round + 1, state.maxAttempts)}/${state.maxAttempts}`;
    els.videoCount.textContent = allVideos.length + secondaryVideos.length;
    [...els.rounds.children].forEach((step, index) => {
        step.classList.toggle("active", index === state.round);
        step.classList.toggle("done", index < state.round);
    });
}

function getBlurLevels() {
    if (state.isExtreme) return BLUR_LEVELS.extreme;
    if (state.isEasyMode) return BLUR_LEVELS.easy;
    return BLUR_LEVELS.normal;
}

function updateBlurDisplay() {
    const levels = getBlurLevels();
    const blur = levels[Math.min(state.round, levels.length - 1)];
    els.thumbCanvas.style.filter = `blur(${blur}px)`;
}

function renderRounds() {
    els.rounds.innerHTML = "";
    for (let i = 0; i < state.maxAttempts; i++) {
        const item = document.createElement("div");
        item.className = "round-step";
        item.textContent = `${i + 1}`;
        els.rounds.appendChild(item);
    }
}

function selectRandomVideo() {
    if (state.pool.length === 0) {
        state.pool = shuffle([...allVideos, ...secondaryVideos]);
    }
    return state.pool.pop();
}

function loadThumbnailToCanvas(url) {
    const canvas = els.thumbCanvas;
    const ctx = canvas.getContext('2d');
    fetch(url)
        .then(r => r.blob())
        .then(blob => {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.naturalWidth || 640;
                canvas.height = img.naturalHeight || 360;
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(img.src);
            };
            img.src = URL.createObjectURL(blob);
        })
        .catch(() => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function() {
                canvas.width = img.naturalWidth || 640;
                canvas.height = img.naturalHeight || 360;
                ctx.drawImage(img, 0, 0);
            };
            img.src = url;
        });
}

function newRound() {
    state.current = selectRandomVideo();
    state.round = 0;
    state.revealed = false;
    els.reveal.classList.remove("show");
    els.revealMedia.innerHTML = "";
    els.guessInput.value = "";
    hideSearchResults();
    els.guessInput.disabled = false;
    els.guessBtn.disabled = false;
    els.newBtn.disabled = false;
    els.skipBtn.disabled = false;
    if (els.changeModeBtn) els.changeModeBtn.style.display = "";

    els.thumbCanvas.style.display = "";
    els.guessInput.style.display = "";
    els.guessBtn.style.display = "";
    els.thumbCanvas.style.filter = `blur(${getBlurLevels()[0]}px)`;
    loadThumbnailToCanvas(`https://img.youtube.com/vi/${state.current.id}/maxresdefault.jpg`);

    els.status.textContent = state.isExtreme
        ? "Modo Extremo: Imagen muy borrosa, sin miniaturas en el buscador."
        : state.isEasyMode
        ? "Adivina el vídeo. Empiezas con menos desenfoque. Tienes 4 intentos."
        : "Adivina el vídeo. Tienes 6 intentos.";
    renderRounds();
    updateBlurDisplay();
    updateStats();
}

function submitGuess() {
    if (!state.current || state.revealed) return;
    hideSearchResults();
    const guess = normalize(els.guessInput.value);
    const answer = normalize(state.current.title);
    if (!guess) {
        els.status.textContent = "Escribe algo antes de adivinar.";
        return;
    }

    if (answer.includes(guess) || tokenScore(guess, answer) >= 0.68) {
        const points = Math.max(10, 60 - state.round * 10);
        state.score += points;
        state.streak += 1;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
            localStorage.setItem("thumb_max_streak", state.maxStreak);
        }
        if (!state.isExtreme) els.thumbCanvas.style.filter = "blur(0px)";
        reveal(true, `Acertaste. +${points} puntos.`);
        setTimeout(() => playSound('success'), 100);
        return;
    }

    els.status.textContent = "No era ese. Siguiente pista.";
    setTimeout(() => playSound('fail'), 100);
    nextRound(false);
}

function nextRound(showMessage = true) {
    if (state.revealed) return;
    state.round += 1;
    if (state.round >= state.maxAttempts) {
        state.streak = 0;
        if (!state.isExtreme) els.thumbCanvas.style.filter = "blur(0px)";
        reveal(false, "Se acabaron los intentos.");
        setTimeout(() => playSound('fail'), 100);
        return;
    }
    updateBlurDisplay();
    updateStats();
    if (showMessage) {
        els.status.textContent = `Siguiente pista: ${state.round + 1}/${state.maxAttempts}.`;
    }
}

function reveal(won, message) {
    state.revealed = true;
    els.guessInput.disabled = true;
    els.guessBtn.disabled = true;
    els.skipBtn.disabled = true;
    if (els.changeModeBtn) els.changeModeBtn.style.display = "none";
    els.status.textContent = message;
    els.revealTitle.textContent = won
        ? `Correcto: ${state.current.title}`
        : state.current.title;
    els.revealMedia.innerHTML = `<iframe title="Vídeo revelado" src="https://www.youtube.com/embed/${state.current.id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    els.watchLink.href = `https://www.youtube.com/watch?v=${state.current.id}`;
    els.watchLink.style.display = "";
    els.revealLinkText.textContent = "Escucha el vídeo aquí";
    els.reveal.classList.add("show");
    updateStats();
}

function renderSearchResults() {
    state.activeSearchIndex = -1;
    const query = normalize(els.guessInput.value);
    if (query.length < 2) { hideSearchResults(); return; }

    const pool = [...allVideos, ...secondaryVideos];
    const terms = query.split(" ").filter(Boolean);
    const matches = pool.filter((video) => {
        const title = normalize(video.title);
        return terms.every((term) => title.includes(term));
    });

    matches.sort((a, b) => {
        const titleA = normalize(a.title);
        const titleB = normalize(b.title);
        const aStarts = titleA.startsWith(query) ? 1 : 0;
        const bStarts = titleB.startsWith(query) ? 1 : 0;
        return bStarts - aStarts || titleA.length - titleB.length;
    });

    if (!matches.length) {
        els.searchResults.innerHTML = `<div class="search-summary">No hay títulos con "${escapeHtml(els.guessInput.value)}"</div>`;
        els.searchResults.classList.add("show");
        return;
    }

    const maxResults = 8;
    const visibleMatches = matches.slice(0, maxResults);

    els.searchResults.innerHTML = `
        <div class="search-summary">
          ${matches.length} resultado${matches.length === 1 ? "" : "s"}
          ${matches.length > maxResults ? ` (mostrando los primeros ${maxResults})` : ""}
        </div>
        ${visibleMatches.map((video) => `
            <button class="search-option" type="button" data-title="${escapeHtml(video.title)}">
              ${state.isExtreme ? '' : `<img class="search-option-thumb" src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="">`}
              <div class="search-option-info">
                <div class="search-option-title">${escapeHtml(video.title)}</div>
                <div class="search-option-meta">${formatDuration(video.duration || 0)}</div>
              </div>
            </button>
        `).join("")}
        <button class="search-option search-submit" type="button" style="justify-content:center;color:var(--yellow);font-weight:900;">
          Buscar en YouTube ↗
        </button>
    `;
    els.searchResults.classList.add("show");
    els.searchResults.querySelectorAll(".search-option").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.classList.contains("search-submit")) {
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(els.guessInput.value)}`, "_blank");
                return;
            }
            els.guessInput.value = button.dataset.title;
            hideSearchResults();
            els.guessInput.focus();
        });
    });
}

function updateSearchHighlight(buttons) {
    buttons.forEach((btn, idx) => {
        if (idx === state.activeSearchIndex) {
            btn.classList.add("selected");
            btn.scrollIntoView({ block: "nearest" });
        } else {
            btn.classList.remove("selected");
        }
    });
}

function hideSearchResults() {
    els.searchResults.classList.remove("show");
    els.searchResults.innerHTML = "";
}

els.guessBtn.addEventListener("click", submitGuess);
els.newBtn.addEventListener("click", newRound);
els.againBtn.addEventListener("click", newRound);
els.skipBtn.addEventListener("click", () => nextRound());

els.guessInput.addEventListener("keydown", (event) => {
    const buttons = els.searchResults.querySelectorAll(".search-option");
    if (buttons.length > 0 && (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter")) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            state.activeSearchIndex = (state.activeSearchIndex + 1) % buttons.length;
            updateSearchHighlight(buttons);
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            state.activeSearchIndex = (state.activeSearchIndex - 1 + buttons.length) % buttons.length;
            updateSearchHighlight(buttons);
            return;
        }
        if (event.key === "Enter" && state.activeSearchIndex >= 0) {
            event.preventDefault();
            buttons[state.activeSearchIndex].click();
            return;
        }
    }
    if (event.key === "Enter") submitGuess();
    if (event.key === "Escape") hideSearchResults();
});

els.guessInput.addEventListener("input", renderSearchResults);

document.addEventListener("click", (event) => {
    if (!event.target.closest(".guess-row")) hideSearchResults();
});

// Hover sounds en TODOS los botones y enlaces
document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn, input[type="text"]');
    if (el) playSound('click');
});

// Start screen
let currentDifficulty = 'normal';
const startScreen = document.getElementById("startScreen");

function setupStartAccordion(toggleId, cardId) {
    const toggle = document.getElementById(toggleId);
    const card = document.getElementById(cardId);
    if (toggle && card) {
        toggle.addEventListener("click", () => {
            const wasOpen = card.classList.contains("open");
            document.querySelectorAll(".mode-card.open").forEach(c => c.classList.remove("open"));
            if (!wasOpen) card.classList.add("open");
            playSound('click');
        });
    }
}

setupStartAccordion("principalModeToggle", "principalModeCard");
setupStartAccordion("secondaryModeToggle", "secondaryModeCard");
setupStartAccordion("bothModeToggle", "bothModeCard");

// Difficulty buttons - class-based listeners
document.querySelectorAll('.start-easy-btn').forEach(btn => {
    btn.addEventListener("click", () => {
        currentDifficulty = 'easy';
        document.querySelectorAll('.start-easy-btn').forEach(b => b.classList.add("active"));
        document.querySelectorAll('.start-normal-btn').forEach(b => b.classList.remove("active"));
        document.querySelectorAll('.start-extreme-btn').forEach(b => b.classList.remove("active"));
        playSound('click');
    });
});
document.querySelectorAll('.start-normal-btn').forEach(btn => {
    btn.addEventListener("click", () => {
        currentDifficulty = 'normal';
        document.querySelectorAll('.start-normal-btn').forEach(b => b.classList.add("active"));
        document.querySelectorAll('.start-easy-btn').forEach(b => b.classList.remove("active"));
        document.querySelectorAll('.start-extreme-btn').forEach(b => b.classList.remove("active"));
        playSound('click');
    });
});
document.querySelectorAll('.start-extreme-btn').forEach(btn => {
    btn.addEventListener("click", () => {
        currentDifficulty = 'extreme';
        document.querySelectorAll('.start-extreme-btn').forEach(b => b.classList.add("active"));
        document.querySelectorAll('.start-normal-btn').forEach(b => b.classList.remove("active"));
        document.querySelectorAll('.start-easy-btn').forEach(b => b.classList.remove("active"));
        playSound('click');
    });
});

// Info buttons
document.querySelectorAll('.info-toggle-btn').forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById('infoModal').classList.add('show');
        playSound('click');
    });
});

function startGame() {
    state.isEasyMode = currentDifficulty === 'easy';
    state.isExtreme = currentDifficulty === 'extreme';
    state.maxAttempts = 6;
    state.pool = [];
    allVideos = (window.RICKY_VIDEOS || []).filter(v => v && v.id);
    secondaryVideos = (window.RICKY_SECONDARY || []).filter(v => v && v.id);
    startScreen.classList.add("hide");
    document.body.style.overflow = "auto";
    renderRounds();
    updateStats();
    newRound();
    playSound('success');
}

if (document.getElementById("startGameBtn")) {
    document.getElementById("startGameBtn").addEventListener("click", startGame);
}
if (document.getElementById("startSecondaryGameBtn")) {
    document.getElementById("startSecondaryGameBtn").addEventListener("click", startGame);
}
if (document.getElementById("startBothGameBtn")) {
    document.getElementById("startBothGameBtn").addEventListener("click", startGame);
}

// Elegir otro
if (els.changeModeBtn) {
    els.changeModeBtn.addEventListener("click", () => {
        els.revealMedia.innerHTML = "";
        els.reveal.classList.remove("show");
        els.thumbCanvas.style.filter = "none";
        els.thumbCanvas.style.display = "none";
        els.thumbImgHidden.src = "";
        const ctx = els.thumbCanvas.getContext('2d');
        ctx.clearRect(0, 0, els.thumbCanvas.width, els.thumbCanvas.height);
        document.querySelectorAll(".mode-card.open").forEach(c => c.classList.remove("open"));
        startScreen.classList.remove("hide");
        document.body.style.overflow = "hidden";
        els.changeModeBtn.style.display = "none";
    });
}

// Init data
allVideos = (window.RICKY_VIDEOS || []).filter(v => v && v.id);
secondaryVideos = (window.RICKY_SECONDARY || []).filter(v => v && v.id);
