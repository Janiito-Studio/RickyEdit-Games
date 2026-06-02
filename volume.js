/* ============================================================
   Rickyedit Games — Shared Volume Control v3 (Slim animated)
   <script src="../volume.js"></script>
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'rlb_volume';
  var LS_MUTE_KEY = 'rlb_muted';

  function getVolume() {
    try { return parseFloat(localStorage.getItem(LS_KEY)); }
    catch (e) { return NaN; }
  }

  function setVolume(v) {
    localStorage.setItem(LS_KEY, String(v));
  }

  function isMuted() {
    return localStorage.getItem(LS_MUTE_KEY) === 'true';
  }

  function setMuted(m) {
    localStorage.setItem(LS_MUTE_KEY, m ? 'true' : 'false');
  }

  var vol = getVolume();
  if (isNaN(vol) || vol < 0 || vol > 1) vol = 1;
  var muted = isMuted();

  window.RickyVolume = {
    get: function () { return muted ? 0 : vol; },
    set: function (v) { vol = v; setVolume(v); if (v > 0) setMuted(false); },
    isMuted: function () { return muted; },
    toggleMute: function () { muted = !muted; setMuted(muted); return muted; },
    getRaw: function () { return vol; }
  };

  function imgBase() {
    var p = location.pathname;
    if (p.indexOf('/songless') !== -1 || p.indexOf('/emojless') !== -1 ||
        p.indexOf('/thumbnail-blur') !== -1 || p.indexOf('/mas-caro') !== -1 ||
        p.indexOf('/letrless') !== -1 || p.indexOf('/emojiplay') !== -1 ||
        p.indexOf('/trivia') !== -1 || p.indexOf('/find-diff') !== -1) {
      return '../';
    }
    return '';
  }

  function createVolumeControl() {
    var base = imgBase();
    var wrapper = document.createElement('div');
    wrapper.className = 'rlb-volume-wrapper';
    wrapper.innerHTML =
      '<button class="rlb-volume-btn" type="button" title="Volumen">' +
        '<img class="rlb-volume-icon-on" src="' + base + 'VOLUMEN.png" alt="Volumen">' +
        '<img class="rlb-volume-icon-off" src="' + base + 'no VOLUMEN.png" alt="Sin volumen" style="display:none;">' +
      '</button>' +
      '<div class="rlb-volume-slider-wrap">' +
        '<input type="range" class="rlb-volume-slider" min="0" max="100" value="' + Math.round(vol * 100) + '">' +
      '</div>';
    return wrapper;
  }

  function setupVolumeUI() {
    var actions = document.querySelectorAll('.nav-actions');
    actions.forEach(function (nav) {
      var ctrl = createVolumeControl();
      var volver = nav.querySelector('button[onclick*="index.html"]');
      if (volver) {
        nav.insertBefore(ctrl, volver);
      } else {
        nav.appendChild(ctrl);
      }
    });
    syncAllVolumeUI();
    bindEvents();
  }

  function syncAllVolumeUI() {
    var wrappers = document.querySelectorAll('.rlb-volume-wrapper');
    wrappers.forEach(function (wrapper) {
      var iconOn = wrapper.querySelector('.rlb-volume-icon-on');
      var iconOff = wrapper.querySelector('.rlb-volume-icon-off');
      var slider = wrapper.querySelector('.rlb-volume-slider');
      var pct = Math.round(vol * 100);
      if (muted || vol === 0) {
        if (iconOn) iconOn.style.display = 'none';
        if (iconOff) iconOff.style.display = '';
      } else {
        if (iconOn) iconOn.style.display = '';
        if (iconOff) iconOff.style.display = 'none';
      }
      if (slider) {
        slider.value = pct;
        /* Chrome fill: gradient on the slider itself */
        var trackBg = 'linear-gradient(to right, #ff33cc ' + pct + '%, rgba(255,255,255,0.15) ' + pct + '%)';
        slider.style.background = trackBg + ' !important';
      }
    });
  }

  function bindEvents() {
    var wrappers = document.querySelectorAll('.rlb-volume-wrapper');
    wrappers.forEach(function (wrapper) {
      var btn = wrapper.querySelector('.rlb-volume-btn');
      var slider = wrapper.querySelector('.rlb-volume-slider');

      if (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          muted = RickyVolume.toggleMute();
          syncAllVolumeUI();
        });
      }

      if (slider) {
        slider.addEventListener('input', function () {
          var v = parseInt(slider.value, 10) / 100;
          RickyVolume.set(v);
          vol = v;
          muted = false;
          syncAllVolumeUI();
        });
        slider.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      }

      /* Keep slider open while interacting */
      wrapper.addEventListener('mouseenter', function () {
        wrapper.classList.add('rlb-vol-active');
      });
      wrapper.addEventListener('mouseleave', function () {
        wrapper.classList.remove('rlb-vol-active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVolumeUI);
  } else {
    setupVolumeUI();
  }

  /* ── Sync volume across tabs in real-time ────────────── */
  window.addEventListener('storage', function (e) {
    if (e.key === LS_KEY && e.newValue !== null) {
      var newVol = parseFloat(e.newValue);
      if (!isNaN(newVol) && newVol >= 0 && newVol <= 1) {
        vol = newVol;
        if (vol > 0) muted = false;
        syncAllVolumeUI();
      }
    }
    if (e.key === LS_MUTE_KEY && e.newValue !== null) {
      muted = e.newValue === 'true';
      syncAllVolumeUI();
    }
  });
})();
