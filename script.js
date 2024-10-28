let text = "";
let currentDifficulty = "";
let userInputElement = document.getElementById("userInput");
let textDisplayElement = document.getElementById("textDisplay");
let startTime = null;
let wpmElement = document.getElementById("wpm");
let accuracyElement = document.getElementById("accuracy");
let isFinished = false;

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Function to render the text with color based on user input
function renderText() {
    let userInput = userInputElement.value;
    let coloredText = "";

    for (let i = 0; i < text.length; i++) {
        let colorClass = "default"; // Default color for text
        if (userInput[i] === text[i]) {
            colorClass = "text-green"; // Green for correct characters
        } else if (userInput[i] !== undefined) {
            colorClass = "text-red"; // Red for incorrect characters
        }
        coloredText += `<span class="${colorClass}">${text[i]}</span>`;
    }

    textDisplayElement.innerHTML = `<span style="font-family: inherit;">${coloredText}</span>`;
}

// Handle input change
function handleInputChange() {
    if (!startTime) {
        startTime = Date.now();
    }

    let newInput = userInputElement.value;
    let correctChars = newInput.split("").filter((char, i) => char === text[i]).length;
    let accuracyScore = Math.round((correctChars / newInput.length) * 100);
    accuracyElement.innerText = isNaN(accuracyScore) ? 100 : accuracyScore;

    // Check if user has typed the text correctly
    if (newInput === text) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60;
        const wordsTyped = text.split(" ").length;
        wpmElement.innerText = Math.round(wordsTyped / timeElapsed);
        isFinished = true;
        document.getElementById("actionButtons").style.display = "flex"; // Show action buttons
    } else {
        document.getElementById("actionButtons").style.display = "none"; // Hide buttons if not correct
    }

    renderText();
}

// Reset the game
function resetGame() {
    userInputElement.value = "";
    startTime = null;
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    isFinished = false;
    document.getElementById("actionButtons").style.display = "none"; // Hide buttons initially
    renderText();
}

// Select difficulty
function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    text = getRandomSentence(difficulty);
    resetGame();
}

// Load next sentence
function nextSentence() {
    text = getRandomSentence(currentDifficulty);
    resetGame();
}

// Get a random sentence based on difficulty
function getRandomSentence(difficulty) {
    let sentencesForDifficulty = sentences[difficulty];
    return sentencesForDifficulty[Math.floor(Math.random() * sentencesForDifficulty.length)];
}

userInputElement.addEventListener("input", handleInputChange);
renderText();
