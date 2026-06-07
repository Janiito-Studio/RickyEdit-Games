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

    /* Build OBS URL relative to repo root */
    function getObsBase() {
        var path = window.location.pathname;
        var dir = path.substring(0, path.lastIndexOf('/'));
        if (dir.split('/').length > 2) {
            dir = dir.substring(0, dir.lastIndexOf('/'));
        }
        return window.location.origin + dir + '/obs-lives.html';
    }

    /* Update OBS link in Info Vidas modal if present */
    function updateObsLink() {
        var link = document.getElementById('obsLivesLink');
        if (link) {
            link.href = getObsBase();
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
