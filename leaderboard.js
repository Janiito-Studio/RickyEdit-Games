/* ============================================================
   Rickyedit Games — Shared Leaderboard Module v4
   <script src="../leaderboard.js"></script>
   <link rel="stylesheet" "../leaderboard.css">
   ============================================================ */
(function () {
  'use strict';

  const LS_PREFIX = 'rlb_';
  const NAME_KEY = 'rlb_player_name';
  const PLAYER_ID_KEY = 'rlb_player_id';
  const REPORTED_KEY = 'rlb_reported_names';
  const GAMES = ['songless', 'emojless', 'thumbblur', 'mascaro', 'letrless', 'pasapalabras'];
  const REPORT_WEBHOOK = 'https://discord.com/api/webhooks/1509215622310006915/9kqCW6JMtnNJqUqJALLfcxiBbcAK6_bLwqbANAPYKBp8Kb928VcrIU8xHCwrQn2dp91g';
  const FIREBASE_DB_URL = 'https://rickyedit-notifications-default-rtdb.firebaseio.com';

  function storageKey(gameId) { return LS_PREFIX + gameId; }

  function loadScores(gameId) {
    try { return JSON.parse(localStorage.getItem(storageKey(gameId))) || []; }
    catch { return []; }
  }

  function saveScores(gameId, arr) {
    localStorage.setItem(storageKey(gameId), JSON.stringify(arr));
  }

  /* ── Firebase sync (with retry) ───────────────────────── */
  var _fbSyncRetries = {};
  var _fbSyncMaxRetries = 3;

  function syncToFirebase(gameId) {
    var scores = loadScores(gameId);
    if (!_fbSyncRetries[gameId]) _fbSyncRetries[gameId] = 0;

    /* Fetch remote first, merge, then PUT the merged result */
    fetch(FIREBASE_DB_URL + '/leaderboard/' + gameId + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (remoteScores) {
        var merged = mergeScores(scores, Array.isArray(remoteScores) ? remoteScores : []);
        saveScores(gameId, merged);
        _fbSyncRetries[gameId] = 0;
        return fetch(FIREBASE_DB_URL + '/leaderboard/' + gameId + '.json', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged)
        });
      })
      .catch(function () {
        _fbSyncRetries[gameId]++;
        if (_fbSyncRetries[gameId] <= _fbSyncMaxRetries) {
          /* Retry after delay */
          setTimeout(function () { syncToFirebase(gameId); }, 2000 * _fbSyncRetries[gameId]);
        } else {
          /* Fallback: just push local scores */
          _fbSyncRetries[gameId] = 0;
          fetch(FIREBASE_DB_URL + '/leaderboard/' + gameId + '.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scores)
          }).catch(function () {});
        }
      });
  }

  var _fbPullRetries = {};

  function syncFromFirebase(gameId, callback) {
    if (!_fbPullRetries[gameId]) _fbPullRetries[gameId] = 0;

    fetch(FIREBASE_DB_URL + '/leaderboard/' + gameId + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (remoteScores) {
        _fbPullRetries[gameId] = 0;
        if (!remoteScores || !Array.isArray(remoteScores)) {
          if (callback) callback();
          return;
        }
        var localScores = loadScores(gameId);
        var merged = mergeScores(localScores, remoteScores);
        saveScores(gameId, merged);
        if (callback) callback();
      })
      .catch(function () {
        _fbPullRetries[gameId]++;
        if (_fbPullRetries[gameId] <= _fbSyncMaxRetries) {
          /* Retry after delay */
          setTimeout(function () { syncFromFirebase(gameId, callback); }, 2000 * _fbPullRetries[gameId]);
        } else {
          _fbPullRetries[gameId] = 0;
          if (callback) callback();
        }
      });
  }

  function mergeScores(local, remote) {
    var best = {};
    local.forEach(function (s) {
      var pid = s.playerId || s.name || '';
      if (!best[pid] || (s.score || 0) > (best[pid].score || 0)) best[pid] = s;
    });
    remote.forEach(function (s) {
      var pid = s.playerId || s.name || '';
      if (!best[pid] || (s.score || 0) > (best[pid].score || 0)) best[pid] = s;
    });
    var merged = Object.values(best);
    merged.sort(function (a, b) {
      // Score DESC → Lives DESC → % → difficulty rank DESC → time ASC
      var aScore = a.score || 0;
      var bScore = b.score || 0;
      if (bScore !== aScore) return bScore - aScore;
      var aLives = a.lives != null ? a.lives : -1;
      var bLives = b.lives != null ? b.lives : -1;
      if (bLives !== aLives) return bLives - aLives;
      var aPct = a.total ? (a.correct / a.total) : (a.percent || 0) / 100;
      var bPct = b.total ? (b.correct / b.total) : (b.percent || 0) / 100;
      if (bPct !== aPct) return bPct - aPct;
      var diffRank = { extreme: 3, hard: 2, normal: 1, easy: 0 };
      var aDiff = diffRank[a.difficulty] || 0;
      var bDiff = diffRank[b.difficulty] || 0;
      if (bDiff !== aDiff) return bDiff - aDiff;
      var aTime = a.time != null ? a.time : Infinity;
      var bTime = b.time != null ? b.time : Infinity;
      return aTime - bTime;
    });
    if (merged.length > 100) merged.length = 100;
    return merged;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ── Player ID ─────────────────────────────────────────── */
  function getPlayerId() {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
      id = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
  }

  /* ── Name helpers ──────────────────────────────────────── */
  function getSavedName() { return localStorage.getItem(NAME_KEY) || ''; }
  function setSavedName(name) { localStorage.setItem(NAME_KEY, name); }

  function isNameTaken(name) {
    const myId = getPlayerId();
    const lower = name.toLowerCase();
    for (const g of GAMES) {
      const scores = loadScores(g);
      if (scores.some(s => s.name && s.name.toLowerCase() === lower && s.playerId !== myId)) return true;
    }
    return false;
  }

  /* ── Reported Names ────────────────────────────────────── */
  function getReportedNames() {
    try { return JSON.parse(localStorage.getItem(REPORTED_KEY)) || []; }
    catch { return []; }
  }

  function isNameReported(name) {
    const lower = name.toLowerCase();
    return getReportedNames().some(r => r.name.toLowerCase() === lower);
  }

  function addReportedName(name, reporter, gameId) {
    const reported = getReportedNames();
    if (reported.some(r => r.name.toLowerCase() === name.toLowerCase())) return false;
    reported.push({ name, reporter, gameId, date: new Date().toISOString() });
    localStorage.setItem(REPORTED_KEY, JSON.stringify(reported));
    return true;
  }

  function removeReportedName(name) {
    const reported = getReportedNames().filter(r => r.name.toLowerCase() !== name.toLowerCase());
    localStorage.setItem(REPORTED_KEY, JSON.stringify(reported));
  }

  /* ── Profanity Filter (v5 — international + anti-evasion) ── */
  const BAD_WORDS = [
    /* ═══ SPANISH ═══ */
    'puta','puto','mierda','coño','joder','carajo','pendejo','pendeja',
    'imbecil','idiota','estupido','estupida','culero','culera',
    'maricon','marica','gilipollas','hostia','cojones',
    'cabron','cabrona','hijodeputa','huevon','huevona',
    'mamahuevo','mamahuevos','chinga','chingada','chingado',
    'naco','naca','pinche','perra','perro','zorra',
    'baboso','babosa','boludo','boluda','capullo','capulla',
    'tarado','tarada','subnormal','retrasado','retrasada','anormal',
    'desgraciado','desgraciada','inutil','basurero',
    'sucio','sucia','asco','asqueroso','asquerosa',
    'mugroso','mugrosa','cochino','cochina','puerco','puerca',
    'cagon','cagona','jodon','jodona','maldito','maldita',
    'carancho','rata','ratero','ratera','patan','patana',
    'pendejez','pendejez','gilipollas','mamarracho','mamarracha',
    'memo','memos','tonto','tonta','novato','novata',
    'pelmazo','cenutrio','zapallo','parguela','donnadie',
    'inutil','idiotez','imbecilidad','estupidez','mongolo','mongola',
    'huelebicho','fetido','asco','repugnante','asqueroso',
    'guarango','guaranga','ordinario','ordinaria','grosero','grosera',
    'vulgar','vulgares','soplagati','soplapollas','comepollas',
    'follador','folladora','chupapollas','cogedor','cogedora',
    'sodomizar','penetrar','violar','violador','violacion',
    'abusar','abusador','abuso','golpear','pegar','castigar',
    'maltrato','maltratar','agredir','agresion','agresor',
    /* ═══ ENGLISH ═══ */
    'fuck','fucker','fucking','fucked','motherfucker','motherfucking',
    'shit','shitty','bullshit','horseshit','dickhead','dickface',
    'bitch','bastard','asshole','dumbass','jackass','badass',
    'cock','cocksucker','pussy','cunt','dick','prick','twat',
    'whore','slut','skank','hoe','tramp','tits','boobs',
    'penis','vagina','clitoris','anus','retard','retarded',
    'moron','moronic','imbecile','stupid','dumb','ugly',
    'stfu','gtfo','piss','pissed','damn','crap','suck','sucks',
    'jerk','douche','loser','trash','garbage','fat','fatty',
    'idiot','idiotic','douchebag','buttwipe','asswipe',
    'dickweed','asshead','shithead','fuckface','fucktard',
    'dumbfuck','motherfucking','prick','wanker','bellend',
    'tosser','git','nutter','numpty','pleb','chav','pikey',
    'spastic','retardo','mongol','mong','spaz',
    'coon','cracker','honky','redneck','whitey',
    'redskin','gook','towelhead','raghead','sandnigger',
    'faggot','fag','dyke','tranny','shemale','queer',
    'homo','homosexual','gaylord','gayface',
    'nigger','nigga','nagger','negro','negrito',
    'spic','wetback','beaner','kike','heeb',
    /* ═══ PORTUGUESE ═══ */
    'puta','puto','merda','caralho','fodasse','foda-se','corno',
    'piranha','vagabunda','viado','bicha','bichona','boiola',
    'arrombado','arrombada','otario','otaria','babaca',
    'cuzao','cuzão','rola','cu','buceta','pirigueti',
    'desgraçado','desgraçada','filho da puta','filha da puta',
    'cabrao','cabrao','piranho','vagabundo','merdinha',
    'punheta','punheteiro','brocha','viadinho','bichinha',
    'cuzinho','boceta','xereca','roludo','roluda',
    'arrombado','pirado','pirada','maluco','louco',
    'retardado','retardada','idiota','imbecil','otario',
    /* ═══ FRENCH ═══ */
    'putain','merde','connard','connasse','salope','saloppe',
    'enculé','enculée','bâtard','fils de pute','connard',
    'nique','niquer','nique ta mère','ta gueule','ferme ta gueule',
    'enculé','pédé','pd','tapette','bouffeur de bite',
    'salaud','salaude','emmerdant','emmerdeuse','emmerder',
    'chiaient','chiant','chier','débile','abruti','crétin',
    'abruti','minable','nul','nulle','imbécile',
    'gros con','grosse conne','abruti','andouille',
    'fesse','fesses','cul','culottes','nichon','nichons',
    'bite','queues','foutre','baiser','baise',
    'salopard','salopiaud','bordel','vieux con',
    /* ═══ GERMAN ═══ */
    'arsch','arschloch','fick','ficken','ficker','scheisse','scheiße',
    'hure','huren','hurensohn','wichser','wichser','schlampe',
    'fotze','fotzen','muschi','schwanz','penis','vagina',
    'idiot','idioten','dummkopf','dumme sau','dumme kuh',
    'mistkerl','miststück','arschgeige','arschkarte',
    'verdammte','verdammt','scheiße','mist','kacke',
    'bescheuert','beschränkt','zurückgeblieben','minderbemittelt',
    'spasti','behinderter','behinderte','krüppel',
    'fotze','fotzen','schlampe','nutte','hure',
    'wichser','schwanzlutscher','mutterficker',
    'hurensohn','bastard','dreckskerl','dreckstück',
    /* ═══ ITALIAN ═══ */
    'puttana','troia','merda','cazzo','cornuto','frocio',
    'stronzo','stronza','pezzo di merda','testa di cazzo',
    'figlio di puttana','vaffanculo','vaffanculo','coglione',
    'cogliona','deficiente','scemo','scema','stupido','stupida',
    'idiota','imbecille','cretino','cretina','minchione',
    'basta','basta così','maiale','porco','maialino',
    'troione','puttanone','frocione','ricchione',
    'sfigato','sfigata','disgraziato','disgraziata',
    'schifoso','schifosa','sporco','sporca',
    'mangiamerda','lingua di merda','culo','culone',
    'tetta','tette','pene','vagina','mammella',
    'fica','fico','fregna','cazzone','cazzotti',
    /* ═══ SEXUAL / EXPLICIT (all langs) ═══ */
    'porn','pornhub','xxx','nude','desnudo','desnuda',
    'teta','tetas','teton','tetera','polla','verga','pene',
    'vagina','culo','nalgas','trasero','follar','follando',
    'mamada','chupame','chupar','sexo','sexual','erotic',
    'fetich','fetiche','sado','sadomaso','bondage',
    'onlyfans','only fans','fansly','nudes','send nudes',
    'pack','packs','escort','prostituta','prostituto',
    'stripper','striptease','camgirl','webcam',
    /* ═══ VIOLENCE / THREATS ═══ */
    'muerto','muerta','matar','muerte','asesino','asesina',
    'terrorista','nazi','hitler','racista','racismo',
    'homofobia','homofobico','discriminacion',
    'bomb','explosive','gun','arma','pistol','cuchillo',
    'knife','stab','apuñalar','shoot','disparar','asesinar',
    'tortura','torturar','suicidio','suicidarse',
    'ahogar','ahorcarse','golpear','pegar',
    'rape','rapist','violar','violador',
    'pedophile','pedofilo','grooming','incest',
    'threat','amenaza','amenazar','intimidar',
    /* ═══ DRUGS ═══ */
    'droga','drugs','cocaina','heroina','marihuana','weed','meth',
    'crack','lsd','ecstasy','molly','mdma','ketamine','cocaine',
    'heroin','fentanyl','marijuana','cannabis',
    'alcohol','drunk','high','stoned','wasted','baked',
    /* ═══ HATE / EXTREMISM ═══ */
    'isis','taliban','alqaeda','hezbollah','hamas','kkk',
    'skinhead','fascist','fascismo','dictadura','supremacist',
    'neo-nazi','swastika','aryan','holocaust',
    /* ═══ INCEST / MINORS ═══ */
    'incest','incestuoso','incestuosa',
    'child','children','kid','kids','baby',
    'underage','menor','puber','preadolescente',
    'grooming','lolita','pedo','pedofilo',
    /* ═══ SELF-HARM ═══ */
    'suicide','suicidio','kill myself','matarme','morirme',
    'cutting','cortarme','overdose','sobredosis',
    /* ═══ SLANG / ABBREVIATIONS ═══ */
    'ctm','tml','ptm','gptm','hp','stfu','gtfo',
    'lmfao','smh','fml','afk','noob','rekt',
    'hijueputa','malparido','gonorrea',
    'no mames','no manches','pinche',
    'vete a la verga','que te jodan',
    'la concha de tu madre','hijo de perra',
    'hostia puta','me cago en dios',
    'joder tio','cabron de mierda',
    'marica de mierda','puta de mierda',
    'mierda de persona','eres una mierda',
    'life is meaningless','kill yourself','kys',
    'neck rope','bridge rope','noose','hang yourself',
    'cut yourself','bleed out','end it','do it'
  ];

  /* ── Leet-speak & obfuscation map ───────────────────────── */
  const LEET_MAP = {
    '0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','8':'b',
    '9':'g','2':'z','6':'g',
    '@':'a','$':'s','!':'i','+':'t','¡':'i','|':'l',
    '€':'e','£':'l','¥':'y','§':'s',
    '#':'h','?':'x','*':'x',
    'ä':'a','ö':'o','ü':'u','ß':'ss',
    'é':'e','è':'e','ê':'e','ë':'e',
    'á':'a','à':'a','â':'a','ã':'a',
    'í':'i','ì':'i','î':'i',
    'ó':'o','ò':'o','ô':'o','õ':'o',
    'ú':'u','ù':'u','û':'u',
    'ñ':'n','ç':'c','ø':'o','å':'a',
    'ð':'d','þ':'th','æ':'ae'
  };

  function normalizeForFilter(str) {
    let s = str.toLowerCase();
    /* Strip diacritics / accents */
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    /* Remove ALL non-alphanumeric (dots, underscores, dashes, spaces, symbols) */
    s = s.replace(/[^a-z0-9]/g, '');
    /* Convert leet-speak: map each char individually */
    s = s.split('').map(c => LEET_MAP[c] || c).join('');
    /* Reduce repeated characters: tooontooo → toonto */
    s = s.replace(/(.)\1{2,}/g, '$1$1');
    return s;
  }

  function containsProfanity(name) {
    const clean = normalizeForFilter(name);
    const cleanNoSpace = clean.replace(/\s+/g, '');

    /* 1. Full word match (normalized) */
    for (const word of BAD_WORDS) {
      const w = normalizeForFilter(word);
      if (clean.includes(w)) return true;
      if (cleanNoSpace.includes(w.replace(/\s+/g, ''))) return true;
    }

    /* 2. Token match — split name into words, check each */
    const tokens = clean.split(/\s+/);
    for (const token of tokens) {
      for (const word of BAD_WORDS) {
        const w = normalizeForFilter(word).replace(/\s+/g, '');
        if (token.includes(w) && w.length >= 3) return true;
      }
    }

    /* 3. Partial / prefix match for evasion */
    const partials = [
      'puta','puto','mier','jod','caraj','pend','imb','idi','estu',
      'culo','mari','gili','host','coj','cab','hijo','porn','xxx',
      'nude','teta','poll','verg','pene','vagi','foll','mama','chup',
      'cerd','puer','suci','muer','mata','ases','nazi','hitl','raci',
      'homo','disc','nigg','fagg','reta','fuck','shit','bitch','dick',
      'cock','puss','whor','slut','boob','drog','coca','hero',
      'wee','met','alco','isis','tali','bomb','gun','arma','pist',
      'cuch','stab','shoo','rape','viol','abus','pedo','child',
      'nino','nena','under','menor','ince','fami','herm','madr',
      'padr','hijo','only','sexy','hot','nake','gay','lesb','tran',
      'quee','dyke','crap','damn','stfu','fagg','retar','moron',
      'dumb','idio','tont','burro','gord','mong','subn','retr',
      'desg','inut','mugr','coch','cago','jodo','mald','cara',
      'gato','rata','basu','asco','asq','cazo','fota','puti',
      'sopo','weon','weona','chup','feto','pito','moco','poto',
      'guata','palta','causa','maraca','maricon','tula','pico',
      'sico','corneta','chucha','concha','copi','csm','ctm',
      'puta','pedo','mamá','teto','bola','pavo','marra','gila',
      'fome','pega','filete','cuma','cacho','yeta','gana',
      'forro','trolo','puto','gato','rata','bancarrota',
      'boludo','boluda','pelotudo','pelotuda','gil','gilazo',
      'salame','salamin','cornudo','cornuda','gato','gata',
      'bot','noob','rekt','pwned','n00b','l2p',
      'fuk','fuxx','sh1t','b1tch','d1ck','c0ck','pussi',
      'wh0re','sl0t','n1gg','f4g','r3tard','stfu','gtfo',
      'fuk','phuck','phuc','phuc',
      'joto','jota','marimacho','marica','maricona',
      'perra','perrita','zorra','zorrita','golfa','golfas',
      'cachonda','caliente','sudoroso','sudorosa',
      'tripas','tripa','panza','panzas','vientre',
      'ano','anos','anal','oral','vaginal','genital',
      'ereccion','masturb','orgasm','penetr','sodom',
      'viol','abus','golp','peg','castig','maltrat','agred',
      'amenaz','intimid','asust','hostig','acos',
      'trol','trofeo','trofea','chiste','broma','joke',
      'mem',' meme','memes','copypasta','spam','troll'
    ];
    for (const p of partials) {
      if (clean.includes(p)) return true;
    }

    /* 4. Obfuscation bypass: strip all non-alpha, then re-check full list */
    const stripped = clean.replace(/[^a-z]/g, '');
    for (const word of BAD_WORDS) {
      const w = normalizeForFilter(word).replace(/[^a-z]/g, '');
      if (w.length >= 3 && stripped.includes(w)) return true;
    }

    /* 5. Reversed name check */
    const reversed = stripped.split('').reverse().join('');
    for (const word of BAD_WORDS) {
      const w = normalizeForFilter(word).replace(/[^a-z]/g, '');
      if (w.length >= 3 && reversed.includes(w)) return true;
    }

    /* 6. Separated letters: "c.b.r.n" or "c b r n" → cabron */
    for (const word of BAD_WORDS) {
      const w = normalizeForFilter(word).replace(/[^a-z]/g, '');
      if (w.length >= 4) {
        const pattern = w.split('').join('[\\s._\\-*/\\\\|,;:!¡?¿★☆♦♣♠♥•·]{0,3}');
        if (new RegExp(pattern).test(clean)) return true;
      }
    }

    /* 7. Unicode bypass: strip ALL non-letter and check */
    const lettersOnly = clean.replace(/[^a-z]/g, '');
    for (const word of BAD_WORDS) {
      const w = normalizeForFilter(word).replace(/[^a-z]/g, '');
      if (w.length >= 3 && lettersOnly.includes(w)) return true;
    }

    return false;
  }

  /* ── Report System ─────────────────────────────────────── */
  function reportName(name, gameId) {
    if (!name || name === 'Anónimo') return;
    const reporter = getSavedName() || getPlayerId();

    /* Send webhook to Discord (fire-and-forget, may fail due to CORS) */
    try {
      const embed = {
        title: '🚨 Nombre reportado en el leaderboard',
        color: 0xff3333,
        fields: [
          { name: '📛 Nombre reportado', value: '`' + name + '`', inline: true },
          { name: '🎮 Juego', value: gameId || 'Desconocido', inline: true },
          { name: '👤 Reportado por', value: reporter, inline: true }
        ],
        timestamp: new Date().toISOString()
      };
      const payload = {
        embeds: [embed]
      };
      fetch(REPORT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => console.log('Report webhook response:', r.status))
        .catch(e => console.error('Report webhook error:', e));
    } catch (e) {}

    /* Save report locally and sync to Firebase */
    addReportedName(name, reporter, gameId);
    syncReportedToFirebase();
  }

  /* ── Reported Names Firebase sync (with retry) ────────── */
  var _reportedSyncRetry = 0;

  function syncReportedToFirebase() {
    var reported = getReportedNames();
    fetch(FIREBASE_DB_URL + '/reported_names.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reported)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      _reportedSyncRetry = 0;
    }).catch(function () {
      _reportedSyncRetry++;
      if (_reportedSyncRetry <= _fbSyncMaxRetries) {
        setTimeout(syncReportedToFirebase, 2000 * _reportedSyncRetry);
      } else {
        _reportedSyncRetry = 0;
      }
    });
  }

  function syncReportedFromFirebase(callback) {
    fetch(FIREBASE_DB_URL + '/reported_names.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (data && Array.isArray(data)) {
          localStorage.setItem(REPORTED_KEY, JSON.stringify(data));
        }
        if (callback) callback();
      })
      .catch(function () {
        if (callback) callback();
      });
  }

  /* ── Admin Panel ───────────────────────────────────────── */
  function isDeleteUnlocked() {
    try {
      return localStorage.getItem('rlb_delete_unlocked') === '1';
    } catch (e) { return false; }
  }

  function showAdminPanel() {
    const existing = document.getElementById('rlbAdminModal');
    if (existing) existing.remove();

    /* Sync from Firebase first, then render */
    syncReportedFromFirebase(function () {
      renderAdminPanel();
    });
  }

  function renderAdminPanel() {
    const reported = getReportedNames();
    const modal = document.createElement('div');
    modal.id = 'rlbAdminModal';
    modal.className = 'rlb-name-modal';
    modal.style.zIndex = '9999';

    let rowsHtml = '';
    if (reported.length === 0) {
      rowsHtml = '<p style="text-align:center;color:var(--muted);padding:20px;">No hay nombres reportados.</p>';
    } else {
      rowsHtml = '<div class="rlb-admin-list">';
      reported.forEach(r => {
        rowsHtml += `
          <div class="rlb-admin-row" data-name="${escapeHtml(r.name)}">
            <div class="rlb-admin-info">
              <span class="rlb-admin-name">${escapeHtml(r.name)}</span>
              <span class="rlb-admin-meta">Por: ${escapeHtml(r.reporter)} | ${r.gameId || '?'} | ${new Date(r.date).toLocaleDateString('es-ES')}</span>
            </div>
            <div class="rlb-admin-actions">
              <button class="rlb-admin-btn rlb-admin-delete" data-name="${escapeHtml(r.name)}"><img src="../Iconos RickyEdit Web/🗑️.png" alt="" style="width:1em;height:1em;vertical-align:middle;margin-right:4px;"> Eliminar</button>
              <button class="rlb-admin-btn rlb-admin-keep" data-name="${escapeHtml(r.name)}"><img src="../Exito.png" alt="" class="rlb-icon-img" style="width:1em;height:1em;vertical-align:middle;margin-right:4px;"> Conservar</button>
            </div>
          </div>`;
      });
      rowsHtml += '</div>';
    }

    modal.innerHTML = `
      <div class="rlb-name-card" style="max-width:560px;">
        <h3 class="rlb-name-title"><img src="../Iconos RickyEdit Web/🛡️.png" alt="" class="rlb-icon-img" style="width:2.2em;height:2.2em;vertical-align:middle;margin-right:4px;"> Panel de Moderación</h3>
        <p class="rlb-name-sub">${reported.length} nombre(s) reportado(s)</p>
        ${rowsHtml}
        <div class="rlb-name-actions" style="margin-top:16px;">
          <button id="rlbAdminClose" class="rlb-name-btn rlb-name-btn-cancel">Cerrar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.querySelectorAll('.rlb-admin-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        /* Remove from all leaderboards */
        GAMES.forEach(g => {
          const scores = loadScores(g);
          const filtered = scores.filter(s => s.name && s.name.toLowerCase() !== name.toLowerCase());
          saveScores(g, filtered);
        });
        removeReportedName(name);
        btn.closest('.rlb-admin-row').remove();
        const remaining = modal.querySelectorAll('.rlb-admin-row');
        modal.querySelector('.rlb-name-sub').textContent = remaining.length + ' nombre(s) reportado(s)';
        if (!remaining.length) {
          modal.querySelector('.rlb-admin-list').innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px;">No hay nombres reportados.</p>';
        }
      });
    });

    modal.querySelectorAll('.rlb-admin-keep').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        removeReportedName(name);
        btn.closest('.rlb-admin-row').remove();
        const remaining = modal.querySelectorAll('.rlb-admin-row');
        modal.querySelector('.rlb-name-sub').textContent = remaining.length + ' nombre(s) reportado(s)';
        if (!remaining.length) {
          modal.querySelector('.rlb-admin-list').innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px;">No hay nombres reportados.</p>';
        }
      });
    });

    document.getElementById('rlbAdminClose').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    });
  }

  /* Check for #admin hash on load */
  function checkAdminHash() {
    if (window.location.hash === '#admin') {
      setTimeout(showAdminPanel, 500);
    }
  }

  /* ── Name Input Modal ──────────────────────────────────── */
  function showNameModal(callback) {
    const saved = getSavedName();
    const existing = document.getElementById('rlbNameModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'rlbNameModal';
    modal.className = 'rlb-name-modal';
    modal.innerHTML = `
      <div class="rlb-name-card">
        <div class="rlb-name-icon"><img src="../Iconos/Guardar nombre.png" alt="Guardar" class="rlb-icon-img"></div>
        <h3 class="rlb-name-title">¿Cómo te llamas?</h3>
        <p class="rlb-name-sub">Escribe tu nombre para el leaderboard</p>
        <input type="text" id="rlbNameInput" class="rlb-name-input" placeholder="Tu nombre..." maxlength="20" value="${escapeHtml(saved)}" autocomplete="off" />
        <p id="rlbNameError" class="rlb-name-error" style="display:none;"></p>
        <div class="rlb-name-actions">
          <button id="rlbNameCancel" class="rlb-name-btn rlb-name-btn-cancel">Cancelar</button>
          <button id="rlbNameConfirm" class="rlb-name-btn rlb-name-btn-confirm">Guardar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

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
      if (containsProfanity(name)) {
        error.textContent = 'Ese nombre no está permitido. Elige otro.';
        error.style.display = 'block';
        return;
      }
      if (isNameReported(name)) {
        error.textContent = 'Ese nombre está reportado. Elige otro.';
        error.style.display = 'block';
        return;
      }
      if (isNameTaken(name)) {
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

  /* ── Report Confirm Modal ──────────────────────────────── */
  function showReportModal(name, gameId, callback) {
    const existing = document.getElementById('rlbReportModal');
    if (existing) existing.remove();

    const deleteEnabled = isDeleteUnlocked();

    const modal = document.createElement('div');
    modal.id = 'rlbReportModal';
    modal.className = 'rlb-report-modal';
    modal.innerHTML = `
      <div class="rlb-report-card">
        <div class="rlb-report-icon"><img src="../Aviso.png" alt="" class="rlb-icon-img"></div>
        <h3 class="rlb-report-title">¿Reportar este nombre?</h3>
        <p class="rlb-report-name">"${escapeHtml(name)}"</p>
        <p class="rlb-report-sub">El nombre será enviado a Jan para revisión. ¿Quieres continuar?</p>
        <div class="rlb-report-actions">
          <button id="rlbReportCancel" class="rlb-report-btn-modal rlb-report-btn-cancel">Cancelar</button>
          <button id="rlbReportConfirm" class="rlb-report-btn-modal rlb-report-btn-confirm">Reportar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    document.getElementById('rlbReportConfirm').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      callback('report');
    });
    document.getElementById('rlbReportCancel').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      callback(false);
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        callback(false);
      }
    });
  }

  /* ── Public API ──────────────────────────────────────── */
  window.RickyLeaderboard = {

    save(gameId, data, callback) {
      const doSave = (name) => {
        data.name = name;
        data.playerId = getPlayerId();
        data.date = data.date || new Date().toISOString();
        const scores = loadScores(gameId);
        scores.push(data);
        /* Keep only best score per player */
        const best = {};
        scores.forEach(function (s) {
          var pid = s.playerId || s.name || '';
          if (!best[pid] || (s.score || 0) > (best[pid].score || 0)) best[pid] = s;
        });
        const deduped = Object.values(best);
        deduped.sort((a, b) => (b.score || 0) - (a.score || 0));
        if (deduped.length > 100) deduped.length = 100;
        saveScores(gameId, deduped);
        syncToFirebase(gameId);
        if (callback) callback(data);
      };

      const saved = getSavedName();
      if (saved && !isNameTaken(saved) && !isNameReported(saved) && !containsProfanity(saved)) {
        doSave(saved);
      } else {
        showNameModal(doSave);
      }
    },

    getAll(gameId, filter) {
      let scores = loadScores(gameId);
      if (filter) {
        if (filter.difficulty) scores = scores.filter(s => s.difficulty === filter.difficulty);
        if (filter.channel)    scores = scores.filter(s => s.channel === filter.channel);
      }
      scores.sort((a, b) => {
        // Score DESC → Lives DESC → % → difficulty rank DESC → time ASC
        var aScore = a.score || 0;
        var bScore = b.score || 0;
        if (bScore !== aScore) return bScore - aScore;
        var aLives = a.lives != null ? a.lives : -1;
        var bLives = b.lives != null ? b.lives : -1;
        if (bLives !== aLives) return bLives - aLives;
        var aPct = a.total ? (a.correct / a.total) : (a.percent || 0) / 100;
        var bPct = b.total ? (b.correct / b.total) : (b.percent || 0) / 100;
        if (bPct !== aPct) return bPct - aPct;
        var diffRank = { extreme: 3, hard: 2, normal: 1, easy: 0 };
        var aDiff = diffRank[a.difficulty] || 0;
        var bDiff = diffRank[b.difficulty] || 0;
        if (bDiff !== aDiff) return bDiff - aDiff;
        var aTime = a.time != null ? a.time : Infinity;
        var bTime = b.time != null ? b.time : Infinity;
        return aTime - bTime;
      });
      return scores;
    },

    getSavedName,
    containsProfanity,
    isNameReported,
    reportName,
    showAdminPanel,
    escapeHtml,

    render(container, gameId, opts) {
      if (typeof container === 'string') container = document.getElementById(container);
      if (!container) return;
      opts = opts || {};

      const maxRows = opts.maxRows || 100;
      const columns = opts.columns || ['rank', 'name', 'correct', 'total', 'percent', 'lives', 'time', 'difficulty', 'date'];

      const diffLabels = { easy: '<img src="../Iconos/Dificultad dif%C3%ADcil.png" alt="" class="rlb-icon-img"> Cagado', normal: '<img src="../Iconos/Dificultad normal.png" alt="" class="rlb-icon-img"> Normal', extreme: '<img src="../Extremo.png" alt="" class="rlb-icon-img"> Extremo', hard: '<img src="../Iconos/Dificultad dif%C3%ADcil.png" alt="" class="rlb-icon-img"> Difícil', none: '—' };
      const diffKeys = opts.difficulties || ['easy', 'normal', 'extreme', 'hard'];
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
          <h3 class="rlb-title">${opts.title || '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard'}</h3>
          <div class="rlb-filters">`;

        /* Difficulty dropdown */
        html += `<div class="rlb-dropdown" data-filter="difficulty">
          <button class="rlb-dropdown-btn" type="button">
            <span class="rlb-dropdown-label">${currentFilter.difficulty ? (diffLabels[currentFilter.difficulty] || currentFilter.difficulty) : 'Todas'}</span>
            <span class="rlb-dropdown-arrow"></span>
          </button>
          <div class="rlb-dropdown-list">
            <div class="rlb-dropdown-item ${!currentFilter.difficulty ? 'selected' : ''}" data-value="">Todas</div>`;
        diffKeys.forEach(k => {
          html += `<div class="rlb-dropdown-item ${currentFilter.difficulty === k ? 'selected' : ''}" data-value="${k}">${diffLabels[k] || k}</div>`;
        });
        html += `</div></div>`;

        /* Channel dropdown */
        if (channelKeys.length) {
          html += `<div class="rlb-dropdown" data-filter="channel">
            <button class="rlb-dropdown-btn" type="button">
              <span class="rlb-dropdown-label">${currentFilter.channel ? (channelLabels[currentFilter.channel] || currentFilter.channel) : 'Todos'}</span>
              <span class="rlb-dropdown-arrow"></span>
            </button>
            <div class="rlb-dropdown-list">
              <div class="rlb-dropdown-item ${!currentFilter.channel ? 'selected' : ''}" data-value="">Todos</div>`;
          channelKeys.forEach(k => {
            html += `<div class="rlb-dropdown-item ${currentFilter.channel === k ? 'selected' : ''}" data-value="${k}">${channelLabels[k]}</div>`;
          });
          html += `</div></div>`;
        }

        html += `</div></div>`;
        html += `<p style="text-align:center;color:var(--muted);font-size:0.78rem;font-weight:700;margin:8px 0 0;"><img src="../Info.png" alt="" style="width:1em;height:1em;vertical-align:middle;margin-right:4px;"> La puntuación es lo que más cuenta en el top. ¡Maximiza tus puntos!</p>`;

        /* Table header */
        const allCols = [...columns];
        if (!allCols.includes('report')) allCols.push('report');

        html += `<div class="rlb-table-wrap"><table class="rlb-table"><thead><tr>`;
        const colLabels = {
          rank: '#', name: 'Jugador', score: 'Puntos', difficulty: 'Dificultad',
          channel: 'Canal', round: 'Pista', time: 'Tiempo', date: 'Fecha',
          streak: 'Racha', correct: '✓', total: 'Total', percent: '%', lives: 'Vidas', report: ''
        };
        allCols.forEach(c => {
          if (colLabels[c] !== undefined) html += `<th class="rlb-col-${c}">${colLabels[c]}</th>`;
        });
        html += `</tr></thead><tbody>`;

        if (!rows.length) {
          html += `<tr><td colspan="${allCols.length}" style="text-align:center;padding:30px 16px;color:var(--muted);">No hay puntuaciones todavía — ¡Juega para registrar tu primera!</td></tr>`;
        } else {
          rows.forEach((s, i) => {
            const medals = [
              '<img src="../Medalla 1.png" alt="1st" class="rlb-medal">',
              '<img src="../Medalla 2.png" alt="2nd" class="rlb-medal">',
              '<img src="../Medalla 3.png" alt="3rd" class="rlb-medal">'
            ];
            const rankDisplay = i < 3 ? medals[i] : (i + 1);
            const pct = s.total ? Math.round((s.correct / s.total) * 100) : (s.percent || 0);
            const isOwn = s.playerId === getPlayerId();
            html += `<tr class="${i < 3 ? 'rlb-top-' + (i + 1) : ''}">`;
            allCols.forEach(c => {
              let val = '';
              switch (c) {
                case 'rank': val = rankDisplay; break;
                case 'name': val = escapeHtml(s.name || 'Anónimo'); break;
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
                case 'lives': val = (s.lives != null && s.maxLives != null) ? s.lives + '/' + s.maxLives : '—'; break;
                case 'report':
                  if (isOwn) {
                    val = '';
                  } else {
                    let reportBtn = `<button class="rlb-report-btn" data-name="${escapeHtml(s.name || '')}" title="Reportar nombre"><img src="../Aviso.png" alt="" class="rlb-icon-img"></button>`;
                    if (isDeleteUnlocked()) {
                      reportBtn += `<button class="rlb-admin-btn rlb-admin-delete rlb-row-delete-btn" data-name="${escapeHtml(s.name || '')}" title="Eliminar nombre" style="margin-left:4px;padding:4px 8px;font-size:0.75rem;"><img src="../Iconos RickyEdit Web/🗑️.png" alt="" style="width:1em;height:1em;vertical-align:middle;"></button>`;
                    }
                    val = reportBtn;
                  }
                  break;
              }
              html += `<td class="rlb-col-${c}">${val}</td>`;
            });
            html += `</tr>`;
          });
        }



        html += `</tbody></table></div>`;

        container.innerHTML = html;

        /* Custom dropdown listeners */
        container.querySelectorAll('.rlb-dropdown').forEach(dropdown => {
          const btn = dropdown.querySelector('.rlb-dropdown-btn');
          const list = dropdown.querySelector('.rlb-dropdown-list');
          const filterKey = dropdown.dataset.filter;

          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            /* Close other dropdowns */
            container.querySelectorAll('.rlb-dropdown-list.show').forEach(other => {
              if (other !== list) other.classList.remove('show');
            });
            container.querySelectorAll('.rlb-dropdown-btn.open').forEach(other => {
              if (other !== btn) other.classList.remove('open');
            });
            list.classList.toggle('show');
            btn.classList.toggle('open');
          });

          dropdown.querySelectorAll('.rlb-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
              e.stopPropagation();
              currentFilter[filterKey] = item.dataset.value;
              render();
            });
          });
        });

        /* Close dropdowns when clicking outside */
        document.addEventListener('click', () => {
          container.querySelectorAll('.rlb-dropdown-list.show').forEach(list => {
            list.classList.remove('show');
          });
          container.querySelectorAll('.rlb-dropdown-btn.open').forEach(btn => {
            btn.classList.remove('open');
          });
        });

        /* Report button listeners */
        container.querySelectorAll('.rlb-report-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            if (!name) return;
            if (btn.classList.contains('rlb-reported')) return;
            showReportModal(name, gameId, (action) => {
              if (action === 'report') {
                reportName(name, gameId);
                btn.classList.add('rlb-reported');
                btn.innerHTML = '<img src="../Exito.png" alt="" class="rlb-icon-img">';
                btn.title = 'Ya reportado';
              } else if (action === 'delete') {
                reportName(name, gameId);
                /* Remove from all leaderboards */
                GAMES.forEach(g => {
                  const scores = loadScores(g);
                  const filtered = scores.filter(s => s.name && s.name.toLowerCase() !== name.toLowerCase());
                  saveScores(g, filtered);
                  syncToFirebase(g);
                });
                addReportedName(name, getSavedName() || getPlayerId(), gameId);
                syncReportedToFirebase();
                render();
              }
            });
          });
        });

        /* Direct delete button listeners (admin only) */
        container.querySelectorAll('.rlb-row-delete-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            if (!name) return;
            if (!confirm('¿Estás seguro de que quieres eliminar a "' + name + '"?\n\nSe eliminará de todos los leaderboards y no podrá volver a usar este nombre.')) return;
            addReportedName(name, getSavedName() || getPlayerId(), gameId);
            syncReportedToFirebase();
            GAMES.forEach(g => {
              const scores = loadScores(g);
              const filtered = scores.filter(s => s.name && s.name.toLowerCase() !== name.toLowerCase());
              saveScores(g, filtered);
              /* Push directly to Firebase without merge */
              fetch(FIREBASE_DB_URL + '/leaderboard/' + g + '.json', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtered)
              }).catch(function() {});
            });
            render();
          });
        });
      }

      render();
    }
  };

  /* Auto-check admin hash */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAdminHash);
  } else {
    checkAdminHash();
  }

  /* ── Firebase periodic sync (every 15s) ──────────────────── */
  function syncAllFromFirebase() {
    var pending = GAMES.length;
    GAMES.forEach(function (g) {
      syncFromFirebase(g, function () {
        if (--pending === 0) window.RickyLeaderboard._fireScoreUpdate();
      });
    });
  }
  setInterval(syncAllFromFirebase, 15000);
  /* Initial sync after a short delay so game renderers are ready */
  setTimeout(syncAllFromFirebase, 2000);

  /* Allow games to register a callback for live leaderboard refresh */
  var _scoreUpdateCallbacks = [];
  window.RickyLeaderboard.onScoresUpdated = function (fn) { _scoreUpdateCallbacks.push(fn); };
  window.RickyLeaderboard._fireScoreUpdate = function () { _scoreUpdateCallbacks.forEach(function (fn) { fn(); }); };

  /* ── Save Toast ──────────────────────────────────────────── */
  window.RickyLeaderboard.showSaveToast = function (gameId, savedData) {
    var allScores = window.RickyLeaderboard.getAll(gameId);
    var rank = allScores.findIndex(function (s) { return s.playerId === savedData.playerId; }) + 1;
    var toast = document.createElement('div');
    toast.className = 'rlb-save-toast';
    toast.innerHTML = '<span style="color:#2ecc71;">&#10003;</span> Guardado correctamente. Has quedado en la <strong>#' + rank + '</strong> posición del top.';
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 3500);
  };

  window.RickyLeaderboard.showExitConfirm = function (onSure, onFinalize) {
    var existing = document.getElementById('rlbExitModal');
    if (existing) existing.remove();
    var modal = document.createElement('div');
    modal.id = 'rlbExitModal';
    modal.className = 'rlb-exit-modal';
    modal.innerHTML =
      '<div class="rlb-exit-card">' +
        '<div class="rlb-exit-icon">&#128680;</div>' +
        '<p class="rlb-exit-title">¿Estás seguro que quieres irte sin finalizar?</p>' +
        '<div class="rlb-exit-actions">' +
          '<button class="rlb-exit-btn rlb-exit-btn-finalize" id="rlbExitFinalize">Finalizar y Guardar</button>' +
          '<button class="rlb-exit-btn rlb-exit-btn-sure" id="rlbExitSure">Salir sin Guardar</button>' +
          '<button class="rlb-exit-btn rlb-exit-btn-cancel" id="rlbExitCancel">Volver a la partida</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    setTimeout(function () { modal.classList.add('show'); }, 10);

    function close() {
      modal.classList.remove('show');
      setTimeout(function () { modal.remove(); }, 300);
    }

    document.getElementById('rlbExitSure').addEventListener('click', function () {
      close();
      if (onSure) onSure();
    });
    document.getElementById('rlbExitFinalize').addEventListener('click', function () {
      close();
      if (onFinalize) onFinalize();
    });
    document.getElementById('rlbExitCancel').addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
  };

  window.RickyLeaderboard.showFinalizeConfirm = function (onConfirm) {
    var existing = document.getElementById('rlbFinalizeModal');
    if (existing) existing.remove();
    var modal = document.createElement('div');
    modal.id = 'rlbFinalizeModal';
    modal.className = 'rlb-finalize-modal';
    modal.innerHTML =
      '<div class="rlb-finalize-card">' +
        '<div class="rlb-finalize-icon">&#10003;</div>' +
        '<p class="rlb-finalize-title">¿Finalizar partida?</p>' +
        '<p class="rlb-finalize-sub">Se guardará tu puntuación en el top.</p>' +
        '<div class="rlb-finalize-actions">' +
          '<button class="rlb-finalize-btn rlb-finalize-btn-cancel" id="rlbFinalizeCancel">Cancelar</button>' +
          '<button class="rlb-finalize-btn rlb-finalize-btn-confirm" id="rlbFinalizeConfirm">Finalizar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    setTimeout(function () { modal.classList.add('show'); }, 10);

    function close() {
      modal.classList.remove('show');
      setTimeout(function () { modal.remove(); }, 300);
    }

    document.getElementById('rlbFinalizeCancel').addEventListener('click', close);
    document.getElementById('rlbFinalizeConfirm').addEventListener('click', function () {
      close();
      if (onConfirm) onConfirm();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
  };

  /* Set personalized OBS lives link for each player */
  function setObsLivesLink() {
    var pid = getPlayerId();
    var baseUrl = 'https://janiito-studio.github.io/RickyEdit-Games/obs-lives.html';
    var links = document.querySelectorAll('#obsLivesLink');
    links.forEach(function (link) {
      var url = baseUrl + '?id=' + pid;
      link.href = url;
      link.textContent = url;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setObsLivesLink);
  } else {
    setObsLivesLink();
  }
})();
