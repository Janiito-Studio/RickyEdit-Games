/* ============================================================
   Rickyedit Games — Wordle
   Guess the 5-letter word in 6 attempts.
   ============================================================ */
(function () {
    'use strict';

    /* ── Mystery words (only these can be answers) ─────────── */
    var WORDS = [
        'RICKY', 'CALVO', 'HUEVO', 'PELAO', 'GORRA',
        'BARBA', 'BROMA', 'TUITS', 'RISAS', 'RIMAS',
        'DRAMA', 'TETAS', 'PLACA', 'VAPER', 'BANEO',
        'RETOS', 'SUSTO', 'GRITO', 'MANCO', 'RATAS',
        'PASTA', 'FUNAS', 'MEMES', 'HATER', 'RANGO'
    ];

    /* ── Filler words (valid guesses, never answers) ───────── */
    var VALID_GUESSES = [
        'AMIGO','AMIGA','MUJER','HOMBRE','PADRE','MADRE','CALLE','PARED',
        'SUELO','CIELO','NEGRO','VERDE','BRAZO','CARNE','QUESO','LECHE',
        'ARROZ','POLLO','SALSA','CERDO','TIGRE','NIEVE','FUEGO','PERRO',
        'TENIS','RUGBY','POETA','ACTOR','VIDEO','TEXTO','RITMO','PIANO',
        'FECHA','PLAZO','JUNIO','PLAYA','ARENA','LARGO','CORTO','GORDO',
        'NUEVO','VIEJO','JOVEN','BUENO','POBRE','CIEGO','SORDO','SABIO',
        'LISTO','MIEDO','CULPA','LUCHA','NOCHE','COMER','BEBER','SALIR',
        'CREER','SABER','SILLA','LENTO','CALMA','FUMAR','JUGAR','NADAR',
        'VOLAR','CAZAR','TOCAR','MORAL','ROSAL','FRESA','TOMAR','OLIVO',
        'ROBLE','CELDA','CINTA','CLIMA','COCHE','CEDRO','CUERO','CHILE',
        'CAMPO','CANOA','CARGO','CARRO','CASCO','CEBRA','CERCA','CISNE',
        'COCER','COMBO','CONGA','CORAL','CORTE','COSER','COSTO','CREMA',
        'CRUDO','CURVO','DANZA','DECIR','DENSO','DIETA','DOLOR','DONAR',
        'DOTAR','DUDAR','DUQUE','ENANO','ENERO','ERROR','ETAPA','FACIL',
        'FALDA','FALSO','FARSA','FELIZ','FIRMA','FLACO','FLAMA','FONDO',
        'FORMA','FORRO','FRENO','FRUTA','FUGAZ','FUNDA','FUSIL','GANAR',
        'GANSO','GARZA','GENTE','GESTO','GLOBO','GOLFO','GORRO','GRADO',
        'GRAFO','GRANO','GRAVE','GRIFO','GRUMO','GRUPO','GUSTO','HEBRA',
        'HEROE','HIELO','HONOR','HUMOR','IMPAR','JARRA','LABIO','LANCE',
        'LAPIZ','LATIR','LECHO','LEGAL','LENTE','LIBRE','LIDER','LIMON',
        'LIRIO','LLAMA','LLANO','LLAVE','LUNES','MALTA','MARCA','MARCO',
        'MAREA','MAYOR','MEDIA','MELON','MENTA','MESON','METAL','METRO',
        'MILAN','MINAR','MIRAR','MIXTO','MODAL','MOLDE','MOLER','MOMIA',
        'MONJE','MORRO','MOSCA','MOTEL','MUNDO','MURAL','MUSEO','MUSGO',
        'NARCO','NARIZ','NATAL','NAVIO','NECIO','NIVEL','NORTE','NOTAR',
        'ODIAR','OPACO','OPTAR','OTOÑO','OVEJA','OXIDO','OZONO','PALCO',
        'PAÑAL','PALMA','PALMO','PANAL','PARCA','PARCO','PARDO','PARTE',
        'PASAR','PASTO','PATIO','PATON','PAUSA','PAVOR','PEDAL','PEDIR',
        'PEINE','PELAR','PELEA','PENAL','PERCA','PESCA','PIEZA','PILAR',
        'PISAR','PISTA','PLANO','PLATA','PLATO','PLENO','PLOMO','PODER',
        'PODIO','POLVO','POMPA','PONER','PORRO','POSTE','POTRO','PRADO',
        'PRIMA','PRIMO','PRISA','PROSA','PULSO','PUNTO','PURGA','QUEJA',
        'QUESO','RABIA','RAMAL','RANCO','RASGO','RATON','RAYAR','RAZON',
        'REGLA','REGIO','REINO','RENAL','RENTA','RESAR','REVES','RIFAR',
        'RIMAR','RIVAL','ROBAR','ROBLE','ROBOT','RODAR','ROLLO','ROSAL',
        'ROTAR','ROTOR','RUBIA','RUBIO','RUCIO','RUINA','RUMBO','RURAL',
        'SABOR','SACRO','SALON','SANAR','SAUNA','SEDAL','SERIE','SIGLO',
        'SIGNO','SITIO','SOBRE','SOLAR','SOLER','SOLIO','SONAR','SUBIR',
        'SUCIO','SUELO','SUEÑO','SUMAR','SURCO','SUTIL','TAPAR','TARDE',
        'TARRO','TAZON','TELON','TEMOR','TENAZ','TENGA','TENIS','TENOR',
        'TEÑIR','TIRAR','TOCAR','TOMAR','TONTO','TOPAR','TOQUE','TORPE',
        'TORRE','TORTA','TOSER','TRABA','TRAMA','TRAMO','TRATO','TRAZO',
        'TRECE','TRIAL','TRIGO','TRINO','TROPA','TROZO','TUMOR','TURNO',
        'VACIO','VAGAR','VALER','VALLE','VAPOR','VARON','VASTO','VELAR',
        'VENIR','VERDE','VIAJE','VICIO','VIGOR','VILLA','VIOLA','VIRAL',
        'VISTA','VITAL','VIVIR','VOLAR','VOTAR','VUELO','ZAMPA','ZANJA',
        'ZARPA','ZURDO'
    ];

    var TOTAL_WORDS = WORDS.length;

    /* ── Audio ─────────────────────────────────────────────── */
    var audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }
    ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'].forEach(function (evt) {
        document.addEventListener(evt, function () {
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        }, { once: true });
    });

    var _currentOsc = null;
    function playSound(type) {
        var vol = (typeof RickyVolume !== 'undefined') ? RickyVolume.get() : 1;
        if (vol <= 0) return;
        if (_currentOsc) { try { _currentOsc.stop(); } catch (e) {} _currentOsc = null; }
        var ctx = getAudioCtx();
        if (!ctx) return;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        var now = ctx.currentTime;
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
        } else if (type === 'win') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.12);
            osc.frequency.setValueAtTime(784, now + 0.24);
            gain.gain.setValueAtTime(0.05 * vol, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.45);
            osc.start(now); osc.stop(now + 0.45);
        } else if (type === 'lifeloss') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);
            gain.gain.setValueAtTime(0.06 * vol, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        }
        _currentOsc = osc;
    }

    /* ── Game settings ─────────────────────────────────────── */
    var maxAttempts = 6;
    var noRepeatMode = true;
    var usedWords = [];

    /* ── Lives system ──────────────────────────────────────── */
    var livesEnabled = false;
    var lives = 3;
    var MAX_LIVES = 3;
    var failCount = 0;
    var usedExtraLife = false;
    var gameOverByLives = false;

    /* ── Game state ────────────────────────────────────────── */
    var state = {
        answer: '',
        guesses: [],
        currentGuess: '',
        round: 0,
        revealed: false,
        won: false,
        score: 0,
        streak: 0,
        maxStreak: parseInt(localStorage.getItem('wordle_max_streak') || '0', 10),
        correct: 0,
        total: 0
    };

    var keyboardState = {};
    var isAnimating = false;
    var wordleGameStartTime = null;

    /* ── DOM refs ──────────────────────────────────────────── */
    var $ = function (id) { return document.getElementById(id); };
    var els = {
        wordleGrid: $('wordleGrid'),
        keyboard: $('keyboard'),
        status: $('status'),
        score: $('score'),
        streak: $('streak'),
        maxStreak: $('maxStreak'),
        rank: $('rank'),
        attempt: $('attempt'),
        wordCount: $('wordCount'),
        reveal: $('reveal'),
        revealTitle: $('revealTitle'),
        resultWord: $('resultWord'),
        resultSubtitle: $('resultSubtitle'),
        resultDisplay: $('resultDisplay'),
        againBtn: $('againBtn'),
        newBtn: $('newBtn'),
        startScreen: $('startScreen'),
        livesDisplay: $('livesDisplay'),
        livesBar: $('livesBar'),
        gameoverOverlay: $('gameoverOverlay'),
        gameoverRestartBtn: $('gameoverRestartBtn'),
        gameoverHomeBtn: $('gameoverHomeBtn'),
        gameoverScore: $('gameoverScore'),
        gameoverHearts: $('gameoverHearts'),
        extraLifeBtn: $('extraLifeBtn'),
        startExtraLifeBtn: $('startExtraLifeBtn')
    };

    /* ── Utilities ─────────────────────────────────────────── */
    function normalize(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9ñ ]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getRank(streak) {
        if (streak >= 12) return 'RickyLord';
        if (streak >= 9) return '\u00c9lite';
        if (streak >= 6) return 'Experto';
        if (streak >= 4) return 'Ultra Fan';
        if (streak >= 2) return 'Fan';
        return 'Novato';
    }

    function isValidGuess(word) {
        var upper = word.toUpperCase();
        for (var i = 0; i < WORDS.length; i++) {
            if (WORDS[i] === upper) return true;
        }
        for (var i = 0; i < VALID_GUESSES.length; i++) {
            if (VALID_GUESSES[i] === upper) return true;
        }
        return false;
    }

    /* ── Wordle evaluation ─────────────────────────────────── */
    function evaluateGuess(guess, answer) {
        var result = Array(5).fill('absent');
        var answerChars = answer.split('');
        var guessChars = guess.split('');

        for (var i = 0; i < 5; i++) {
            if (guessChars[i] === answerChars[i]) {
                result[i] = 'correct';
                answerChars[i] = null;
                guessChars[i] = null;
            }
        }

        for (var i = 0; i < 5; i++) {
            if (guessChars[i] === null) continue;
            var idx = answerChars.indexOf(guessChars[i]);
            if (idx !== -1) {
                result[i] = 'present';
                answerChars[idx] = null;
            }
        }

        return result;
    }

    function updateKeyboardState(guess, result) {
        var priority = { 'correct': 3, 'present': 2, 'absent': 1 };
        for (var i = 0; i < 5; i++) {
            var letter = guess[i];
            var newState = result[i];
            if (!keyboardState[letter] || priority[newState] > priority[keyboardState[letter]]) {
                keyboardState[letter] = newState;
            }
        }
    }

    /* ── Keyboard single-key update (no full rebuild) ──────── */
    function updateSingleKey(letter) {
        if (!els.keyboard) return;
        var btn = els.keyboard.querySelector('.key[data-key="' + letter + '"]');
        if (!btn) return;
        btn.classList.remove('correct', 'present', 'absent');
        if (keyboardState[letter]) {
            btn.classList.add(keyboardState[letter]);
        }
    }

    /* ── Word selection ────────────────────────────────────── */
    function selectRandomWord() {
        var available = WORDS;
        if (noRepeatMode && usedWords.length >= available.length) {
            showCompletion();
            return null;
        }
        var filtered = noRepeatMode
            ? available.filter(function (w) { return usedWords.indexOf(w) === -1; })
            : available;
        if (!filtered.length) filtered = available;
        var word = filtered[Math.floor(Math.random() * filtered.length)];
        usedWords.push(word);
        return word;
    }

    /* ── Rendering ─────────────────────────────────────────── */
    function renderGrid() {
        els.wordleGrid.innerHTML = '';
        for (var r = 0; r < maxAttempts; r++) {
            var row = document.createElement('div');
            row.className = 'wordle-row';
            row.dataset.row = r;
            if (r < state.guesses.length) {
                row.classList.add('done');
            } else if (r === state.guesses.length && !state.revealed) {
                row.classList.add('active');
            } else {
                row.classList.add('pending');
            }
            for (var c = 0; c < 5; c++) {
                var tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = r;
                tile.dataset.col = c;
                if (r < state.guesses.length) {
                    var guess = state.guesses[r];
                    tile.textContent = guess.word[c];
                    if (isAnimating && r === state.guesses.length - 1) {
                        tile.classList.add('filled');
                    } else {
                        tile.classList.add(guess.result[c]);
                    }
                } else if (r === state.guesses.length && c < state.currentGuess.length) {
                    tile.textContent = state.currentGuess[c];
                    tile.classList.add('filled');
                }
                row.appendChild(tile);
            }
            els.wordleGrid.appendChild(row);
        }
    }

    function renderKeyboard() {
        var rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BORRAR']
        ];

        els.keyboard.innerHTML = '';
        rows.forEach(function (rowLetters) {
            var rowEl = document.createElement('div');
            rowEl.className = 'kb-row';
            rowLetters.forEach(function (key) {
                var btn = document.createElement('button');
                btn.className = 'key';
                btn.type = 'button';
                btn.dataset.key = key;
                if (key === 'ENTER' || key === 'BORRAR') {
                    btn.classList.add('wide');
                    btn.textContent = key === 'ENTER' ? 'ENTER' : '⌫';
                } else {
                    btn.textContent = key;
                    if (keyboardState[key]) {
                        btn.classList.add(keyboardState[key]);
                    }
                }
                btn.addEventListener('click', function () {
                    playSound('click');
                    handleKeyPress(key);
                });
                rowEl.appendChild(btn);
            });
            els.keyboard.appendChild(rowEl);
        });
    }

    function updateStats() {
        els.score.textContent = state.score;
        els.streak.textContent = state.streak;
        els.maxStreak.textContent = state.maxStreak;
        els.rank.textContent = getRank(state.streak);
        els.attempt.textContent = Math.min(state.round + 1, maxAttempts) + '/' + maxAttempts;
        els.wordCount.textContent = TOTAL_WORDS;
    }

    function updateRowHighlight() {
        var rows = els.wordleGrid.querySelectorAll('.wordle-row');
        rows.forEach(function (row, i) {
            row.classList.remove('active', 'done', 'pending');
            if (i < state.guesses.length) {
                row.classList.add('done');
            } else if (i === state.guesses.length && !state.revealed) {
                row.classList.add('active');
            } else {
                row.classList.add('pending');
            }
        });
    }

    /* ── Lives functions ───────────────────────────────────── */
    function updateLivesDisplay() {
        var bar = els.livesBar;
        var el = els.livesDisplay;
        var ms = document.getElementById('mysteryScreen');
        if (!el) return;
        if (!livesEnabled) {
            if (bar) bar.classList.remove('visible');
            if (ms) ms.classList.remove('has-lives');
            try { localStorage.removeItem('rlb_obs_lives'); } catch (e) {}
            try {
                var _pid = localStorage.getItem('rlb_player_id');
                if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE' });
            } catch (e) {}
            return;
        }
        if (bar) bar.classList.add('visible');
        if (ms) ms.classList.add('has-lives');
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
            hearts.forEach(function (img, i) {
                img.src = i < lives ? '../Iconos RickyEdit Web/Vida Entera.png' : '../Iconos RickyEdit Web/Vida Rota.png';
            });
        }
        try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: lives, max: MAX_LIVES })); } catch (e) {}
        try {
            var _pid2 = localStorage.getItem('rlb_player_id');
            if (_pid2) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid2) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: lives, max: MAX_LIVES }) });
        } catch (e) {}
    }

    function loseLife() {
        if (!livesEnabled) return false;
        lives--;
        playSound('lifeloss');
        var _el = els.livesDisplay;
        if (_el) {
            var _h = _el.querySelectorAll('.life-heart');
            if (_h[lives]) {
                _h[lives].src = '../Iconos RickyEdit Web/Vida Rota.png';
            }
        }
        try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: lives, max: MAX_LIVES })); } catch (e) {}
        try {
            var _pid = localStorage.getItem('rlb_player_id');
            if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: lives, max: MAX_LIVES }) });
        } catch (e) {}
        if (lives <= 0) {
            setTimeout(function () { gameOver(); }, 500);
            return true;
        }
        return false;
    }

    function gameOver() {
        state.revealed = true;
        gameOverByLives = true;

        var elapsed = wordleGameStartTime ? ((Date.now() - wordleGameStartTime) / 1000).toFixed(1) : null;
        var scoreVal = state.score || 0;
        if (els.gameoverScore) els.gameoverScore.textContent = scoreVal > 0 ? scoreVal + ' puntos' : '';

        var heartsEl = els.gameoverHearts;
        if (heartsEl) {
            heartsEl.innerHTML = '';
            for (var i = 0; i < MAX_LIVES; i++) {
                var img = document.createElement('img');
                img.src = '../Iconos RickyEdit Web/Vida Rota.png';
                img.alt = 'Sin vida';
                heartsEl.appendChild(img);
            }
        }

        if (els.gameoverOverlay) els.gameoverOverlay.classList.add('show');

        try { localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: 0, max: MAX_LIVES })); } catch (e) {}
        try {
            var _pid = localStorage.getItem('rlb_player_id');
            if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: 0, max: MAX_LIVES }) });
        } catch (e) {}

        if (!usedExtraLife) {
            RickyLeaderboard.save('wordle', {
                score: state.score,
                difficulty: maxAttempts === 8 ? 'easy' : 'normal',
                time: elapsed ? parseFloat(elapsed) : null,
                correct: state.correct || 0,
                total: state.total || 0,
                maxStreak: state.maxStreak || 0,
                lives: livesEnabled ? lives : null,
                maxLives: livesEnabled ? MAX_LIVES : null
            }, function () {});
        }
    }

    function resetLivesToLobby() {
        livesEnabled = false;
        updateLivesDisplay();
        try { localStorage.removeItem('rlb_obs_lives'); } catch (e) {}
        try {
            var _pid = localStorage.getItem('rlb_player_id');
            if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE', keepalive: true });
        } catch (e) {}
        if (window.RlbPlayer) RlbPlayer.signalLobby();
    }

    function addExtraLife(fromStart) {
        if (fromStart) { showExtraLifeToast('Dale a empezar para usarlo.'); return; }
        if (!livesEnabled) { showExtraLifeToast('Primero activa las vidas para usar este botón.'); return; }
        if (lives >= MAX_LIVES) { showExtraLifeToast('Ya tienes todas las vidas.'); return; }
        function doAdd() {
            lives++;
            usedExtraLife = true;
            updateLivesDisplay();
            showExtraLifeToast('+1 Vida añadida. Tu puntuación no se guardará en el leaderboard.');
        }
        var confirmed = false;
        try { confirmed = localStorage.getItem('rlb_extralife_confirmed') === '1'; } catch (e) {}
        if (confirmed) { doAdd(); } else { showExtraLifeConfirm(doAdd); }
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
        modal.querySelector('.btn-cancel').addEventListener('click', function () {
            modal.classList.remove('show');
            setTimeout(function () { modal.remove(); }, 300);
        });
        modal.querySelector('.btn-confirm').addEventListener('click', function () {
            try { localStorage.setItem('rlb_extralife_confirmed', '1'); } catch (e) {}
            modal.classList.remove('show');
            setTimeout(function () { modal.remove(); }, 300);
            onConfirm();
        });
    }

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

    /* ── Animations ────────────────────────────────────────── */
    function animateReveal(rowIndex, results, callback) {
        var row = els.wordleGrid.querySelector('.wordle-row[data-row="' + rowIndex + '"]');
        if (!row) { if (callback) callback(); return; }
        var tiles = row.querySelectorAll('.tile');
        var guess = state.guesses[rowIndex].word;
        var totalDelay = tiles.length * 300 + 300;

        tiles.forEach(function (tile, i) {
            setTimeout(function () {
                tile.classList.add('flip-half');

                setTimeout(function () {
                    tile.classList.remove('flip-half');
                    tile.classList.add(results[i], 'flip-full');

                    updateKeyboardState(guess[i], results[i]);
                    updateSingleKey(guess[i]);

                    setTimeout(function () {
                        tile.classList.remove('flip-full');
                    }, 250);
                }, 250);
            }, i * 300);
        });

        setTimeout(function () {
            if (callback) callback();
        }, totalDelay);
    }

    function animateShake(rowIndex) {
        var row = els.wordleGrid.querySelector('.wordle-row[data-row="' + rowIndex + '"]');
        if (!row) return;
        var tiles = row.querySelectorAll('.tile');
        tiles.forEach(function (tile) { tile.classList.add('shake'); });
        setTimeout(function () {
            tiles.forEach(function (tile) { tile.classList.remove('shake'); });
        }, 400);
    }

    function animateWin(rowIndex) {
        var row = els.wordleGrid.querySelector('.wordle-row[data-row="' + rowIndex + '"]');
        if (!row) return;
        var tiles = row.querySelectorAll('.tile');
        tiles.forEach(function (tile, i) {
            setTimeout(function () {
                tile.classList.add('pop-win');
            }, i * 100);
        });
    }

    /* ── Game logic ────────────────────────────────────────── */
    function newRound() {
        var word = selectRandomWord();
        if (word === null) return;

        state.answer = word;
        state.guesses = [];
        state.currentGuess = '';
        state.round = 0;
        state.revealed = false;
        state.won = false;
        keyboardState = {};
        isAnimating = false;

        els.reveal.classList.remove('show');
        els.status.textContent = 'Adivina la palabra. Tienes ' + maxAttempts + ' intentos.';
        els.newBtn.disabled = false;

        renderGrid();
        renderKeyboard();
        updateStats();
    }

    function handleKeyPress(key) {
        if (state.revealed || isAnimating) return;

        if (key === 'ENTER') {
            submitGuess();
            return;
        }

        if (key === 'BORRAR') {
            if (state.currentGuess.length > 0) {
                state.currentGuess = state.currentGuess.slice(0, -1);
                renderGrid();
            }
            return;
        }

        if (key.length === 1 && /^[A-ZÑ]$/.test(key)) {
            if (state.currentGuess.length < 5) {
                state.currentGuess += key;
                renderGrid();
            }
        }
    }

    function submitGuess() {
        if (state.revealed || isAnimating) return;
        if (state.currentGuess.length < 5) {
            els.status.textContent = 'Necesitas 5 letras.';
            animateShake(state.round);
            return;
        }

        var guess = state.currentGuess;

        if (!isValidGuess(guess)) {
            els.status.textContent = 'Palabra no válida. Intenta otra.';
            animateShake(state.round);
            return;
        }

        var result = evaluateGuess(guess, state.answer);

        isAnimating = true;

        state.guesses.push({ word: guess, result: result });
        state.currentGuess = '';
        state.total++;

        renderGrid();
        updateRowHighlight();

        animateReveal(state.round, result, function () {
            isAnimating = false;

            if (guess === state.answer) {
                var points = Math.max(10, 60 - state.round * 10);
                state.score += points;
                state.streak++;
                state.correct++;
                if (state.streak > state.maxStreak) {
                    state.maxStreak = state.streak;
                    localStorage.setItem('wordle_max_streak', state.maxStreak);
                }
                state.won = true;
                state.revealed = true;
                animateWin(state.round);
                setTimeout(function () { playSound('win'); }, 100);
                revealResult(true, 'Acertaste. +' + points + ' puntos.');
                updateStats();
            } else if (state.round >= maxAttempts - 1) {
                state.streak = 0;
                state.revealed = true;
                setTimeout(function () { playSound('fail'); }, 100);
                revealResult(false, 'Se acabaron los intentos. Era: ' + state.answer);
                updateStats();

                if (livesEnabled) {
                    loseLife();
                }
            } else {
                state.round++;
                state.currentGuess = '';
                els.status.textContent = 'Siguiente intento: ' + (state.round + 1) + '/' + maxAttempts + '.';
                updateStats();
                updateRowHighlight();
            }
        });
    }

    function revealResult(won, message) {
        els.reveal.classList.add('show');
        els.status.textContent = message;

        if (won) {
            els.resultWord.textContent = state.answer;
            els.resultWord.className = 'result-word win';
            els.resultSubtitle.textContent = '\u00a1Correcto!';
        } else {
            els.resultWord.textContent = state.answer;
            els.resultWord.className = 'result-word lose';
            els.resultSubtitle.textContent = 'La palabra era:';
        }
        els.revealTitle.textContent = won ? 'Victoria' : 'Derrota';
    }

    function showCompletion() {
        $('completionScore').textContent = state.score;
        $('completionOverlay').classList.add('show');
        state.revealed = true;
        els.status.textContent = '\u00a1Completaste todas las palabras!';
    }

    /* ── Start screen logic ────────────────────────────────── */
    var startScreen = els.startScreen;
    var normalToggle = $('normalModeToggle');
    var normalCard = $('normalModeCard');
    var startEasyBtn = $('startEasyBtn');
    var startNormalBtn = $('startNormalBtn');
    var startGameBtn = $('startGameBtn');
    var startNoRepeatBtn = $('startNoRepeatBtn');
    var startRandomBtn = $('startRandomBtn');

    function updateStartBtn() {
        if (startGameBtn) startGameBtn.disabled = false;
    }
    updateStartBtn();

    if (normalToggle && normalCard) {
        normalToggle.addEventListener('click', function () {
            playSound('click');
            var wasOpen = normalCard.classList.contains('open');
            document.querySelectorAll('.mode-card.open').forEach(function (c) { c.classList.remove('open'); });
            if (!wasOpen) normalCard.classList.add('open');
        });
    }

    if (startEasyBtn) {
        startEasyBtn.addEventListener('click', function () {
            playSound('click');
            maxAttempts = 8;
            startEasyBtn.classList.add('active');
            startNormalBtn.classList.remove('active');
            var _ms = document.getElementById('mysteryScreen');
            if (_ms) _ms.classList.add('cagado');
        });
    }
    if (startNormalBtn) {
        startNormalBtn.addEventListener('click', function () {
            playSound('click');
            maxAttempts = 6;
            startNormalBtn.classList.add('active');
            startEasyBtn.classList.remove('active');
            var _ms = document.getElementById('mysteryScreen');
            if (_ms) _ms.classList.remove('cagado');
        });
    }

    if (startNoRepeatBtn) {
        startNoRepeatBtn.addEventListener('click', function () {
            playSound('click');
            noRepeatMode = true;
            startNoRepeatBtn.classList.add('active');
            startRandomBtn.classList.remove('active');
        });
    }
    if (startRandomBtn) {
        startRandomBtn.addEventListener('click', function () {
            playSound('click');
            noRepeatMode = false;
            startRandomBtn.classList.add('active');
            startNoRepeatBtn.classList.remove('active');
        });
    }

    /* ── Lives selector in start screen ────────────────────── */
    var livesSelector = document.querySelector('.lives-selector');
    if (livesSelector) {
        var heartsBtns = livesSelector.querySelectorAll('.lives-heart-btn');
        var countEl = livesSelector.querySelector('.lives-selector-count');
        heartsBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                playSound('click');
                var val = parseInt(btn.dataset.lives, 10);
                if (livesEnabled && MAX_LIVES === val) {
                    livesEnabled = false;
                    localStorage.removeItem('rlb_obs_lives');
                    try {
                        var _pid = localStorage.getItem('rlb_player_id');
                        if (_pid) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid) + '.json', { method: 'DELETE' });
                    } catch (e) {}
                    heartsBtns.forEach(function (h) { h.classList.remove('active'); });
                    if (countEl) countEl.textContent = '';
                } else {
                    livesEnabled = true;
                    if (window.RlbPlayer) RlbPlayer.signalGame();
                    MAX_LIVES = val;
                    localStorage.setItem('rlb_obs_lives', JSON.stringify({ lives: val, max: val }));
                    try {
                        var _pid2 = localStorage.getItem('rlb_player_id');
                        if (_pid2) fetch('https://rickyedit-notifications-default-rtdb.firebaseio.com/leaderboard/obs_lives_' + encodeURIComponent(_pid2) + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lives: val, max: val }) });
                    } catch (e) {}
                    heartsBtns.forEach(function (h) { h.classList.remove('active'); });
                    for (var i = 0; i < val; i++) heartsBtns[i].classList.add('active');
                    if (countEl) countEl.textContent = val;
                }
            });
        });
    }

    if (startGameBtn) {
        startGameBtn.addEventListener('click', function () {
            playSound('success');
            startScreen.classList.add('hide');
            document.body.style.overflow = 'auto';
            wordleGameStartTime = Date.now();

            lives = MAX_LIVES;
            failCount = 0;
            usedExtraLife = false;
            gameOverByLives = false;
            updateLivesDisplay();
            if (window.RlbPlayer) RlbPlayer.signalGame();

            renderGrid();
            renderKeyboard();
            newRound();
        });
    }

    /* ── Game over overlay buttons ──────────────────────────── */
    if (els.gameoverRestartBtn) {
        els.gameoverRestartBtn.addEventListener('click', function () {
            playSound('click');
            if (els.gameoverOverlay) els.gameoverOverlay.classList.remove('show');
            lives = MAX_LIVES;
            failCount = 0;
            usedExtraLife = false;
            gameOverByLives = false;
            state.score = 0;
            state.streak = 0;
            state.correct = 0;
            state.total = 0;
            usedWords = [];
            updateLivesDisplay();
            newRound();
        });
    }
    if (els.gameoverHomeBtn) {
        els.gameoverHomeBtn.addEventListener('click', function () {
            playSound('click');
            if (els.gameoverOverlay) els.gameoverOverlay.classList.remove('show');
            resetLivesToLobby();
            startScreen.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            usedWords = [];
            state.score = 0;
            state.streak = 0;
            state.correct = 0;
            state.total = 0;
            wordleGameStartTime = null;
            renderWordleLeaderboard();
        });
    }

    /* ── +1 Vida buttons ───────────────────────────────────── */
    if (els.extraLifeBtn) {
        els.extraLifeBtn.addEventListener('click', function () {
            playSound('click');
            addExtraLife(false);
        });
    }
    if (els.startExtraLifeBtn) {
        els.startExtraLifeBtn.addEventListener('click', function () {
            playSound('click');
            addExtraLife(true);
        });
    }

    /* ── Physical keyboard ─────────────────────────────────── */
    document.addEventListener('keydown', function (e) {
        if (state.revealed || isAnimating) return;
        if (startScreen && !startScreen.classList.contains('hide')) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            handleKeyPress('ENTER');
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            handleKeyPress('BORRAR');
            return;
        }
        var key = e.key.toUpperCase();
        if (/^[A-ZÑ]$/.test(key)) {
            handleKeyPress(key);
        }
    });

    /* ── Button event listeners ────────────────────────────── */
    els.againBtn.addEventListener('click', function () {
        playSound('click');
        newRound();
    });
    els.newBtn.addEventListener('click', function () {
        playSound('click');
        newRound();
    });

    /* ── Hover sounds ──────────────────────────────────────── */
    var _hoveredEls = new WeakSet();
    document.addEventListener('mouseover', function (e) {
        var el = e.target.closest('button, a.pill-link, a.icon-btn');
        if (el && !_hoveredEls.has(el)) { _hoveredEls.add(el); playSound('click'); }
    });
    document.addEventListener('mouseout', function (e) {
        var el = e.target.closest('button, a.pill-link, a.icon-btn');
        if (el && !el.contains(e.relatedTarget)) _hoveredEls.delete(el);
    });
    document.addEventListener('click', function (e) {
        var el = e.target.closest('button, a.pill-link, a.icon-btn');
        if (el) playSound('click');
    });

    /* ── Info buttons ──────────────────────────────────────── */
    document.querySelectorAll('.info-toggle-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            $('infoModal').classList.add('show');
            playSound('click');
        });
    });

    document.querySelectorAll('#openUpdatesBtn, #startOpenUpdatesBtn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            playSound('click');
            showWordleInfo();
        });
    });

    var WORDLE_INFO_HTML =
        '<h3><img src="../Iconos RickyEdit Web/🆕.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> ¡Bienvenido a Wordle!</h3>' +
        '<p>Tienes que <span class="upd-highlight">adivinar palabras de 5 letras</span> en 6 intentos.</p>' +
        '<hr class="upd-sep">' +
        '<h3><img src="../Iconos RickyEdit Web/🎮.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Cómo se juega</h3>' +
        '<ul>' +
        '<li><strong>Paso 1:</strong> Escribe una palabra de 5 letras con el teclado</li>' +
        '<li><strong>Paso 2:</strong> Pulsa ENTER o el botón para enviar</li>' +
        '<li><strong>Paso 3:</strong> Los colores te dicen qué tan cerca estás:</li>' +
        '<li style="margin-left:16px;"><span style="color:#36e28a;font-weight:800;">🟩 Verde</span> = Letra correcta en posición correcta</li>' +
        '<li style="margin-left:16px;"><span style="color:#f1c40f;font-weight:800;">🟨 Amarillo</span> = Letra correcta pero en posición incorrecta</li>' +
        '<li style="margin-left:16px;"><span style="color:#6b6b7b;font-weight:800;">⬜ Gris</span> = Letra que no está en la palabra</li>' +
        '</ul>' +
        '<hr class="upd-sep">' +
        '<h3><img src="../Iconos RickyEdit Web/😎.png" alt="" style="width:2.4em;height:2.4em;vertical-align:middle;margin-right:6px;"> Modos</h3>' +
        '<ul>' +
        '<li><span class="upd-highlight">Cagado</span> — 8 intentos, más oportunidades</li>' +
        '<li><span class="upd-highlight">Normal</span> — 6 intentos, el modo clásico</li>' +
        '<li><span class="upd-highlight">Sin repetir</span> — No se repite ninguna palabra</li>' +
        '<li><span class="upd-highlight">Aleatorio</span> — Las palabras se repiten y salen en orden aleatorio</li>' +
        '</ul>' +
        '<hr class="upd-sep">' +
        '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
        '<p>Compite con otros jugadores en la clasificación.</p>';

    function showWordleInfo() {
        RickyUpdates.forceShow(WORDLE_INFO_HTML);
    }

    /* ── Leaderboard ───────────────────────────────────────── */
    var finalizeBtn = $('finalizeBtn');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', function () {
            playSound('click');
            var elapsed = wordleGameStartTime ? ((Date.now() - wordleGameStartTime) / 1000).toFixed(1) : null;
            RickyLeaderboard.save('wordle', {
                score: state.score,
                difficulty: maxAttempts === 8 ? 'easy' : 'normal',
                time: elapsed ? parseFloat(elapsed) : null,
                correct: state.correct || 0,
                total: state.total || 0,
                maxStreak: state.maxStreak || 0,
                lives: livesEnabled ? lives : null,
                maxLives: livesEnabled ? MAX_LIVES : null
            }, function (savedData) {
                RickyLeaderboard.showSaveToast('wordle', savedData);
                els.reveal.classList.remove('show');
                startScreen.classList.remove('hide');
                document.body.style.overflow = 'hidden';
                resetLivesToLobby();
                renderWordleLeaderboard();
            });
        });
    }

    var finalizeBtnMid = $('finalizeBtnMid');
    if (finalizeBtnMid) {
        finalizeBtnMid.addEventListener('click', function () {
            playSound('click');
            var elapsed = wordleGameStartTime ? ((Date.now() - wordleGameStartTime) / 1000).toFixed(1) : null;
            RickyLeaderboard.save('wordle', {
                score: state.score,
                difficulty: maxAttempts === 8 ? 'easy' : 'normal',
                time: elapsed ? parseFloat(elapsed) : null,
                correct: state.correct || 0,
                total: state.total || 0,
                maxStreak: state.maxStreak || 0,
                lives: livesEnabled ? lives : null,
                maxLives: livesEnabled ? MAX_LIVES : null
            }, function (savedData) {
                RickyLeaderboard.showSaveToast('wordle', savedData);
                els.reveal.classList.remove('show');
                startScreen.classList.remove('hide');
                document.body.style.overflow = 'hidden';
                resetLivesToLobby();
                state.score = 0;
                state.streak = 0;
                state.correct = 0;
                state.total = 0;
                wordleGameStartTime = null;
                renderWordleLeaderboard();
            });
        });
    }

    $('completionRestartBtn').addEventListener('click', function () {
        playSound('click');
        usedWords = [];
        state.score = 0;
        state.streak = 0;
        state.correct = 0;
        state.total = 0;
        $('completionOverlay').classList.remove('show');
        newRound();
    });
    $('completionFinalizeBtn').addEventListener('click', function () {
        playSound('click');
        var elapsed = wordleGameStartTime ? ((Date.now() - wordleGameStartTime) / 1000).toFixed(1) : null;
        RickyLeaderboard.save('wordle', {
            score: state.score,
            difficulty: maxAttempts === 8 ? 'easy' : 'normal',
            time: elapsed ? parseFloat(elapsed) : null,
            correct: state.correct || 0,
            total: state.total || 0,
            maxStreak: state.maxStreak || 0,
            lives: livesEnabled ? lives : null,
            maxLives: livesEnabled ? MAX_LIVES : null
        }, function (savedData) {
            RickyLeaderboard.showSaveToast('wordle', savedData);
            $('completionOverlay').classList.remove('show');
            els.reveal.classList.remove('show');
            startScreen.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            resetLivesToLobby();
            usedWords = [];
            state.score = 0;
            state.streak = 0;
            state.correct = 0;
            state.total = 0;
            wordleGameStartTime = null;
            renderWordleLeaderboard();
        });
    });
    $('completionHomeBtn').addEventListener('click', function () {
        playSound('click');
        $('completionOverlay').classList.remove('show');
        els.reveal.classList.remove('show');
        startScreen.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        resetLivesToLobby();
        usedWords = [];
        state.score = 0;
        state.streak = 0;
        state.correct = 0;
        state.total = 0;
        wordleGameStartTime = null;
    });

    /* ── Game topbar Volver ────────────────────────────────── */
    var gameVolverBtn = $('gameVolverBtn');
    if (gameVolverBtn) {
        gameVolverBtn.addEventListener('click', function () {
            playSound('click');
            var hasScore = state.score > 0;
            if (!hasScore) {
                resetLivesToLobby();
                location.href = '../index.html';
                return;
            }
            RickyLeaderboard.showExitConfirm(
                function () {
                    resetLivesToLobby();
                    location.href = '../index.html';
                },
                function () {
                    var elapsed = wordleGameStartTime ? ((Date.now() - wordleGameStartTime) / 1000).toFixed(1) : null;
                    RickyLeaderboard.save('wordle', {
                        score: state.score,
                        difficulty: maxAttempts === 8 ? 'easy' : 'normal',
                        time: elapsed ? parseFloat(elapsed) : null,
                        correct: state.correct || 0,
                        total: state.total || 0,
                        maxStreak: state.maxStreak || 0,
                        lives: livesEnabled ? lives : null,
                        maxLives: livesEnabled ? MAX_LIVES : null
                    }, function (savedData) {
                        RickyLeaderboard.showSaveToast('wordle', savedData);
                    });
                    resetLivesToLobby();
                    state.score = 0; state.streak = 0; state.correct = 0; state.total = 0; wordleGameStartTime = null;
                    location.href = '../index.html';
                }
            );
        });
    }

    /* ── Leaderboard render ────────────────────────────────── */
    renderWordleLeaderboard();
    RickyLeaderboard.onScoresUpdated(function () { renderWordleLeaderboard(); });

    function renderWordleLeaderboard() {
        RickyLeaderboard.render('leaderboardContainer', 'wordle', {
            title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top \u2014 Wordle',
            columns: ['rank', 'name', 'score', 'correct', 'total', 'percent', 'lives', 'time', 'difficulty', 'date'],
            difficulties: ['easy', 'normal'],
            maxRows: 100
        });
    }

    RickyUpdates.show('wordle', 'v1.0', WORDLE_INFO_HTML);

})();
