/* ============================================================
   Rickyedit Games — Shared Leaderboard Module
   Usage:
     import from each game's script:
       <script src="../leaderboard.js"></script>
       <link rel="stylesheet" href="../leaderboard.css">
   ============================================================ */
(function () {
  'use strict';

  const LS_PREFIX = 'rlb_'; // rlb = RickyLeaderBoard

  /* ── helpers ─────────────────────────────────────────────── */
  function storageKey(gameId) { return LS_PREFIX + gameId; }

  function loadScores(gameId) {
    try { return JSON.parse(localStorage.getItem(storageKey(gameId))) || []; }
    catch { return []; }
  }

  function saveScores(gameId, arr) {
    localStorage.setItem(storageKey(gameId), JSON.stringify(arr));
  }

  /* ── public API ──────────────────────────────────────────── */

  /**
   * Save a score entry.
   * @param {string} gameId  - e.g. "songless", "emojless", "thumbblur", "mascaro"
   * @param {object} data    - { name, score, difficulty, channel, time, round, streak, maxStreak, correct, total, date? }
   */
  window.RickyLeaderboard = {
    save(gameId, data) {
      const scores = loadScores(gameId);
      data.date = data.date || new Date().toISOString();
      scores.push(data);
      // keep only top 100 per game
      scores.sort((a, b) => (b.score || 0) - (a.score || 0));
      if (scores.length > 100) scores.length = 100;
      saveScores(gameId, scores);
      return data;
    },

    /** Returns sorted scores (highest first), optionally filtered. */
    getAll(gameId, filter) {
      let scores = loadScores(gameId);
      if (filter) {
        if (filter.difficulty) scores = scores.filter(s => s.difficulty === filter.difficulty);
        if (filter.channel)    scores = scores.filter(s => s.channel === filter.channel);
      }
      scores.sort((a, b) => (b.score || 0) - (a.score || 0));
      return scores;
    },

    /** Clear all scores for a game. */
    clear(gameId) {
      saveScores(gameId, []);
    },

    /**
     * Render leaderboard into a container element.
     * @param {HTMLElement|string} container - element or ID
     * @param {string} gameId
     * @param {object} opts - { title, filters, columns, maxRows, lang }
     */
    render(container, gameId, opts) {
      if (typeof container === 'string') container = document.getElementById(container);
      if (!container) return;
      opts = opts || {};

      const lang = opts.lang || 'es';
      const maxRows = opts.maxRows || 20;
      const columns = opts.columns || ['rank', 'name', 'score', 'difficulty', 'round', 'time', 'date'];

      // difficulty labels
      const diffLabels = { easy: '😰 Cagado', normal: '💪 Normal', extreme: '🔥 Extremo', none: '—' };
      const diffKeys = opts.difficulties || ['easy', 'normal', 'extreme'];
      const channelLabels = opts.channels || {};
      const channelKeys = Object.keys(channelLabels);

      let currentFilter = { difficulty: '', channel: '' };

      function getFiltered() { return window.RickyLeaderboard.getAll(gameId, currentFilter.difficulty || currentFilter.channel ? currentFilter : null); }

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

        // Difficulty filter
        html += `<select class="rlb-filter" data-filter="difficulty">
          <option value="">Todas las dificultades</option>`;
        diffKeys.forEach(k => {
          html += `<option value="${k}" ${currentFilter.difficulty === k ? 'selected' : ''}>${diffLabels[k] || k}</option>`;
        });
        html += `</select>`;

        // Channel filter
        if (channelKeys.length) {
          html += `<select class="rlb-filter" data-filter="channel">
            <option value="">Todos los canales</option>`;
          channelKeys.forEach(k => {
            html += `<option value="${k}" ${currentFilter.channel === k ? 'selected' : ''}>${channelLabels[k]}</option>`;
          });
          html += `</select>`;
        }

        html += `<button class="rlb-clear-btn" title="Borrar todo">🗑️</button>
          </div></div>`;

        if (!rows.length) {
          html += `<div class="rlb-empty">No hay puntuaciones todavía. ¡Juega para registrar tu primera!</div>`;
        } else {
          html += `<div class="rlb-table-wrap"><table class="rlb-table"><thead><tr>`;
          const colLabels = {
            rank: '#', name: 'Jugador', score: 'Puntos', difficulty: 'Dificultad',
            channel: 'Canal', round: 'Pista', time: 'Tiempo', date: 'Fecha',
            streak: 'Racha', correct: 'Correctos', total: 'Total'
          };
          columns.forEach(c => {
            if (colLabels[c]) html += `<th class="rlb-col-${c}">${colLabels[c]}</th>`;
          });
          html += `</tr></thead><tbody>`;

          rows.forEach((s, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const rankDisplay = i < 3 ? medals[i] : (i + 1);
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
              }
              html += `<td class="rlb-col-${c}">${val}</td>`;
            });
            html += `</tr>`;
          });

          html += `</tbody></table></div>`;
        }

        container.innerHTML = html;

        // bind filter events
        container.querySelectorAll('.rlb-filter').forEach(sel => {
          sel.addEventListener('change', e => {
            const f = e.target.dataset.filter;
            currentFilter[f] = e.target.value;
            render();
          });
        });

        // clear button
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
