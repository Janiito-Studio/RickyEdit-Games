const items = [
    // --- 25 SKINS DE CS2 (Precios estables y más comunes en marketplaces externos) ---
    {
        name: "AK-47 | Case Hardened",
        price: 320,
        type: "skin",
        image: "images/skins/ak47_case_hardened.png",
        description: "Una de las skins más icónicas de CS2. Su valor medio común se mantiene estable en mercados externos para patrones estándar."
    },
    {
        name: "AWP | Dragon Lore",
        price: 6500,
        type: "skin",
        image: "images/skins/awp_dragon_lore.png",
        description: "La reina indiscutible de las skins de AWP. Su precio de mercado real y más común se estabiliza fuera de las fluctuaciones de Steam."
    },
    {
        name: "Bowie Knife | Lore",
        price: 160,
        type: "skin",
        image: "images/skins/bowie_knife_lore.png",
        description: "Un cuchillo Bowie dorado con grabados rúnicos inspirado en la clásica Dragon Lore. Un valor de entrada muy común y estable."
    },
    {
        name: "M9 Bayonet | Crimson Web",
        price: 720,
        type: "skin",
        image: "images/skins/m9_bayonet_crimson_web.png",
        description: "Patrón de telaraña roja sobre fondo negro. El precio base más repetido y representativo para desgastes intermedios estándar."
    },
    {
        name: "Glock-18 | Fade",
        price: 950,
        type: "skin",
        image: "images/skins/glock18_fade.png",
        description: "Pistola Glock-18 pintada con un degradado translúcido. Su coste estándar consolidado suele rondar esta cifra en la mayoría de plataformas."
    },
    {
        name: "Karambit | Case Hardened",
        price: 750,
        type: "skin",
        image: "images/skins/karambit_case_hardened.png",
        description: "Un clásico absoluto de los cuchillos. Su precio base más común para patrones estándar sin sobreprecio por porcentaje de azul."
    },
    {
        name: "Butterfly Knife | Doppler Zafiro",
        price: 11500,
        type: "skin",
        image: "images/skins/butterfly_knife_doppler_zafiro.png",
        description: "Un cuchillo de mariposa con el patrón Doppler en fase Zafiro. Una cotización estándar y consolidada entre grandes coleccionistas."
    },
    {
        name: "M4A4 | Howl",
        price: 3400,
        type: "skin",
        image: "images/skins/m4a4_howl.png",
        description: "La única skin de rareza 'Contrabando'. Su precio medio de transacción real y más repetido en su desgaste más común."
    },
    {
        name: "AK-47 | Redline",
        price: 20,
        type: "skin",
        image: "images/skins/ak47_redline.png",
        description: "Una clásica skin minimalista de fibra de carbono negra con líneas rojas. Su precio base más común y accesible en el mercado."
    },
    {
        name: "Desert Eagle | Blaze",
        price: 620,
        type: "skin",
        image: "images/skins/desert_eagle_blaze.png",
        description: "Pintada con llamas de aerógrafo sobre una base negra. Mítica y con un precio estándar consolidado en plataformas externas."
    },
    {
        name: "AWP | Gungnir",
        price: 8200,
        type: "skin",
        image: "images/skins/awp_gungnir.png",
        description: "Inspirada en la lanza de Odín de la mitología nórdica. Su valor de mercado real más repetido para desgastes estándar."
    },
    {
        name: "AK-47 | Wild Lotus",
        price: 5500,
        type: "skin",
        image: "images/skins/ak47_wild_lotus.png",
        description: "Decorada con impresionantes flores de loto sobre fondo verde. El precio base consolidado en operaciones de mercado abierto."
    },
    {
        name: "Karambit | Doppler",
        price: 980,
        type: "skin",
        image: "images/skins/karambit_doppler.png",
        description: "Un impresionante cuchillo Karambit Doppler. El coste estándar y más común para sus fases regulares."
    },
    {
        name: "M4A1-S | Welcome to the Jungle",
        price: 1100,
        type: "skin",
        image: "images/skins/m4a1s_welcome_to_the_jungle.png",
        description: "Skin temática de jungla con una víbora dorada. Su cotización media habitual en plataformas externas estables."
    },
    {
        name: "AWP | Asiimov",
        price: 105,
        type: "skin",
        image: "images/skins/awp_asiimov.png",
        description: "Diseño futurista de color blanco, naranja y negro. Un clásico atemporal con un precio estándar muy asentado."
    },
    {
        name: "AK-47 | Vulcan",
        price: 280,
        type: "skin",
        image: "images/skins/ak47_vulcan.png",
        description: "Skin de estética deportiva con líneas limpias. Su valor medio real y más común para un desgaste intermedio regular."
    },
    {
        name: "USP-S | Kill Confirmed",
        price: 45,
        type: "skin",
        image: "images/skins/usps_kill_confirmed.png",
        description: "Muestra el impacto dinámico de una bala atravesando un cráneo. Precio estándar habitual para su versión más buscada."
    },
    {
        name: "Karambit | Fade",
        price: 1750,
        type: "skin",
        image: "images/skins/karambit_fade.png",
        description: "Pintado con un degradado translúcido. El coste de mercado real más repetido para porcentajes de degradado estándar."
    },
    {
        name: "M9 Bayonet | Lore",
        price: 900,
        type: "skin",
        image: "images/skins/m9_bayonet_lore.png",
        description: "Un cuchillo M9 dorado con un intrincado patrón rúnico. El precio base medio más estable en transacciones externas."
    },
    {
        name: "Sport Gloves | Vice",
        price: 1400,
        type: "skin",
        image: "images/skins/sport_gloves_vice.png",
        description: "Guantes deportivos en vibrante color rosa y azul cian. Su cotización media común para desgastes intermedios realistas."
    },
    {
        name: "Specialist Gloves | Crimson Kimono",
        price: 1050,
        type: "skin",
        image: "images/skins/specialist_gloves_crimson_kimono.png",
        description: "Guantes de especialista con patrón de rombos en rojo carmesí y negro. El precio base común más estable del mercado."
    },
    {
        name: "Desert Eagle | Printstream",
        price: 40,
        type: "skin",
        image: "images/skins/desert_eagle_printstream.png",
        description: "Acabado de color blanco perla nacarado que cambia con la luz. Su valor de catálogo estándar más repetido."
    },
    {
        name: "AK-47 | Slate",
        price: 3,
        type: "skin",
        image: "images/skins/ak47_slate.png",
        description: "Una skin completamente negra y sumamente popular. Su coste estándar real consolidado en plataformas externas."
    },
    {
        name: "AWP | Atheris",
        price: 2,
        type: "skin",
        image: "images/skins/awp_atheris.png",
        description: "Presenta una víbora de arbusto de color verde brillante. Su precio base regular y más común en el mercado abierto."
    },
    {
        name: "AWP | Hyper Beast",
        price: 25,
        type: "skin",
        image: "images/skins/awp_hyper_beast.png",
        description: "Diseño psicodélico neón de una criatura monstruosa. El precio medio estable más habitual para este modelo."
    },

    // --- 25 VIDA REAL (Precios base estables estándar sin ofertas ni promociones) ---
    {
        name: "Camiseta Oficial de España",
        price: 100,
        type: "real",
        image: "images/real/camiseta_espana.png",
        description: "La equipación deportiva oficial de la selección española de fútbol. Precio de venta al público estándar en tiendas de deportes autorizadas."
    },
    {
        name: "PlayStation 5 Pro",
        price: 800,
        type: "real",
        image: "images/real/playstation_5_pro.png",
        description: "Consola de última generación de Sony. Precio de venta al público estándar recomendado y consolidado en tiendas habituales."
    },
    {
        name: "iPhone 16 Pro Max",
        price: 1400,
        type: "real",
        image: "images/real/iphone_15_pro_max.png",
        description: "El modelo insignia de Apple construido en titanio. Su precio comercial de venta estándar y más común en establecimientos autorizados."
    },
    {
        name: "Rolex Submariner Date",
        price: 10500,
        type: "real",
        image: "images/real/rolex_submariner_date.png",
        description: "El icónico reloj de buceo mecánico de lujo. Precio base de lista estándar recomendado por el fabricante."
    },
    {
        name: "Tesla Model 3 (base)",
        price: 39000,
        type: "real",
        image: "images/real/tesla_model_3.png",
        description: "Berlina eléctrica eficiente con gran autonomía. Precio de venta estándar de la marca antes de ayudas locales variables."
    },
    {
        name: "Menú Hamburguesa Completo",
        price: 12,
        type: "real",
        image: "images/real/hamburguesa_completa.png",
        description: "Menú de hamburguesa clásica, patatas y refresco. El precio estándar habitual en el mostrador sin ofertas temporales."
    },
    {
        name: "Mansión de Lujo en Marbella",
        price: 5000000,
        type: "real",
        image: "images/real/mansion_marbella.png",
        description: "Exclusiva villa contemporánea en la Costa del Sol. Valor estándar de mercado promedio para propiedades de altas prestaciones en la zona."
    },
    {
        name: "Patinete Eléctrico Premium",
        price: 850,
        type: "real",
        image: "images/real/patinete_electrico.png",
        description: "Patinete urbano de gama alta con suspensión y autonomía extendida. Precio de venta estándar en el mercado tecnológico habitual."
    },
    {
        name: "Billete de Metro Sencillo",
        price: 1.50,
        type: "real",
        image: "images/real/billete_metro_sencillo.png",
        description: "Un billete de viaje sencillo válido para un trayecto básico en la red metropolitana de transporte."
    },
    {
        name: "Viaje a Japón Todo Incluido",
        price: 3500,
        type: "real",
        image: "images/real/viaje_japon.png",
        description: "Paquete estándar de viaje combinando vuelos regulares y estancias en hoteles confortables de gama media."
    },
    {
        name: "Isla Privada en las Bahamas",
        price: 12000000,
        type: "real",
        image: "images/real/isla_privada.png",
        description: "Un pequeño cayo virgen en el Caribe. Valor de mercado de catálogo estándar internacional para islas privadas de este rango."
    },
    {
        name: "Helicóptero Robinson R44",
        price: 450000,
        type: "real",
        image: "images/real/helicoptero.png",
        description: "Helicóptero civil ligero de cuatro plazas. Coste de catálogo estándar internacional para la configuración del modelo base."
    },
    {
        name: "Entradas VIP Final Champions",
        price: 5000,
        type: "real",
        image: "images/real/entradas_champions.png",
        description: "Acceso VIP exclusivo con servicio hospitality en los paquetes oficiales emitidos para el evento deportivo de élite."
    },
    {
        name: "Refresco en el Cine",
        price: 4.50,
        type: "real",
        image: "images/real/refresco_cine.png",
        description: "Un vaso grande de refresco frío comprado directamente en el mostrador del cine a precio comercial regular."
    },
    {
        name: "Lamborghini Huracán Evo",
        price: 240000,
        type: "real",
        image: "images/real/lamborghini_huracan_evo.png",
        description: "Superdeportivo italiano con motor V10. Precio de mercado de ocasión promedio y más repetido para unidades seminuevas verificadas."
    },
    {
        name: "Cena Restaurante 3 Estrellas Michelin",
        price: 350,
        type: "real",
        image: "images/real/cena_michelin.png",
        description: "Menú degustación estándar por persona en uno de los establecimientos gastronómicos galardonados más prestigiosos."
    },
    {
        name: "Yate de Lujo (20 metros)",
        price: 950000,
        type: "real",
        image: "images/real/yate_lujo.png",
        description: "Embarcación de recreo de eslora media de segunda mano, valorada bajo el estándar de tasación habitual de mercado."
    },
    {
        name: "Teclado Mecánico Custom Gamer",
        price: 180,
        type: "real",
        image: "images/real/teclado_mecanico.png",
        description: "Teclado mecánico premium montado por piezas de alta calidad compradas a precio estándar de catálogo especializado."
    },
    {
        name: "Bolígrafo BIC Clásico",
        price: 0.40,
        type: "real",
        image: "images/real/boligrafo_bic.png",
        description: "El mítico bolígrafo de tinta azul, calculado a su valor comercial unitario de papelería tradicional."
    },
    {
        name: "MacBook Pro M4 Max",
        price: 4000,
        type: "real",
        image: "images/real/macbook_pro.png",
        description: "El ordenador portátil de Apple configurado para alto rendimiento. Su precio comercial estándar de venta al público en tiendas oficiales."
    },
    {
        name: "Suscripción 1 año Netflix Premium",
        price: 240,
        type: "real",
        image: "images/real/netflix_premium.png",
        description: "12 meses del plan de suscripción más alto calculados según la tarifa fija comercial estándar mensual."
    },
    {
        name: "Bicicleta de Montaña Profesional",
        price: 4200,
        type: "real",
        image: "images/real/bicicleta_montana.png",
        description: "Bicicleta de Enduro con cuadro de carbono y componentes de alta gama a precio de catálogo comercial regular."
    },
    {
        name: "Café Latte Grande en Cafetería",
        price: 3.20,
        type: "real",
        image: "images/real/cafe_latte.png",
        description: "Una taza grande de café con leche texturizada servida habitualmente en una cafetería local estándar."
    },
    {
        name: "Casa Adosada en Madrid",
        price: 520000,
        type: "real",
        image: "images/real/casa_adosada.png",
        description: "Vivienda familiar unifamiliar adosada. Precio medio de venta de mercado más común registrado en zonas residenciales metropolitanas."
    },
    {
        name: "Auriculares AirPods Pro 2",
        price: 240,
        type: "real",
        image: "images/real/airpods_pro.png",
        description: "Auriculares inalámbricos de Apple con cancelación de ruido activa a precio estándar habitual en grandes superficies."
    }
];

// Estado del juego
let score = 0;
let streak = 0;
let highestStreak = parseInt(localStorage.getItem('max-streak') || '0', 10);
let currentPair = [];
let gameActive = true;
let roundCount = 0;
let correctCount = 0;
let incorrectCount = 0;
let TOTAL_ROUNDS = 50;
let easyMode = false;
let gameStartTime = null;

// Colas de mezcla para garantizar que no se repitan los ítems hasta mostrar todos
let skinQueue = [];
let realQueue = [];

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Inicialización de sonidos mediante Web Audio API
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}
['click','touchstart','keydown','mousedown','pointerdown'].forEach(evt =>
    document.addEventListener(evt, () => { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }, { once: true })
);

function playSound(type) {
    const ctx = getAudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (type === 'fail') {
        osc.frequency.setValueAtTime(330, now); // E4
        osc.frequency.linearRampToValueAtTime(165, now + 0.25); // E3
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    }
}

// Formatear precio
function formatPrice(value) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

// Actualizar contadores del HUD
function updateCounters() {
    document.getElementById('round-counter').textContent = `${roundCount}/${TOTAL_ROUNDS}`;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
}

// Actualizar contadores del HUD
function updateCounters() {
    document.getElementById('round-counter').textContent = `${roundCount}/${TOTAL_ROUNDS}`;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
}

// Obtener un par aleatorio asegurando que:
// 1. Uno sea Skin de CS2 y otro sea de la Vida Real.
// 2. No sean obvios (los precios deben estar en un rango de magnitud comparable, factor máx 15x).
// 3. No se repitan consecutivamente, utilizando colas mezcladas sin repetición.
function applyImageGlow(imgEl, wrapperEl, type) {
    const bgColor = type === 'skin' ? '241, 196, 15' : '56, 212, 255';
    imgEl.style.filter = 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3)) drop-shadow(0 6px 16px rgba(0, 0, 0, 0.4))';
    wrapperEl.style.background = `radial-gradient(ellipse at 50% 50%, rgba(${bgColor}, 0.3), rgba(${bgColor}, 0.08) 50%, transparent 75%)`;
}

function getRandomPair() {
    const csSkins = items.filter(i => i.type === 'skin');
    const realLife = items.filter(i => i.type === 'real');

    // Rellenar y barajar colas si están vacías
    if (skinQueue.length === 0) {
        skinQueue = shuffle(csSkins);
    }
    if (realQueue.length === 0) {
        realQueue = shuffle(realLife);
    }

    let skinCandidate = null;
    let realCandidate = null;
    let attempts = 0;
    
    // Algoritmo de emparejamiento inteligente para buscar precios no obvios (dentro de un rango de magnitud razonable)
    while (attempts < 100) {
        // Sacar candidatos temporales
        const sIdx = Math.floor(Math.random() * skinQueue.length);
        const rIdx = Math.floor(Math.random() * realQueue.length);
        
        const tempSkin = skinQueue[sIdx];
        const tempReal = realQueue[rIdx];
        
        const ratio = tempSkin.price / tempReal.price;
        // La diferencia de precios no debe ser abismal (factor máximo de 15x entre ambos para que sea difícil y divertido)
        if (ratio >= 0.06 && ratio <= 16.0) {
            // Extraerlos de las colas para que no se repitan
            skinCandidate = skinQueue.splice(sIdx, 1)[0];
            realCandidate = realQueue.splice(rIdx, 1)[0];
            break;
        }
        attempts++;
    }

    // Fallback por si la restricción de precio es muy estricta y no encuentra pareja compatible en 100 intentos
    if (!skinCandidate || !realCandidate) {
        skinCandidate = skinQueue.pop() || csSkins[0];
        realCandidate = realQueue.pop() || realLife[0];
    }

    // Skin siempre a la izquierda, vida real siempre a la derecha
    return [skinCandidate, realCandidate];
}

// Generar una nueva ronda
function nextRound() {
    if (roundCount >= TOTAL_ROUNDS) {
        // Victoria!
        document.getElementById('victory-overlay').classList.add('show');
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-correct').textContent = correctCount;
        document.getElementById('final-incorrect').textContent = incorrectCount;
        const total = correctCount + incorrectCount;
        const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        document.getElementById('final-pct').textContent = `${pct}%`;
        return;
    }
    
    roundCount++;
    if (!gameStartTime) gameStartTime = Date.now();
    gameActive = true;
    currentPair = getRandomPair();
    updateCounters();
    updateCounters();

    // Resetear clases de animación y estados
    const cardLeft = document.getElementById('card-left');
    const cardRight = document.getElementById('card-right');
    const vsIcon = document.getElementById('vs-icon');

    cardLeft.className = "card-container glass cs-card";
    cardRight.className = "card-container glass real-card";
    vsIcon.className = "vs-badge";

    // Asignar datos a la izquierda
    const imgLeft = document.getElementById('img-left');
    const wrapLeft = imgLeft.closest('.image-wrapper');
    imgLeft.src = currentPair[0].image;
    applyImageGlow(imgLeft, wrapLeft, currentPair[0].type);
    document.getElementById('name-left').textContent = currentPair[0].name.toUpperCase();
    document.getElementById('tag-left').textContent = currentPair[0].type === 'skin' ? 'SKIN DE CS2' : 'VIDA REAL';
    document.getElementById('tag-left').className = `item-tag ${currentPair[0].type}`;
    document.getElementById('price-left').textContent = '?';
    document.getElementById('price-left').classList.remove('revealed');
    document.getElementById('desc-left').textContent = currentPair[0].description;
    document.getElementById('desc-left').style.opacity = 0;

    // Asignar datos a la derecha
    const imgRight = document.getElementById('img-right');
    const wrapRight = imgRight.closest('.image-wrapper');
    imgRight.src = currentPair[1].image;
    applyImageGlow(imgRight, wrapRight, currentPair[1].type);
    document.getElementById('name-right').textContent = currentPair[1].name.toUpperCase();
    document.getElementById('tag-right').textContent = currentPair[1].type === 'skin' ? 'SKIN DE CS2' : 'VIDA REAL';
    document.getElementById('tag-right').className = `item-tag ${currentPair[1].type}`;
    document.getElementById('price-right').textContent = '?';
    document.getElementById('price-right').classList.remove('revealed');
    document.getElementById('desc-right').textContent = currentPair[1].description;
    document.getElementById('desc-right').style.opacity = 0;

    // Cagado hint
    const hintEl = document.getElementById('price-hint');
    if (hintEl) {
        if (easyMode) {
            const maxPrice = Math.max(currentPair[0].price, currentPair[1].price);
            const minPrice = Math.min(currentPair[0].price, currentPair[1].price);
            const hintRange = maxPrice > 1000 ? 'más de 1000€' : maxPrice > 100 ? 'entre 100€ y 1000€' : 'menos de 100€';
            hintEl.textContent = `💡 Pista: El más caro cuesta ${hintRange}`;
            hintEl.classList.add('show');
        } else {
            hintEl.classList.remove('show');
        }
    }

    // Habilitar clics
    document.getElementById('btn-left').disabled = false;
    document.getElementById('btn-right').disabled = false;
    document.getElementById('btn-next').classList.remove('show');
}

// Manejar la selección del usuario
function selectOption(selectedIdx) {
    if (!gameActive) return;
    gameActive = false;

    playSound('click');

    const otherIdx = selectedIdx === 0 ? 1 : 0;
    const selectedItem = currentPair[selectedIdx];
    const otherItem = currentPair[otherIdx];

    // Deshabilitar clics
    document.getElementById('btn-left').disabled = true;
    document.getElementById('btn-right').disabled = true;

    // Animación de conteo del precio izquierda
    animatePrice('price-left', currentPair[0].price);
    animatePrice('price-right', currentPair[1].price);

    // Revelar descripciones con transición
    document.getElementById('desc-left').style.opacity = 0.85;
    document.getElementById('desc-right').style.opacity = 0.85;

    const isCorrect = selectedItem.price > otherItem.price;

    const selectedBtn = selectedIdx === 0 ? document.getElementById('card-left') : document.getElementById('card-right');
    const otherBtn = selectedIdx === 0 ? document.getElementById('card-right') : document.getElementById('card-left');
    const vsIcon = document.getElementById('vs-icon');

    if (isCorrect) {
        correctCount++;
        streak++;
        score += 100 + streak * 10;
        if (streak > highestStreak) {
            highestStreak = streak;
            localStorage.setItem('max-streak', highestStreak);
            document.getElementById('high-score').textContent = highestStreak;
        }
        selectedBtn.classList.add('correct');
        otherBtn.classList.add('faded');
        vsIcon.classList.add('success');
        setTimeout(() => playSound('success'), 200);
    } else {
        incorrectCount++;
        streak = 0;
        selectedBtn.classList.add('wrong');
        otherBtn.classList.add('correct');
        vsIcon.classList.add('fail');
        setTimeout(() => playSound('fail'), 200);
    }

    // Actualizar marcadores
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    updateCounters();

    // Mostrar botón de siguiente ronda
    setTimeout(() => {
        document.getElementById('btn-next').classList.add('show');
    }, 1200);
}

// Animar el contador del precio
function animatePrice(elementId, targetValue) {
    const el = document.getElementById(elementId);
    el.classList.add('revealed');
    let start = 0;
    const duration = 1000; // ms
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cuadrático
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * targetValue);

        el.textContent = formatPrice(currentValue);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = formatPrice(targetValue);
        }
    }
    requestAnimationFrame(update);
}

// Event Listeners e Inicio
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('high-score').textContent = highestStreak;

    // Accordion
    const normalToggle = document.getElementById('normalModeToggle');
    const normalCard = document.getElementById('normalModeCard');
    if (normalToggle && normalCard) {
        normalToggle.addEventListener('click', () => {
            playSound('click');
            const wasOpen = normalCard.classList.contains('open');
            document.querySelectorAll('.mode-card.open').forEach(c => c.classList.remove('open'));
            if (!wasOpen) normalCard.classList.add('open');
        });
    }

    // Difficulty buttons
    const startEasyBtn = document.getElementById('startEasyBtn');
    const startNormalBtn = document.getElementById('startNormalBtn');
    if (startEasyBtn) startEasyBtn.addEventListener('click', () => { playSound('click'); easyMode = true; startEasyBtn.classList.add('active'); startNormalBtn.classList.remove('active'); });
    if (startNormalBtn) startNormalBtn.addEventListener('click', () => { playSound('click'); easyMode = false; startNormalBtn.classList.add('active'); startEasyBtn.classList.remove('active'); });

    // Info button
    document.querySelectorAll('.info-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('infoModal').classList.add('show');
            playSound('click');
        });
    });

    // Start game
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            playSound('success');
            document.getElementById('startScreen').classList.add('hide');
            document.body.style.overflow = 'auto';
            TOTAL_ROUNDS = easyMode ? 20 : 50;
            nextRound();
        });
    }

    // Hint element
    let hintEl = document.createElement('div');
    hintEl.className = 'price-hint';
    hintEl.id = 'price-hint';
    const arena = document.querySelector('.arena');
    if (arena) arena.parentNode.insertBefore(hintEl, arena.nextSibling);

    document.getElementById('btn-left').addEventListener('click', () => selectOption(0));
    document.getElementById('btn-right').addEventListener('click', () => selectOption(1));
    document.getElementById('btn-left').addEventListener('mouseenter', () => { if (gameActive) playSound('click'); });
    document.getElementById('btn-right').addEventListener('mouseenter', () => { if (gameActive) playSound('click'); });
    document.getElementById('btn-next').addEventListener('click', () => {
        playSound('click');
        nextRound();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        playSound('click');
        score = 0;
        streak = 0;
        roundCount = 0;
        correctCount = 0;
        incorrectCount = 0;
        skinQueue = [];
        realQueue = [];
        gameStartTime = null;
        document.getElementById('score').textContent = '0';
        document.getElementById('streak').textContent = '0';
        document.getElementById('victory-overlay').classList.remove('show');
        document.getElementById('startScreen').classList.remove('hide');
        document.body.style.overflow = 'hidden';
    });

    // Finalize button — save score to leaderboard
    document.getElementById('btn-finalize').addEventListener('click', () => {
        playSound('click');
        const elapsed = gameStartTime ? ((Date.now() - gameStartTime) / 1000).toFixed(1) : null;
        const total = correctCount + incorrectCount;
        const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        RickyLeaderboard.save('mascaro', {
            score,
            difficulty: easyMode ? 'easy' : 'normal',
            time: elapsed ? parseFloat(elapsed) : null,
            correct: correctCount,
            total,
            percent: pct,
            maxStreak: highestStreak
        }, () => {
            document.getElementById('victory-overlay').classList.remove('show');
            document.getElementById('startScreen').classList.remove('hide');
            document.body.style.overflow = 'hidden';
            score = 0; streak = 0; roundCount = 0; correctCount = 0; incorrectCount = 0;
            skinQueue = []; realQueue = []; gameStartTime = null;
            document.getElementById('score').textContent = '0';
            document.getElementById('streak').textContent = '0';
            renderLeaderboard();
        });
    });

    // Leaderboard toggle
    document.getElementById('leaderboardToggle').addEventListener('click', () => {
        playSound('click');
        const panel = document.getElementById('leaderboardPanel');
        panel.classList.toggle('visible');
    });
    renderLeaderboard();
});

function renderLeaderboard() {
    RickyLeaderboard.render('leaderboardContainer', 'mascaro', {
        title: '<img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Top — ¿Qué es más caro?',
        columns: ['rank', 'name', 'correct', 'total', 'percent', 'time', 'difficulty', 'date'],
        difficulties: ['easy', 'normal'],
        maxRows: 20
    });
}

// Hover sounds en TODOS los botones y enlaces
const _hoveredEls = new WeakSet();
document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn, input[type="text"], .card-button');
    if (el && !_hoveredEls.has(el)) { _hoveredEls.add(el); playSound('click'); }
});
document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('button, a.pill-link, a.icon-btn, input[type="text"], .card-button');
    if (el) _hoveredEls.delete(el);
});

// Info modal content
const MASCARO_INFO_HTML =
    '<h3>🆕 ¡Bienvenido a ¿Qué es más caro?</h3>' +
    '<p>Un juego donde tienes que <span class="upd-highlight">adivinar qué skin de Counter Strike cuesta más</span> de entre dos opciones.</p>' +
    '<hr class="upd-sep">' +
    '<h3>🎮 Cómo se juega</h3>' +
    '<ul>' +
    '<li>Se te muestran 2 skins de Counter Strike lado a lado</li>' +
    '<li>Escribe cuál crees que cuesta más</li>' +
    '<li>Cada acierto suma puntos</li>' +
    '<li>¡La racha de aciertos seguidos da bonus!</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3>😎 Modos</h3>' +
    '<ul>' +
    '<li><span class="upd-highlight">Cagado</span> — 3 rondas, más tiempo para decidir</li>' +
    '<li><span class="upd-highlight">Normal</span> — 5 rondas, ritmo estándar</li>' +
    '</ul>' +
    '<hr class="upd-sep">' +
    '<h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>' +
    '<p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>';

document.querySelectorAll('#openUpdatesBtn, #startOpenUpdatesBtn').forEach(btn => {
    btn.addEventListener('click', () => { playSound('click'); RickyUpdates.forceShow(MASCARO_INFO_HTML); });
});

// Updates modal
RickyUpdates.show('mascaro', 'v2.0', `
    <h3>🆕 ¡Bienvenido a ¿Qué es más caro?</h3>
    <p>Un juego donde tienes que <span class="upd-highlight">adivinar qué skin de Counter Strike cuesta más</span> de entre dos opciones.</p>
    <hr class="upd-sep">
    <h3>🎮 Cómo se juega</h3>
    <ul>
        <li>Se te muestran 2 skins de Counter Strike lado a lado</li>
        <li>Escribe cuál crees que cuesta más</li>
        <li>Cada acierto suma puntos</li>
        <li>¡La racha de aciertos seguidos da bonus!</li>
    </ul>
    <hr class="upd-sep">
    <h3>😎 Modos</h3>
    <ul>
        <li><span class="upd-highlight">Cagado</span> — 3 rondas, más tiempo para decidir</li>
        <li><span class="upd-highlight">Normal</span> — 5 rondas, ritmo estándar</li>
    </ul>
    <hr class="upd-sep">
    <h3><img src="../Iconos/Trofeo leaderboard.png" alt="" class="rlb-icon-img"> Leaderboard</h3>
    <p>Compite con otros jugadores. ¡Dale a <span class="upd-highlight">¡Entendido!</span>!</p>
`);
