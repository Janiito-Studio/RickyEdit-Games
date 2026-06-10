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
    "parche": "👁️🩹🚢🏴‍☠️🤕🛠️",
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

let _currentOsc = null;
function playSound(type) {
    var vol = (typeof RickyVolume !== 'undefined') ? RickyVolume.get() : 1;
    if (vol <= 0) return;
    if (_currentOsc) { try { _currentOsc.stop(); } catch(e) {} _currentOsc = null; }
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
        gain.gain.setValueAtTime(0.04 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
    } else if (type === 'fail') {
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(165, now + 0.25);
        gain.gain.setValueAtTime(0.05 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.03 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'lifeloss') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);
        gain.gain.setValueAtTime(0.06 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
    }
    _currentOsc = osc;
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
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return [...segmenter.segment(str)].map(s => s.segment);
    }
    return [...str].filter(ch => ch !== "\uFE0F" && ch !== "\u200D" && ch !== "\u20E3");
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
    const totalSlots = Math.max(allEmojis.length, 6);
    const startVisible = easyMode ? 3 : 1;
    const visibleCount = Math.min(startVisible + state.round, totalSlots);
    const visible = allEmojis.slice(0, visibleCount);
    const hidden = [];
    for (let i = visibleCount; i < totalSlots; i++) hidden.push("\u2753");
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
    let available = keys;
    /* Filter by selected years if any (skip if Todas is active) */
    if (!todasActive && selectedYears.size > 0) {
        available = keys.filter(k => {
            const song = SONG_MAP[k];
            return song && selectedYears.has(song.year);
        });
        if (!available.length) available = keys;
    }
    if (noRepeatMode && usedSongs.length >= available.length) {
        // Show completion overlay
        document.getElementById('completionScore').textContent = state.score;
        document.getElementById('completionOverlay').classList.add('show');
        state.revealed = true;
        els.guessInput.disabled = true;
        els.guessBtn.disabled = true;
        els.status.textContent = '<img src="../Iconos RickyEdit Web/🎉.png" alt="" style="width:2.2em;height:2.2em;vertical-align:middle;margin-right:4px;"> ¡Completaste todas las canciones!';
        return { title: 'completion', emojis: '<img src="../Iconos RickyEdit Web/🎉.png" alt="" style="width:120px;height:120px;">' };
    }
    let filtered = noRepeatMode ? available.filter(k => !usedSongs.includes(k)) : available;
    if (!filtered.length) filtered = available;
    const key = filtered[Math.floor(Math.random() * filtered.length)];
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

    if (guess.length < 2) {
        els.status.textContent = "Escribe al menos 2 caracteres.";
        return;
    }
    const songInfo = SONG_MAP[state.current.title];
    const fullTitle = songInfo ? normalize(songInfo.title) : answer;
    if (fullTitle === guess || answer === guess) {
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
        failCount = 0;
        setTimeout(() => playSound('success'), 100);
        return;
    }

    state.total++;
    els.status.textContent = "No era ese. Te revelo otro emoji.";
    setTimeout(() => playSound('fail'), 100);
    nextRound(false);
    failCount++;
    if (failCount >= 2) {
        failCount = 0;
        if (loseLife()) return;
    }
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

let searchVisibleCount = 5;

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
        const showCount = Math.min(remaining, 8);
        html += `<button class="search-option search-more" type="button" style="justify-content:center;color:var(--pink);font-weight:900;">Ver ${showCount} más</button>`;
    }

    els.searchResults.innerHTML = html;
    els.searchResults.classList.add("show");
    els.searchResults.querySelectorAll(".search-option").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
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
els.skipBtn.addEventListener("click", () => {
    playSound('click');
    state.total++;
    nextRound(false);
    failCount++;
    if (failCount >= 2) {
        failCount = 0;
        if (loseLife()) return;
    }
});

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

els.guessInput.addEventListener("input", () => { searchVisibleCount = 5; renderSearchResults(); });

document.addEventListener("click", (event) => {
    if (!event.target.closest(".guess-row")) hideSearchResults();
});

// Start screen
let easyMode = false;
let noRepeatMode = true;
let usedSongs = [];
let livesEnabled = false;
let lives = 3;
let MAX_LIVES = 3;
let failCount = 0;
let usedExtraLife = false;
let gameOverByLives = false;

function updateLivesDisplay() {
    var el = document.getElementById('livesDisplay');
    if (!el) return;
    if (!livesEnabled) {
        el.style.display = 'none';
        try { localStorage.removeItem('rlb_obs_lives'); } catch(e) {}
        try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE' }); } catch(e) {}
        return;
    }
    el.style.display = 'flex';
    var hearts = el.querySelectorAll('.life-heart');
    if (hearts.length !== MAX_LIVES) {
        el.innerHTML = '';
        for (var i = 0; i < MAX_LIVES; i++) {
            var img = document.createElement('img');
            img.src = i < lives ? '../Iconos RickyEdit Web/Vida Entera.png' : '../Iconos RickyEdit Web/Vida Rota.png';
            img.alt = i < lives ? 'Vida' : 'Sin vida';
            img.className = 'life-heart';
            img.style.animationDelay = (i * 0.1) + 's';
            el.appendChild(img);
        }
    } else {
        hearts.forEach(function(img, i) {
            img.src = i < lives ? '../Iconos RickyEdit Web/Vida Entera.png' : '../Iconos RickyEdit Web/Vida Rota.png';
        });
    }
    try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: lives, max: MAX_LIVES })); } catch(e) {}
    try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: lives, max: MAX_LIVES }) }); } catch(e) {}
}

function resetLivesToLobby() {
    livesEnabled = false;
    updateLivesDisplay();
    try { localStorage.removeItem('rlb_obs_lives'); } catch(e) {}
    try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true }); } catch(e) {}
    if (window.RlbPlayer) RlbPlayer.signalLobby();
}

function loseLife() {
    if (!livesEnabled) return false;
    lives--;
    playSound('lifeloss');
    var _el = document.getElementById('livesDisplay');
    if (_el) {
        var _h = _el.querySelectorAll('.life-heart');
        if (_h[lives]) {
            _h[lives].src = '../Iconos RickyEdit Web/Vida Rota.png';
        }
    }
    try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: lives, max: MAX_LIVES })); } catch(e) {}
    try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: lives, max: MAX_LIVES }) }); } catch(e) {}
    if (lives <= 0) {
        setTimeout(() => gameOver(), 500);
        return true;
    }
    return false;
}

function gameOver() {
    state.revealed = true;
    gameOverByLives = true;
    els.guessInput.disabled = true;
    els.guessBtn.disabled = true;

    const elapsed = emojlessGameStartTime ? ((Date.now() - emojlessGameStartTime) / 1000).toFixed(1) : null;
    const scoreVal = state.score || 0;
    document.getElementById('gameoverScore').textContent = scoreVal > 0 ? scoreVal + ' puntos' : '';

    var heartsEl = document.getElementById('gameoverHearts');
    if (heartsEl) {
        heartsEl.innerHTML = '';
        for (var i = 0; i < MAX_LIVES; i++) {
            var img = document.createElement('img');
            img.src = '../Iconos RickyEdit Web/Vida Rota.png';
            img.alt = 'Sin vida';
            heartsEl.appendChild(img);
        }
    }

    document.getElementById('gameoverOverlay').classList.add('show');

    try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: 0, max: MAX_LIVES })); } catch(e) {}
    try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: 0, max: MAX_LIVES }) }); } catch(e) {}

    if (!usedExtraLife) {
        RickyLeaderboard.save('emojless', {
            score: state.score,
            difficulty: easyMode ? 'easy' : 'normal',
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, () => {});
    }
}

function hideGameoverOverlay() {
    document.getElementById('gameoverOverlay').classList.remove('show');
}

document.getElementById('gameoverRestartBtn').addEventListener('click', () => {
    playSound('click');
    resetLivesToLobby();
    hideGameoverOverlay();
    document.getElementById('reveal').classList.remove('show');
    document.getElementById('startScreen').classList.remove('hide');
    document.body.style.overflow = 'hidden';
});

document.getElementById('gameoverHomeBtn').addEventListener('click', () => {
    playSound('click');
    resetLivesToLobby();
    hideGameoverOverlay();
    document.getElementById('reveal').classList.remove('show');
    document.getElementById('startScreen').classList.remove('hide');
    document.body.style.overflow = 'hidden';
    renderEmojlessLeaderboard();
});

/* ── +1 Vida extra button logic ── */
function showExtraLifeToast(msg) {
    var t = document.createElement('div');
    t.className = 'extralife-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
        t.classList.remove('show');
        setTimeout(function () { t.remove(); }, 300);
    }, 2200);
}

function showExtraLifeConfirm(onConfirm) {
    var modal = document.createElement('div');
    modal.className = 'extralife-modal';
    modal.innerHTML =
        '<div class="extralife-modal-card">' +
            '<div class="extralife-modal-header"><h2>+1 Vida</h2></div>' +
            '<div class="extralife-modal-body">' +
                '<p>¿Seguro que quieres añadir una vida extra?</p>' +
                '<p class="warning-text">Si usas esta opción, tu puntuación NO se guardará en el leaderboard.</p>' +
            '</div>' +
            '<div class="extralife-modal-actions">' +
                '<button class="btn-cancel" type="button">Cancelar</button>' +
                '<button class="btn-confirm" type="button">Confirmar</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    requestAnimationFrame(function () { modal.classList.add('show'); });

    function close() {
        modal.classList.remove('show');
        setTimeout(function () { modal.remove(); }, 300);
    }
    modal.querySelector('.btn-cancel').addEventListener('click', function () { playSound('click'); close(); });
    modal.querySelector('.btn-confirm').addEventListener('click', function () {
        playSound('click');
        close();
        try { localStorage.setItem('rlb_extralife_confirmed', '1'); } catch (e) {}
        onConfirm();
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
}

function addExtraLife(fromStart) {
    if (fromStart) {
        showExtraLifeToast('Dale a empezar para usarlo.');
        return;
    }
    if (!livesEnabled) {
        showExtraLifeToast('Primero activa las vidas para usar este botón.');
        return;
    }
    if (lives >= MAX_LIVES) {
        showExtraLifeToast('Ya tienes todas las vidas.');
        return;
    }
    function doAdd() {
        lives++;
        usedExtraLife = true;
        updateLivesDisplay();
        showExtraLifeToast('+1 Vida añadida. Tu puntuación no se guardará en el leaderboard.');
    }
    var confirmed = false;
    try { confirmed = localStorage.getItem('rlb_extralife_confirmed') === '1'; } catch (e) {}
    if (confirmed) {
        doAdd();
    } else {
        showExtraLifeConfirm(doAdd);
    }
}

document.getElementById('extraLifeBtn').addEventListener('click', function () { playSound('click'); addExtraLife(false); });
document.getElementById('startExtraLifeBtn').addEventListener('click', function () { playSound('click'); addExtraLife(true); });

const startScreen = document.getElementById("startScreen");
const normalToggle = document.getElementById("normalModeToggle");
const normalCard = document.getElementById("normalModeCard");
const startEasyBtn = document.getElementById("startEasyBtn");
const startNormalBtn = document.getElementById("startNormalBtn");
const startGameBtn = document.getElementById("startGameBtn");

/* ── Year filter ── */
let selectedYears = new Set();
let todasActive = false;
const yearChipsEl = document.getElementById("yearChips");

function buildEmojlessYearChips() {
    const yearSet = new Set();
    SONGS.forEach(s => { if (s.year) yearSet.add(s.year); });
    const years = [...yearSet].sort((a, b) => b - a);
    if (yearChipsEl) {
        yearChipsEl.innerHTML =
            '<button class="year-chip" data-year="">Todas</button>' +
            years.map(y => '<button class="year-chip" data-year="' + y + '">' + y + '</button>').join("");
    }
}

function updateEmojlessStartBtn() {
    if (startGameBtn) startGameBtn.disabled = !todasActive && selectedYears.size === 0;
}

if (yearChipsEl) {
    yearChipsEl.addEventListener("click", (e) => {
        const chip = e.target.closest(".year-chip");
        if (!chip) return;
        const yearVal = chip.dataset.year;
        if (yearVal === "") {
            const allYears = yearChipsEl.querySelectorAll(".year-chip:not([data-year=''])");
            const allActive = allYears.length === yearChipsEl.querySelectorAll(".year-chip.active:not([data-year=''])").length;
            yearChipsEl.querySelectorAll(".year-chip").forEach(c => c.classList.remove("active"));
            if (!allActive) {
                chip.classList.add("active");
                allYears.forEach(c => c.classList.add("active"));
                selectedYears = new Set();
                todasActive = true;
            } else {
                selectedYears = new Set();
                todasActive = false;
            }
        } else {
            yearChipsEl.querySelector(".year-chip[data-year='']").classList.remove("active");
            todasActive = false;
            chip.classList.toggle("active");
            selectedYears = new Set();
            yearChipsEl.querySelectorAll(".year-chip.active:not([data-year=''])").forEach(c => {
                selectedYears.add(Number(c.dataset.year));
            });
            const allIndiv = yearChipsEl.querySelectorAll(".year-chip:not([data-year=''])");
            if (selectedYears.size === allIndiv.length) {
                yearChipsEl.querySelector(".year-chip[data-year='']").classList.add("active");
                todasActive = true;
                selectedYears = new Set();
            }
        }
        updateEmojlessStartBtn();
    });
}

buildEmojlessYearChips();
updateEmojlessStartBtn();

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

const livesSelector = document.querySelector('.lives-selector');
if (livesSelector) {
    const hearts = livesSelector.querySelectorAll('.lives-heart-btn');
    const countEl = livesSelector.querySelector('.lives-selector-count');
    hearts.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            const val = parseInt(btn.dataset.lives, 10);
            if (livesEnabled && MAX_LIVES === val) {
                livesEnabled = false;
                try { localStorage.removeItem('rlb_obs_lives'); } catch(e) {}
        try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE' }); } catch(e) {}
                hearts.forEach(h => h.classList.remove('active'));
                if (countEl) countEl.textContent = '';
            } else {
                livesEnabled = true;
                if (window.RlbPlayer) RlbPlayer.signalGame();
                MAX_LIVES = val;
                try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: val, max: val })); } catch(e) {}
                try { var _pid = localStorage.getItem('rlb_player_id'); if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: val, max: val }) }); } catch(e) {}
                hearts.forEach(h => h.classList.remove('active'));
                for (let i = 0; i < val; i++) hearts[i].classList.add('active');
                if (countEl) countEl.textContent = val;
            }
        });
    });
}

if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
        playSound('success');
        startScreen.classList.add("hide");
        document.body.style.overflow = "auto";
        lives = MAX_LIVES;
        failCount = 0;
        usedExtraLife = false;
        gameOverByLives = false;
        updateLivesDisplay();
        if (easyMode) {
            MAX_ATTEMPTS = 4;
            document.getElementById("segmentsInfo").textContent = "Empiezas con 3 emojis visibles. Cada fallo revela uno más. Tienes 4 intentos.";
        } else {
            MAX_ATTEMPTS = 6;
            document.getElementById("segmentsInfo").textContent = "Empiezas con 1 emoji visible. Cada fallo revela uno más. Tienes 6 intentos.";
        }
        renderRounds();
        newRound();
        // Show Marc's letter on first game start
        if (!localStorage.getItem('emojless_message_shown') && letterModal) {
            setTimeout(() => {
                letterModal.classList.add('show');
            }, 800);
            localStorage.setItem('emojless_message_shown', 'true');
        }
    });
}

// Hover sounds en TODOS los botones y enlaces
const _hoveredEls = new WeakSet();
document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn');
    if (el && !_hoveredEls.has(el)) { _hoveredEls.add(el); playSound('click'); }
});
document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn');
    if (el && !el.contains(e.relatedTarget)) _hoveredEls.delete(el);
});
document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn');
    if (el) playSound('click');
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
    // Show letter button manually
    if (!localStorage.getItem('emojless_message_shown') && letterModal) {
        // Will show on first game start
    }
}

// Info modal content
const EMOJLESS_INFO_HTML =
    '<h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Emojless!</h3>' +
    '<p>Tienes que <span class="upd-highlight">adivinar canciones de Rickyedit</span> solo con emojis.</p>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>' +
    '<ul>' +
    '<li><strong>Paso 1:</strong> Se te muestran los emojis de una canción</li>' +
    '<li><strong>Paso 2:</strong> Escribe el nombre en el buscador y selecciónalo con el ratón o Enter</li>' +
    '<li><strong>Paso 3:</strong> Si aciertas, ganas puntos. Si fallas, se revela un emoji más</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos RickyEdit Web/😎.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Modos</h3>' +
    '<ul>' +
    '<li><span class="upd-highlight">Cagado</span> — Empiezas con 3 emojis visibles y tienes 4 intentos</li>' +
    '<li><span class="upd-highlight">Normal</span> — Empiezas con 1 emoji visible y tienes 6 intentos</li>' +
    '<li><span class="upd-highlight">Sin repetir</span> — No se repite ninguna canción</li>' +
    '<li><span class="upd-highlight">Aleatorio</span> — Las canciones salen en orden aleatorio</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos RickyEdit Web/Vida Entera.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Sistema de vidas</h3>' +
    '<p>Hay un sistema de vidas opcional. Pulsa <span class="upd-highlight">Info Vidas</span> para más detalles.</p>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
    '<p>Compite con otros jugadores en la clasificación. Tu puntuación, tiempo y racha máxima quedan registrados.</p>';

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
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, (savedData) => {
            RickyLeaderboard.showSaveToast('emojless', savedData);
            resetLivesToLobby();
            document.getElementById('reveal').classList.remove('show');
            document.getElementById('startScreen').classList.remove('hide');
            document.body.style.overflow = 'hidden';
            renderEmojlessLeaderboard();
        });
    });
}

const finalizeBtnMid = document.getElementById('finalizeBtnMid');
if (finalizeBtnMid) {
    finalizeBtnMid.addEventListener('click', () => {
        playSound('click');
        const elapsed = emojlessGameStartTime ? ((Date.now() - emojlessGameStartTime) / 1000).toFixed(1) : null;
        RickyLeaderboard.save('emojless', {
            score: state.score,
            difficulty: easyMode ? 'easy' : 'normal',
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, (savedData) => {
            RickyLeaderboard.showSaveToast('emojless', savedData);
            resetLivesToLobby();
            document.getElementById('reveal').classList.remove('show');
            document.getElementById('startScreen').classList.remove('hide');
            document.body.style.overflow = 'hidden';
            state.score = 0;
            state.streak = 0;
            state.correct = 0;
            state.total = 0;
            emojlessGameStartTime = null;
            renderEmojlessLeaderboard();
        });
    });
}

// Completion overlay buttons
const completionRestartBtn = document.getElementById('completionRestartBtn');
const completionFinalizeBtn = document.getElementById('completionFinalizeBtn');
const completionHomeBtn = document.getElementById('completionHomeBtn');

if (completionRestartBtn) {
    completionRestartBtn.addEventListener('click', () => {
        playSound('click');
        usedSongs = [];
        state.score = 0;
        state.streak = 0;
        state.correct = 0;
        state.total = 0;
        document.getElementById('completionOverlay').classList.remove('show');
        newRound();
    });
}
if (completionFinalizeBtn) {
    completionFinalizeBtn.addEventListener('click', () => {
        playSound('click');
        const elapsed = emojlessGameStartTime ? ((Date.now() - emojlessGameStartTime) / 1000).toFixed(1) : null;
        RickyLeaderboard.save('emojless', {
            score: state.score,
            difficulty: easyMode ? 'easy' : 'normal',
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, (savedData) => {
            RickyLeaderboard.showSaveToast('emojless', savedData);
            resetLivesToLobby();
            document.getElementById('completionOverlay').classList.remove('show');
            document.getElementById('reveal').classList.remove('show');
            document.getElementById('startScreen').classList.remove('hide');
            document.body.style.overflow = 'hidden';
            usedSongs = [];
            state.score = 0;
            state.streak = 0;
            state.correct = 0;
            state.total = 0;
            emojlessGameStartTime = null;
            renderEmojlessLeaderboard();
        });
    });
}
if (completionHomeBtn) {
    completionHomeBtn.addEventListener('click', () => {
        playSound('click');
        resetLivesToLobby();
        document.getElementById('completionOverlay').classList.remove('show');
        document.getElementById('reveal').classList.remove('show');
        document.getElementById('startScreen').classList.remove('hide');
        document.body.style.overflow = 'hidden';
        usedSongs = [];
        state.score = 0;
        state.streak = 0;
        state.correct = 0;
        state.total = 0;
        emojlessGameStartTime = null;
    });
}

// Game topbar Volver — confirm exit
const gameVolverBtn = document.getElementById('gameVolverBtn');
if (gameVolverBtn) {
    gameVolverBtn.addEventListener('click', () => {
        playSound('click');
        const hasScore = state.score > 0;
        if (!hasScore) {
            localStorage.removeItem('rlb_obs_lives');
            const _pid = localStorage.getItem('rlb_player_id');
            if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true });
            location.href = '../index.html';
            return;
        }
        RickyLeaderboard.showExitConfirm(
            () => {
                localStorage.removeItem('rlb_obs_lives');
                const _pid = localStorage.getItem('rlb_player_id');
                if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true });
                location.href = '../index.html';
            },
            () => {
                const elapsed = emojlessGameStartTime ? ((Date.now() - emojlessGameStartTime) / 1000).toFixed(1) : null;
                RickyLeaderboard.save('emojless', {
                    score: state.score,
                    difficulty: easyMode ? 'easy' : 'normal',
                    time: elapsed ? parseFloat(elapsed) : null,
                    correct: state.correct || 0,
                    total: state.total || 0,
                    maxStreak: state.maxStreak || 0,
                    lives: livesEnabled ? lives : null,
                    maxLives: livesEnabled ? MAX_LIVES : null
                }, (savedData) => {
                    RickyLeaderboard.showSaveToast('emojless', savedData);
                });
                state.score = 0; state.streak = 0; state.correct = 0; state.total = 0; emojlessGameStartTime = null;
                localStorage.removeItem('rlb_obs_lives');
                const _pid = localStorage.getItem('rlb_player_id');
                if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true });
                location.href = '../index.html';
            }
        );
    });
}

renderEmojlessLeaderboard();
RickyLeaderboard.onScoresUpdated(function () { renderEmojlessLeaderboard(); });

function renderEmojlessLeaderboard() {
    RickyLeaderboard.render('leaderboardContainer', 'emojless', {
        title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top — Emojless',
        columns: ['rank', 'name', 'score', 'correct', 'total', 'percent', 'lives', 'time', 'difficulty', 'date'],
        difficulties: ['easy', 'normal'],
        maxRows: 100
    });
}

// Updates modal
updateLivesDisplay();
RickyUpdates.show('emojless', 'v2.0', `
    <h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Emojless!</h3>
    <p>Este es un juego nuevo donde tienes que <span class="upd-highlight">adivinar canciones de Rickyedit</span> solo con emojis.</p>
    <hr class="upd-sep">
    <h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>
    <ul>
        <li>Se te muestran los emojis de una canción</li>
        <li>Escribe el nombre en el buscador y selecciónalo</li>
        <li>Cada fallo revela un emoji más</li>
    </ul>
    <hr class="upd-sep">
    <h3><img src="../Iconos RickyEdit Web/😎.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Modos</h3>
    <ul>
        <li><span class="upd-highlight">Cagado</span> — Empiezas con 3 emojis y tienes 4 intentos</li>
        <li><span class="upd-highlight">Normal</span> — Empiezas con 1 emoji y tienes 6 intentos</li>
        <li><span class="upd-highlight">Sin repetir</span> — No se repite ninguna canción</li>
    </ul>
    <hr class="upd-sep">
    <h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>
    <p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>
`);
