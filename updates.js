/* ============================================================
   Rickyedit Games — Shared Updates Modal
   <script src="../updates.js"></script>
   Usage: RickyUpdates.show(gameId, version, htmlContent)
   ============================================================ */
(function () {
  'use strict';

  const LS_KEY = 'rlb_updates_seen';

  function getSeen() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }

  function setSeen(gameId, version) {
    const seen = getSeen();
    seen[gameId] = version;
    localStorage.setItem(LS_KEY, JSON.stringify(seen));
  }

  function hasSeen(gameId, version) {
    const seen = getSeen();
    return seen[gameId] === version;
  }

  function createModal(content) {
    const existing = document.getElementById('rlbUpdatesModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'rlbUpdatesModal';
    modal.className = 'rlb-updates-modal';
    modal.innerHTML = `
      <div class="rlb-updates-card">
        <div class="rlb-updates-header">
          <span class="rlb-updates-badge">NEW</span>
          <h2 class="rlb-updates-title">Updates</h2>
          <button class="rlb-updates-close" id="rlbUpdatesClose" type="button">×</button>
        </div>
        <div class="rlb-updates-body">
          ${content}
        </div>
        <div class="rlb-updates-footer">
          <button class="rlb-updates-btn" id="rlbUpdatesOk" type="button">¡Entendido!</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));

    function close() {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }

    document.getElementById('rlbUpdatesClose').addEventListener('click', close);
    document.getElementById('rlbUpdatesOk').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
  }

  window.RickyUpdates = {
    show(gameId, version, html) {
      if (hasSeen(gameId, version)) return;
      createModal(html);
      setSeen(gameId, version);
    },
    forceShow(html) {
      createModal(html);
    }
  };
})();
