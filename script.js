const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over-screen");

let score = 0;
let highScore = localStorage.getItem("dinoHighScore") || 0;
let isAlive = true;
let gameSpeed = 5;
let cactusPosition = -30;

// Inicializa o recorde na tela
highScoreElement.textContent = `HI ${String(highScore).padStart(5, '0')}`;

// Eventos para pular ou reiniciar
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.code === "ArrowUp") {
        handleAction();
    }
});

document.addEventListener("touchstart", function () {
    handleAction();
});

function handleAction() {
    if (!isAlive) {
        resetGame();
    } else {
        jump();
    }
}

function jump() {
    if (!dino.classList.contains("jump")) {
        dino.classList.add("jump");
        
        // Remove a classe após a animação terminar (0.6s)
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 600);
    }
}

function moveCactus() {
    if (!isAlive) return;

    // Move o cacto para a esquerda baseado na velocidade atual
    cactusPosition -= gameSpeed;

    // Se o cacto saiu da tela, reinicia ele na direita e soma pontos
    if (cactusPosition < -30) {
        cactusPosition = 600;
        score += 10;
        scoreElement.textContent = String(score).padStart(5, '0');
        
        // Aumenta gradualmente a velocidade do jogo a cada obstáculo passado
        if (gameSpeed < 12) {
            gameSpeed += 0.3;
        }
    }

    cactus.style.left = cactusPosition + "px";

    // Lógica de colisão precisa
    let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    
    // O cacto está na posição X onde o dinossauro ocupa (entre 50px e 90px da esquerda)
    if (cactusPosition > 50 && cactusPosition < 90 && dinoBottom <= 40) {
        gameOver();
    }

    requestAnimationFrame(moveCactus);
}

function gameOver() {
    isAlive = false;
    gameOverScreen.classList.remove("hidden");
    cactus.style.left = cactusPosition + "px"; // Para o cacto onde colidiu

    // Atualiza o recorde se a pontuação atual for maior
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("dinoHighScore", highScore);
        highScoreElement.textContent = `HI ${String(highScore).padStart(5, '0')}`;
    }
}

function resetGame() {
    isAlive = true;
    score = 0;
    gameSpeed = 5;
    cactusPosition = 600;
    scoreElement.textContent = "00000";
    gameOverScreen.classList.add("hidden");
    
    // Reinicia o loop de animação do cacto
    requestAnimationFrame(moveCactus);
}

// Inicia o jogo automaticamente ao carregar
resetGame();
