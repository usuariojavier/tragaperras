// Símbolos disponibles
const symbols = ["🍒", "🍋", "🍌", "🍇", "⭐", "🍎", "🍉", "🍍", "🥝", "🥥", "🍓", "🍐"];

// Referencias a los elementos del DOM
const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinButton = document.getElementById("spin-button");
const resultText = document.getElementById("result");
const coinCounter = document.getElementById("coin-counter");
const gameOverMessage = document.getElementById("game-over");
const restartButton = document.getElementById("restart-button");

// Variables del juego
let coins = 100;
const spinCost = 25;
const prizes = {
    twoOfAKind: 100,
    threeOfAKind: 500,
    threeStars: 1000,
};

// Función para obtener un símbolo aleatorio
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Función para girar los rodillos
async function spinReels() {
    // Restar monedas
    coins -= spinCost;
    updateCoinCounter();

    // Reiniciar el mensaje de resultado
    resultText.textContent = "";

    // Girar cada rodillo y esperar a que terminen
    await Promise.all([spinReel(reel1), spinReel(reel2), spinReel(reel3)]);

    // Verificar el resultado después de que todos los rodillos hayan terminado
    checkResult();
}

// Función para girar un rodillo
function spinReel(reel) {
    return new Promise((resolve) => {
        let spins = 0;
        const interval = setInterval(() => {
            reel.textContent = getRandomSymbol();
            spins++;
            if (spins > 10) { // Detener después de 10 giros
                clearInterval(interval);
                resolve(); // Resolver la promesa cuando el rodillo termine
            }
        }, 100);
    });
}

function checkResult() {
    // Definir las variables dentro de la función
    const symbol1 = reel1.textContent;
    const symbol2 = reel2.textContent;
    const symbol3 = reel3.textContent;

    // Depuración: Mostrar símbolos en la consola
    console.log("Símbolos en pantalla:", reel1.textContent, reel2.textContent, reel3.textContent);
    console.log("Símbolos evaluados:", symbol1, symbol2, symbol3);


    let prize = 0;

    // Verificar combinaciones
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        if (symbol1 === "⭐") {
            prize = prizes.threeStars;
            resultText.textContent = `¡Bote!  ${prize} 💰💰💰`;
        } else {
            prize = prizes.threeOfAKind;
            resultText.textContent = `¡Premio!  ${prize} 💰💰`;
        }
    } else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
        prize = prizes.twoOfAKind;
        resultText.textContent = `¡Premio!  ${prize} 💰`;
    } else {
        resultText.textContent = "Inténtalo de nuevo ";
    }

    // Sumar premio al monedero
    coins += prize;
    updateCoinCounter();

    // Verificar si el jugador se queda sin monedas
    if (coins < spinCost) {
        endGame();
    }

    // Depuración: Mostrar símbolos y premio en la consola
    console.log("Símbolos:", symbol1, symbol2, symbol3);
    console.log("Premio otorgado:", prize);
}

// Función para actualizar el contador de monedas
function updateCoinCounter() {
    coinCounter.textContent = coins;
}

// Función para finalizar el juego
function endGame() {
    spinButton.disabled = true;
    gameOverMessage.classList.remove("hidden");
}

// Función para reiniciar el juego
function restartGame() {
    coins = 100;
    updateCoinCounter();
    spinButton.disabled = false;
    gameOverMessage.classList.add("hidden");
    resultText.textContent = "";
}

// Evento para el botón de girar
spinButton.addEventListener("click", spinReels);

// Evento para el botón de reiniciar
restartButton.addEventListener("click", restartGame);


