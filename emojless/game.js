const EMOJI_DATA = {
    "ir": "🚶🛣️🌃🌙💨🖤",
    "si mañana": "🌅☁️⏳🤔🌧️💭",
    "diva virtual": "👩🤖💻💬📸🌐",
    "lo siento": "😔💔🥀😭🌧️🖤",
    "rango superior": "📈💸👑🚀🔥🏆",
    "hoa": "🌺🌴☀️🌊🍹✨",
    "prioridad": "❤️📲💬⏰⚡📞",
    "otra vida": "🕊️➡️🧑‍🦲🪐🌠✨",
    "quema": "🔥❄️🚬🖤⚡🥀",
    "paqué": "🤷🧟😵‍💫💭🌀🙃",
    "caliente": "🥵🔥☀️💋❤️🌡️",
    "noche": "🌙🌃🌧️🚬✨🖤",
    "badabadún": "🏫✏️🎵🎉🕺🔥",
    "y más allá": "🚀🌌⭐🪐🌠✨",
    "casa": "🏠🛋️📺☕🚪🪟",
    "gourmet": "🍔🍕🌮🍟🍣🍰",
    "en verdad": "💧🚿❤️💭🖤⚖️",
    "por ti": "✖️❤️🌹💌🫶🥀",
    "mi habitación": "🛏️🎧💻📱🏡🪑",
    "era": "⏳📼🕰️🥀💭🖤",
    "u banned": "🚫🔨💻⚠️😡💀",
    "4k/mes": "💸📈🤑💰💻🏦",
    "mamisabesqno": "👧❌🌙😵‍💫💭🌀",
    "navimal": "🎄🎁🔔❄️☃️🦌",
    "quelamamen": "😈🌶️🔥🖤⚡🌹",
    "blu": "🔵🌊💙🫧🐟🌙",
    "COVID-AD": "🦠😷🧻🎄🔔❄️",
    "el otro era yo": "👥👤🪞👀🤔🎭",
    "mansana": "💃🍎🐍🚫🌳🦷",
    "fórmula secreta": "🧪🤫🍔📝🔬🧫",
    "ABISMO": "🕳️🌑🧗‍♂️📉😵‍💫🖤",
    "romilar": "💊💐🤒🏥🤢🩸",
    "Parche": "👁️🩹🚢🏴‍☠️🤕🛠️",
    "Así Es Internet": "🌐💻🤡📱🔥🌍",
    "Querido Youtube": "🎥▶️💌📉💸😡",
    "Dolorfoda": "💔🤕🖤🥀🌧️😭",
    "Soy Un Tryhard": "🎮💦🖱️⌨️🏆🔥",
    "50 Rimas Sobre Mi": "🎤5️⃣0️⃣📝🗣️🔥",

    // ── PARODIANDO CANCIONES ─────────────────────────────────────────────
    "Parodiando Canciones 1": "🎵1️⃣😂🎤🤣🎶",
    "Parodiando Canciones 2": "🎵2️⃣😂🎤🤣🎶",
    "Parodiando Canciones 3": "🎵3️⃣🤣🎤🤣🎶",
    "Parodiando Canciones 4": "🎵4️⃣🤣🎤🤣🎶",
    "Parodiando Canciones 5": "🎵5️⃣🤣🎤🤣🎶",
    "Parodiando Canciones 6": "🎵6️⃣😂🎤🤣🎶",
    "Parodiando Canciones 7": "🎵7️⃣😂🎤🤣🎶",
    "Parodiando Canciones (El Mashup)": "🎵🎛️🎚️🎶🔀🎭",

    // ── OTRAS ────────────────────────────────────────────────────────────
    "FRIKY": "🤓💔📱🚫😅💬",
    "Mis 20 Canciones": "🎵2️⃣0️⃣🎤🎶📝🎸",
};

const SONGS = window.RICKY_SONGS || [];
let MAX_ATTEMPTS = 6;

let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}
['click','touchstart','keydown','mousedown','pointerdown'].forEach(evt =>
    document.addEventListener(evt, () => { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }, { once: true })
);

function playSound(type) {
    const ctx = getAudioCtx();
    if (!ctx) return;
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

const SONG_MAP = {};
Object.keys(EMOJI_DATA).forEach(key => {
    const normalizedKey = normalize(key);
    const found = SONGS.find(s => normalize(s.title).startsWith(normalizedKey));
    if (found) SONG_MAP[key] = found;
});

const state = {
    current: null,
    score: 0,
    streak: 0,
    maxStreak: parseInt(localStorage.getItem("emojless_max_streak") || "0", 10),
    round: 0,
    revealed: false,
    activeSearchIndex: -1,
    correct: 0,
    total: 0,
};

const $ = (id) => document.getElementById(id);
const els = {
    emojiDisplay: $("emojiDisplay"),
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
};

function normalize(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9ñ ]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenScore(guess, answer) {
    const guessWords = new Set(guess.split(" ").filter(Boolean));
    const answerWords = new Set(answer.split(" ").filter(Boolean));
    let hits = 0;
    guessWords.forEach((word) => {
        if (answerWords.has(word)) hits += 1;
    });
    return hits / Math.max(1, Math.min(6, answerWords.size), guessWords.size);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function splitEmojis(str) {
    return [...str].filter(ch => ch !== "\uFE0F" && ch !== "\u200D");
}

function getRank(streak) {
    if (streak >= 12) return "RickyLord";
    if (streak >= 9) return "\u00c9lite";
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
    els.attempt.textContent = `${Math.min(state.round + 1, MAX_ATTEMPTS)}/${MAX_ATTEMPTS}`;
    els.videoCount.textContent = SONGS.length;
    [...els.rounds.children].forEach((step, index) => {
        step.classList.toggle("active", index === state.round);
        step.classList.toggle("done", index < state.round);
    });
}

function updateEmojiDisplay() {
    if (!state.current) return;
    const allEmojis = splitEmojis(state.current.emojis);
    const startVisible = easyMode ? 3 : 1;
    const visible = allEmojis.slice(0, startVisible + state.round);
    const hidden = allEmojis.slice(startVisible + state.round).map(() => "\u2753");
    els.emojiDisplay.textContent = [...visible, ...hidden].join(" ");
}

function renderRounds() {
    els.rounds.innerHTML = "";
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const item = document.createElement("div");
        item.className = "round-step";
        item.textContent = `${i + 1}`;
        els.rounds.appendChild(item);
    }
}

function selectRandomSong() {
    const keys = Object.keys(EMOJI_DATA);
    if (noRepeatMode && usedSongs.length >= keys.length) usedSongs = [];
    let available = noRepeatMode ? keys.filter(k => !usedSongs.includes(k)) : keys;
    if (!available.length) available = keys;
    const key = available[Math.floor(Math.random() * available.length)];
    usedSongs.push(key);
    return { title: key, emojis: EMOJI_DATA[key] };
}

function newRound() {
    state.current = selectRandomSong();
    state.round = 0;
    state.revealed = false;
    els.reveal.classList.remove("show");
    els.revealMedia.innerHTML = "";
    els.guessInput.value = "";
    hideSearchResults();
    els.guessInput.disabled = false;
    els.guessBtn.disabled = false;
    els.newBtn.disabled = false;
    els.status.textContent = easyMode
        ? "Adivina la canción. Empiezas con 3 emojis. Tienes 4 intentos."
        : "Adivina la canción. Tienes 6 intentos.";
    renderRounds();
    updateEmojiDisplay();
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

    const songInfo = SONG_MAP[state.current.title];
    const fullTitle = songInfo ? normalize(songInfo.title) : answer;
    if (fullTitle.includes(guess) || answer.includes(guess) || tokenScore(guess, answer) >= 0.68) {
        const points = Math.max(10, 60 - state.round * 10);
        state.score += points;
        state.streak += 1;
        state.correct++;
        state.total++;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
            localStorage.setItem("emojless_max_streak", state.maxStreak);
        }
        reveal(true, `Acertaste. +${points} puntos.`);
        setTimeout(() => playSound('success'), 100);
        return;
    }

    state.total++;
    els.status.textContent = "No era ese. Te revelo otro emoji.";
    setTimeout(() => playSound('fail'), 100);
    nextRound(false);
}

function nextRound(showMessage = true) {
    if (state.revealed) return;
    state.round += 1;
    if (state.round >= MAX_ATTEMPTS) {
        state.streak = 0;
        reveal(false, "Se acabaron los intentos.");
        return;
    }
    updateEmojiDisplay();
    updateStats();
    if (showMessage) {
        els.status.textContent = `Siguiente intento: ${state.round + 1}/${MAX_ATTEMPTS}.`;
    }
}

function reveal(won, message) {
    state.revealed = true;
    els.guessInput.disabled = true;
    els.guessBtn.disabled = true;
    els.status.textContent = message;
    els.revealTitle.textContent = won
        ? `Correcto: ${state.current.title}`
        : state.current.title;

    const songInfo = SONG_MAP[state.current.title];
    if (songInfo) {
        els.revealMedia.innerHTML = `<iframe title="Canción revelada" src="https://www.youtube.com/embed/${songInfo.id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        els.watchLink.href = `https://www.youtube.com/watch?v=${songInfo.id}`;
        els.watchLink.style.display = "";
        els.revealLinkText.textContent = "";
    } else {
        els.revealMedia.innerHTML = "No disponible";
        els.revealLinkText.textContent = "Enlace no disponible";
        els.watchLink.style.display = "none";
    }

    els.reveal.classList.add("show");
    updateEmojiDisplay();
    updateStats();
}

let searchVisibleCount = 8;

function renderSearchResults() {
    state.activeSearchIndex = -1;
    const query = normalize(els.guessInput.value);
    if (query.length < 1) {
        hideSearchResults();
        return;
    }

    const terms = query.split(" ").filter(Boolean);
    const matches = SONGS.filter((song) => {
        const title = normalize(song.title);
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
        els.searchResults.innerHTML = `<div class="search-summary">No hay resultados para "${escapeHtml(els.guessInput.value)}"</div>`;
        els.searchResults.classList.add("show");
        return;
    }

    const visibleMatches = matches.slice(0, searchVisibleCount);
    const remaining = matches.length - visibleMatches.length;

    let html = `<div class="search-summary">${matches.length} resultado${matches.length === 1 ? "" : "s"}</div>`;
    visibleMatches.forEach((song) => {
        html += `
            <button class="search-option" type="button" data-title="${escapeHtml(song.title)}">
              <img class="search-option-thumb" src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" alt="">
              <div class="search-option-info">
                <div class="search-option-title">${escapeHtml(song.title)}</div>
                <div class="search-option-meta">${song.year}</div>
              </div>
            </button>`;
    });
    if (remaining > 0) {
        html += `<button class="search-option search-more" type="button" style="justify-content:center;color:var(--pink);font-weight:900;">Ver más (${remaining} restantes)</button>`;
    }

    els.searchResults.innerHTML = html;
    els.searchResults.classList.add("show");
    els.searchResults.querySelectorAll(".search-option").forEach((button) => {
        button.addEventListener("click", () => {
            playSound('click');
            if (button.classList.contains("search-more")) {
                searchVisibleCount += 8;
                renderSearchResults();
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

els.guessBtn.addEventListener("click", () => { playSound('click'); submitGuess(); });
els.newBtn.addEventListener("click", () => { playSound('click'); newRound(); });
els.againBtn.addEventListener("click", () => { playSound('click'); newRound(); });
els.skipBtn.addEventListener("click", () => { playSound('click'); nextRound(); });

els.guessInput.addEventListener("keydown", (event) => {
    const buttons = els.searchResults.querySelectorAll(".search-option");
    if (
        buttons.length > 0 &&
        (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter")
    ) {
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

// Start screen
let easyMode = false;
let noRepeatMode = true;
let usedSongs = [];

const startScreen = document.getElementById("startScreen");
const normalToggle = document.getElementById("normalModeToggle");
const normalCard = document.getElementById("normalModeCard");
const startEasyBtn = document.getElementById("startEasyBtn");
const startNormalBtn = document.getElementById("startNormalBtn");
const startGameBtn = document.getElementById("startGameBtn");

if (normalToggle && normalCard) {
    normalToggle.addEventListener("click", () => {
        playSound('click');
        const wasOpen = normalCard.classList.contains("open");
        document.querySelectorAll(".mode-card.open").forEach(c => c.classList.remove("open"));
        if (!wasOpen) normalCard.classList.add("open");
    });
}

if (startEasyBtn) {
    startEasyBtn.addEventListener("click", () => {
        playSound('click');
        easyMode = true;
        startEasyBtn.classList.add("active");
        startNormalBtn.classList.remove("active");
    });
}

if (startNormalBtn) {
    startNormalBtn.addEventListener("click", () => {
        playSound('click');
        easyMode = false;
        startNormalBtn.classList.add("active");
        startEasyBtn.classList.remove("active");
    });
}

const startNoRepeatBtn = document.getElementById("startNoRepeatBtn");
const startRandomBtn = document.getElementById("startRandomBtn");

if (startNoRepeatBtn) {
    startNoRepeatBtn.addEventListener("click", () => {
        playSound('click');
        noRepeatMode = true;
        startNoRepeatBtn.classList.add("active");
        startRandomBtn.classList.remove("active");
    });
}

if (startRandomBtn) {
    startRandomBtn.addEventListener("click", () => {
        playSound('click');
        noRepeatMode = false;
        startRandomBtn.classList.add("active");
        startNoRepeatBtn.classList.remove("active");
    });
}

if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
        playSound('success');
        startScreen.classList.add("hide");
        document.body.style.overflow = "auto";
        if (easyMode) {
            MAX_ATTEMPTS = 4;
            document.getElementById("segmentsInfo").textContent = "Empiezas con 3 emojis visibles. Cada fallo revela uno más. Tienes 4 intentos.";
        } else {
            MAX_ATTEMPTS = 6;
            document.getElementById("segmentsInfo").textContent = "Empiezas con 1 emoji visible. Cada fallo revela uno más. Tienes 6 intentos.";
        }
        renderRounds();
        newRound();
    });
}

// Hover sounds en TODOS los botones y enlaces
const _hoveredEls = new WeakSet();
document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn, input[type="text"]');
    if (el && !_hoveredEls.has(el)) { _hoveredEls.add(el); playSound('click'); }
});
document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn, input[type="text"]');
    if (el) _hoveredEls.delete(el);
});

// Info buttons
document.querySelectorAll('.info-toggle-btn').forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById('infoModal').classList.add('show');
        playSound('click');
    });
});

// Letter modal
const letterModal = document.getElementById('letterModal');
const openLetterBtn = document.getElementById('openLetterBtn');
const closeLetterBtn = document.getElementById('closeLetterBtn');

if (openLetterBtn) {
    openLetterBtn.addEventListener('click', () => {
        playSound('click');
        letterModal.classList.add('show');
        localStorage.setItem('emojless_message_shown', 'true');
    });
}
if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
        playSound('click');
        letterModal.classList.remove('show');
    });
}
if (letterModal) {
    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) letterModal.classList.remove('show');
    });
    // Show letter once on first visit, but not if updates modal is open
    if (!localStorage.getItem('emojless_message_shown')) {
        setTimeout(() => {
            const updatesModal = document.getElementById('rlbUpdatesModal');
            if (!updatesModal || !updatesModal.classList.contains('show')) {
                letterModal.classList.add('show');
            }
            localStorage.setItem('emojless_message_shown', 'true');
        }, 1500);
    }
}

// Info modal content
const EMOJLESS_INFO_HTML =
    '<h3>🆕 ¡Bienvenido a Emojless!</h3>' +
    '<p>Este es un juego nuevo donde tienes que <span class="upd-highlight">adivinar canciones de Rickyedit</span> solo con emojis.</p>' +
    '<hr class="upd-sep">' +
    '<h3>🎮 Cómo se juega</h3>' +
    '<ul>' +
    '<li>Se te muestran los emojis de una canción</li>' +
    '<li>Escribe el nombre en el buscador y selecciónalo</li>' +
    '<li>Cada fallo revela un emoji más</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3>😎 Modos</h3>' +
    '<ul>' +
    '<li><span class="upd-highlight">Cagado</span> — Empiezas con 3 emojis y tienes 4 intentos</li>' +
    '<li><span class="upd-highlight">Normal</span> — Empiezas con 1 emoji y tienes 6 intentos</li>' +
    '<li><span class="upd-highlight">Sin repetir</span> — No se repite ninguna canción</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
    '<p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>';

function showEmojlessInfo() {
    if (letterModal) letterModal.classList.remove('show');
    RickyUpdates.forceShow(EMOJLESS_INFO_HTML);
}

// Info buttons (start screen + game topbar)
document.querySelectorAll('#openUpdatesBtn, #startOpenUpdatesBtn').forEach(btn => {
    btn.addEventListener('click', () => { playSound('click'); showEmojlessInfo(); });
});

// Leaderboard
let emojlessGameStartTime = null;

// Set game start time when player clicks start
if (startGameBtn) {
    const origListener = startGameBtn.onclick;
    startGameBtn.addEventListener("click", () => {
        emojlessGameStartTime = Date.now();
    });
}

const finalizeBtn = document.getElementById('finalizeBtn');
if (finalizeBtn) {
    finalizeBtn.addEventListener('click', () => {
        playSound('click');
        const elapsed = emojlessGameStartTime ? ((Date.now() - emojlessGameStartTime) / 1000).toFixed(1) : null;
        RickyLeaderboard.save('emojless', {
            score: state.score,
            difficulty: easyMode ? 'easy' : 'normal',
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0
        }, () => {
            document.getElementById('reveal').classList.remove('show');
            document.getElementById('startScreen').classList.remove('hide');
            document.body.style.overflow = 'hidden';
            renderEmojlessLeaderboard();
        });
    });
}

const leaderboardToggle = document.getElementById('leaderboardToggle');
if (leaderboardToggle) {
    leaderboardToggle.addEventListener('click', () => {
        playSound('click');
        const panel = document.getElementById('leaderboardPanel');
        panel.classList.toggle('visible');
    });
}
renderEmojlessLeaderboard();

function renderEmojlessLeaderboard() {
    RickyLeaderboard.render('leaderboardContainer', 'emojless', {
        title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top — Emojless',
        columns: ['rank', 'name', 'correct', 'total', 'percent', 'time', 'difficulty', 'date'],
        difficulties: ['easy', 'normal'],
        maxRows: 20
    });
}

// Updates modal
RickyUpdates.show('emojless', 'v2.0', `
    <h3>🆕 ¡Bienvenido a Emojless!</h3>
    <p>Este es un juego nuevo donde tienes que <span class="upd-highlight">adivinar canciones de Rickyedit</span> solo con emojis.</p>
    <hr class="upd-sep">
    <h3>🎮 Cómo se juega</h3>
    <ul>
        <li>Se te muestran los emojis de una canción</li>
        <li>Escribe el nombre en el buscador y selecciónalo</li>
        <li>Cada fallo revela un emoji más</li>
    </ul>
    <hr class="upd-sep">
    <h3>😎 Modos</h3>
    <ul>
        <li><span class="upd-highlight">Cagado</span> — Empiezas con 3 emojis y tienes 4 intentos</li>
        <li><span class="upd-highlight">Normal</span> — Empiezas con 1 emoji y tienes 6 intentos</li>
        <li><span class="upd-highlight">Sin repetir</span> — No se repite ninguna canción</li>
    </ul>
    <hr class="upd-sep">
    <h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>
    <p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>
`);
