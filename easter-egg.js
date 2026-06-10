/* ============================================================
   Rickyedit Games — Shared Easter Egg Module
   Triple-click the nav-logo to open the easter egg menu.
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'rlb_easter_eggs';
  var TOTAL_EGGS = 8;

  /* Migration: remove letrless and jan1119 from discovered if they exist */
  try {
    var _disc = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    var _changed = false;
    if (_disc.indexOf('letrless') !== -1) {
      _disc = _disc.filter(function (k) { return k !== 'letrless'; });
      _changed = true;
    }
    if (_disc.indexOf('jan1119') !== -1) {
      _disc = _disc.filter(function (k) { return k !== 'jan1119'; });
      _changed = true;
    }
    if (_changed) localStorage.setItem(LS_KEY, JSON.stringify(_disc));
  } catch (e) {}

  var EASTER_EGGS = {
    calvo: {
      id: 'calvo',
      image: 'Ricky_calvo.jpg',
      title: 'Has descubierto al RickyEdit calvo!',
      subtitle: '¡Felicidades!',
      colors: ['#ff33cc', '#f1c40f', '#38d4ff']
    },
    '4312': {
      id: '4312',
      image: 'Five_nights_at_ricks.png',
      title: 'Felicidades, has descubierto a Five Nights at Rick\'s',
      subtitle: '',
      colors: ['#ff168c', '#e74c3c', '#f39c12']
    },
    ricky: {
      id: 'ricky',
      image: 'Avatar Rickyedit.jpg',
      title: 'Felicidades, has encontrado a Ricky',
      subtitle: '',
      colors: ['#ff33cc', '#f1c40f', '#ff168c']
    },
    songless: {
      id: 'songless',
      image: 'icon_songless.png',
      title: 'Felicidades, has encontrado el minijuego con el que empezó esta web',
      subtitle: '',
      colors: ['#38d4ff', '#ff33cc', '#36e28a']
    },
    jan: {
      id: 'jan',
      image: 'Jan.png',
      title: 'El creador de esta web, yo ;) (Obviamente el mejor)',
      subtitle: '',
      colors: ['#f1c40f', '#ff33cc', '#38d4ff']
    },
    cs2: {
      id: 'cs2',
      image: 'mas-caro/images/skins/awp_dragon_lore.png',
      title: '¿Qué es más caro? ¡Una Dragon Lore!',
      subtitle: 'Pista: bastante cara',
      colors: ['#f39c12', '#e74c3c', '#f1c40f']
    },
    lgbt: {
      id: 'lgbt',
      image: 'Logo_with_LGBT_colors_202606022013.jpeg',
      title: 'Felicidades, nuevo logo del canal',
      subtitle: '',
      colors: ['#e74c3c', '#f39c12', '#f1c40f', '#27c93f', '#38d4ff', '#9b59b6']
    },
    fifa: {
      id: 'fifa',
      image: 'RickyEdit Fifa.png',
      title: 'Felicidades, has encontrado al Ricky Futbolero (por cierto, tiene la bandera y eso personalizado para ti)',
      subtitle: '',
      colors: ['#f1c40f', '#36e28a', '#38d4ff']
    }
  };

  var EASTER_EGGS_KEYS = Object.keys(EASTER_EGGS);

  function getDiscovered() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveDiscovered(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }

  function discover(id) {
    var arr = getDiscovered();
    if (arr.indexOf(id) !== -1) return false;
    arr.push(id);
    saveDiscovered(arr);
    return true;
  }

  function isDiscovered(id) {
    return getDiscovered().indexOf(id) !== -1;
  }

  function isSubPage() {
    var p = location.pathname;
    return p.indexOf('/songless') !== -1 ||
           p.indexOf('/emojless') !== -1 ||
           p.indexOf('/thumbnail-blur') !== -1 ||
           p.indexOf('/mas-caro') !== -1 ||
           p.indexOf('/letrless') !== -1 ||
           p.indexOf('/pasapalabras') !== -1;
  }

  function imgPath(file) {
    return isSubPage() ? '../' + file : file;
  }

  function createMenu() {
    var existing = document.getElementById('rlbEasterEggModal');
    if (existing) existing.remove();

    var count = getDiscovered().length;

    var listHtml = EASTER_EGGS_KEYS.map(function (key) {
      var egg = EASTER_EGGS[key];
      var found = isDiscovered(key);
      var dataAttr = found ? ' data-egg="' + key + '"' : '';
      var clickableClass = found ? ' rlb-ee-egg-clickable' : '';
      return '<div class="rlb-ee-egg-item ' + (found ? 'found' : '') + clickableClass + '"' + dataAttr + '>' +
        '<span class="rlb-ee-egg-icon">' + (found ? '<img class="rlb-ee-egg-img" src="' + imgPath('ester_egg.png') + '" alt="egg" />' : '<img class="rlb-ee-egg-img" src="' + imgPath('Bloqueado.png') + '" alt="locked" style="filter:brightness(0.6);" />') + '</span>' +
        '<span class="rlb-ee-egg-name">' + (found ? egg.title : '???') + '</span>' +
        '</div>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'rlbEasterEggModal';
    modal.className = 'rlb-ee-modal';
    modal.innerHTML =
      '<div class="rlb-ee-card">' +
        '<div class="rlb-ee-header">' +
          '<h2 class="rlb-ee-title">Easter Eggs</h2>' +
          '<button class="rlb-ee-close" id="rlbEasterEggClose" type="button">×</button>' +
        '</div>' +
        '<div class="rlb-ee-body">' +
          '<div class="rlb-ee-hero">' +
            '<img class="rlb-ee-hero-img" src="' + imgPath('Ricky_Esteregg.png') + '" alt="Easter Egg" />' +
            '<p class="rlb-ee-hero-msg">Perdón por la foto, necesitaba ponerla</p>' +
          '</div>' +
          '<div class="rlb-ee-counter">' +
            'Tienes <span class="rlb-ee-count-num">' + count + '</span> / ' + TOTAL_EGGS + ' easter eggs' +
          '</div>' +
          '<div class="rlb-ee-discovered-list" id="rlbEasterEggList">' +
            listHtml +
          '</div>' +
          '<div class="rlb-ee-input-section">' +
            '<label class="rlb-ee-input-label">Introduce un código para desbloquear un easter egg oculto</label>' +
            '<div class="rlb-ee-input-row">' +
              '<input type="text" class="rlb-ee-input" id="rlbEasterEggInput" placeholder="Escribe aquí..." autocomplete="off" />' +
              '<button class="rlb-ee-submit" id="rlbEasterEggSubmit" type="button">→</button>' +
            '</div>' +
            '<div class="rlb-ee-input-feedback" id="rlbEasterEggFeedback"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(function () { modal.classList.add('show'); });
    bindListClicks();

    function close() {
      modal.classList.remove('show');
      setTimeout(function () { modal.remove(); }, 300);
    }

    document.getElementById('rlbEasterEggClose').addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    var input = document.getElementById('rlbEasterEggInput');
    var submitBtn = document.getElementById('rlbEasterEggSubmit');
    var feedback = document.getElementById('rlbEasterEggFeedback');

    function refreshList() {
      var list = document.getElementById('rlbEasterEggList');
      if (!list) return;
      list.innerHTML = EASTER_EGGS_KEYS.map(function (key) {
        var egg = EASTER_EGGS[key];
        var found = isDiscovered(key);
        var dataAttr = found ? ' data-egg="' + key + '"' : '';
        var clickableClass = found ? ' rlb-ee-egg-clickable' : '';
        return '<div class="rlb-ee-egg-item ' + (found ? 'found' : '') + clickableClass + '"' + dataAttr + '>' +
        '<span class="rlb-ee-egg-icon">' + (found ? '<img class="rlb-ee-egg-img" src="' + imgPath('ester_egg.png') + '" alt="egg" />' : '<img class="rlb-ee-egg-img" src="' + imgPath('Bloqueado.png') + '" alt="locked" style="filter:brightness(0.6);" />') + '</span>' +
        '<span class="rlb-ee-egg-name">' + (found ? egg.title : '???') + '</span>' +
        '</div>';
      }).join('');
      bindListClicks();
    }

    function bindListClicks() {
      var list = document.getElementById('rlbEasterEggList');
      if (!list) return;
      list.querySelectorAll('.rlb-ee-egg-clickable').forEach(function (item) {
        item.addEventListener('click', function () {
          var key = item.getAttribute('data-egg');
          if (key && EASTER_EGGS[key]) {
            showEggReveal(EASTER_EGGS[key], false);
          }
        });
      });
    }

    function tryCode() {
      var val = input.value.trim();
      if (!val) return;

      /* Check secret notification code first (jan1119 in base64) */
      if (typeof checkSecretCode === 'function' && checkSecretCode(val)) {
        input.value = '';
        feedback.textContent = 'Acceso concedido. Botones de notificaciones y eliminar activados.';
        feedback.className = 'rlb-ee-input-feedback success';
        try { localStorage.setItem('rlb_notif_authorized', '1'); } catch (e) {}
        try { localStorage.setItem('rlb_delete_unlocked', '1'); } catch (e) {}
        showFloatingNotifButton();
        return;
      }

      var valLower = val.toLowerCase();
      if (EASTER_EGGS[valLower]) {
        var egg = EASTER_EGGS[valLower];
        var isNew = discover(valLower);
        if (isNew) {
          showEggReveal(egg);
          var newCount = getDiscovered().length;
          var counter = modal.querySelector('.rlb-ee-count-num');
          if (counter) counter.textContent = newCount;
          refreshList();
        } else {
          feedback.textContent = 'Ya has desbloqueado este easter egg.';
          feedback.className = 'rlb-ee-input-feedback duplicate';
        }
      } else {
        feedback.textContent = 'Código no válido. ¡Sigue intentando!';
        feedback.className = 'rlb-ee-input-feedback error';
      }
      input.value = '';
    }

    submitBtn.addEventListener('click', tryCode);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryCode();
    });

    input.focus();
  }

  function showEggReveal(egg, isNew) {
    if (typeof isNew === 'undefined') isNew = true;
    var overlay = document.createElement('div');
    overlay.className = 'rlb-ee-reveal-overlay';
    var src = imgPath(egg.image);
    overlay.innerHTML =
      '<div class="rlb-ee-reveal-card">' +
        '<button class="rlb-ee-reveal-close" type="button">&times;</button>' +
        '<img class="rlb-ee-reveal-img" src="' + src + '" alt="' + egg.title + '" />' +
        '<h2 class="rlb-ee-reveal-title" style="background:linear-gradient(135deg,' + egg.colors.join(',') + ');-webkit-background-clip:text;-webkit-text-fill-color:transparent;">' + egg.title + '</h2>' +
        (isNew && egg.subtitle ? '<p class="rlb-ee-reveal-subtitle" style="color:' + (egg.colors[1] || egg.colors[0]) + ';">' + egg.subtitle + '</p>' : '') +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });

    if (isNew) {
      spawnConfetti(overlay, egg.colors);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('rlb-ee-reveal-close')) {
        overlay.classList.remove('show');
        setTimeout(function () { overlay.remove(); }, 500);
        return;
      }
      overlay.classList.remove('show');
      setTimeout(function () { overlay.remove(); }, 500);
    });
  }

  function spawnConfetti(container, colors) {
    for (var i = 0; i < 50; i++) {
      var c = document.createElement('div');
      c.className = 'rlb-ee-confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 0.8 + 's';
      c.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      container.appendChild(c);
    }
  }

  /* Triple-click detection on nav-logo */
  var clickCount = 0;
  var clickTimer = null;

  function setupTripleClick() {
    var logos = document.querySelectorAll('.nav-logo');
    logos.forEach(function (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', function () {
        clickCount++;
        if (clickCount === 1) {
          clickTimer = setTimeout(function () { clickCount = 0; }, 600);
        } else if (clickCount >= 3) {
          clearTimeout(clickTimer);
          clickCount = 0;
          createMenu();
        }
      });
    });
  }

  /* ── Secret Notification System (Jan's encrypted easter egg) ── */
  var NOTIF_LS_KEY = 'rlb_notifications';
  var NOTIF_AUTH_KEY = 'rlb_notif_authorized';
  var NOTIF_SHOWN_KEY = 'rlb_notif_last_shown';
  /* jan1119 encoded in base64 */
  var SECRET_CODE_B64 = 'amFuMTExOQ==';

  /* Firebase config for cross-device notifications */
  var FIREBASE_DB_URL = 'https://rickyedit-notifications-default-rtdb.firebaseio.com';

  /* Connection state tracking */
  var _fbConnected = false;
  var _fbFailCount = 0;
  var _fbMaxRetries = 3;
  var _fbRetryDelay = 1000; /* ms between retries */

  function checkSecretCode(val) {
    try { return btoa(val.trim()) === SECRET_CODE_B64; } catch (e) { return false; }
  }

  function isNotifAuthorized() {
    try { return localStorage.getItem(NOTIF_AUTH_KEY) === '1'; } catch (e) { return false; }
  }

  /* ── Connection indicator (only visible for Jan) ── */
  function _updateConnectionDot() {
    if (!isNotifAuthorized()) return;
    var dot = document.getElementById('rlbNotifDot');
    if (!dot) {
      dot = document.createElement('div');
      dot.id = 'rlbNotifDot';
      dot.title = 'Estado de Firebase';
      dot.style.cssText = 'position:fixed;bottom:82px;right:38px;z-index:99999;width:12px;height:12px;border-radius:50%;border:2px solid #18191c;transition:background 0.3s ease;';
      document.body.appendChild(dot);
    }
    dot.style.background = _fbConnected ? '#2ecc71' : '#e74c3c';
    dot.title = _fbConnected ? 'Firebase: Conectado' : 'Firebase: Sin conexión';
  }

  function _testFirebaseConnection() {
    return fetch(FIREBASE_DB_URL + '/notifications.json?shallow=true')
      .then(function (r) {
        _fbConnected = r.ok;
        _fbFailCount = 0;
        _updateConnectionDot();
        return r.ok;
      })
      .catch(function () {
        _fbConnected = false;
        _fbFailCount++;
        _updateConnectionDot();
        return false;
      });
  }

  /* ── Cleanup old notifications (>24h) in Firebase ── */
  function _cleanupOldNotifications() {
    var cutoff = Date.now() - (24 * 60 * 60 * 1000);
    fetch(FIREBASE_DB_URL + '/notifications.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || typeof data !== 'object') return;
        var keys = Object.keys(data);
        var updates = {};
        var hasOld = false;
        for (var i = 0; i < keys.length; i++) {
          var n = data[keys[i]];
          if (n && n.ts && n.ts < cutoff) {
            updates['/notifications/' + keys[i]] = null;
            hasOld = true;
          }
        }
        if (hasOld) {
          fetch(FIREBASE_DB_URL + '.json', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          }).catch(function () {});
        }
      })
      .catch(function () {});
  }

  function showNotificationModal() {
    var existing = document.getElementById('rlbNotifModal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'rlbNotifModal';
    modal.className = 'rlb-ee-modal';
    modal.innerHTML =
      '<div class="rlb-ee-card">' +
        '<div class="rlb-ee-header">' +
          '<h2 class="rlb-ee-title">Enviar Notificación</h2>' +
          '<button class="rlb-ee-close" id="rlbNotifClose" type="button">×</button>' +
        '</div>' +
        '<div class="rlb-ee-body">' +
          '<p style="color:var(--muted);font-size:0.9rem;margin-bottom:14px;">Envía una notificación a todos los jugadores conectados.</p>' +
          '<textarea id="rlbNotifMsg" class="rlb-ee-input" rows="3" placeholder="Escribe el mensaje..." maxlength="200" style="width:100%;resize:vertical;font-family:inherit;"></textarea>' +
          '<div class="rlb-ee-input-feedback" id="rlbNotifFeedback"></div>' +
          '<div class="rlb-ee-input-row" style="margin-top:12px;">' +
            '<button id="rlbNotifSend" class="rlb-ee-submit" type="button" style="width:100%;border-radius:12px;">Enviar</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(function () { modal.classList.add('show'); });

    var closeBtn = document.getElementById('rlbNotifClose');
    var sendBtn = document.getElementById('rlbNotifSend');
    var msgInput = document.getElementById('rlbNotifMsg');
    var feedback = document.getElementById('rlbNotifFeedback');

    function close() {
      modal.classList.remove('show');
      setTimeout(function () { modal.remove(); }, 300);
    }

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    sendBtn.addEventListener('click', function () {
      var msg = msgInput.value.trim();
      if (!msg) {
        feedback.textContent = 'Escribe un mensaje.';
        feedback.className = 'rlb-ee-input-feedback error';
        return;
      }
      sendBtn.disabled = true;
      sendBtn.textContent = 'Enviando...';

      var notification = { msg: msg, from: 'Jan', ts: Date.now() };

      /* Send to Firebase with retry (cross-device) */
      var retryCount = 0;
      function trySend() {
        fetch(FIREBASE_DB_URL + '/notifications.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        }).then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          _fbConnected = true;
          _fbFailCount = 0;
          _updateConnectionDot();
          feedback.textContent = 'Notificación enviada a todos los dispositivos.';
          feedback.className = 'rlb-ee-input-feedback success';
          setTimeout(close, 1500);
        }).catch(function () {
          _fbConnected = false;
          _fbFailCount++;
          _updateConnectionDot();
          retryCount++;
          if (retryCount < _fbMaxRetries) {
            sendBtn.textContent = 'Reintentando... (' + retryCount + '/' + _fbMaxRetries + ')';
            setTimeout(trySend, _fbRetryDelay * retryCount);
          } else {
            /* Fallback to localStorage */
            try {
              var notifs = JSON.parse(localStorage.getItem(NOTIF_LS_KEY)) || [];
              notifs.push(notification);
              if (notifs.length > 50) notifs = notifs.slice(-50);
              localStorage.setItem(NOTIF_LS_KEY, JSON.stringify(notifs));
            } catch (e) {}
            feedback.textContent = 'Enviado (solo local). Firebase no disponible.';
            feedback.className = 'rlb-ee-input-feedback error';
            setTimeout(close, 1500);
          }
        });
      }
      trySend();
    });
  }

  function showFloatingNotifButton() {
    if (document.getElementById('rlbNotifFloatBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'rlbNotifFloatBtn';
    btn.type = 'button';
    btn.title = 'Enviar notificación';
    btn.textContent = '\uD83D\uDD14';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;width:52px;height:52px;border-radius:50%;border:2px solid rgba(241,196,15,0.5);background:linear-gradient(135deg,#18191c,#23242a);color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:transform 0.2s ease,box-shadow 0.2s ease;display:flex;align-items:center;justify-content:center;';
    btn.addEventListener('mouseenter', function () { btn.style.transform = 'scale(1.1)'; btn.style.boxShadow = '0 6px 28px rgba(241,196,15,0.3)'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'; });
    btn.addEventListener('click', function (e) { e.stopPropagation(); showNotificationModal(); });
    document.body.appendChild(btn);
    _updateConnectionDot();
    _testFirebaseConnection();
  }

  /* ── Stacked persistent toasts ── */
  var _activeToasts = [];
  var _toastBaseTop = 20;

  function showPersistentToast(message) {
    var container = document.getElementById('rlbNotifToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'rlbNotifToastContainer';
      container.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;padding-top:' + _toastBaseTop + 'px;';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'rlb-notif-toast-item';
    toast.style.cssText = 'background:linear-gradient(135deg,#18191c,#23242a);color:#fff;padding:14px 24px;border-radius:14px;border:1px solid rgba(241,196,15,0.4);box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;font-size:0.95rem;font-weight:700;max-width:90vw;min-width:300px;text-align:center;opacity:0;transition:opacity 0.3s ease;display:flex;align-items:center;gap:10px;pointer-events:auto;';

    var textSpan = document.createElement('span');
    textSpan.style.cssText = 'flex:1;';
    textSpan.textContent = message;
    toast.appendChild(textSpan);

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00D7';
    closeBtn.style.cssText = 'background:none;border:none;color:#b9bbbe;font-size:1.3rem;cursor:pointer;padding:0 0 0 8px;line-height:1;flex-shrink:0;';
    closeBtn.addEventListener('click', function () { _removeToast(toast); });
    toast.appendChild(closeBtn);

    container.appendChild(toast);
    _activeToasts.push(toast);
    requestAnimationFrame(function () { toast.style.opacity = '1'; });

    /* No auto-dismiss — only manual close */
  }

  function _removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      _activeToasts = _activeToasts.filter(function (t) { return t !== toast; });
    }, 300);
  }

  /* Listen for new notifications from Firebase */
  var _lastNotifTs = parseInt(localStorage.getItem(NOTIF_SHOWN_KEY) || '0', 10);
  var _notifInitialized = false;
  var _pollRetryCount = 0;

  function pollFirebase() {
    fetch(FIREBASE_DB_URL + '/notifications.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        _fbConnected = true;
        _fbFailCount = 0;
        _pollRetryCount = 0;
        _updateConnectionDot();

        if (!data || typeof data !== 'object') return;
        var keys = Object.keys(data);
        if (!keys.length) return;

        /* Collect ALL new notifications (not just the latest) */
        var newNotifs = [];
        for (var i = 0; i < keys.length; i++) {
          var n = data[keys[i]];
          if (n && n.ts && n.ts > _lastNotifTs) newNotifs.push(n);
        }
        if (!newNotifs.length) return;

        /* Sort by timestamp ascending */
        newNotifs.sort(function (a, b) { return a.ts - b.ts; });

        /* On first poll, only show notifications from the last 30 seconds */
        if (!_notifInitialized) {
          _notifInitialized = true;
          var recentCutoff = Date.now() - 30000;
          var recentNotifs = newNotifs.filter(function(n) { return n.ts >= recentCutoff; });
          if (recentNotifs.length > 0) {
            for (var j = 0; j < recentNotifs.length; j++) {
              showPersistentToast('Notificación de Jan: ' + recentNotifs[j].msg);
            }
          }
          var newest = newNotifs[newNotifs.length - 1];
          _lastNotifTs = newest.ts;
          localStorage.setItem(NOTIF_SHOWN_KEY, String(newest.ts));
          return;
        }

        /* Show all new notifications stacked */
        for (var j = 0; j < newNotifs.length; j++) {
          showPersistentToast('Notificación de Jan: ' + newNotifs[j].msg);
        }
        _lastNotifTs = newNotifs[newNotifs.length - 1].ts;
        localStorage.setItem(NOTIF_SHOWN_KEY, String(_lastNotifTs));
      })
      .catch(function () {
        _fbConnected = false;
        _fbFailCount++;
        _pollRetryCount++;
        _updateConnectionDot();

        /* Retry a few times before giving up */
        if (_pollRetryCount < _fbMaxRetries) {
          /* Will retry on next poll cycle (3s interval) */
        } else if (_pollRetryCount === _fbMaxRetries) {
          /* Mark as disconnected after max retries */
          _updateConnectionDot();
        }

        /* Fallback: check localStorage for notifications */
        if (_notifInitialized) {
          try {
            var localNotifs = JSON.parse(localStorage.getItem(NOTIF_LS_KEY)) || [];
            for (var k = 0; k < localNotifs.length; k++) {
              if (localNotifs[k].ts && localNotifs[k].ts > _lastNotifTs) {
                showPersistentToast('Notificación (local): ' + localNotifs[k].msg);
              }
            }
          } catch (e) {}
        }
      });
  }

  /* Init on load */
  function _notifInit() {
    if (isNotifAuthorized()) showFloatingNotifButton();
    /* Test Firebase connection on startup */
    _testFirebaseConnection();
    /* Cleanup old notifications on startup */
    _cleanupOldNotifications();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _notifInit);
  } else {
    _notifInit();
  }

  /* Poll Firebase every 3 seconds for new notifications */
  setInterval(pollFirebase, 3000);
  pollFirebase();

  /* Cleanup old notifications every 10 minutes */
  setInterval(_cleanupOldNotifications, 10 * 60 * 1000);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTripleClick);
  } else {
    setupTripleClick();
  }

  window.RickyEasterEgg = {
    open: createMenu,
    getDiscovered: getDiscovered,
    TOTAL: TOTAL_EGGS
  };
})();
