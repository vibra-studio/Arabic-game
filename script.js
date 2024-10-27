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

// Function to render the text
function renderText() {
    console.log("Rendering text:", text); // Debug: show the text being rendered
    textDisplayElement.innerText = text; // Set the text directly
}

// Handle input change
function handleInputChange() {
    if (!startTime) {
        startTime = Date.now();
    }

    let newInput = userInputElement.value;
    console.log("User input:", newInput); // Debug: show user input
    let correctChars = newInput.split("").filter((char, i) => char === text[i]).length;
    let accuracyScore = Math.round((correctChars / newInput.length) * 100);
    accuracyElement.innerText = isNaN(accuracyScore) ? 100 : accuracyScore;

    if (newInput.length === text.length) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60;
        const wordsTyped = text.split(" ").length;
        wpmElement.innerText = Math.round(wordsTyped / timeElapsed);
        isFinished = true;
        document.getElementById("nextButton").style.display = "block";
        console.log("Finished typing! WPM:", wpmElement.innerText); // Debug: show WPM when finished
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
    document.getElementById("nextButton").style.display = "none";
    renderText();
    console.log("Game reset!"); // Debug: notify game reset
}

// Select difficulty
function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    console.log("Difficulty selected:", currentDifficulty); // Debug: show selected difficulty
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
    console.log("Sentences for difficulty:", sentencesForDifficulty); // Debug: show sentences for the selected difficulty
    return sentencesForDifficulty[Math.floor(Math.random() * sentencesForDifficulty.length)];
}

userInputElement.addEventListener("input", handleInputChange);
renderText();
