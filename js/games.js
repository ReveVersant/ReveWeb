
        // Snake Game Script
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const box = 20;
        let snake;
        let food;
        let score;
        let direction;
        let game;

        function initGame() {
            snake = [{ x: 9 * box, y: 10 * box }];
            food = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box,
            };
            score = 0;
            direction = null;
            document.getElementById('snakeResult').innerText = '';
            document.getElementById('restartBtn').style.display = 'none';
            game = setInterval(drawGame, 100);
        }

        document.addEventListener('keydown', changeDirection);
        document.addEventListener('keydown', preventScroll);

        function preventScroll(event) {
            if (event.keyCode >= 37 && event.keyCode <= 40) {
                event.preventDefault();
            }
        }

        function changeDirection(event) {
            if (event.keyCode == 37 && direction != 'RIGHT') direction = 'LEFT';
            else if (event.keyCode == 38 && direction != 'DOWN') direction = 'UP';
            else if (event.keyCode == 39 && direction != 'LEFT') direction = 'RIGHT';
            else if (event.keyCode == 40 && direction != 'UP') direction = 'DOWN';
        }

        function drawGame() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = i == 0 ? 'green' : 'white';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = 'red';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (direction == 'LEFT') snakeX -= box;
            if (direction == 'UP') snakeY -= box;
            if (direction == 'RIGHT') snakeX += box;
            if (direction == 'DOWN') snakeY += box;

            if (snakeX == food.x && snakeY == food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * 19 + 1) * box,
                    y: Math.floor(Math.random() * 19 + 1) * box,
                };
            } else {
                snake.pop();
            }

            let newHead = { x: snakeX, y: snakeY };

            if (
                snakeX < 0 ||
                snakeY < 0 ||
                snakeX >= canvas.width ||
                snakeY >= canvas.height ||
                collision(newHead, snake)
            ) {
                clearInterval(game);
                document.getElementById('snakeResult').innerText = `Game Over! Your score is ${score}.`;
                document.getElementById('restartBtn').style.display = 'block';
            }

            snake.unshift(newHead);
        }

        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) {
                    return true;
                }
            }
            return false;
        }

        function restartGame() {
            clearInterval(game);
            initGame();
        }

        initGame();

// Text-based Game Script

let player = {
    name: "Hero",
    level: 1,
    hp: 100,
    attack: 10,
    defense: 5,
    experience: 0,
    gold: 50,
    inventory: []
};

let enemy = null;
const gameLog = document.getElementById('game-log');

const enemyNames = ['Skeleton', 'Bat', 'Orc', 'Bandit'];
const bossNames = ['Boss Skeleton', 'Boss Bat', 'Boss Orc', 'Boss Bandit'];

function generateEnemy() {
    let minLevel = Math.max(player.level - 2, 1);
    let maxLevel = player.level + 5;
    let level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    let isBoss = Math.random() < 0.2;
    let name = isBoss ? bossNames[Math.floor(Math.random() * bossNames.length)] : enemyNames[Math.floor(Math.random() * enemyNames.length)];

    const statVariance = 1 + (Math.random() * 0.5);

    enemy = {
        name: name,
        level: level,
        hp: Math.floor((50 + level * 10 + (isBoss ? 100 : 0)) * statVariance),
        attack: Math.floor((5 + level * 2 + (isBoss ? 10 : 0)) * statVariance),
        defense: Math.floor((2 + level + (isBoss ? 5 : 0)) * statVariance)
    };

    logMessage(`A wild ${enemy.name} appeared! You can Punch, Kick or Slap the enemy!`);
    updateEnemyStats();
}

function calculateDamage(baseDamage, defense, isCritical) {
    let damage = Math.max(0, baseDamage - defense);
    if (isCritical) damage *= 1.5;
    return damage;
}

function attackEnemy(attackType) {
    let baseDamage = 0;
    let rolledDamage = 0;
    let damageText = '';
    
    if (attackType === 'punch') {
        rolledDamage = Math.floor(Math.random() * player.attack) + 5;
        baseDamage = rolledDamage;
    } else if (attackType === 'kick') {
        rolledDamage = Math.floor(Math.random() * (player.attack + 5)) + 7;
        baseDamage = rolledDamage;
    } else if (attackType === 'slap') {
        rolledDamage = Math.floor(Math.random() * (player.attack - 2)) + 3;
        baseDamage = rolledDamage;
    }

    let isCritical = Math.random() < 0.2;
    let effectiveDamage = calculateDamage(baseDamage, enemy.defense, isCritical);
    
    // Detailed log message
    let criticalText = isCritical ? ' (Crit!)' : '';
    damageText = `${attackType.charAt(0).toUpperCase() + attackType.slice(1)} (Rolled ${rolledDamage} + ${baseDamage - rolledDamage}) - Defence (${enemy.defense}) = ${effectiveDamage.toFixed(1)}${criticalText}`;

    enemy.hp -= effectiveDamage;
    logMessage(`${player.name} ${attackType}s ${enemy.name} for ${effectiveDamage.toFixed(1)} damage${criticalText}`, damageText);

    updateEnemyStats();

    if (enemy.hp <= 0) {
        winBattle();
        return;
    }
    enemyAttack();
}


function enemyAttack() {
    let baseDamage = Math.floor(Math.random() * enemy.attack) + 2;
    let isCritical = Math.random() < 0.2;
    let effectiveDamage = calculateDamage(baseDamage, player.defense, isCritical);
    
    // Detailed log message
    let criticalText = isCritical ? ' (Crit!)' : '';
    let damageText = `Enemy Attack (Rolled ${baseDamage}) - Defence (${player.defense}) = ${effectiveDamage.toFixed(1)}${criticalText}`;

    player.hp -= effectiveDamage;
    logMessage(`${enemy.name} attacks ${player.name} for ${effectiveDamage.toFixed(1)} damage${criticalText}`, damageText);
    
    if (player.hp <= 0) {
        gameOver();
    } else {
        updateStats();
    }
}


function winBattle() {
    logMessage(`<strong>${enemy.name} is defeated!</strong>`);
    let baseXP = enemy.level * 5;
    let baseGold = enemy.level * 10;

    // XP bonus for defeating higher-level enemies
    if (enemy.level > player.level) {
        let levelDifference = enemy.level - player.level;
        let extraXP = levelDifference * 2; // Example scaling, adjust as needed
        baseXP += extraXP;
        baseGold += levelDifference * 5; // Example gold scaling, adjust as needed
    }

    player.experience += baseXP;
    player.gold += baseGold;
    logMessage(`<strong>${player.name} gains <span style="color: #FFD700;">${baseXP}</span> XP and <span style="color: #FFD700;">${baseGold}</span> gold.</strong>`);

    if (player.experience >= player.level * 10) {
        levelUp();
    }
    generateEnemy();
}

function levelUp() {
    player.level++;
    player.hp += 20;
    player.attack += 1;
    player.defense += 0.25;
    player.experience = 0;
    logMessage(`${player.name} leveled up! Level: ${player.level}, HP: ${player.hp}, Attack: ${player.attack}, Defense: ${player.defense}`);
}

function shop() {
    let choice = prompt("Welcome to the shop!\n1. Heal (50 gold)\n2. Attack Upgrade (100 gold)\n3. Defense Upgrade (100 gold)\n4. Exit Shop\nChoose an option:");
    switch(choice) {
        case '1':
            buyItem('heal');
            break;
        case '2':
            buyItem('attack_up');
            break;
        case '3':
            buyItem('defense_up');
            break;
        default:
            logMessage("You left the shop.");
    }
}

function buyItem(item) {
    if (item === 'heal' && player.gold >= 50) {
        player.hp += 100;
        player.gold -= 50;
        logMessage(`${player.name} buys a heal. HP: ${player.hp}`);
    } else if (item === 'attack_up' && player.gold >= 100) {
        player.attack += 4;
        player.gold -= 100;
        logMessage(`${player.name} buys an attack upgrade. Attack: ${player.attack}`);
    } else if (item === 'defense_up' && player.gold >= 100) {
        player.defense += 1;
        player.gold -= 100;
        logMessage(`${player.name} buys a defense upgrade. Defense: ${player.defense}`);
    } else {
        logMessage("Not enough gold or invalid option.");
    }
    updateStats();
}

function updateStats() {
    document.getElementById('player-stats').innerText = `Name: ${player.name}, Level: ${player.level}, HP: ${player.hp}, Attack: ${player.attack}, Defense: ${player.defense}, Gold: ${player.gold}`;
}

function updateEnemyStats() {
    if (enemy) {
        document.getElementById('enemy-stats').innerText = `Enemy: ${enemy.name}, Level: ${enemy.level}, HP: ${enemy.hp.toFixed(1)}, Attack: ${enemy.attack}, Defense: ${enemy.defense}`;
    }
}

function logMessage(message, damageText = "") {
    const logEntry = document.createElement('p');
    logEntry.innerHTML = `${message} <span class="damage-info">${damageText}</span>`;
    logEntry.classList.add('new-entry');
    gameLog.appendChild(logEntry);

    // Keep only the latest 10 messages
    while (gameLog.children.length > 10) {
        const firstChild = gameLog.firstChild;
        firstChild.classList.add('old-entry');
        gameLog.removeChild(firstChild);
    }

    gameLog.scrollTop = gameLog.scrollHeight;
}

function gameOver() {
    logMessage(`${player.name} is defeated! Game Over.`);
    player.hp = 0;
    updateStats();
}

 function startGame() {
            gameLog.innerHTML = "";
            let playerName = prompt("Enter your character's name:");
            if (!playerName) {
                playerName = "Hero";
            }
            player.name = playerName;

            player.hp = 100;
            player.experience = 0;
            player.level = 1;
            player.attack = 15;
            player.defense = 10;
            player.gold = 500;
            updateStats();
            logMessage(`Welcome, ${player.name}! Explore and fight enemies.`);
            generateEnemy();
        }

