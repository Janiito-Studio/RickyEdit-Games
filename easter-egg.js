/* ============================================================
   Rickyedit Games — Shared Easter Egg Module
   Triple-click the nav-logo to open the easter egg menu.
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'rlb_easter_eggs';
  var TOTAL_EGGS = 7;

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
    letrless: {
      id: 'letrless',
      image: 'Letrless.png',
      title: '¡Letrless! Adivina por la letra',
      subtitle: 'Palabra por palabra',
      colors: ['#ff33cc', '#38d4ff', '#f1c40f']
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
           p.indexOf('/letrless') !== -1;
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
        '<span class="rlb-ee-egg-icon">' + (found ? '<img class="rlb-ee-egg-img" src="' + imgPath('ester_egg.png') + '" alt="egg" />' : '🔒') + '</span>' +
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
        '<span class="rlb-ee-egg-icon">' + (found ? '<img class="rlb-ee-egg-img" src="' + imgPath('ester_egg.png') + '" alt="egg" />' : '🔒') + '</span>' +
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
      var val = input.value.trim().toLowerCase();
      if (!val) return;

      if (EASTER_EGGS[val]) {
        var egg = EASTER_EGGS[val];
        var isNew = discover(val);
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
        '<img class="rlb-ee-reveal-img" src="' + src + '" alt="' + egg.title + '" />' +
        '<h2 class="rlb-ee-reveal-title" style="background:linear-gradient(135deg,' + egg.colors.join(',') + ');-webkit-background-clip:text;-webkit-text-fill-color:transparent;">' + egg.title + '</h2>' +
        (isNew && egg.subtitle ? '<p class="rlb-ee-reveal-subtitle" style="color:' + (egg.colors[1] || egg.colors[0]) + ';">' + egg.subtitle + '</p>' : '') +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });

    if (isNew) {
      spawnConfetti(overlay, egg.colors);
    }

    setTimeout(function () {
      overlay.classList.remove('show');
      setTimeout(function () { overlay.remove(); }, 500);
    }, 3500);

    overlay.addEventListener('click', function () {
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
