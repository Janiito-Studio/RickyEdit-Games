/* ============================================================
   Rickyedit Games — Letrless
   Guess the song from lyric fragments, word by word.
   ============================================================ */
(function () {
    'use strict';

    const LYRICS = window.RICKY_LYRICS || {};
    const SONGS = window.RICKY_SONGS || [];

    let audioCtx = null;
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
        }
        _currentOsc = osc;
    }

    function normalize(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9ñ ]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function tokenScore(guess, answer) {
        var guessWords = new Set(guess.split(' ').filter(Boolean));
        var answerWords = new Set(answer.split(' ').filter(Boolean));
        var hits = 0;
        guessWords.forEach(function (word) {
            if (answerWords.has(word)) hits += 1;
        });
        return hits / Math.max(1, Math.min(6, answerWords.size), guessWords.size);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getRank(streak) {
        if (streak >= 12) return 'RickyLord';
        if (streak >= 9) return '\u00c9lite';
        if (streak >= 6) return 'Experto';
        if (streak >= 4) return 'Ultra Fan';
        if (streak >= 2) return 'Fan';
        return 'Novato';
    }

    // Build SONG_MAP: lyrics key -> RICKY_SONGS entry
    var SONG_MAP = {};
    Object.keys(LYRICS).forEach(function (key) {
        var normalizedKey = normalize(key);
        var found = SONGS.find(function (s) { return normalize(s.title).startsWith(normalizedKey); });
        if (found) SONG_MAP[key] = found;
    });

    // Game state
    var minWords = 5; // default normal
    var noRepeatMode = true;
    var usedSongs = [];
    var gameStartTime = null;

    var state = {
        current: null,
        score: 0,
        streak: 0,
        maxStreak: parseInt(localStorage.getItem('letrless_max_streak') || '0', 10),
        round: 0,
        revealed: false,
        activeSearchIndex: -1,
        correct: 0,
        total: 0
    };

    var $ = function (id) { return document.getElementById(id); };
    var els = {
        lyricDisplay: $('lyricDisplay'),
        guessInput: $('guessInput'),
        guessBtn: $('guessBtn'),
        newBtn: $('newBtn'),
        skipBtn: $('skipBtn'),
        status: $('status'),
        score: $('score'),
        streak: $('streak'),
        maxStreak: $('maxStreak'),
        rank: $('rank'),
        attempt: $('attempt'),
        videoCount: $('videoCount'),
        rounds: $('rounds'),
        reveal: $('reveal'),
        revealMedia: $('revealMedia'),
        revealTitle: $('revealTitle'),
        revealLinkText: $('revealLinkText'),
        watchLink: $('watchLink'),
        againBtn: $('againBtn'),
        searchResults: $('searchResults')
    };

    function updateStats() {
        els.score.textContent = state.score;
        els.streak.textContent = state.streak;
        els.maxStreak.textContent = state.maxStreak;
        els.rank.textContent = getRank(state.streak);
        if (state.current) {
            var total = state.current.words.length;
            els.attempt.textContent = Math.min(state.round + 1, total) + '/' + total;
        }
        els.videoCount.textContent = Object.keys(LYRICS).length;
        var steps = els.rounds.querySelectorAll('.round-step');
        steps.forEach(function (step, index) {
            step.classList.toggle('active', index === state.round);
            step.classList.toggle('done', index < state.round);
        });
    }

    function updateLyricDisplay() {
        if (!state.current) return;
        var words = state.current.words;
        var visibleCount = Math.min(state.round + 1, words.length);
        var html = '';
        for (var i = 0; i < words.length; i++) {
            if (i < visibleCount) {
                html += '<span class="lyric-word revealed">' + escapeHtml(words[i]) + '</span>';
            } else {
                html += '<span class="lyric-word hidden">___</span>';
            }
        }
        els.lyricDisplay.innerHTML = html;
    }

    function renderRounds() {
        els.rounds.innerHTML = '';
        if (!state.current) return;
        var total = state.current.words.length;
        for (var i = 0; i < total; i++) {
            var item = document.createElement('div');
            item.className = 'round-step';
            item.textContent = (i + 1);
            els.rounds.appendChild(item);
        }
    }

    function selectRandomSong() {
        var keys = Object.keys(LYRICS);
        var available = keys;
        /* Filter by selected years if any (skip if Todas is active) */
        if (!todasActive && selectedYears.size > 0) {
            available = keys.filter(function (k) {
                var song = SONG_MAP[k];
                return song && selectedYears.has(song.year);
            });
            if (!available.length) available = keys;
        }
        if (noRepeatMode && usedSongs.length >= available.length) usedSongs = [];
        var filtered = noRepeatMode ? available.filter(function (k) { return usedSongs.indexOf(k) === -1; }) : available;
        if (!filtered.length) filtered = available;
        var key = filtered[Math.floor(Math.random() * filtered.length)];
        usedSongs.push(key);

        // Pick a random line with enough words
        var lines = LYRICS[key].filter(function (line) {
            return line.split(/\s+/).filter(Boolean).length >= minWords;
        });
        if (!lines.length) {
            // Fallback: use any line with 3+ words
            lines = LYRICS[key].filter(function (line) {
                return line.split(/\s+/).filter(Boolean).length >= 3;
            });
        }
        if (!lines.length) lines = LYRICS[key]; // ultimate fallback

        var line = lines[Math.floor(Math.random() * lines.length)];
        var words = line.split(/\s+/).filter(Boolean);

        return { title: key, line: line, words: words };
    }

    function newRound() {
        state.current = selectRandomSong();
        state.round = 0;
        state.revealed = false;
        els.reveal.classList.remove('show');
        els.revealMedia.innerHTML = '';
        els.guessInput.value = '';
        hideSearchResults();
        els.guessInput.disabled = false;
        els.guessBtn.disabled = false;
        els.newBtn.disabled = false;
        els.status.textContent = 'Adivina la canción. Se van desbloqueando las palabras.';
        renderRounds();
        updateLyricDisplay();
        updateStats();
    }

    function submitGuess() {
        if (!state.current || state.revealed) return;
        hideSearchResults();
        var guess = normalize(els.guessInput.value);
        var answer = normalize(state.current.title);
        if (!guess) {
            els.status.textContent = 'Escribe algo antes de adivinar.';
            return;
        }
        if (guess.length < 2) {
            els.status.textContent = 'Escribe al menos 2 caracteres.';
            return;
        }

        var songInfo = SONG_MAP[state.current.title];
        var fullTitle = songInfo ? normalize(songInfo.title) : answer;
        if (fullTitle === guess || answer === guess) {
            var points = Math.max(10, 60 - state.round * 10);
            state.score += points;
            state.streak += 1;
            state.correct++;
            state.total++;
            if (state.streak > state.maxStreak) {
                state.maxStreak = state.streak;
                localStorage.setItem('letrless_max_streak', state.maxStreak);
            }
            reveal(true, 'Acertaste. +' + points + ' puntos.');
            setTimeout(function () { playSound('success'); }, 100);
            return;
        }

        state.total++;
        els.status.textContent = 'No era ese. Te revelo la siguiente palabra.';
        setTimeout(function () { playSound('fail'); }, 100);
        nextRound(false);
    }

    function nextRound(showMessage) {
        if (state.revealed) return;
        state.round += 1;
        if (state.round >= state.current.words.length) {
            state.streak = 0;
            reveal(false, 'Se acabaron las palabras. Era: ' + state.current.title);
            return;
        }
        updateLyricDisplay();
        updateStats();
        if (showMessage !== false) {
            els.status.textContent = 'Siguiente palabra: ' + (state.round + 1) + '/' + state.current.words.length + '.';
        }
    }

    function reveal(won, message) {
        state.revealed = true;
        els.guessInput.disabled = true;
        els.guessBtn.disabled = true;
        els.status.textContent = message;
        els.revealTitle.textContent = won
            ? 'Correcto: ' + state.current.title
            : state.current.title;

        var songInfo = SONG_MAP[state.current.title];
        if (songInfo) {
            els.revealMedia.innerHTML = '<iframe title="Canción revelada" src="https://www.youtube.com/embed/' + songInfo.id + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
            els.watchLink.href = 'https://www.youtube.com/watch?v=' + songInfo.id;
            els.watchLink.style.display = '';
            els.revealLinkText.textContent = '';
        } else {
            els.revealMedia.innerHTML = 'No disponible';
            els.revealLinkText.textContent = 'Enlace no disponible';
            els.watchLink.style.display = 'none';
        }

        els.reveal.classList.add('show');
        updateLyricDisplay();
        updateStats();
    }

    var searchVisibleCount = 8;

    function renderSearchResults() {
        state.activeSearchIndex = -1;
        var query = normalize(els.guessInput.value);
        if (query.length < 1) {
            hideSearchResults();
            return;
        }

        var terms = query.split(' ').filter(Boolean);
        var matches = SONGS.filter(function (song) {
            var title = normalize(song.title);
            return terms.every(function (term) { return title.indexOf(term) !== -1; });
        });

        matches.sort(function (a, b) {
            var titleA = normalize(a.title);
            var titleB = normalize(b.title);
            var aStarts = titleA.startsWith(query) ? 1 : 0;
            var bStarts = titleB.startsWith(query) ? 1 : 0;
            return bStarts - aStarts || titleA.length - titleB.length;
        });

        if (!matches.length) {
            els.searchResults.innerHTML = '<div class="search-summary">No hay resultados para "' + escapeHtml(els.guessInput.value) + '"</div>';
            els.searchResults.classList.add('show');
            return;
        }

        var visibleMatches = matches.slice(0, searchVisibleCount);
        var remaining = matches.length - visibleMatches.length;

        var html = '<div class="search-summary">' + matches.length + ' resultado' + (matches.length === 1 ? '' : 's') + '</div>';
        visibleMatches.forEach(function (song) {
            html += '<button class="search-option" type="button" data-title="' + escapeHtml(song.title) + '">' +
                '<img class="search-option-thumb" src="https://img.youtube.com/vi/' + song.id + '/mqdefault.jpg" alt="">' +
                '<div class="search-option-info">' +
                '<div class="search-option-title">' + escapeHtml(song.title) + '</div>' +
                '<div class="search-option-meta">' + song.year + '</div>' +
                '</div></button>';
        });
        if (remaining > 0) {
            html += '<button class="search-option search-more" type="button" style="justify-content:center;color:var(--pink);font-weight:900;">Ver más (' + remaining + ' restantes)</button>';
        }

        els.searchResults.innerHTML = html;
        els.searchResults.classList.add('show');
        els.searchResults.querySelectorAll('.search-option').forEach(function (button) {
            button.addEventListener('click', function () {
                playSound('click');
                if (button.classList.contains('search-more')) {
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
        buttons.forEach(function (btn, idx) {
            if (idx === state.activeSearchIndex) {
                btn.classList.add('selected');
                btn.scrollIntoView({ block: 'nearest' });
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    function hideSearchResults() {
        els.searchResults.classList.remove('show');
        els.searchResults.innerHTML = '';
    }

    // Event listeners
    els.guessBtn.addEventListener('click', function () { playSound('click'); submitGuess(); });
    els.newBtn.addEventListener('click', function () { playSound('click'); newRound(); });
    els.againBtn.addEventListener('click', function () { playSound('click'); newRound(); });
    els.skipBtn.addEventListener('click', function () { playSound('click'); nextRound(); });

    els.guessInput.addEventListener('keydown', function (event) {
        var buttons = els.searchResults.querySelectorAll('.search-option');
        if (buttons.length > 0 && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter')) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                state.activeSearchIndex = (state.activeSearchIndex + 1) % buttons.length;
                updateSearchHighlight(buttons);
                return;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                state.activeSearchIndex = (state.activeSearchIndex - 1 + buttons.length) % buttons.length;
                updateSearchHighlight(buttons);
                return;
            }
            if (event.key === 'Enter' && state.activeSearchIndex >= 0) {
                event.preventDefault();
                buttons[state.activeSearchIndex].click();
                return;
            }
        }
        if (event.key === 'Enter') submitGuess();
        if (event.key === 'Escape') hideSearchResults();
    });

    els.guessInput.addEventListener('input', renderSearchResults);

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.guess-row')) hideSearchResults();
    });

    // Start screen
    var startScreen = document.getElementById('startScreen');
    var normalToggle = document.getElementById('normalModeToggle');
    var normalCard = document.getElementById('normalModeCard');
    var startEasyBtn = document.getElementById('startEasyBtn');
    var startNormalBtn = document.getElementById('startNormalBtn');
    var startHardBtn = document.getElementById('startHardBtn');
    var startGameBtn = document.getElementById('startGameBtn');

    /* ── Year filter ── */
    var selectedYears = new Set();
    var todasActive = false;
    var yearChipsEl = document.getElementById('yearChips');

    function buildLetrlessYearChips() {
        var yearSet = new Set();
        SONGS.forEach(function (s) { if (s.year) yearSet.add(s.year); });
        var years = Array.from(yearSet).sort(function (a, b) { return b - a; });
        if (yearChipsEl) {
            yearChipsEl.innerHTML =
                '<button class="year-chip" data-year="">Todas</button>' +
                years.map(function (y) { return '<button class="year-chip" data-year="' + y + '">' + y + '</button>'; }).join("");
        }
    }

    function updateLetrlessStartBtn() {
        if (startGameBtn) startGameBtn.disabled = !todasActive && selectedYears.size === 0;
    }

    if (yearChipsEl) {
        yearChipsEl.addEventListener("click", function (e) {
            var chip = e.target.closest(".year-chip");
            if (!chip) return;
            var yearVal = chip.dataset.year;
            if (yearVal === "") {
                var allYears = yearChipsEl.querySelectorAll(".year-chip:not([data-year=''])");
                var allActive = allYears.length === yearChipsEl.querySelectorAll(".year-chip.active:not([data-year=''])").length;
                yearChipsEl.querySelectorAll(".year-chip").forEach(function (c) { c.classList.remove("active"); });
                if (!allActive) {
                    chip.classList.add("active");
                    allYears.forEach(function (c) { c.classList.add("active"); });
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
                yearChipsEl.querySelectorAll(".year-chip.active:not([data-year=''])").forEach(function (c) {
                    selectedYears.add(Number(c.dataset.year));
                });
                var allIndiv = yearChipsEl.querySelectorAll(".year-chip:not([data-year=''])");
                if (selectedYears.size === allIndiv.length) {
                    yearChipsEl.querySelector(".year-chip[data-year='']").classList.add("active");
                    todasActive = true;
                    selectedYears = new Set();
                }
            }
            updateLetrlessStartBtn();
        });
    }

    buildLetrlessYearChips();
    updateLetrlessStartBtn();

    if (normalToggle && normalCard) {
        normalToggle.addEventListener('click', function () {
            playSound('click');
            var wasOpen = normalCard.classList.contains('open');
            document.querySelectorAll('.mode-card.open').forEach(function (c) { c.classList.remove('open'); });
            if (!wasOpen) normalCard.classList.add('open');
        });
    }

    // Difficulty buttons (min words)
    function clearDiffBtns() {
        startEasyBtn.classList.remove('active');
        startNormalBtn.classList.remove('active');
        startHardBtn.classList.remove('active');
    }

    if (startEasyBtn) {
        startEasyBtn.addEventListener('click', function () {
            playSound('click');
            clearDiffBtns();
            startEasyBtn.classList.add('active');
            minWords = 7;
        });
    }
    if (startNormalBtn) {
        startNormalBtn.addEventListener('click', function () {
            playSound('click');
            clearDiffBtns();
            startNormalBtn.classList.add('active');
            minWords = 5;
        });
    }
    if (startHardBtn) {
        startHardBtn.addEventListener('click', function () {
            playSound('click');
            clearDiffBtns();
            startHardBtn.classList.add('active');
            minWords = 3;
        });
    }

    var startNoRepeatBtn = document.getElementById('startNoRepeatBtn');
    var startRandomBtn = document.getElementById('startRandomBtn');

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

    if (startGameBtn) {
        startGameBtn.addEventListener('click', function () {
            playSound('success');
            startScreen.classList.add('hide');
            document.body.style.overflow = 'auto';
            gameStartTime = Date.now();

            var diffLabel = minWords === 7 ? 'Fácil' : minWords === 3 ? 'Difícil' : 'Normal';
            document.getElementById('segmentsInfo').textContent =
                'Mínimo ' + minWords + ' palabras por frase (' + diffLabel + '). Cada fallo revela una palabra más.';
            renderRounds();
            newRound();
        });
    }

    // Hover sounds
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

    // Info modal
    document.querySelectorAll('.info-toggle-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            document.getElementById('infoModal').classList.add('show');
            playSound('click');
        });
    });

    // Info buttons
    document.querySelectorAll('#openUpdatesBtn, #startOpenUpdatesBtn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            playSound('click');
            RickyUpdates.forceShow(LETRLESS_INFO_HTML);
        });
    });

    // Leaderboard
    var finalizeBtn = document.getElementById('finalizeBtn');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', function () {
            playSound('click');
            var elapsed = gameStartTime ? ((Date.now() - gameStartTime) / 1000).toFixed(1) : null;
            RickyLeaderboard.save('letrless', {
                score: state.score,
                difficulty: minWords === 7 ? 'easy' : minWords === 3 ? 'hard' : 'normal',
                time: elapsed ? parseFloat(elapsed) : null,
                correct: state.correct || 0,
                total: state.total || 0,
                maxStreak: state.maxStreak || 0
            }, function () {
                document.getElementById('reveal').classList.remove('show');
                document.getElementById('startScreen').classList.remove('hide');
                document.body.style.overflow = 'hidden';
                renderLetrlessLeaderboard();
            });
        });
    }

    var finalizeBtnMid = document.getElementById('finalizeBtnMid');
    if (finalizeBtnMid) {
        finalizeBtnMid.addEventListener('click', function () {
            playSound('click');
            var elapsed = gameStartTime ? ((Date.now() - gameStartTime) / 1000).toFixed(1) : null;
            RickyLeaderboard.save('letrless', {
                score: state.score,
                difficulty: minWords === 7 ? 'easy' : minWords === 3 ? 'hard' : 'normal',
                time: elapsed ? parseFloat(elapsed) : null,
                correct: state.correct || 0,
                total: state.total || 0,
                maxStreak: state.maxStreak || 0
            }, function () {
                document.getElementById('reveal').classList.remove('show');
                document.getElementById('startScreen').classList.remove('hide');
                document.body.style.overflow = 'hidden';
                state.score = 0;
                state.streak = 0;
                state.correct = 0;
                state.total = 0;
                gameStartTime = null;
                renderLetrlessLeaderboard();
            });
        });
    }

    renderLetrlessLeaderboard();
    RickyLeaderboard.onScoresUpdated(function () { renderLetrlessLeaderboard(); });

    function renderLetrlessLeaderboard() {
        RickyLeaderboard.render('leaderboardContainer', 'letrless', {
            title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top — Letrless',
            columns: ['rank', 'name', 'correct', 'total', 'percent', 'time', 'difficulty', 'date'],
            difficulties: ['easy', 'normal', 'hard'],
            maxRows: 20
        });
    }

    var LETRLESS_INFO_HTML =
        '<h3>🆕 ¡Bienvenido a Letrless!</h3>' +
        '<p>Este es un juego donde tienes que <span class="upd-highlight">adivinar canciones de Rickyedit</span> a partir de fragmentos de su letra.</p>' +
        '<hr class="upd-sep">' +
        '<h3>🎮 Cómo se juega</h3>' +
        '<ul>' +
        '<li>Se muestra una frase de una canción, palabra por palabra</li>' +
        '<li>Empiezas con la primera palabra visible</li>' +
        '<li>Cada fallo revela la siguiente palabra</li>' +
        '<li>Si se revelan todas las palabras, pierdes la ronda</li>' +
        '</ul>' +
        '<hr class="upd-sep">' +
        '<h3>😎 Dificultades</h3>' +
        '<ul>' +
        '<li><span class="upd-highlight">Fácil</span> — Frases con 7+ palabras (más pistas)</li>' +
        '<li><span class="upd-highlight">Normal</span> — Frases con 5+ palabras (equilibrado)</li>' +
        '<li><span class="upd-highlight">Difícil</span> — Frases con 3+ palabras (menos pistas)</li>' +
        '<li><span class="upd-highlight">Sin repetir</span> — No se repite ninguna canción</li>' +
        '</ul>' +
        '<hr class="upd-sep">' +
        '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
        '<p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>';

    RickyUpdates.show('letrless', 'v1.0', LETRLESS_INFO_HTML);

})();
