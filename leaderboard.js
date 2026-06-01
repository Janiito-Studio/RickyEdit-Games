/* ============================================================
   Rickyedit Games — Shared Leaderboard Module v2
   <script src="../leaderboard.js"></script>
   <link rel="stylesheet" href="../leaderboard.css">
   ============================================================ */
(function () {
  'use strict';

  const LS_PREFIX = 'rlb_';
  const NAME_KEY = 'rlb_player_name';

  function storageKey(gameId) { return LS_PREFIX + gameId; }

  function loadScores(gameId) {
    try { return JSON.parse(localStorage.getItem(storageKey(gameId))) || []; }
    catch { return []; }
  }

  function saveScores(gameId, arr) {
    localStorage.setItem(storageKey(gameId), JSON.stringify(arr));
  }

  /* ── Name helpers ──────────────────────────────────────────── */
  function getSavedName() { return localStorage.getItem(NAME_KEY) || ''; }
  function setSavedName(name) { localStorage.setItem(NAME_KEY, name); }

  function isNameTaken(gameId, name) {
    const scores = loadScores(gameId);
    return scores.some(s => s.name && s.name.toLowerCase() === name.toLowerCase());
  }

  /* ── Name Input Modal ──────────────────────────────────────── */
  function showNameModal(gameId, callback) {
    const saved = getSavedName();
    const existing = document.getElementById('rlbNameModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'rlbNameModal';
    modal.className = 'rlb-name-modal';
    modal.innerHTML = `
      <div class="rlb-name-card">
        <div class="rlb-name-icon">✏️</div>
        <h3 class="rlb-name-title">¿Cómo te llamas?</h3>
        <p class="rlb-name-sub">Escribe tu nombre para el leaderboard</p>
        <input type="text" id="rlbNameInput" class="rlb-name-input" placeholder="Tu nombre..." maxlength="20" value="${saved}" autocomplete="off" />
        <p id="rlbNameError" class="rlb-name-error" style="display:none;"></p>
        <div class="rlb-name-actions">
          <button id="rlbNameCancel" class="rlb-name-btn rlb-name-btn-cancel">Cancelar</button>
          <button id="rlbNameConfirm" class="rlb-name-btn rlb-name-btn-confirm">Guardar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));

    const input = document.getElementById('rlbNameInput');
    const error = document.getElementById('rlbNameError');
    input.focus();
    input.select();

    function confirm() {
      const name = input.value.trim();
      if (!name) {
        error.textContent = 'Escribe un nombre';
        error.style.display = 'block';
        return;
      }
      if (name.length < 2) {
        error.textContent = 'El nombre tiene que tener al menos 2 letras';
        error.style.display = 'block';
        return;
      }
      if (isNameTaken(gameId, name)) {
        error.textContent = 'Ese nombre ya está en uso. Elige otro.';
        error.style.display = 'block';
        return;
      }
      setSavedName(name);
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      callback(name);
    }

    document.getElementById('rlbNameConfirm').addEventListener('click', confirm);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
    document.getElementById('rlbNameCancel').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
    modal.addEventListener('click', e => { if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }});
  }

  /* ── Public API ──────────────────────────────────────────── */
  window.RickyLeaderboard = {

    /** Save a score entry (shows name modal if needed) */
    save(gameId, data, callback) {
      const doSave = (name) => {
        data.name = name;
        data.date = data.date || new Date().toISOString();
        const scores = loadScores(gameId);
        scores.push(data);
        scores.sort((a, b) => (b.score || 0) - (a.score || 0));
        if (scores.length > 100) scores.length = 100;
        saveScores(gameId, scores);
        if (callback) callback(data);
      };

      const saved = getSavedName();
      if (saved) {
        if (isNameTaken(gameId, saved)) {
          showNameModal(gameId, doSave);
        } else {
          doSave(saved);
        }
      } else {
        showNameModal(gameId, doSave);
      }
    },

    getAll(gameId, filter) {
      let scores = loadScores(gameId);
      if (filter) {
        if (filter.difficulty) scores = scores.filter(s => s.difficulty === filter.difficulty);
        if (filter.channel)    scores = scores.filter(s => s.channel === filter.channel);
      }
      scores.sort((a, b) => (b.score || 0) - (a.score || 0));
      return scores;
    },

    clear(gameId) { saveScores(gameId, []); },

    getSavedName,

    render(container, gameId, opts) {
      if (typeof container === 'string') container = document.getElementById(container);
      if (!container) return;
      opts = opts || {};

      const maxRows = opts.maxRows || 20;
      const columns = opts.columns || ['rank', 'name', 'correct', 'total', 'percent', 'time', 'difficulty', 'date'];

      const diffLabels = { easy: '😰 Cagado', normal: '💪 Normal', extreme: '🔥 Extremo', none: '—' };
      const diffKeys = opts.difficulties || ['easy', 'normal', 'extreme'];
      const channelLabels = opts.channels || {};
      const channelKeys = Object.keys(channelLabels);

      let currentFilter = { difficulty: '', channel: '' };

      function getFiltered() {
        let scores = window.RickyLeaderboard.getAll(gameId);
        if (currentFilter.difficulty) scores = scores.filter(s => s.difficulty === currentFilter.difficulty);
        if (currentFilter.channel) scores = scores.filter(s => s.channel === currentFilter.channel);
        return scores;
      }

      function formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' ' +
               d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      }

      function formatTime(seconds) {
        if (seconds == null || seconds === '') return '—';
        const s = Number(seconds);
        if (s < 60) return s.toFixed(1) + 's';
        const m = Math.floor(s / 60);
        const sec = (s % 60).toFixed(0);
        return m + 'm ' + sec + 's';
      }

      function render() {
        const scores = getFiltered();
        const rows = scores.slice(0, maxRows);

        let html = `<div class="rlb-header">
          <h3 class="rlb-title">${opts.title || '🏆 Leaderboard'}</h3>
          <div class="rlb-filters">`;

        html += `<select class="rlb-filter" data-filter="difficulty">
          <option value="">Todas</option>`;
        diffKeys.forEach(k => {
          html += `<option value="${k}" ${currentFilter.difficulty === k ? 'selected' : ''}>${diffLabels[k] || k}</option>`;
        });
        html += `</select>`;

        if (channelKeys.length) {
          html += `<select class="rlb-filter" data-filter="channel">
            <option value="">Todos</option>`;
          channelKeys.forEach(k => {
            html += `<option value="${k}" ${currentFilter.channel === k ? 'selected' : ''}>${channelLabels[k]}</option>`;
          });
          html += `</select>`;
        }

        html += `<button class="rlb-clear-btn" title="Borrar todo">🗑️</button></div></div>`;

        if (!rows.length) {
          html += `<div class="rlb-empty">
            <div class="rlb-empty-icon">🎮</div>
            <div class="rlb-empty-text">No hay puntuaciones todavía</div>
            <div class="rlb-empty-sub">¡Juega para registrar tu primera!</div>
          </div>`;
        } else {
          html += `<div class="rlb-table-wrap"><table class="rlb-table"><thead><tr>`;
          const colLabels = {
            rank: '#', name: 'Jugador', score: 'Puntos', difficulty: 'Dificultad',
            channel: 'Canal', round: 'Pista', time: 'Tiempo', date: 'Fecha',
            streak: 'Racha', correct: '✓', total: 'Total', percent: '%'
          };
          columns.forEach(c => {
            if (colLabels[c]) html += `<th class="rlb-col-${c}">${colLabels[c]}</th>`;
          });
          html += `</tr></thead><tbody>`;

          rows.forEach((s, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const rankDisplay = i < 3 ? medals[i] : (i + 1);
            const pct = s.total ? Math.round((s.correct / s.total) * 100) : (s.percent || 0);
            html += `<tr class="${i < 3 ? 'rlb-top-' + (i + 1) : ''}">`;
            columns.forEach(c => {
              let val = '';
              switch (c) {
                case 'rank': val = rankDisplay; break;
                case 'name': val = s.name || 'Anónimo'; break;
                case 'score': val = s.score || 0; break;
                case 'difficulty': val = diffLabels[s.difficulty] || s.difficulty || '—'; break;
                case 'channel': val = channelLabels[s.channel] || s.channel || '—'; break;
                case 'round': val = s.round != null ? s.round : '—'; break;
                case 'time': val = formatTime(s.time); break;
                case 'date': val = formatDate(s.date); break;
                case 'streak': val = s.maxStreak || s.streak || 0; break;
                case 'correct': val = s.correct != null ? s.correct : '—'; break;
                case 'total': val = s.total != null ? s.total : '—'; break;
                case 'percent': val = pct + '%'; break;
              }
              html += `<td class="rlb-col-${c}">${val}</td>`;
            });
            html += `</tr>`;
          });
          html += `</tbody></table></div>`;
        }

        container.innerHTML = html;

        container.querySelectorAll('.rlb-filter').forEach(sel => {
          sel.addEventListener('change', e => {
            currentFilter[e.target.dataset.filter] = e.target.value;
            render();
          });
        });

        const clearBtn = container.querySelector('.rlb-clear-btn');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            if (confirm('¿Borrar todo el leaderboard de este juego?')) {
              window.RickyLeaderboard.clear(gameId);
              render();
            }
          });
        }
      }

      render();
    }
  };
})();
