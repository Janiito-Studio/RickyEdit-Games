const EMOJI_DATA = {
    "ir": "🚶🛣️🌆",
    "si mañana": "☁️⏳🌅",
    "diva virtual": "👩📱💿",
    "lo siento": "😔🥀💔",
    "rango superior": "👑📈🔥",
    "hoa": "🌺🌴✨",
    "priority": "❗📞⚡",
    "otra vida": "🌌🪐🕊️",
    "quema": "🔥🚬💣",
    "paqué": "🤷❓🌀",
    "caliente": "🌡️🔥🥵",
    "noche": "🌙🌃✨",
    "badabadún": "🥁🎺🎉",
    "y más allá": "🚀🌌⭐",
    "casa": "🏠🛋️🌧️",
    "gourmet": "🍷🍽️🧀",
    "en verdad": "🗣️👀💭",
    "por ti": "❤️🫶🌹",
    "mi habitación": "🛏️💻🌑",
    "era": "⏳📼🌫️",
    "u banned": "🚫🔨💀",
    "4k/mes": "💸📈🤑",
    "mamisabesqno": "😵🎶🌀",
    "navimal": "🎄❄️🎁",
    "quelamamen": "😈🍑🔥",
    "blu": "🔵🌊🫧",
    "COVID-AD (Villancico RickyEdit)": "🦠🎄😷"
};

let currentSong = null;
let score = 0;
let streak = 0;
let maxStreak = 0;
let attempts = 1;
const MAX_ATTEMPTS = 6;

const elements = {
    emojiDisplay: document.getElementById('emojiDisplay'),
    guessInput: document.getElementById('guessInput'),
    guessBtn: document.getElementById('guessBtn'),
    scoreEl: document.getElementById('score'),
    streakEl: document.getElementById('streak'),
    maxStreakEl: document.getElementById('maxStreak'),
    attemptEl: document.getElementById('attempt'),
    videoCountEl: document.getElementById('videoCount'),
    roundsEl: document.getElementById('rounds'),
    statusEl: document.getElementById('status'),
    newBtn: document.getElementById('newBtn'),
    reveal: document.getElementById('reveal'),
    revealMedia: document.getElementById('revealMedia'),
    revealTitle: document.getElementById('revealTitle'),
    revealLinkText: document.getElementById('revealLinkText'),
    searchResults: document.getElementById('searchResults')
};

function updateStats() {
    elements.scoreEl.textContent = score;
    elements.streakEl.textContent = streak;
    elements.maxStreakEl.textContent = maxStreak;
    elements.attemptEl.textContent = `${attempts}/${MAX_ATTEMPTS}`;
    elements.videoCountEl.textContent = currentSong ? 1 : 0;
}

function getRank() {
    if (score >= 50) return "Leyenda";
    if (score >= 30) return "Experto";
    if (score >= 15) return "Conocedor";
    if (score >= 5) return "Aprendiz";
    return "Novato";
}

function updateRank() {
    document.getElementById('rank').textContent = getRank();
}

function selectRandomSong() {
    const songs = Object.keys(EMOJI_DATA);
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    return {
        title: randomSong,
        emojis: EMOJI_DATA[randomSong]
    };
}

function startNewGame() {
    currentSong = selectRandomSong();
    attempts = 1;
    elements.emojiDisplay.textContent = currentSong.emojis;
    elements.guessInput.value = '';
    elements.reveal.classList.remove('show');
    elements.statusEl.textContent = '¿Qué canción es?';
    
    renderRounds();
    updateStats();
    updateRank();
}

function renderRounds() {
    elements.roundsEl.innerHTML = '';
    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        const div = document.createElement('div');
        div.className = `round-step ${i === attempts ? 'active' : (i < attempts ? 'done' : '')}`;
        div.textContent = i;
        elements.roundsEl.appendChild(div);
    }
}

function checkGuess() {
    const guess = elements.guessInput.value.trim().toLowerCase();
    const correct = currentSong.title.toLowerCase();

    if (!guess) return;

    if (guess === correct) {
        handleWin();
    } else {
        handleWrong();
    }
}

function handleWin() {
    score += (MAX_ATTEMPTS - attempts + 1) * 10;
    streak++;
    maxStreak = Math.max(maxStreak, streak);
    
    elements.statusEl.textContent = '¡Correcto! 🎉';
    elements.guessBtn.disabled = true;
    
    revealSong();
}

function handleWrong() {
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
        streak = 0;
        elements.statusEl.textContent = '¡Has perdido!';
        revealSong();
    } else {
        elements.statusEl.textContent = 'Incorrecto ❌';
        renderRounds();
        updateStats();
    }
}

function revealSong() {
    elements.reveal.classList.add('show');
    elements.revealTitle.textContent = currentSong.title;
    
    // Find song in ricky-songs.js list to get YouTube link
    const songInfo = rickySongs.find(s => s.title.toLowerCase() === currentSong.title.toLowerCase());
    if (songInfo) {
        elements.revealMedia.innerHTML = `<iframe src="https://www.youtube.com/embed/${songInfo.id}" frameborder="0" allowfullscreen></iframe>`;
        elements.revealLinkText.innerHTML = `<a href="https://www.youtube.com/watch?v=${songInfo.id}" target="_blank">Ver en YouTube</a>`;
    } else {
        elements.revealMedia.innerHTML = 'No disponible';
        elements.revealLinkText.textContent = 'Enlace no disponible';
    }
    
    elements.guessBtn.disabled = false;
}

document.getElementById('guessBtn').addEventListener('click', checkGuess);
elements.newBtn.addEventListener('click', startNewGame);
elements.guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkGuess();
});

// Search logic using ricky-songs.js
function initSearch() {
    elements.guessInput.addEventListener('input', () => {
        const query = elements.guessInput.value.toLowerCase();
        if (!query) {
            elements.searchResults.classList.remove('show');
            return;
        }

        const matches = rickySongs.filter(s => s.title.toLowerCase().includes(query));
        
        elements.searchResults.innerHTML = `
            <div class="search-summary">Resultados encontrados: ${matches.length}</div>
            ${matches.map(s => `
                <div class="search-option" data-title="${s.title}">
                    <img class="search-option-thumb" src="${s.thumb}" alt="${s.title}">
                    <div class="search-option-info">
                        <div class="search-option-title">${s.title}</div>
                        <div class="search-option-meta">${s.year}</div>
                    </div>
                </div>
            `).join('')}
        `;
        elements.searchResults.classList.add('show');
    });

    document.addEventListener('addEventListener', (e) => {
        // Note: This is a BUG in my code, should be document.addEventListener('click', ...)
    });
}

// Correcting search click handler
document.addEventListener('click', (e) => {
    if (e.target.closest('.search-option')) {
        const option = e.target.closest('.search-option');
        elements.guessInput.value = option.dataset.title;
        elements.searchResults.classList.remove('show');
    }
});

initSearch();
startNewGame();
