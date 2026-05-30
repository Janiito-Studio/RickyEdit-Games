// Base de datos de 50 ítems para el juego (25 Skins de CS2 + 25 Vida Real)
// Imágenes locales almacenadas en images/skins/ e images/real/
const items = [
    // --- 25 SKINS DE CS2 ---
    {
        name: "AK-47 | Case Hardened",
        price: 45,
        type: "skin",
        image: "images/skins/ak47_case_hardened.png",
        description: "Una de las skins más icónicas de CS2. Los patrones Blue Gem pueden valer más de 1 millón."
    },
    {
        name: "AWP | Dragon Lore",
        price: 8500,
        type: "skin",
        image: "images/skins/awp_dragon_lore.png",
        description: "La reina indiscutible de las skins de AWP. Con su dragón grabado escupiendo fuego, símbolo de estatus en CS2."
    },
    {
        name: "Bowie Knife | Lore",
        price: 280,
        type: "skin",
        image: "images/skins/bowie_knife_lore.png",
        description: "Un cuchillo Bowie dorado con grabados rúnicos inspirado en la clásica Dragon Lore."
    },
    {
        name: "M9 Bayonet | Crimson Web",
        price: 1200,
        type: "skin",
        image: "images/skins/m9_bayonet_crimson_web.png",
        description: "Patrón de telaraña roja sobre fondo negro. Los especímenes con el nudo centrado son los más valiosos."
    },
    {
        name: "Glock-18 | Fade",
        price: 620,
        type: "skin",
        image: "images/skins/glock18_fade.png",
        description: "Pistola Glock-18 pintada con un degradado translúcido que va del violeta al amarillo."
    },
    {
        name: "Karambit | Case Hardened",
        price: 900,
        type: "skin",
        image: "images/skins/karambit_case_hardened.png",
        description: "El Santo Grial de los cuchillos de CS2. Con la cara de juego totalmente azul, su dueño rechazó ofertas millonarias."
    },
    {
        name: "Butterfly Knife | Doppler Zafiro",
        price: 12000,
        type: "skin",
        image: "images/skins/butterfly_knife_doppler_zafiro.png",
        description: "Un cuchillo de mariposa con el patrón Doppler en fase Zafiro. De color azul brillante cristalino."
    },
    {
        name: "M4A4 | Howl",
        price: 6000,
        type: "skin",
        image: "images/skins/m4a4_howl.png",
        description: "La única skin de contrabando del juego. Su diseño original fue retirado tras una disputa de derechos de autor."
    },
    {
        name: "AK-47 | Redline",
        price: 18,
        type: "skin",
        image: "images/skins/ak47_redline.png",
        description: "Una clásica skin minimalista de fibra de carbono negra con líneas decorativas de color rojo."
    },
    {
        name: "Desert Eagle | Blaze",
        price: 380,
        type: "skin",
        image: "images/skins/desert_eagle_blaze.png",
        description: "Pintada con llamas de aerógrafo sobre una base negra. Una skin icónica y clásica."
    },
    {
        name: "AWP | Gungnir",
        price: 6500,
        type: "skin",
        image: "images/skins/awp_gungnir.png",
        description: "Inspirada en la lanza de Odín de la mitología nórdica, con hermosos grabados en tonos azulados."
    },
    {
        name: "AK-47 | Wild Lotus",
        price: 5500,
        type: "skin",
        image: "images/skins/ak47_wild_lotus.png",
        description: "Decorada con flores de loto de color naranja brillante sobre un fondo verde oliva."
    },
    {
        name: "Karambit | Doppler",
        price: 850,
        type: "skin",
        image: "images/skins/karambit_doppler.png",
        description: "Un impresionante cuchillo Karambit Doppler con tonos oscuros y destellos púrpuras."
    },
    {
        name: "M4A1-S | Welcome to the Jungle",
        price: 1800,
        type: "skin",
        image: "images/skins/m4a1s_welcome_to_the_jungle.png",
        description: "Una skin temática de jungla con una serpiente dorada grabada a lo largo del silenciador."
    },
    {
        name: "AWP | Asiimov",
        price: 75,
        type: "skin",
        image: "images/skins/awp_asiimov.png",
        description: "Diseño futurista de color blanco, naranja y negro que rinde tributo a las obras de Isaac Asimov."
    },
    {
        name: "AK-47 | Vulcan",
        price: 220,
        type: "skin",
        image: "images/skins/ak47_vulcan.png",
        description: "Skin de temática deportiva con líneas limpias de colores gris, celeste, negro y blanco."
    },
    {
        name: "USP-S | Kill Confirmed",
        price: 22,
        type: "skin",
        image: "images/skins/usps_kill_confirmed.png",
        description: "Muestra el impacto de una bala atravesando una calavera con salpicaduras de pintura roja."
    },
    {
        name: "Karambit | Fade",
        price: 1100,
        type: "skin",
        image: "images/skins/karambit_fade.png",
        description: "Pintado con un degradado translúcido de colores rosa, oro, violeta y amarillo."
    },
    {
        name: "M9 Bayonet | Lore",
        price: 950,
        type: "skin",
        image: "images/skins/m9_bayonet_lore.png",
        description: "Un cuchillo M9 dorado con un patrón de nudos rúnicos grabados en la hoja."
    },
    {
        name: "Sport Gloves | Vice",
        price: 3200,
        type: "skin",
        image: "images/skins/sport_gloves_vice.png",
        description: "Guantes deportivos de color rosa y azul de la colección Clutch. Muy codiciados en la comunidad."
    },
    {
        name: "Specialist Gloves | Crimson Kimono",
        price: 1600,
        type: "skin",
        image: "images/skins/specialist_gloves_crimson_kimono.png",
        description: "Guantes de especialista con un patrón tradicional de color rojo carmesí y negro."
    },
    {
        name: "Desert Eagle | Printstream",
        price: 65,
        type: "skin",
        image: "images/skins/desert_eagle_printstream.png",
        description: "Acabado de color blanco perla nacarado con inscripciones informáticas y pequeños dibujos geométricos."
    },
    {
        name: "AK-47 | Slate",
        price: 3,
        type: "skin",
        image: "images/skins/ak47_slate.png",
        description: "Una de las skins más simples y populares, completamente pintada de color negro mate."
    },
    {
        name: "AWP | Atheris",
        price: 5,
        type: "skin",
        image: "images/skins/awp_atheris.png",
        description: "Presenta una víbora de arbusto de color verde brillante y azul sobre un fondo negro."
    },
    {
        name: "AWP | Hyper Beast",
        price: 28,
        type: "skin",
        image: "images/skins/awp_hyper_beast.png",
        description: "Decorada con una criatura monstruosa pintada con colores psicodélicos e intensos."
    },

    // --- 25 VIDA REAL ---
    {
        name: "Camiseta Oficial de España",
        price: 90,
        type: "real",
        image: "images/real/camiseta_espana.png",
        description: "La equipación deportiva oficial de la selección española de fútbol. PVP en tienda oficial."
    },
    {
        name: "PlayStation 5 Pro",
        price: 700,
        type: "real",
        image: "images/real/playstation_5_pro.png",
        description: "Consola de última generación de Sony con alto rendimiento de gráficos y tasa de refresco fluida."
    },
    {
        name: "iPhone 16 Pro Max",
        price: 1319,
        type: "real",
        image: "images/real/iphone_15_pro_max.png",
        description: "Teléfono premium fabricado en titanio aeroespacial y con las cámaras más avanzadas de Apple."
    },
    {
        name: "Rolex Submariner Date",
        price: 10300,
        type: "real",
        image: "images/real/rolex_submariner_date.png",
        description: "El icónico reloj de buzo de lujo, un clásico indiscutible del prestigio suizo. Precio de lista oficial."
    },
    {
        name: "Tesla Model 3 (base)",
        price: 41990,
        type: "real",
        image: "images/real/tesla_model_3.png",
        description: "Coche eléctrico de gran autonomía con funciones avanzadas de piloto automático. Precio en España."
    },
    {
        name: "Menú Hamburguesa Completo",
        price: 12,
        type: "real",
        image: "images/real/hamburguesa_completa.png",
        description: "Menú con hamburguesa clásica, patatas fritas crujientes y refresco mediano en cadena popular."
    },
    {
        name: "Mansión de Lujo en Marbella",
        price: 4500000,
        type: "real",
        image: "images/real/mansion_marbella.png",
        description: "Mansión de lujo con piscina infinity, vistas al mar Mediterráneo y múltiples habitaciones."
    },
    {
        name: "Patinete Eléctrico Premium",
        price: 799,
        type: "real",
        image: "images/real/patinete_electrico.png",
        description: "Segway Ninebot Max, patinete de movilidad urbana de larga duración de batería."
    },
    {
        name: "Billete de Metro Sencillo",
        price: 1,
        type: "real",
        image: "images/real/billete_metro_sencillo.png",
        description: "Un billete de ida simple para viajar en la red metropolitana de Madrid. Con bonificación."
    },
    {
        name: "Viaje a Japón Todo Incluido",
        price: 4200,
        type: "real",
        image: "images/real/viaje_japon.png",
        description: "Vuelos, hoteles tradicionales, pases de tren bala y guía local en Tokio y Kioto. 10 días."
    },
    {
        name: "Isla Privada en las Bahamas",
        price: 7000000,
        type: "real",
        image: "images/real/isla_privada.png",
        description: "Una pequeña porción de paraíso tropical de arena blanca y agua cristalina con absoluta privacidad."
    },
    {
        name: "Helicóptero Robinson R44",
        price: 380000,
        type: "real",
        image: "images/real/helicoptero.png",
        description: "Helicóptero ligero monomotor de cuatro plazas muy popular a nivel mundial. Precio nuevo."
    },
    {
        name: "Entradas VIP Final Champions",
        price: 5000,
        type: "real",
        image: "images/real/entradas_champions.png",
        description: "Acceso a la zona de hospitalidad exclusiva, catering y la mejor perspectiva del estadio."
    },
    {
        name: "Refresco en el Cine",
        price: 4,
        type: "real",
        image: "images/real/refresco_cine.png",
        description: "Un clásico refresco con gas frío servido en vaso grande en la barra del cine."
    },
    {
        name: "Lamborghini Huracán Evo",
        price: 220000,
        type: "real",
        image: "images/real/lamborghini_huracan_evo.png",
        description: "Superdeportivo italiano con motor V10 atmosférico de 640 CV y espectacular aceleración."
    },
    {
        name: "Cena Restaurante 3 Estrellas Michelin",
        price: 350,
        type: "real",
        image: "images/real/cena_michelin.png",
        description: "Menú degustación maridado de alta cocina en uno de los mejores locales culinarios del mundo."
    },
    {
        name: "Yate de Lujo (20 metros)",
        price: 800000,
        type: "real",
        image: "images/real/yate_lujo.png",
        description: "Yate de recreo de segunda mano con camarotes de lujo, solárium y motor potente."
    },
    {
        name: "Teclado Mecánico Custom Gamer",
        price: 280,
        type: "real",
        image: "images/real/teclado_mecanico.png",
        description: "Teclado personalizado con interruptores mecánicos engrasados y teclas premium de doble disparo."
    },
    {
        name: "Bolígrafo BIC Clásico",
        price: 1,
        type: "real",
        image: "images/real/boligrafo_bic.png",
        description: "El bolígrafo más vendido de la historia. Precio en papelería normal."
    },
    {
        name: "MacBook Pro M4 Max",
        price: 3999,
        type: "real",
        image: "images/real/macbook_pro.png",
        description: "Ordenador portátil de alta gama con el chip M4 Max de Apple para profesionales."
    },
    {
        name: "Suscripción 1 año Netflix Premium",
        price: 216,
        type: "real",
        image: "images/real/netflix_premium.png",
        description: "12 meses de acceso ilimitado a películas y series en 4K. Plan premium en España 2025."
    },
    {
        name: "Bicicleta de Montaña Profesional",
        price: 4500,
        type: "real",
        image: "images/real/bicicleta_montana.png",
        description: "Trek Fuel EX 8 con doble suspensión, cuadro de aluminio y frenos hidráulicos Shimano."
    },
    {
        name: "Café Latte Grande en Cafetería",
        price: 5,
        type: "real",
        image: "images/real/cafe_latte.png",
        description: "Café espresso de especialidad batido con leche vaporizada en vaso alto en cafetería de barrio."
    },
    {
        name: "Casa Adosada en Madrid",
        price: 420000,
        type: "real",
        image: "images/real/casa_adosada.png",
        description: "Chalet adosado en las afueras de Madrid con jardín pequeño y plaza de aparcamiento."
    },
    {
        name: "Auriculares AirPods Pro 2",
        price: 279,
        type: "real",
        image: "images/real/airpods_pro.png",
        description: "Auriculares inalámbricos con cancelación activa de ruido de segunda generación y audio espacial."
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
const TOTAL_ROUNDS = 50;

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
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

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

// Obtener un par aleatorio asegurando que:
// 1. Uno sea Skin de CS2 y otro sea de la Vida Real.
// 2. No sean obvios (los precios deben estar en un rango de magnitud comparable, factor máx 15x).
// 3. No se repitan consecutivamente, utilizando colas mezcladas sin repetición.
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
    gameActive = true;
    currentPair = getRandomPair();
    updateCounters();

    // Resetear clases de animación y estados
    const cardLeft = document.getElementById('card-left');
    const cardRight = document.getElementById('card-right');
    const vsIcon = document.getElementById('vs-icon');

    cardLeft.className = "card-container glass cs-card";
    cardRight.className = "card-container glass real-card";
    vsIcon.className = "vs-badge";

    // Asignar datos a la izquierda
    document.getElementById('img-left').src = currentPair[0].image;
    document.getElementById('name-left').textContent = currentPair[0].name.toUpperCase();
    document.getElementById('tag-left').textContent = currentPair[0].type === 'skin' ? 'SKIN DE CS2' : 'VIDA REAL';
    document.getElementById('tag-left').className = `item-tag ${currentPair[0].type}`;
    document.getElementById('price-left').textContent = '?';
    document.getElementById('price-left').classList.remove('revealed');
    document.getElementById('desc-left').textContent = currentPair[0].description;
    document.getElementById('desc-left').style.opacity = 0;

    // Asignar datos a la derecha
    document.getElementById('img-right').src = currentPair[1].image;
    document.getElementById('name-right').textContent = currentPair[1].name.toUpperCase();
    document.getElementById('tag-right').textContent = currentPair[1].type === 'skin' ? 'SKIN DE CS2' : 'VIDA REAL';
    document.getElementById('tag-right').className = `item-tag ${currentPair[1].type}`;
    document.getElementById('price-right').textContent = '?';
    document.getElementById('price-right').classList.remove('revealed');
    document.getElementById('desc-right').textContent = currentPair[1].description;
    document.getElementById('desc-right').style.opacity = 0;

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

    document.getElementById('btn-left').addEventListener('click', () => selectOption(0));
    document.getElementById('btn-right').addEventListener('click', () => selectOption(1));
    document.getElementById('btn-next').addEventListener('click', () => {
        playSound('click');
        nextRound();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        score = 0;
        streak = 0;
        roundCount = 0;
        correctCount = 0;
        incorrectCount = 0;
        skinQueue = [];
        realQueue = [];
        document.getElementById('score').textContent = '0';
        document.getElementById('streak').textContent = '0';
        document.getElementById('victory-overlay').classList.remove('show');
        nextRound();
    });

    nextRound();
});
