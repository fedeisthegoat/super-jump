<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍄 Super Jump Game 🍄</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(to bottom, #60a5fa, #93c5fd, #86efac);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        h1 {
            font-size: 3rem;
            color: white;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
            margin-bottom: 10px;
        }

        .subtitle {
            color: white;
            font-size: 1.2rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .game-card {
            background: white;
            border-radius: 12px;
            border: 4px solid #fbbf24;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            overflow: hidden;
            margin-bottom: 20px;
        }

        .game-header {
            background: linear-gradient(to right, #dc2626, #b91c1c);
            color: white;
            padding: 20px;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 15px;
        }

        .stat {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .game-body {
            padding: 30px;
        }

        canvas {
            width: 100%;
            max-width: 800px;
            height: auto;
            border: 4px solid #3b82f6;
            border-radius: 8px;
            display: block;
            margin: 0 auto;
            background: #87ceeb;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .overlay-content {
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
        }

        .hidden {
            display: none;
        }

        button {
            background: #22c55e;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin: 5px;
            transition: all 0.3s;
        }

        button:hover {
            background: #16a34a;
            transform: scale(1.05);
        }

        button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
        }

        .btn-secondary {
            background: #3b82f6;
        }

        .btn-secondary:hover {
            background: #2563eb;
        }

        .btn-danger {
            background: #ef4444;
        }

        .btn-danger:hover {
            background: #dc2626;
        }

        .shop-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .shop-item {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }

        .shop-item.owned {
            background: #dcfce7;
            border-color: #22c55e;
        }

        .shop-item h3 {
            margin-bottom: 10px;
        }

        .shop-item p {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 10px;
        }

        .price {
            color: #f59e0b;
            font-weight: bold;
            font-size: 1.1rem;
            margin: 10px 0;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }

        .tab {
            padding: 10px 20px;
            background: none;
            border: none;
            font-size: 1rem;
            cursor: pointer;
            border-bottom: 3px solid transparent;
        }

        .tab.active {
            border-bottom-color: #3b82f6;
            color: #3b82f6;
        }

        .level-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .level-card {
            background: rgba(255,255,255,0.9);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            border: 2px solid #e5e7eb;
        }

        .level-card.active {
            border-color: #fbbf24;
            border-width: 4px;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            margin: 2px;
        }

        .badge-red {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge-yellow {
            background: #fef3c7;
            color: #92400e;
        }

        .badge-blue {
            background: #dbeafe;
            color: #1e3a8a;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            .game-body {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍄 Super Jump Game 🍄</h1>
            <p class="subtitle">Springe auf die Plattformen und erreiche die Flagge!</p>
        </div>

        <div class="game-card">
            <div class="game-header">
                <div class="stats">
                    <div class="stat">
                        <span>⭐ Level</span>
                        <span class="stat-value" id="levelDisplay">1/12</span>
                    </div>
                    <div class="stat">
                        <span>🪙 Münzen</span>
                        <span class="stat-value" id="coinsDisplay">0</span>
                    </div>
                    <div class="stat">
                        <span>❤️ Leben</span>
                        <span class="stat-value" id="livesDisplay">3</span>
                    </div>
                    <button onclick="toggleShop()" class="btn-secondary">🛒 Shop</button>
                </div>
                <div id="levelName" style="text-align: center; margin-top: 10px; font-size: 1.2rem;"></div>
            </div>
            <div class="game-body">
                <canvas id="gameCanvas" width="800" height="600"></canvas>
            </div>
        </div>

        <div id="levelGrid" class="level-grid"></div>
    </div>

    <!-- Ready Screen -->
    <div id="readyOverlay" class="overlay">
        <div class="overlay-content">
            <h2 style="font-size: 2rem; margin-bottom: 20px;">Bereit zum Springen?</h2>
            <div style="text-align: left; margin: 20px 0;">
                <p>🎮 <strong>Steuerung:</strong></p>
                <p>← → oder A/D = Bewegen</p>
                <p>LEERTASTE oder ↑ = Springen</p>
                <p style="color: #f59e0b; margin-top: 15px;">🪙 Sammle Münzen für den Shop!</p>
                <p style="color: #dc2626;">⚠️ Vermeide die Gegner!</p>
                <p style="color: #22c55e; margin-top: 10px;">🏆 12 Level zu meistern!</p>
                <p style="color: #8b5cf6;">👤 Schalte neue Charaktere frei!</p>
            </div>
            <button onclick="startGame()">▶️ Spiel Starten</button>
        </div>
    </div>

    <!-- Shop Overlay -->
    <div id="shopOverlay" class="overlay hidden">
        <div class="overlay-content" style="max-width: 700px;">
            <h2>🛒 Shop</h2>
            <button onclick="toggleShop()" style="float: right; margin-top: -40px;">Zurück</button>
            <div class="tabs">
                <button class="tab active" onclick="switchTab('powerups')">Power-Ups</button>
                <button class="tab" onclick="switchTab('skins')">Charaktere</button>
            </div>
            <div id="powerupsTab" class="shop-grid"></div>
            <div id="skinsTab" class="shop-grid hidden"></div>
        </div>
    </div>

    <!-- Level Complete -->
    <div id="levelCompleteOverlay" class="overlay hidden">
        <div class="overlay-content">
            <div style="font-size: 4rem;">⭐</div>
            <h2 style="font-size: 2.5rem; color: #f59e0b; margin: 20px 0;">Level Geschafft! 🎉</h2>
            <p id="completedLevelName" style="font-size: 1.3rem; margin: 10px 0;"></p>
            <p id="completedScore" style="font-size: 1.5rem; margin: 10px 0;"></p>
            <div style="margin-top: 20px;">
                <button onclick="nextLevel()">⭐ Nächstes Level</button>
                <button onclick="toggleShop()" class="btn-secondary">🛒 Shop Besuchen</button>
            </div>
        </div>
    </div>

    <!-- Game Over -->
    <div id="gameOverOverlay" class="overlay hidden">
        <div class="overlay-content">
            <h2 style="font-size: 2.5rem; color: #dc2626; margin: 20px 0;">Game Over!</h2>
            <p id="gameOverLevelName" style="font-size: 1.3rem; margin: 10px 0;"></p>
            <p id="gameOverScore" style="font-size: 1.5rem; margin: 10px 0;"></p>
            <div style="margin-top: 20px;">
                <button onclick="restartLevel()">🔄 Level Wiederholen</button>
                <button onclick="startGame()" class="btn-danger">Neu Starten</button>
                <button onclick="toggleShop()" class="btn-secondary">🛒 Shop</button>
            </div>
        </div>
    </div>

    <!-- Won -->
    <div id="wonOverlay" class="overlay hidden">
        <div class="overlay-content">
            <div style="font-size: 4rem;">🏆</div>
            <h2 style="font-size: 2.5rem; color: #f59e0b; margin: 20px 0;">Alle Level Gemeistert! 🎉</h2>
            <p id="wonScore" style="font-size: 1.8rem; margin: 10px 0;"></p>
            <p id="wonCoins" style="font-size: 1.5rem; color: #f59e0b; margin: 10px 0;"></p>
            <button onclick="startGame()" style="margin-top: 20px;">🔄 Nochmal Spielen</button>
        </div>
    </div>

    <script>
        // Game State
        let gameState = 'ready';
        let currentLevel = 1;
        let score = 0;
        let lives = 3;
        let totalCoins = 0;
        let currentSkin = 'mario';
        let ownedSkins = ['mario'];
        let powerups = {
            speedBoost: false,
            superJump: false,
            shield: 0,
            doubleCoins: false
        };

        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let animationFrameCount = 0;
        const keys = {};

        // Skins
        const skins = {
            mario: { name: 'Mario', color: '#FF0000', hatColor: '#8B0000', faceColor: '#FFE4C4', overallColor: '#0000FF', buttonColor: '#FFD700', shoeColor: '#8B4513', cost: 0, description: 'Der klassische Held!' },
            luigi: { name: 'Luigi', color: '#00FF00', hatColor: '#006400', faceColor: '#FFE4C4', overallColor: '#0000CD', buttonColor: '#FFD700', shoeColor: '#8B4513', cost: 100, description: 'Marios grüner Bruder' },
            peach: { name: 'Peach', color: '#FFB6C1', hatColor: '#FFD700', faceColor: '#FFE4C4', overallColor: '#FF69B4', buttonColor: '#FFFFFF', shoeColor: '#FF1493', cost: 150, description: 'Die elegante Prinzessin' },
            toad: { name: 'Toad', color: '#FF0000', hatColor: '#FFFFFF', faceColor: '#FFE4C4', overallColor: '#4169E1', buttonColor: '#FFD700', shoeColor: '#8B4513', cost: 120, description: 'Der treue Pilz-Begleiter' },
            wario: { name: 'Wario', color: '#FFFF00', hatColor: '#8B8B00', faceColor: '#FFE4C4', overallColor: '#800080', buttonColor: '#FFFFFF', shoeColor: '#228B22', cost: 200, description: 'Der böse Doppelgänger' },
            waluigi: { name: 'Waluigi', color: '#9400D3', hatColor: '#4B0082', faceColor: '#FFE4C4', overallColor: '#000000', buttonColor: '#FFD700', shoeColor: '#8B4500', cost: 200, description: 'Luigis mysteriöser Rivale' }
        };

        // Shop Items
        const shopItems = [
            { id: 'extraLife', name: 'Extra Leben', description: 'Gibt dir ein zusätzliches Leben', cost: 50, type: 'consumable' },
            { id: 'speedBoost', name: 'Geschwindigkeits-Boost', description: 'Bewege dich 50% schneller', cost: 100, type: 'upgrade' },
            { id: 'superJump', name: 'Super Sprung', description: 'Springe viel höher', cost: 150, type: 'upgrade' },
            { id: 'shield', name: 'Schutzschild', description: 'Schützt vor einem Treffer', cost: 80, type: 'consumable' },
            { id: 'doubleCoins', name: 'Doppelte Münzen', description: 'Verdopple alle Münzen', cost: 200, type: 'upgrade' }
        ];

        // Levels configuration (abbreviated for space - keeping structure)
        const levels = {
            1: {
                name: "Grüne Hügel",
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50, color: '#8B4513', hasGrass: true },
                    { x: 200, y: 450, width: 150, height: 20, color: '#228B22', hasGrass: true },
                    { x: 400, y: 350, width: 150, height: 20, color: '#228B22', hasGrass: true },
                    { x: 600, y: 250, width: 150, height: 20, color: '#228B22', hasGrass: true },
                    { x: 300, y: 200, width: 200, height: 20, color: '#228B22', hasGrass: true, moving: true, velocityX: 1.5, minX: 250, maxX: 500 },
                    { x: 100, y: 150, width: 150, height: 20, color: '#228B22', hasGrass: true }
                ],
                coins: [
                    { x: 250, y: 400, size: 20, collected: false },
                    { x: 450, y: 300, size: 20, collected: false },
                    { x: 650, y: 200, size: 20, collected: false },
                    { x: 400, y: 150, size: 20, collected: false },
                    { x: 150, y: 100, size: 20, collected: false }
                ],
                diamonds: [
                    { x: 350, y: 160, size: 25, collected: false },
                    { x: 550, y: 210, size: 25, collected: false }
                ],
                enemies: [
                    { x: 400, y: 310, width: 30, height: 30, velocityX: 2, color: '#8B0000', minX: 400, maxX: 550, defeated: false },
                    { x: 200, y: 410, width: 30, height: 30, velocityX: 2, color: '#8B0000', minX: 200, maxX: 350, defeated: false }
                ],
                goal: { x: 150, y: 100, width: 50, height: 50 },
                bgColor: '#87CEEB'
            },
            12: {
                name: "Pilz-Königreich - Boss Kampf",
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50, color: '#DC143C', hasGrass: false },
                    { x: 100, y: 450, width: 120, height: 20, color: '#FF6347', hasGrass: false },
                    { x: 580, y: 450, width: 120, height: 20, color: '#FF6347', hasGrass: false },
                    { x: 300, y: 380, width: 200, height: 20, color: '#FF6347', hasGrass: false }
                ],
                coins: [
                    { x: 160, y: 410, size: 20, collected: false },
                    { x: 640, y: 410, size: 20, collected: false },
                    { x: 400, y: 340, size: 20, collected: false }
                ],
                diamonds: [
                    { x: 220, y: 240, size: 25, collected: false },
                    { x: 580, y: 240, size: 25, collected: false }
                ],
                enemies: [],
                boss: {
                    x: 600,
                    y: 400,
                    width: 80,
                    height: 100,
                    velocityX: -4,
                    health: 10,
                    maxHealth: 10,
                    minX: 100,
                    maxX: 700,
                    fireballTimer: 0,
                    fireballCooldown: 60,
                    defeated: false
                },
                fireballs: [],
                goal: { x: 350, y: 120, width: 50, height: 60 },
                bgColor: '#FFB6C1',
                isBossLevel: true
            }
        };

        // Add other levels (2-11) - simplified for brevity
        for (let i = 2; i <= 11; i++) {
            levels[i] = {
                name: `Level ${i}`,
                platforms: [{ x: 0, y: 550, width: 800, height: 50, color: '#8B4513', hasGrass: false }],
                coins: [],
                diamonds: [],
                enemies: [],
                goal: { x: 700, y: 500, width: 50, height: 50 },
                bgColor: '#87CEEB'
            };
        }

        let game = {
            player: {
                x: 100, y: 300, width: 40, height: 50,
                velocityY: 0, velocityX: 0, isJumping: false,
                skin: 'mario', direction: 'right',
                hasShield: false, isHit: false, hitTimer: 0,
                invincible: false, invincibleTimer: 0
            },
            platforms: [], coins: [], diamonds: [], enemies: [],
            boss: null, fireballs: [], goal: {}
        };

        // Initialize
        function init() {
            updateDisplay();
            renderShop();
            renderLevelGrid();
            
            window.addEventListener('keydown', (e) => {
                keys[e.key] = true;
                if ((e.key === ' ' || e.key === 'ArrowUp') && gameState === 'playing') {
                    e.preventDefault();
                    jump();
                }
            });
            
            window.addEventListener('keyup', (e) => {
                keys[e.key] = false;
            });
        }

        function updateDisplay() {
            document.getElementById('levelDisplay').textContent = `${currentLevel}/12`;
            document.getElementById('coinsDisplay').textContent = totalCoins;
            document.getElementById('livesDisplay').textContent = lives;
            document.getElementById('levelName').textContent = levels[currentLevel] ? `${skins[currentSkin].name} • ${levels[currentLevel].name}` : '';
        }

        function startGame() {
            powerups = { speedBoost: false, superJump: false, shield: 0, doubleCoins: false };
            totalCoins = 0;
            score = 0;
            lives = 3;
            currentLevel = 1;
            loadLevel(1);
            gameState = 'playing';
            hideAllOverlays();
            updateDisplay();
            gameLoop();
        }

        function loadLevel(levelNum) {
            const level = levels[levelNum];
            game = {
                player: {
                    x: 100, y: 300, width: 40, height: 50,
                    velocityY: 0, velocityX: 0, isJumping: false,
                    skin: currentSkin, direction: 'right',
                    hasShield: powerups.shield > 0,
                    isHit: false, hitTimer: 0,
                    invincible: false, invincibleTimer: 0
                },
                platforms: JSON.parse(JSON.stringify(level.platforms)),
                coins: JSON.parse(JSON.stringify(level.coins)),
                diamonds: JSON.parse(JSON.stringify(level.diamonds)),
                enemies: JSON.parse(JSON.stringify(level.enemies)),
                boss: level.boss ? JSON.parse(JSON.stringify(level.boss)) : null,
                fireballs: [],
                goal: { ...level.goal }
            };
        }

        function nextLevel() {
            const next = currentLevel + 1;
            if (next <= 12) {
                loadLevel(next);
                currentLevel = next;
                gameState = 'playing';
                hideAllOverlays();
                updateDisplay();
                gameLoop();
            } else {
                showWon();
            }
        }

        function restartLevel() {
            loadLevel(currentLevel);
            gameState = 'playing';
            hideAllOverlays();
            gameLoop();
        }

        function jump() {
            if (!game.player.isJumping) {
                game.player.velocityY = powerups.superJump ? -20 : -15;
                game.player.isJumping = true;
            }
        }

        function hideAllOverlays() {
            document.getElementById('readyOverlay').classList.add('hidden');
            document.getElementById('shopOverlay').classList.add('hidden');
            document.getElementById('levelCompleteOverlay').classList.add('hidden');
            document.getElementById('gameOverOverlay').classList.add('hidden');
            document.getElementById('wonOverlay').classList.add('hidden');
        }

        function showLevelComplete() {
            gameState = 'levelComplete';
            document.getElementById('completedLevelName').textContent = `Level ${currentLevel}: ${levels[currentLevel].name}`;
            document.getElementById('completedScore').textContent = `Punkte: ${score}`;
            document.getElementById('levelCompleteOverlay').classList.remove('hidden');
        }

        function showGameOver() {
            gameState = 'gameOver';
            document.getElementById('gameOverLevelName').textContent = `Level ${currentLevel}: ${levels[currentLevel].name}`;
            document.getElementById('gameOverScore').textContent = `Punkte: ${score}`;
            document.getElementById('gameOverOverlay').classList.remove('hidden');
        }

        function showWon() {
            gameState = 'won';
            document.getElementById('wonScore').textContent = `Endpunkte: ${score}`;
            document.getElementById('wonCoins').textContent = `Gesammelte Münzen: ${totalCoins}`;
            document.getElementById('wonOverlay').classList.remove('hidden');
        }

        function toggleShop() {
            const shopOverlay = document.getElementById('shopOverlay');
            shopOverlay.classList.toggle('hidden');
            if (!shopOverlay.classList.contains('hidden')) {
                renderShop();
            }
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            
            if (tab === 'powerups') {
                document.getElementById('powerupsTab').classList.remove('hidden');
                document.getElementById('skinsTab').classList.add('hidden');
            } else {
                document.getElementById('powerupsTab').classList.add('hidden');
                document.getElementById('skinsTab').classList.remove('hidden');
            }
        }

        function renderShop() {
            // Render powerups
            const powerupsTab = document.getElementById('powerupsTab');
            powerupsTab.innerHTML = shopItems.map(item => {
                const canBuy = totalCoins >= item.cost;
                const isOwned = item.type === 'upgrade' && powerups[item.id];
                return `
                    <div class="shop-item ${isOwned ? 'owned' : ''}">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        ${isOwned ? '<span class="badge" style="background: #22c55e; color: white;">Gekauft</span>' : ''}
                        ${item.id === 'shield' && powerups.shield > 0 ? `<span class="badge">${powerups.shield}x</span>` : ''}
                        <div class="price">🪙 ${item.cost}</div>
                        <button onclick="buyItem('${item.id}')" ${!canBuy || (isOwned && item.type === 'upgrade') ? 'disabled' : ''}>
                            ${isOwned && item.type === 'upgrade' ? 'Besessen' : 'Kaufen'}
                        </button>
                    </div>
                `;
            }).join('');

            // Render skins
            const skinsTab = document.getElementById('skinsTab');
            skinsTab.innerHTML = Object.entries(skins).map(([skinId, skin]) => {
                const isOwned = ownedSkins.includes(skinId);
                const isActive = currentSkin === skinId;
                const canBuy = totalCoins >= skin.cost;
                return `
                    <div class="shop-item ${isActive ? 'owned' : ''}">
                        <div style="width: 60px; height: 60px; margin: 0 auto 10px; background: #87CEEB; border-radius: 8px; position: relative; border: 2px solid #ccc;">
                            <div style="width: 30px; height: 30px; background: ${skin.color}; border: 3px solid ${skin.hatColor}; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                        </div>
                        <h3>${skin.name}</h3>
                        <p style="font-size: 0.85rem;">${skin.description}</p>
                        ${isActive ? '<span class="badge" style="background: #22c55e; color: white;">Aktiv</span>' : ''}
                        ${isOwned && !isActive ? '<span class="badge">Besessen</span>' : ''}
                        ${skin.cost === 0 || isOwned ? 
                            `<button onclick="selectSkin('${skinId}')" ${isActive ? 'disabled' : ''}>${isActive ? 'Ausgewählt' : 'Auswählen'}</button>` :
                            `<div class="price">🪙 ${skin.cost}</div><button onclick="buySkin('${skinId}')" ${!canBuy ? 'disabled' : ''}>Kaufen</button>`
                        }
                    </div>
                `;
            }).join('');
        }

        function buyItem(itemId) {
            const item = shopItems.find(i => i.id === itemId);
            if (!item || totalCoins < item.cost) return;

            totalCoins -= item.cost;
            
            if (item.id === 'extraLife') {
                lives++;
            } else if (item.id === 'shield') {
                powerups.shield++;
                if (game.player) game.player.hasShield = true;
            } else {
                powerups[item.id] = true;
            }
            
            updateDisplay();
            renderShop();
        }

        function buySkin(skinId) {
            const skin = skins[skinId];
            if (!skin || totalCoins < skin.cost || ownedSkins.includes(skinId)) return;

            totalCoins -= skin.cost;
            ownedSkins.push(skinId);
            currentSkin = skinId;
            if (game.player) game.player.skin = skinId;
            
            updateDisplay();
            renderShop();
        }

        function selectSkin(skinId) {
            if (!ownedSkins.includes(skinId)) return;
            currentSkin = skinId;
            if (game.player) game.player.skin = skinId;
            updateDisplay();
            renderShop();
        }

        function renderLevelGrid() {
            const grid = document.getElementById('levelGrid');
            grid.innerHTML = Object.entries(levels).map(([num, level]) => `
                <div class="level-card ${parseInt(num) === currentLevel ? 'active' : ''}">
                    <p style="font-weight: bold; font-size: 1.1rem;">Level ${num}</p>
                    <p style="font-size: 0.9rem; color: #666;">${level.name}</p>
                    <div style="margin-top: 10px;">
                        <span class="badge badge-red">${level.enemies.length} 👾</span>
                        <span class="badge badge-yellow">${level.coins.length} 🪙</span>
                        <span class="badge badge-blue">${level.diamonds.length} 💎</span>
                    </div>
                </div>
            `).join('');
        }

        // Drawing functions
        function drawPlayer(player) {
            const skin = skins[player.skin];
            const x = player.x, y = player.y, w = player.width, h = player.height;
            
            ctx.save();
            if (player.invincible && Math.floor(player.invincibleTimer / 5) % 2 === 0) {
                ctx.globalAlpha = 0.3;
            }

            // Simple player representation
            ctx.fillStyle = skin.shoeColor;
            ctx.fillRect(x + 8, y + h - 5, 10, 5);
            ctx.fillRect(x + w - 18, y + h - 5, 10, 5);

            ctx.fillStyle = skin.overallColor;
            ctx.fillRect(x + 8, y + h - 20, 10, 18);
            ctx.fillRect(x + w - 18, y + h - 20, 10, 18);

            ctx.fillStyle = skin.color;
            ctx.fillRect(x + 5, y + 20, w - 10, 18);

            ctx.fillStyle = skin.faceColor;
            ctx.beginPath();
            ctx.arc(x + w/2, y + 12, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = skin.hatColor;
            ctx.fillRect(x + w/2 - 14, y + 5, 28, 8);

            if (player.hasShield) {
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x + w/2, y + h/2, 28, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }

        function drawBowser(boss) {
            const x = boss.x, y = boss.y, w = boss.width, h = boss.height;
            
            // Simple Bowser representation
            ctx.fillStyle = '#8B4500';
            ctx.fillRect(x + 15, y + h - 30, 15, 30);
            ctx.fillRect(x + w - 30, y + h - 30, 15, 30);

            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.ellipse(x + w/2, y + h/2, w/2 - 5, h/2 - 20, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#9ACD32';
            ctx.beginPath();
            ctx.arc(x + w/2, y + 25, 28, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(x + w/2 - 10, y + 25, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w/2 + 10, y + 25, 4, 0, Math.PI * 2);
            ctx.fill();

            // Health bar
            const healthBarWidth = 150;
            const healthBarX = x + w/2 - healthBarWidth/2;
            const healthBarY = y - 20;
            
            ctx.fillStyle = '#330000';
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth, 12);
            
            const healthPercentage = boss.health / boss.maxHealth;
            ctx.fillStyle = healthPercentage > 0.5 ? '#00FF00' : healthPercentage > 0.25 ? '#FFFF00' : '#FF0000';
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, 12);
            
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, 12);
        }

        function drawFireball(fireball) {
            const gradient = ctx.createRadialGradient(fireball.x, fireball.y, 0, fireball.x, fireball.y, fireball.size);
            gradient.addColorStop(0, '#FFFF00');
            gradient.addColorStop(0.5, '#FF8800');
            gradient.addColorStop(1, '#FF0000');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(fireball.x, fireball.y, fireball.size, 0, Math.PI * 2);
            ctx.fill();
        }

        function gameLoop() {
            if (gameState !== 'playing') return;

            const level = levels[currentLevel];
            const player = game.player;

            animationFrameCount++;

            // Update timers
            if (player.isHit && player.hitTimer > 0) player.hitTimer--;
            if (player.hitTimer === 0) player.isHit = false;
            if (player.invincible && player.invincibleTimer > 0) player.invincibleTimer--;
            if (player.invincibleTimer === 0) player.invincible = false;

            // Clear canvas
            ctx.fillStyle = level.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Player movement
            const moveSpeed = powerups.speedBoost ? 7.5 : 5;
            player.velocityX = 0;
            if (keys['ArrowLeft'] || keys['a']) {
                player.velocityX = -moveSpeed;
                player.direction = 'left';
            }
            if (keys['ArrowRight'] || keys['d']) {
                player.velocityX = moveSpeed;
                player.direction = 'right';
            }

            // Gravity
            player.velocityY += 0.6;
            player.y += player.velocityY;
            player.x += player.velocityX;

            // Bounds
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

            // Update platforms
            game.platforms.forEach(platform => {
                if (platform.moving) {
                    platform.x += platform.velocityX;
                    if (platform.x <= platform.minX || platform.x + platform.width >= platform.maxX) {
                        platform.velocityX *= -1;
                    }
                }
            });

            // Platform collisions
            let onGround = false;
            game.platforms.forEach(platform => {
                if (player.x < platform.x + platform.width &&
                    player.x + player.width > platform.x &&
                    player.y + player.height > platform.y &&
                    player.y + player.height < platform.y + platform.height &&
                    player.velocityY >= 0) {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.isJumping = false;
                    onGround = true;
                }
            });

            // Fell off
            if (player.y > canvas.height) {
                if (player.hasShield) {
                    player.hasShield = false;
                    powerups.shield = Math.max(0, powerups.shield - 1);
                    player.x = 100;
                    player.y = 300;
                    player.velocityY = 0;
                } else {
                    lives--;
                    if (lives <= 0) {
                        showGameOver();
                        return;
                    } else {
                        player.x = 100;
                        player.y = 300;
                        player.velocityY = 0;
                    }
                }
                updateDisplay();
            }

            // Draw platforms
            game.platforms.forEach(platform => {
                ctx.fillStyle = platform.color;
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                ctx.strokeStyle = '#2F4F2F';
                ctx.lineWidth = 2;
                ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            });

            // Boss logic
            if (game.boss && !game.boss.defeated) {
                const boss = game.boss;
                
                boss.x += boss.velocityX;
                if (boss.x <= boss.minX || boss.x + boss.width >= boss.maxX) {
                    boss.velocityX *= -1;
                }
                
                boss.fireballTimer++;
                if (boss.fireballTimer >= boss.fireballCooldown) {
                    boss.fireballTimer = 0;
                    const angle = Math.atan2(player.y + player.height/2 - (boss.y + 35), player.x + player.width/2 - (boss.x + boss.width/2));
                    game.fireballs.push({
                        x: boss.x + boss.width/2,
                        y: boss.y + 35,
                        velocityX: Math.cos(angle) * 4,
                        velocityY: Math.sin(angle) * 4,
                        size: 15
                    });
                }
                
                drawBowser(boss);
                
                // Boss collision
                if (player.x < boss.x + boss.width &&
                    player.x + player.width > boss.x &&
                    player.y < boss.y + boss.height &&
                    player.y + player.height > boss.y) {
                    const isJumpingOnBoss = player.velocityY > 0 && player.y + player.height - 20 < boss.y + boss.height / 2;
                    
                    if (isJumpingOnBoss && !player.invincible) {
                        boss.health--;
                        const coinBonus = powerups.doubleCoins ? 20 : 10;
                        score += coinBonus;
                        totalCoins += coinBonus;
                        player.velocityY = -12;
                        player.isJumping = true;
                        player.invincible = true;
                        player.invincibleTimer = 30;
                        updateDisplay();
                        
                        if (boss.health <= 0) {
                            boss.defeated = true;
                            const bonusCoins = powerups.doubleCoins ? 200 : 100;
                            score += bonusCoins;
                            totalCoins += bonusCoins;
                            updateDisplay();
                        }
                    }
                }
            }

            // Fireballs
            game.fireballs = game.fireballs.filter(fireball => {
                fireball.x += fireball.velocityX;
                fireball.y += fireball.velocityY;
                
                if (fireball.x < -50 || fireball.x > canvas.width + 50 || 
                    fireball.y < -50 || fireball.y > canvas.height + 50) {
                    return false;
                }
                
                const dist = Math.sqrt(
                    Math.pow(player.x + player.width/2 - fireball.x, 2) +
                    Math.pow(player.y + player.height/2 - fireball.y, 2)
                );
                
                if (dist < player.width/2 + fireball.size && !player.invincible) {
                    if (player.hasShield) {
                        player.hasShield = false;
                        powerups.shield = Math.max(0, powerups.shield - 1);
                    } else {
                        lives--;
                        if (lives <= 0) {
                            showGameOver();
                        } else {
                            player.x = 100;
                            player.y = 300;
                            player.velocityY = 0;
                        }
                    }
                    updateDisplay();
                    return false;
                }
                
                drawFireball(fireball);
                return true;
            });

            // Draw coins
            game.coins.forEach(coin => {
                if (!coin.collected) {
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(coin.x, coin.y, coin.size / 2, 0, Math.PI * 2);
                    ctx.fill();

                    const dist = Math.sqrt(
                        Math.pow(player.x + player.width / 2 - coin.x, 2) +
                        Math.pow(player.y + player.height / 2 - coin.y, 2)
                    );
                    if (dist < player.width / 2 + coin.size / 2) {
                        coin.collected = true;
                        const coinValue = powerups.doubleCoins ? 20 : 10;
                        score += coinValue;
                        totalCoins += coinValue;
                        updateDisplay();
                    }
                }
            });

            // Draw diamonds
            game.diamonds.forEach(diamond => {
                if (!diamond.collected) {
                    ctx.fillStyle = '#00FFFF';
                    ctx.save();
                    ctx.translate(diamond.x, diamond.y);
                    ctx.rotate(Date.now() / 300);
                    ctx.beginPath();
                    ctx.moveTo(0, -diamond.size/2);
                    ctx.lineTo(diamond.size*0.3, 0);
                    ctx.lineTo(0, diamond.size/2);
                    ctx.lineTo(-diamond.size*0.3, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();

                    const dist = Math.sqrt(
                        Math.pow(player.x + player.width / 2 - diamond.x, 2) +
                        Math.pow(player.y + player.height / 2 - diamond.y, 2)
                    );
                    if (dist < player.width / 2 + diamond.size / 2) {
                        diamond.collected = true;
                        const diamondValue = powerups.doubleCoins ? 200 : 100;
                        score += diamondValue;
                        totalCoins += diamondValue;
                        updateDisplay();
                    }
                }
            });

            // Draw goal
            if (!game.boss || game.boss.defeated) {
                const goal = game.goal;
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(goal.x, goal.y, 10, goal.height);
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.moveTo(goal.x + 10, goal.y);
                ctx.lineTo(goal.x + 40, goal.y + 15);
                ctx.lineTo(goal.x + 10, goal.y + 30);
                ctx.closePath();
                ctx.fill();

                if (player.x < goal.x + goal.width &&
                    player.x + player.width > goal.x &&
                    player.y < goal.y + goal.height &&
                    player.y + player.height > goal.y) {
                    showLevelComplete();
                    return;
                }
            }

            drawPlayer(player);

            animationFrameId = requestAnimationFrame(gameLoop);
        }

        // Start
        init();
    </script>
</body>
</html>
