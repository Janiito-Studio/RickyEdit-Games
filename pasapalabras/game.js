// ── Questions Database ──
const QUESTIONS = [
    { letter: 'A', prompt: 'Empieza por la "A"', question: 'Comunidad Autónoma en la que nació RickyEdit', answer: 'Andalucía', contains: false },
    { letter: 'B', prompt: 'Empieza por la "B"', question: 'Título de uno de sus temas musicales más populares', answer: 'Badabadun', contains: false },
    { letter: 'C', prompt: 'Empieza por la "C"', question: 'Canción con +10 millones de reproducciones en Spotify', answer: 'Caliente', contains: false },
    { letter: 'D', prompt: 'Empieza por la "D"', question: 'Plataforma de voz y texto con canales donde su comunidad se reúne', answer: 'Discord', contains: false },
    { letter: 'E', prompt: 'Empieza por la "E"', question: 'Segunda mitad de su nombre artístico', answer: 'Edit', contains: false },
    { letter: 'F', prompt: 'Empieza por la "F"', question: 'Siglas del famoso juego de terror de animatrónicos al que ha jugado', answer: 'FNaF', contains: false },
    { letter: 'G', prompt: 'Empieza por la "G"', question: 'Título de una de sus canciones, la cual cuenta también con un Remix oficial', answer: 'Gourmet', contains: false },
    { letter: 'H', prompt: 'Contiene la "H"', question: 'Título de su tema musical que hace referencia al cuarto donde duerme', answer: 'Mi Habitación', contains: true },
    { letter: 'I', prompt: 'Empieza por la "I"', question: 'Temática de la que suele opinar en su canal y parte del título de su canción "Así Es..."', answer: 'Internet', contains: false },
    { letter: 'J', prompt: 'Empieza por la "J"', question: 'Categoría de Twitch en inglés donde suele pasar sus primeras horas de directo', answer: 'Just Chatting', contains: false },
    { letter: 'L', prompt: 'Empieza por la "L"', question: 'Nombre de su mítica serie de YouTube reaccionando a publicaciones cuestionables', answer: 'Locas de Twitter', contains: false },
    { letter: 'M', prompt: 'Empieza por la "M"', question: 'El primer apellido real de Ricky', answer: 'Moral', contains: false },
    { letter: 'N', prompt: 'Empieza por la "N"', question: 'Nombre de uno de sus proyectos musicales lanzado en conjunto con BeTru', answer: 'Noche', contains: false },
    { letter: 'Ñ', prompt: 'Contiene la "Ñ"', question: 'Título de su canción de pop urbano lanzada el día de Navidad de 2023', answer: 'si mañana', contains: true },
    { letter: 'O', prompt: 'Empieza por la "O"', question: 'Popular página web de videochat con desconocidos de la que sacó muchísimo contenido', answer: 'Omegle', contains: false },
    { letter: 'P', prompt: 'Empieza por la "P"', question: 'Palabra que daba nombre a la serie de vídeos de 2015 que le hizo saltar a la fama', answer: ['Parodiando Canciones', 'Parodiando'], contains: false },
    { letter: 'Q', prompt: 'Empieza por la "Q"', question: 'Título de una de sus canciones más provocadoras que se escribe todo junto', answer: 'Quelamamen', contains: false },
    { letter: 'R', prompt: 'Empieza por la "R"', question: 'El verdadero nombre de pila de RickyEdit', answer: 'Ricardo', contains: false },
    { letter: 'S', prompt: 'Empieza por la "S"', question: 'Plataforma de color verde donde puedes escuchar sus temas', answer: 'Spotify', contains: false },
    { letter: 'T', prompt: 'Empieza por la "T"', question: 'Red social del antiguamente pajarito de donde saca capturas para su serie de vídeos', answer: 'Twitter', contains: false },
    { letter: 'U', prompt: 'Empieza por la "U"', question: 'Título de su tema musical sobre las estrictas normas de Twitch y los "tickets" de soporte', answer: 'U Banned', contains: false },
    { letter: 'V', prompt: 'Empieza por la "V"', question: 'Formato de contenido audiovisual cuya edición es su especialidad y que dio origen a su apodo', answer: 'Vídeo', contains: false },
    { letter: 'X', prompt: 'Contiene la "X"', question: 'Nombre del artista y productor musical que le ha hecho varios remixes oficiales', answer: 'Hemix', contains: true },
    { letter: 'Y', prompt: 'Empieza por la "Y"', question: 'Última palabra del título de su famosa canción "El Otro Era..."', answer: 'Yo', contains: false },
    { letter: 'Z', prompt: 'Contiene la "Z"', question: 'Gentilicio de Ricky por ser originario de la provincia de Córdoba', answer: 'Andaluz', contains: true }
];

// ── Audio System ──
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
    } else if (type === 'complete') {
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.15);
        osc.frequency.setValueAtTime(784, now + 0.3);
        gain.gain.setValueAtTime(0.04 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
    }
    _currentOsc = osc;
}

// ── Normalize helper ──
function normalize(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9ñ ]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ── Game State ──
const state = {
    score: 0,
    streak: 0,
    maxStreak: parseInt(localStorage.getItem("pasapalabras_max_streak") || "0", 10),
    correct: 0,
    wrong: 0,
    total: 0,
    currentIndex: 0,
    revealed: false
};

let easyMode = false;
let livesEnabled = false;
let lives = 3;
let MAX_LIVES = 3;
let usedExtraLife = false;
let gameOverByLives = false;
let pasapalabrasGameStartTime = null;
let timerInterval = null;
let timeLeft = 120;
let gameStarted = false;

// Letter states: 'pending', 'correct', 'wrong', 'skipped', 'current'
const letterStates = {};

// ── Init letter states ──
function initLetterStates() {
    QUESTIONS.forEach(q => { letterStates[q.letter] = 'pending'; });
    letterStates[QUESTIONS[0].letter] = 'current';
}

// ── DOM Elements ──
const $ = (id) => document.getElementById(id);
const els = {
    score: $("score"),
    streak: $("streak"),
    maxStreak: $("maxStreak"),
    rank: $("rank"),
    correctCount: $("correctCount"),
    remainingCount: $("remainingCount"),
    guessInput: $("guessInput"),
    guessBtn: $("guessBtn"),
    pasapalabrasBtn: $("pasapalabrasBtn"),
    status: $("status"),
    qLetter: $("qLetter"),
    qText: $("qText"),
    timerDisplay: $("timerDisplay"),
    roscoContainer: $("roscoContainer"),
    mysteryScreen: $("mysteryScreen")
};

// ── Rank ──
function getRank(streak) {
    if (streak >= 12) return "RickyLord";
    if (streak >= 9) return "Élite";
    if (streak >= 6) return "Experto";
    if (streak >= 4) return "Ultra Fan";
    if (streak >= 2) return "Fan";
    return "Novato";
}

// ── Update Stats ──
function updateStats() {
    els.score.textContent = state.score;
    els.streak.textContent = state.streak;
    els.maxStreak.textContent = state.maxStreak;
    els.rank.textContent = getRank(state.streak);
    els.correctCount.textContent = state.correct;
    const remaining = QUESTIONS.filter(q => letterStates[q.letter] === 'pending' || letterStates[q.letter] === 'skipped' || letterStates[q.letter] === 'current').length;
    els.remainingCount.textContent = remaining;
}

// ── Render Rosco ──
function renderRosco() {
    const container = els.roscoContainer;
    const size = container.offsetWidth || 380;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.40;

    let svg = `<svg class="rosco-svg" viewBox="0 0 ${size} ${size}">`;

    const totalLetters = QUESTIONS.length;

    QUESTIONS.forEach((q, i) => {
        const angle = (i / totalLetters) * 2 * Math.PI - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const stateClass = letterStates[q.letter] || 'pending';

        svg += `<g class="rosco-letter ${stateClass}" data-letter="${q.letter}" data-index="${i}">`;
        svg += `<circle cx="${x}" cy="${y}" r="16" />`;
        svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" dominant-baseline="middle">${q.letter}</text>`;
        svg += `</g>`;
    });

    svg += '</svg>';

    svg += `<div class="rosco-center">
        <div class="letter-big" id="roscoCenterLetter">${QUESTIONS[state.currentIndex].letter}</div>
        <div class="letter-hint" id="roscoCenterHint">${QUESTIONS[state.currentIndex].prompt}</div>
    </div>`;

    container.innerHTML = svg;
}

// ── Update Current Letter Highlight ──
function updateRoscoHighlight() {
    const allGroups = els.roscoContainer.querySelectorAll('.rosco-letter');
    allGroups.forEach(g => {
        const letter = g.getAttribute('data-letter');
        g.classList.remove('current');
        if (letterStates[letter] === 'current') {
            g.classList.add('current');
        }
    });

    const centerLetter = document.getElementById('roscoCenterLetter');
    const centerHint = document.getElementById('roscoCenterHint');
    if (centerLetter) centerLetter.textContent = QUESTIONS[state.currentIndex].letter;
    if (centerHint) centerHint.textContent = QUESTIONS[state.currentIndex].prompt;
}

// ── Show Question ──
function showQuestion() {
    const q = QUESTIONS[state.currentIndex];
    els.qLetter.textContent = q.letter;
    els.qText.textContent = `${q.prompt}: ${q.question}`;
    els.guessInput.value = '';
    els.guessInput.disabled = false;
    els.guessBtn.disabled = false;
    els.pasapalabrasBtn.disabled = false;
    updateRoscoHighlight();
    updateStats();
}

// ── Find Next Pending Letter ──
function findNextPending(startIndex, skipCurrent) {
    const total = QUESTIONS.length;
    const start = startIndex + (skipCurrent ? 1 : 0);
    for (let i = 0; i < total - 1; i++) {
        const idx = (start + i) % total;
        const letter = QUESTIONS[idx].letter;
        if (letterStates[letter] === 'pending' || letterStates[letter] === 'skipped') {
            return idx;
        }
    }
    return -1;
}

// ── Check if Rosco Complete ──
function isRoscoComplete() {
    return QUESTIONS.every(q => letterStates[q.letter] === 'correct');
}

// ── Submit Answer ──
function submitGuess() {
    if (!gameStarted || state.revealed) return;

    const guess = normalize(els.guessInput.value);
    if (!guess) {
        els.status.textContent = 'Escribe algo antes de adivinar.';
        return;
    }

    const q = QUESTIONS[state.currentIndex];
    const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
    const isCorrect = answers.some(a => normalize(a) === guess);

    if (isCorrect) {
        // Correct
        letterStates[q.letter] = 'correct';
        const points = 10;
        state.score += points;
        state.streak++;
        state.correct++;
        state.total++;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
            localStorage.setItem("pasapalabras_max_streak", state.maxStreak);
        }
        els.status.textContent = `¡Correcto! +${points} puntos`;
        setTimeout(() => playSound('success'), 50);

        if (isRoscoComplete()) {
            endGame(true, '¡Has completado todo el rosco!');
            return;
        }

        // Find next pending
        const nextIdx = findNextPending(state.currentIndex, true);
        if (nextIdx === -1) {
            endGame(true, '¡No quedan más letras!');
            return;
        }
        state.currentIndex = nextIdx;
        letterStates[QUESTIONS[nextIdx].letter] = 'current';
        renderRosco();
        showQuestion();
    } else {
        // Wrong
        letterStates[q.letter] = 'wrong';
        state.streak = 0;
        state.wrong++;
        state.total++;
        els.status.textContent = `Incorrecto. La respuesta era: ${answers[0]}`;
        setTimeout(() => playSound('fail'), 50);

        // Lose life
        if (livesEnabled) {
            if (loseLife()) return; // game over
        }

        // Find next pending
        const nextIdx = findNextPending(state.currentIndex, true);
        if (nextIdx === -1) {
            endGame(false, 'No quedan más letras.');
            return;
        }
        state.currentIndex = nextIdx;
        letterStates[QUESTIONS[nextIdx].letter] = 'current';
        renderRosco();
        showQuestion();
    }
}

// ── Pasapalabras (skip) ──
function doPasapalabras() {
    if (!gameStarted || state.revealed) return;

    const q = QUESTIONS[state.currentIndex];
    if (letterStates[q.letter] === 'pending') {
        letterStates[q.letter] = 'skipped';
    }

    els.status.textContent = `Letra ${q.letter} saltada. Volverás a ella más tarde.`;
    playSound('click');

    const nextIdx = findNextPending(state.currentIndex, true);
    if (nextIdx === -1) {
        // No other pending/skipped letters ahead — loop back to first skipped (excluding current)
        const currentLetter = QUESTIONS[state.currentIndex].letter;
        const firstSkipped = QUESTIONS.findIndex(q2 => letterStates[q2.letter] === 'skipped' && q2.letter !== currentLetter);
        if (firstSkipped !== -1) {
            state.currentIndex = firstSkipped;
            letterStates[QUESTIONS[firstSkipped].letter] = 'current';
        } else {
            // Only current letter is skipped, or nothing left — end game
            endGame(true, '¡Rosco completado!');
            return;
        }
    } else {
        state.currentIndex = nextIdx;
        letterStates[QUESTIONS[nextIdx].letter] = 'current';
    }

    renderRosco();
    showQuestion();
}

// ── Timer ──
function startTimer() {
    if (easyMode) {
        els.timerDisplay.style.display = 'none';
        return;
    }
    els.timerDisplay.style.display = 'block';
    timeLeft = 120;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false, '¡Se acabó el tiempo!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    els.timerDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    if (timeLeft <= 15) {
        els.timerDisplay.classList.add('warning');
    } else {
        els.timerDisplay.classList.remove('warning');
    }
}

function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ── End Game ──
function endGame(won, message) {
    state.revealed = true;
    stopTimer();
    els.guessInput.disabled = true;
    els.guessBtn.disabled = true;
    els.pasapalabrasBtn.disabled = true;

    const elapsed = pasapalabrasGameStartTime ? ((Date.now() - pasapalabrasGameStartTime) / 1000).toFixed(1) : null;

    if (won) {
        setTimeout(() => playSound('complete'), 100);
    }

    $('resultTitle').textContent = won ? '¡Rosco completado!' : 'Fin de la partida';
    $('resultScore').textContent = state.score + ' puntos';
    $('resultCorrect').textContent = state.correct;
    $('resultWrong').textContent = state.wrong;
    $('resultTime').textContent = elapsed ? elapsed + 's' : '-';
    $('resultMsg').textContent = message;
    $('resultOverlay').classList.add('show');
}

// ── Lives System ──
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
    stopTimer();
    els.guessInput.disabled = true;
    els.guessBtn.disabled = true;
    els.pasapalabrasBtn.disabled = true;

    const elapsed = pasapalabrasGameStartTime ? ((Date.now() - pasapalabrasGameStartTime) / 1000).toFixed(1) : null;
    document.getElementById('gameoverScore').textContent = state.score > 0 ? state.score + ' puntos' : '';

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
        RickyLeaderboard.save('pasapalabras', {
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

// ── Extra Life ──
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

// ── Reset State ──
function resetState() {
    state.score = 0;
    state.streak = 0;
    state.correct = 0;
    state.wrong = 0;
    state.total = 0;
    state.currentIndex = 0;
    state.revealed = false;
    pasapalabrasGameStartTime = null;
    stopTimer();
    initLetterStates();
}

// ── Start Game ──
function startGame() {
    playSound('success');
    resetState();
    gameStarted = true;
    usedExtraLife = false;
    gameOverByLives = false;
    lives = MAX_LIVES;
    updateLivesDisplay();

    $('startScreen').classList.add('hide');
    document.body.style.overflow = 'auto';

    renderRosco();
    showQuestion();
    startTimer();
    pasapalabrasGameStartTime = Date.now();
}

// ── Finalize ──
function doFinalize() {
    playSound('click');
    const elapsed = pasapalabrasGameStartTime ? ((Date.now() - pasapalabrasGameStartTime) / 1000).toFixed(1) : null;
    RickyLeaderboard.save('pasapalabras', {
        score: state.score,
        difficulty: easyMode ? 'easy' : 'normal',
        time: elapsed ? parseFloat(elapsed) : null,
        correct: state.correct || 0,
        total: state.total || 0,
        maxStreak: state.maxStreak || 0,
        lives: livesEnabled ? lives : null,
        maxLives: livesEnabled ? MAX_LIVES : null
    }, (savedData) => {
        RickyLeaderboard.showSaveToast('pasapalabras', savedData);
        resetLivesToLobby();
        gameStarted = false;
        resetState();
        $('resultOverlay').classList.remove('show');
        $('gameoverOverlay').classList.remove('show');
        $('startScreen').classList.remove('hide');
        document.body.style.overflow = 'hidden';
        renderPasapalabrasLeaderboard();
    });
}

// ── Leaderboard ──
function renderPasapalabrasLeaderboard() {
    RickyLeaderboard.render('leaderboardContainer', 'pasapalabras', {
        title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top — Pasapalabras',
        columns: ['rank', 'name', 'score', 'correct', 'total', 'percent', 'lives', 'time', 'difficulty', 'date'],
        difficulties: ['easy', 'normal'],
        maxRows: 100
    });
}

// ── Event Listeners ──
document.addEventListener('DOMContentLoaded', () => {
    // Start screen accordion
    const normalToggle = $('normalModeToggle');
    const normalCard = $('normalModeCard');
    if (normalToggle && normalCard) {
        normalToggle.addEventListener('click', () => {
            playSound('click');
            const wasOpen = normalCard.classList.contains('open');
            document.querySelectorAll('.mode-card.open').forEach(c => c.classList.remove('open'));
            if (!wasOpen) normalCard.classList.add('open');
        });
    }

    // Difficulty buttons
    const startEasyBtn = $('startEasyBtn');
    const startNormalBtn = $('startNormalBtn');
    if (startEasyBtn) {
        startEasyBtn.addEventListener('click', () => {
            playSound('click');
            easyMode = true;
            startEasyBtn.classList.add('active');
            startNormalBtn.classList.remove('active');
        });
    }
    if (startNormalBtn) {
        startNormalBtn.addEventListener('click', () => {
            playSound('click');
            easyMode = false;
            startNormalBtn.classList.add('active');
            startEasyBtn.classList.remove('active');
        });
    }

    // Lives selector
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

    // Start game button
    $('startGameBtn').addEventListener('click', startGame);

    // Game buttons
    els.guessBtn.addEventListener('click', () => { playSound('click'); submitGuess(); });
    els.pasapalabrasBtn.addEventListener('click', () => { doPasapalabras(); });

    els.guessInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); playSound('click'); submitGuess(); }
    });

    // Finalize buttons
    $('finalizeBtnMid').addEventListener('click', () => { playSound('click'); doFinalize(); });
    $('resultFinalizeBtn').addEventListener('click', () => { playSound('click'); doFinalize(); });

    // Result restart
    $('resultRestartBtn').addEventListener('click', () => {
        playSound('click');
        $('resultOverlay').classList.remove('show');
        startGame();
    });

    // Result home
    $('resultHomeBtn').addEventListener('click', () => {
        playSound('click');
        resetLivesToLobby();
        gameStarted = false;
        resetState();
        $('resultOverlay').classList.remove('show');
        $('startScreen').classList.remove('hide');
        document.body.style.overflow = 'hidden';
        renderPasapalabrasLeaderboard();
    });

    // Game over buttons
    $('gameoverRestartBtn').addEventListener('click', () => {
        playSound('click');
        resetLivesToLobby();
        $('gameoverOverlay').classList.remove('show');
        startGame();
    });

    $('gameoverHomeBtn').addEventListener('click', () => {
        playSound('click');
        resetLivesToLobby();
        gameStarted = false;
        resetState();
        $('gameoverOverlay').classList.remove('show');
        $('startScreen').classList.remove('hide');
        document.body.style.overflow = 'hidden';
        renderPasapalabrasLeaderboard();
    });

    // Extra life buttons
    $('extraLifeBtn').addEventListener('click', () => { playSound('click'); addExtraLife(false); });
    $('startExtraLifeBtn').addEventListener('click', () => { playSound('click'); addExtraLife(true); });

    // Game topbar Volver
    $('gameVolverBtn').addEventListener('click', () => {
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
                const elapsed = pasapalabrasGameStartTime ? ((Date.now() - pasapalabrasGameStartTime) / 1000).toFixed(1) : null;
                RickyLeaderboard.save('pasapalabras', {
                    score: state.score,
                    difficulty: easyMode ? 'easy' : 'normal',
                    time: elapsed ? parseFloat(elapsed) : null,
                    correct: state.correct || 0,
                    total: state.total || 0,
                    maxStreak: state.maxStreak || 0,
                    lives: livesEnabled ? lives : null,
                    maxLives: livesEnabled ? MAX_LIVES : null
                }, (savedData) => {
                    RickyLeaderboard.showSaveToast('pasapalabras', savedData);
                });
                state.score = 0; state.streak = 0; state.correct = 0; state.wrong = 0; state.total = 0; pasapalabrasGameStartTime = null;
                localStorage.removeItem('rlb_obs_lives');
                const _pid = localStorage.getItem('rlb_player_id');
                if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true });
                location.href = '../index.html';
            }
        );
    });

    // Hover sounds
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
    document.querySelectorAll('#openUpdatesBtn, #startOpenUpdatesBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            RickyUpdates.forceShow(
                '<h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Pasapalabras!</h3>' +
                '<p>Tienes que <span class="upd-highlight">responder preguntas sobre RickyEdit</span> letra a letra.</p>' +
                '<hr class="upd-sep">' +
                '<h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>' +
                '<ul>' +
                '<li><strong>Paso 1:</strong> Se te muestra una letra del rosco con su pregunta</li>' +
                '<li><strong>Paso 2:</strong> Escribe la respuesta y pulsa Adivinar</li>' +
                '<li><strong>Paso 3:</strong> Si aciertas, ganas 10 puntos y pasas a la siguiente letra</li>' +
                '<li><strong>Paso 4:</strong> Si fallas, pierdes una vida (si están activadas)</li>' +
                '</ul>' +
                '<hr class="upd-sep">' +
                '<h3><img src="../Iconos RickyEdit Web/😎.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Modos</h3>' +
                '<ul>' +
                '<li><span class="upd-highlight">Cagado</span> — Sin límite de tiempo, 3 vidas por defecto</li>' +
                '<li><span class="upd-highlight">Normal</span> — 120 segundos para completar el rosco</li>' +
                '</ul>' +
                '<hr class="upd-sep">' +
                '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
                '<p>Compite con otros jugadores en la clasificación.</p>'
            );
        });
    });

    // Init
    initLetterStates();
    renderPasapalabrasLeaderboard();
    RickyLeaderboard.onScoresUpdated(function () { renderPasapalabrasLeaderboard(); });
    updateLivesDisplay();

    RickyUpdates.show('pasapalabras', 'v1.0', `
        <h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Pasapalabras!</h3>
        <p>Responde preguntas sobre RickyEdit letra a letra del abecedario. ¡Completa todo el rosco!</p>
        <hr class="upd-sep">
        <h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>
        <ul>
            <li>Cada letra tiene una pregunta sobre RickyEdit</li>
            <li>Escribe la respuesta y pulsa Adivinar</li>
            <li>Usa Pasapalabras para saltar letras difíciles</li>
        </ul>
        <hr class="upd-sep">
        <h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>
        <p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>
    `);
});
