/**
 * ============================================
 * SISTEMA SOLAR INTERATIVO - JAVASCRIPT
 * ============================================
 *
 * Funcionalidades:
 * - Geração procedural de estrelas de fundo
 * - Geração do cinturão de asteroides
 * - Controles de animação (play/pause, velocidade)
 * - Painel de informações interativo
 * - Zoom e Rotação 3D com mouse e controles UI
 */

// ============================================
// DADOS DOS PLANETAS
// ============================================
const planetData = {
    mercury: {
        name: "Mercúrio",
        distance: "57,9 milhões km",
        diameter: "4.879 km",
        period: "88 dias terrestres",
        curiosity: "É o planeta mais próximo do Sol e o menor do Sistema Solar. Um dia em Mercúrio (do nascer ao pôr do sol) dura cerca de 176 dias terrestres!"
    },
    venus: {
        name: "Vênus",
        distance: "108,2 milhões km",
        diameter: "12.104 km",
        period: "225 dias terrestres",
        curiosity: "É o planeta mais quente do Sistema Solar, com temperaturas que chegam a 462°C devido ao efeito estufa extremo. Gira no sentido oposto aos outros planetas!"
    },
    earth: {
        name: "Terra",
        distance: "149,6 milhões km (1 UA)",
        diameter: "12.742 km",
        period: "365,25 dias",
        curiosity: "É o único planeta conhecido que abriga vida. Possui 71% de sua superfície coberta por água e uma atmosfera rica em oxigênio e nitrogênio."
    },
    mars: {
        name: "Marte",
        distance: "227,9 milhões km",
        diameter: "6.779 km",
        period: "687 dias terrestres",
        curiosity: "Conhecido como o 'Planeta Vermelho' devido ao óxido de ferro em sua superfície. Possui o maior vulcão do Sistema Solar, o Monte Olimpo."
    },
    jupiter: {
        name: "Júpiter",
        distance: "778,5 milhões km",
        diameter: "139.820 km",
        period: "11,9 anos terrestres",
        curiosity: "É o maior planeta do Sistema Solar, com mais de 1.300 Terras cabendo dentro dele. Sua Grande Mancha Vermelha é uma tempestade que dura há séculos!"
    },
    saturn: {
        name: "Saturno",
        distance: "1,4 bilhões km",
        diameter: "116.460 km",
        period: "29,5 anos terrestres",
        curiosity: "Famoso por seus belos anéis compostos principalmente de gelo e rocha. É tão leve que flutuaria na água se houvesse um oceano grande o suficiente!"
    },
    uranus: {
        name: "Urano",
        distance: "2,9 bilhões km",
        diameter: "50.724 km",
        period: "84 anos terrestres",
        curiosity: "Gira praticamente deitado em sua órbita, com uma inclinação de 98°. Sua cor azul-esverdeada vem do metano em sua atmosfera."
    },
    neptune: {
        name: "Netuno",
        distance: "4,5 bilhões km",
        diameter: "49.244 km",
        period: "165 anos terrestres",
        curiosity: "É o planeta mais distante do Sol e possui os ventos mais rápidos do Sistema Solar, chegando a 2.100 km/h. Foi descoberto por cálculos matemáticos antes de ser observado!"
    }
};

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
let isPaused = false;
let currentSpeed = 'normal';

// Estado do Zoom e Rotação
let zoomLevel = 1.0;
let angleX = 0;
let angleY = 0;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;

// Estado do Drag
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
const DRAG_SENSITIVITY = 0.5;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    generateStars();
    generateAsteroidBelt();
    setupPlanetInteractions();
    setupKeyboardControls();
    setupZoomControls();
    setupDragControls();
    updateTransform();
});

// ============================================
// GERAÇÃO DE ESTRELAS
// ============================================
function generateStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Posição aleatória
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Tamanho aleatório
        const size = Math.random() * 2 + 1;

        // Atraso de animação aleatório
        const delay = Math.random() * 3;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }
}

// ============================================
// GERAÇÃO DO CINTURÃO DE ASTEROIDES
// ============================================
function generateAsteroidBelt() {
    const asteroidBelt = document.querySelector('.asteroid-belt');
    const asteroidCount = 80;

    for (let i = 0; i < asteroidCount; i++) {
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';

        // Posição aleatória em círculo
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const radius = 50 + Math.random() * 40; // Variação no raio

        const x = 50 + (radius * Math.cos(angle) / 3.8);
        const y = 50 + (radius * Math.sin(angle) / 3.8);

        // Tamanho aleatório
        const size = Math.random() * 2 + 1;

        // Opacidade aleatória
        const opacity = Math.random() * 0.5 + 0.3;

        asteroid.style.left = `${x}%`;
        asteroid.style.top = `${y}%`;
        asteroid.style.width = `${size}px`;
        asteroid.style.height = `${size}px`;
        asteroid.style.opacity = opacity;

        asteroidBelt.appendChild(asteroid);
    }
}

// ============================================
// INTERAÇÃO COM PLANETAS
// ============================================
function setupPlanetInteractions() {
    const planets = document.querySelectorAll('.planet');

    planets.forEach(planet => {
        planet.addEventListener('click', function(e) {
            e.stopPropagation();
            const planetKey = this.closest('.orbit').dataset.planet;
            showPlanetInfo(planetKey);
        });
    });

    // Fechar painel ao clicar fora
    document.addEventListener('click', function(e) {
        const infoPanel = document.getElementById('info-panel');
        if (!infoPanel.classList.contains('hidden') &&
            !infoPanel.contains(e.target) &&
            !e.target.classList.contains('planet')) {
            closeInfoPanel();
        }
    });
}

// ============================================
// EXIBIR INFORMAÇÕES DO PLANETA
// ============================================
function showPlanetInfo(planetKey) {
    const data = planetData[planetKey];
    if (!data) return;

    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('planet-distance').textContent = data.distance;
    document.getElementById('planet-diameter').textContent = data.diameter;
    document.getElementById('planet-period').textContent = data.period;
    document.getElementById('planet-curiosity').textContent = data.curiosity;

    const infoPanel = document.getElementById('info-panel');
    infoPanel.classList.remove('hidden');
}

// ============================================
// FECHAR PAINEL DE INFORMAÇÕES
// ============================================
function closeInfoPanel() {
    const infoPanel = document.getElementById('info-panel');
    infoPanel.classList.add('hidden');
}

// ============================================
// CONTROLES DE ANIMAÇÃO
// ============================================
function toggleAnimation() {
    const solarSystem = document.querySelector('.solar-system');
    const btnPause = document.getElementById('btn-pause');

    isPaused = !isPaused;

    if (isPaused) {
        solarSystem.classList.add('paused');
        btnPause.innerHTML = '<span class="icon">▶️</span> Continuar';
    } else {
        solarSystem.classList.remove('paused');
        btnPause.innerHTML = '<span class="icon">⏸️</span> Pausar';
    }
}

// ============================================
// CONTROLE DE VELOCIDADE
// ============================================
function setSpeed(speed) {
    const solarSystem = document.querySelector('.solar-system');
    const speedButtons = document.querySelectorAll('.speed-btn');

    // Remover classes de velocidade anteriores
    solarSystem.classList.remove('speed-slow', 'speed-normal', 'speed-fast');

    // Adicionar nova classe de velocidade
    solarSystem.classList.add(`speed-${speed}`);
    currentSpeed = speed;

    // Atualizar botões ativos
    speedButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === getSpeedLabel(speed)) {
            btn.classList.add('active');
        }
    });
}

function getSpeedLabel(speed) {
    const labels = {
        'slow': 'lenta',
        'normal': 'normal',
        'fast': 'rápida'
    };
    return labels[speed] || speed;
}

// ============================================
// CONTROLES DE ZOOM
// ============================================
function setupZoomControls() {
    // Zoom via scroll do mouse
    const wrapper = document.getElementById('solar-system-wrapper');

    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();

        // Determinar direção do scroll
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        adjustZoom(delta);
    }, { passive: false });
}

function adjustZoom(delta) {
    // Aplicar o delta ao zoom atual
    let newZoom = zoomLevel + delta;

    // Limitar entre MIN_ZOOM e MAX_ZOOM
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

    // Arredondar para 1 casa decimal
    newZoom = Math.round(newZoom * 10) / 10;

    // Só atualizar se mudou
    if (newZoom !== zoomLevel) {
        zoomLevel = newZoom;
        updateTransform();
        updateZoomDisplay();
    }
}

function updateZoomDisplay() {
    const zoomDisplay = document.getElementById('zoom-level');
    if (zoomDisplay) {
        zoomDisplay.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
}

// ============================================
// CONTROLES DE ROTAÇÃO
// ============================================
function updateRotation() {
    const angleXInput = document.getElementById('angle-x');
    const angleYInput = document.getElementById('angle-y');

    if (angleXInput) {
        angleX = parseInt(angleXInput.value);
        document.getElementById('angle-x-value').textContent = `${angleX}°`;
    }

    if (angleYInput) {
        angleY = parseInt(angleYInput.value);
        document.getElementById('angle-y-value').textContent = `${angleY}°`;
    }

    updateTransform();
}

function updateTransform() {
    const solarSystem = document.querySelector('.solar-system');

    // Aplicar transformações: rotateX, rotateY, scale
    // Ordem importante: primeiro rotação, depois escala
    solarSystem.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(${zoomLevel})`;
}

// ============================================
// CONTROLES DE DRAG (ARRASTAR PARA ROTACIONAR)
// ============================================
function setupDragControls() {
    const wrapper = document.getElementById('solar-system-wrapper');

    wrapper.addEventListener('mousedown', function(e) {
        // Ignorar se clicou em um planeta ou no painel de info
        if (e.target.classList.contains('planet') ||
            e.target.closest('.info-panel') ||
            e.target.closest('.controls') ||
            e.target.closest('.view-controls')) {
            return;
        }

        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        wrapper.classList.add('dragging');

        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;

        // Atualizar ângulos baseado no movimento do mouse
        // Movimento horizontal afeta ângulo Y (rotação horizontal)
        // Movimento vertical afeta ângulo X (inclinação vertical)
        angleY = (angleY + deltaX * DRAG_SENSITIVITY) % 360;
        if (angleY < 0) angleY += 360;

        angleX = Math.max(-45, Math.min(45, angleX - deltaY * DRAG_SENSITIVITY));

        // Atualizar sliders
        const angleXInput = document.getElementById('angle-x');
        const angleYInput = document.getElementById('angle-y');

        if (angleXInput) {
            angleXInput.value = Math.round(angleX);
            document.getElementById('angle-x-value').textContent = `${Math.round(angleX)}°`;
        }

        if (angleYInput) {
            angleYInput.value = Math.round(angleY);
            document.getElementById('angle-y-value').textContent = `${Math.round(angleY)}°`;
        }

        updateTransform();

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            wrapper.classList.remove('dragging');
        }
    });

    // Suporte a touch para dispositivos móveis
    wrapper.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('planet') ||
            e.target.closest('.info-panel') ||
            e.target.closest('.controls') ||
            e.target.closest('.view-controls')) {
            return;
        }

        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;

        const deltaX = e.touches[0].clientX - lastMouseX;
        const deltaY = e.touches[0].clientY - lastMouseY;

        angleY = (angleY + deltaX * DRAG_SENSITIVITY) % 360;
        if (angleY < 0) angleY += 360;

        angleX = Math.max(-45, Math.min(45, angleX - deltaY * DRAG_SENSITIVITY));

        const angleXInput = document.getElementById('angle-x');
        const angleYInput = document.getElementById('angle-y');

        if (angleXInput) {
            angleXInput.value = Math.round(angleX);
            document.getElementById('angle-x-value').textContent = `${Math.round(angleX)}°`;
        }

        if (angleYInput) {
            angleYInput.value = Math.round(angleY);
            document.getElementById('angle-y-value').textContent = `${Math.round(angleY)}°`;
        }

        updateTransform();

        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;

        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// ============================================
// RESETAR VISÃO
// ============================================
function resetView() {
    zoomLevel = 1.0;
    angleX = 0;
    angleY = 0;

    // Atualizar sliders
    const angleXInput = document.getElementById('angle-x');
    const angleYInput = document.getElementById('angle-y');

    if (angleXInput) {
        angleXInput.value = 0;
        document.getElementById('angle-x-value').textContent = '0°';
    }

    if (angleYInput) {
        angleYInput.value = 0;
        document.getElementById('angle-y-value').textContent = '0°';
    }

    updateTransform();
    updateZoomDisplay();
}

// ============================================
// CONTROLES DE TECLADO
// ============================================
function setupKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case ' ': // Espaço - pausar/continuar
                e.preventDefault();
                toggleAnimation();
                break;
            case '1': // Velocidade lenta
                setSpeed('slow');
                break;
            case '2': // Velocidade normal
                setSpeed('normal');
                break;
            case '3': // Velocidade rápida
                setSpeed('fast');
                break;
            case 'Escape': // Fechar painel
                closeInfoPanel();
                break;
            case '+':
            case '=':
                adjustZoom(0.1);
                break;
            case '-':
            case '_':
                adjustZoom(-0.1);
                break;
            case '0':
            case 'r':
            case 'R':
                resetView();
                break;
        }
    });
}

// ============================================
// UTILITÁRIOS
// ============================================

// Efeito de parallax suave ao mover o mouse
let mouseX = 0;
let mouseY = 0;
let isMoving = false;

document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateParallax);
    }
});

function updateParallax() {
    const stars = document.querySelectorAll('.star');

    stars.forEach((star, index) => {
        const depth = (index % 3 + 1) * 0.5;
        const moveX = mouseX * depth;
        const moveY = mouseY * depth;

        star.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    isMoving = false;
}

// Prevenir menu de contexto em planetas (melhor UX)
document.querySelectorAll('.planet').forEach(planet => {
    planet.addEventListener('contextmenu', e => e.preventDefault());
});

// Console info
console.log('🌌 Sistema Solar Interativo carregado!');
console.log('🎮 Controles:');
console.log('   [ESPAÇO] - Pausar/Continuar animação');
console.log('   [1] - Velocidade lenta');
console.log('   [2] - Velocidade normal');
console.log('   [3] - Velocidade rápida');
console.log('   [ESC] - Fechar painel de informações');
console.log('   [+] / [-] - Aumentar/Diminuir zoom');
console.log('   [R] ou [0] - Resetar visão');
console.log('   [SCROLL] - Zoom com roda do mouse');
console.log('   [DRAG] - Arrastar para rotacionar');
console.log('🖱️  Clique em qualquer planeta para ver informações');
