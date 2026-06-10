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
    correct: 0,
    total: 0,
};

let livesEnabled = false;
let lives = 3;
let MAX_LIVES = 3;
let failCount = 0;
let usedExtraLife = false;
let gameOverByLives = false;

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

function normalize(text) {
    return String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
}

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
    els.newBtn.disabled = true;
    els.skipBtn.disabled = true;

    const elapsed = thumbblurGameStartTime ? ((Date.now() - thumbblurGameStartTime) / 1000).toFixed(1) : null;
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
        RickyLeaderboard.save('thumbblur', {
            score: state.score,
            difficulty: state.isExtreme ? 'extreme' : (state.isEasyMode ? 'easy' : 'normal'),
            channel: currentChannel,
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
    if (guess.length < 2) {
        els.status.textContent = "Escribe al menos 2 caracteres.";
        return;
    }

    if (answer === guess || tokenScore(guess, answer) >= 0.68) {
        const points = Math.max(10, 60 - state.round * 10);
        state.score += points;
        state.streak += 1;
        state.correct++;
        failCount = 0;
        state.total++;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
            localStorage.setItem("thumb_max_streak", state.maxStreak);
        }
        if (!state.isExtreme) els.thumbCanvas.style.filter = "blur(0px)";
        reveal(true, `Acertaste. +${points} puntos.`);
        setTimeout(() => playSound('success'), 100);
        return;
    }

    state.total++;
    els.status.textContent = "No era ese. Siguiente pista.";
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
    els.revealLinkText.textContent = "";
    els.reveal.classList.add("show");
    updateStats();
}

let searchVisibleCount = 5;

function renderSearchResults() {
    state.activeSearchIndex = -1;
    const query = normalize(els.guessInput.value);
    if (query.length < 1) { hideSearchResults(); return; }

    const terms = query.split(" ").filter(Boolean);
    const allVideos = [...(window.RICKY_VIDEOS || []), ...(window.RICKY_SECONDARY || [])];
    const matches = allVideos.filter((video) => {
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

    const visibleMatches = matches.slice(0, searchVisibleCount);
    const remaining = matches.length - visibleMatches.length;

    let html = `<div class="search-summary">${matches.length} resultado${matches.length === 1 ? "" : "s"}</div>`;
    visibleMatches.forEach((video) => {
        html += `
            <button class="search-option" type="button" data-title="${escapeHtml(video.title)}">
              ${state.isExtreme ? '' : `<img class="search-option-thumb" src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="">`}
              <div class="search-option-info">
                <div class="search-option-title">${escapeHtml(video.title)}</div>
                <div class="search-option-meta">${formatDuration(video.duration || 0)}</div>
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

els.guessBtn.addEventListener("click", submitGuess);
els.newBtn.addEventListener("click", newRound);
els.againBtn.addEventListener("click", newRound);
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

els.guessInput.addEventListener("input", () => { searchVisibleCount = 5; renderSearchResults(); });

document.addEventListener("click", (event) => {
    if (!event.target.closest(".guess-row")) hideSearchResults();
});

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

// Start screen
let currentDifficulty = 'normal';
let currentChannel = 'principal';
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

// Lives hearts selector
document.querySelectorAll('.lives-selector').forEach(selector => {
    const hearts = selector.querySelectorAll('.lives-heart-btn');
    const countEl = selector.querySelector('.lives-selector-count');
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
    lives = MAX_LIVES;
    failCount = 0;
    usedExtraLife = false;
    gameOverByLives = false;
    updateLivesDisplay();
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
    document.getElementById("startGameBtn").addEventListener("click", () => { currentChannel = 'principal'; startGame(); });
}
if (document.getElementById("startSecondaryGameBtn")) {
    document.getElementById("startSecondaryGameBtn").addEventListener("click", () => { currentChannel = 'secondary'; startGame(); });
}
if (document.getElementById("startBothGameBtn")) {
    document.getElementById("startBothGameBtn").addEventListener("click", () => { currentChannel = 'both'; startGame(); });
}

// Game over buttons
document.getElementById('gameoverRestartBtn').addEventListener('click', () => {
    playSound('click');
    hideGameoverOverlay();
    resetLivesToLobby();
    els.reveal.classList.remove('show');
    els.revealMedia.innerHTML = "";
    startScreen.classList.remove('hide');
    document.body.style.overflow = 'hidden';
});
document.getElementById('gameoverHomeBtn').addEventListener('click', () => {
    playSound('click');
    hideGameoverOverlay();
    resetLivesToLobby();
    els.reveal.classList.remove('show');
    els.revealMedia.innerHTML = "";
    startScreen.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    renderThumbblurLeaderboard();
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

// Info modal content
const THUMBBLUR_INFO_HTML =
    '<h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Miniatura Borrosa!</h3>' +
    '<p>Un juego nuevo donde tienes que <span class="upd-highlight">adivinar vídeos de Rickyedit</span> con la miniatura borrosa.</p>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>' +
    '<ul>' +
    '<li>Se te muestra una miniatura borrosa de un vídeo</li>' +
    '<li>Escribe el título en el buscador y selecciónalo</li>' +
    '<li>Cada intento enfoca la miniatura un poco más</li>' +
    '<li>Cuanto antes la adivines, más puntos</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos RickyEdit Web/😎.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Modos</h3>' +
    '<ul>' +
    '<li><span class="upd-highlight">Cagado</span> — Miniatura muy borrosa, menos intentos</li>' +
    '<li><span class="upd-highlight">Normal</span> — Borrosidad equilibrada</li>' +
    '<li><span class="upd-highlight">Extremo</span> — Sin ver la miniatura, solo por el título</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos RickyEdit Web/Vida Entera.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Sistema de vidas</h3>' +
    '<p>Hay un sistema de vidas opcional. Pulsa <span class="upd-highlight">Info Vidas</span> para más detalles.</p>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
    '<p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>';

document.querySelectorAll('#openUpdatesBtn, #startOpenUpdatesBtn').forEach(btn => {
    btn.addEventListener('click', () => { playSound('click'); RickyUpdates.forceShow(THUMBBLUR_INFO_HTML); });
});

// Leaderboard
let thumbblurGameStartTime = null;
const finalizeBtn = document.getElementById('finalizeBtn');
if (finalizeBtn) {
    finalizeBtn.addEventListener('click', () => {
        playSound('click');
        const elapsed = thumbblurGameStartTime ? ((Date.now() - thumbblurGameStartTime) / 1000).toFixed(1) : null;
        const channel = currentChannel;
        RickyLeaderboard.save('thumbblur', {
            score: state.score,
            difficulty: state.isExtreme ? 'extreme' : (state.isEasyMode ? 'easy' : 'normal'),
            channel,
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, (savedData) => {
            RickyLeaderboard.showSaveToast('thumbblur', savedData);
            resetLivesToLobby();
            els.reveal.classList.remove('show');
            startScreen.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            renderThumbblurLeaderboard();
        });
    });
}

const finalizeBtnMid = document.getElementById('finalizeBtnMid');
if (finalizeBtnMid) {
    finalizeBtnMid.addEventListener('click', () => {
        playSound('click');
        const elapsed = thumbblurGameStartTime ? ((Date.now() - thumbblurGameStartTime) / 1000).toFixed(1) : null;
        const channel = currentChannel;
        RickyLeaderboard.save('thumbblur', {
            score: state.score,
            difficulty: state.isExtreme ? 'extreme' : (state.isEasyMode ? 'easy' : 'normal'),
            channel,
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, (savedData) => {
            RickyLeaderboard.showSaveToast('thumbblur', savedData);
            resetLivesToLobby();
            els.reveal.classList.remove('show');
            startScreen.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            state.score = 0;
            state.streak = 0;
            state.correct = 0;
            state.total = 0;
            thumbblurGameStartTime = null;
            renderThumbblurLeaderboard();
        });
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
                const elapsed = thumbblurGameStartTime ? ((Date.now() - thumbblurGameStartTime) / 1000).toFixed(1) : null;
                const channel = currentChannel;
                RickyLeaderboard.save('thumbblur', {
                    score: state.score,
                    difficulty: state.isExtreme ? 'extreme' : (state.isEasyMode ? 'easy' : 'normal'),
                    channel: channel,
                    time: elapsed ? parseFloat(elapsed) : null,
                    correct: state.correct || 0,
                    total: state.total || 0,
                    maxStreak: state.maxStreak || 0,
                    lives: livesEnabled ? lives : null,
                    maxLives: livesEnabled ? MAX_LIVES : null
                }, (savedData) => {
                    RickyLeaderboard.showSaveToast('thumbblur', savedData);
                });
                state.score = 0; state.streak = 0; state.correct = 0; state.total = 0; thumbblurGameStartTime = null;
                localStorage.removeItem('rlb_obs_lives');
                const _pid = localStorage.getItem('rlb_player_id');
                if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true });
                location.href = '../index.html';
            }
        );
    });
}

updateLivesDisplay();
renderThumbblurLeaderboard();
RickyLeaderboard.onScoresUpdated(function () { renderThumbblurLeaderboard(); });

function renderThumbblurLeaderboard() {
    RickyLeaderboard.render('leaderboardContainer', 'thumbblur', {
        title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top — Miniatura Borrosa',
        columns: ['rank', 'name', 'score', 'correct', 'total', 'percent', 'lives', 'time', 'difficulty', 'channel', 'date'],
        difficulties: ['easy', 'normal', 'extreme'],
        channels: { principal: 'Canal Principal', secondary: 'Canal Secundario', both: 'Los 2 canales' },
        maxRows: 100
    });
}

// Track game start
const origStartGameTB = startGame;
startGame = function() {
    thumbblurGameStartTime = Date.now();
    origStartGameTB.apply(this, arguments);
};

// Updates modal
RickyUpdates.show('thumbblur', 'v2.0', `
    <h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Miniatura Borrosa!</h3>
    <p>Un juego nuevo donde tienes que <span class="upd-highlight">adivinar vídeos de Rickyedit</span> con la miniatura borrosa.</p>
    <hr class="upd-sep">
    <h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>
    <ul>
        <li>Se te muestra una miniatura borrosa de un vídeo</li>
        <li>Escribe el título en el buscador y selecciónalo</li>
        <li>Cada intento enfoca la miniatura un poco más</li>
        <li>Cuanto antes la adivines, más puntos</li>
    </ul>
    <hr class="upd-sep">
    <h3><img src="../Iconos RickyEdit Web/😎.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Modos</h3>
    <ul>
        <li><span class="upd-highlight">Cagado</span> — Miniatura muy borrosa, menos intentos</li>
        <li><span class="upd-highlight">Normal</span> — Borrosidad equilibrada</li>
        <li><span class="upd-highlight">Extremo</span> — Sin ver la miniatura, solo por el título</li>
    </ul>
    <hr class="upd-sep">
    <h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>
    <p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>
`);
