const EMOJI_DATA = {
    "ir": "🚶🛣️🌃💨🖤🌙",
    "si mañana": "🌅☁️⏳🤔💭🌤️",
    "diva virtual": "👩📱💿✨💔🌐",
    "lo siento": "😔🥀🖤🌧️💭💔",
    "rango superior": "👑⬆️💸🔥🚀💎",
    "hoa": "🌺☀️😵‍💫🌴✨🌈",
    "priority": "📲⚡❤️🕒💭🔥",
    "otra vida": "🌌🪐🕊️✨🌠💭",
    "quema": "🔥🚬🫀🌑💥🥀",
    "paqué": "❓🤷🌀💭😵🌫️",
    "caliente": "🥵🔥🌡️☀️💦❤️",
    "noche": "🌙🌃🚬✨🖤🌧️",
    "badabadún": "🥁🎺🎉🕺🔥⚡",
    "y más allá": "🚀🌌⭐🪐✨🌠",
    "casa": "🏠🛏️🌧️🖤💭☕",
    "gourmet": "🍷🍽️🧀💎✨🥂",
    "en verdad": "🗣️👀🫀💭🖤⚡",
    "por ti": "❤️🌹🫶✨🥀💌",
    "mi habitación": "🛏️💻🌑🎧🖤🌧️",
    "era": "⏳📼🌫️🥀💭🖤",
    "u banned": "🚫💻🔨💀⚠️🖤",
    "4k/mes": "💸📈🤑🔥💻🚗",
    "mamisabesqno": "😵‍💫🎶❤️🌙🌀💭",
    "navimal": "🎄❄️😈🎁🖤🔔",
    "quelamamen": "😈🍑🔥🖤💋⚡",
    "blu": "🔵🌊🫧🌌💙🌙",
    "COVID-AD (Villancico RickyEdit)": "🦠🎄😷🔔❄️🧪"
};

const SONGS = window.RICKY_SONGS || [];
const MAX_ATTEMPTS = 6;

const state = {
    current: null,
    score: 0,
    streak: 0,
    maxStreak: parseInt(localStorage.getItem("emojless_max_streak") || "0", 10),
    round: 0,
    revealed: false,
    activeSearchIndex: -1,
};

const $ = (id) => document.getElementById(id);
const els = {
    emojiDisplay: $("emojiDisplay"),
    guessInput: $("guessInput"),
    guessBtn: $("guessBtn"),
    newBtn: $("newBtn"),
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
    const visible = allEmojis.slice(0, state.round + 1);
    const hidden = allEmojis.slice(state.round + 1).map(() => "\u2753");
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
    const key = keys[Math.floor(Math.random() * keys.length)];
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
    els.status.textContent = "Adivina la canción. Tienes 6 intentos.";
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

    if (answer.includes(guess) || tokenScore(guess, answer) >= 0.68) {
        const points = Math.max(10, 60 - state.round * 10);
        state.score += points;
        state.streak += 1;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
            localStorage.setItem("emojless_max_streak", state.maxStreak);
        }
        reveal(true, `Acertaste. +${points} puntos.`);
        return;
    }

    els.status.textContent = "No era ese. Te revelo otro emoji.";
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

    const songInfo = SONGS.find(s => normalize(s.title).includes(normalize(state.current.title)));
    if (songInfo) {
        els.revealMedia.innerHTML = `<iframe title="Canción revelada" src="https://www.youtube.com/embed/${songInfo.id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        els.revealLinkText.innerHTML = `<a href="https://www.youtube.com/watch?v=${songInfo.id}" target="_blank">Ver en YouTube</a>`;
    } else {
        els.revealMedia.innerHTML = "No disponible";
        els.revealLinkText.textContent = "Enlace no disponible";
    }

    els.reveal.classList.add("show");
    updateEmojiDisplay();
    updateStats();
}

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

    const maxResults = 8;
    const visibleMatches = matches.slice(0, maxResults);

    els.searchResults.innerHTML = `
        <div class="search-summary">
          ${matches.length} resultado${matches.length === 1 ? "" : "s"}
          ${matches.length > maxResults ? ` (mostrando los primeros ${maxResults})` : ""}
        </div>
        ${visibleMatches
            .map((song) => {
                return `
            <button class="search-option" type="button" data-title="${escapeHtml(song.title)}">
              <img class="search-option-thumb" src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" alt="">
              <div class="search-option-info">
                <div class="search-option-title">${escapeHtml(song.title)}</div>
                <div class="search-option-meta">${song.year}</div>
              </div>
            </button>
          `;
            })
            .join("")}
      `;
    els.searchResults.classList.add("show");
    els.searchResults
        .querySelectorAll(".search-option")
        .forEach((button) => {
            button.addEventListener("click", () => {
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

newRound();
