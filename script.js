let text = "";
let currentDifficulty = "";
let usedSentences = { Easy: new Set(), Medium: new Set(), Hard: new Set() };
let userInputElement = document.getElementById("userInput");
let textDisplayElement = document.getElementById("textDisplay");
let startTime = null;
let wpmElement = document.getElementById("wpm");
let accuracyElement = document.getElementById("accuracy");
let isFinished = false;

// Sound Effects
const nextSound = new Audio("next-sound.mp3");
const typeSound = new Audio("type.mp3");

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
        coloredText += `<span class="${colorClass}" style="display: inline;">${text[i]}</span>`;
    }

    textDisplayElement.innerHTML = `<span style="font-family: inherit;">${coloredText}</span>`;
}

// Handle input change
function handleInputChange() {
    if (!startTime) {
        startTime = Date.now();
    }

    // Play typing sound
    typeSound.currentTime = 0; // Reset sound to start to allow rapid replays
    typeSound.play();

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
    nextSound.play(); // Play next button sound
    text = getRandomSentence(currentDifficulty);
    resetGame();
}

// Get a random sentence based on difficulty without repetition
function getRandomSentence(difficulty) {
    let sentencesForDifficulty = sentences[difficulty];
    let usedSet = usedSentences[difficulty];

    // Reset the used sentences set if all sentences have been used
    if (usedSet.size === sentencesForDifficulty.length) {
        usedSet.clear();
    }

    // Find a new sentence that hasn't been used
    let sentence;
    do {
        sentence = sentencesForDifficulty[Math.floor(Math.random() * sentencesForDifficulty.length)];
    } while (usedSet.has(sentence));

    // Mark this sentence as used
    usedSet.add(sentence);
    return sentence;
}

// Event listeners
userInputElement.addEventListener("input", handleInputChange);
renderText();
