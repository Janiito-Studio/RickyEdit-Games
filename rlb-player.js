/* ── Rickyedit Games — Player ID & Lobby Signal ──────────── */
(function() {
    var SIGNAL_KEY = 'rlb_lobby_signal';

    /* Generate persistent player ID if not exists */
    function getPlayerId() {
        var id = localStorage.getItem('rlb_player_id');
        if (!id) {
            id = 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('rlb_player_id', id);
        }
        return id;
    }

    var playerId = getPlayerId();

    /* Build OBS URL with full GitHub Pages base */
    function getObsBase() {
        return 'https://janiito-studio.github.io/RickyEdit-Games/obs-lives.html';
    }

    /* Update OBS link in Info Vidas modal if present */
    function updateObsLink() {
        var link = document.getElementById('obsLivesLink');
        if (link) {
            var url = getObsBase() + '?id=' + playerId;
            link.href = url;
            link.textContent = url;
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateObsLink);
    } else {
        updateObsLink();
    }

    /* Expose globally */
    window.RlbPlayer = {
        id: playerId,
        obsUrl: getObsBase(),
        signalLobby: function() {
            try {
                localStorage.setItem(SIGNAL_KEY, JSON.stringify({
                    ts: Date.now(),
                    player: playerId,
                    lobby: true
                }));
            } catch(e) {}
        },
        signalGame: function() {
            try {
                localStorage.setItem(SIGNAL_KEY, JSON.stringify({
                    ts: Date.now(),
                    player: playerId,
                    lobby: false
                }));
            } catch(e) {}
        }
    };
})();
