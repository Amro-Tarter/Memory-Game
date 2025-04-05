// Select the game container
const cardsContainer = document.querySelector(".cards");

// Define the colors (each color appears twice)
const colors = ["aqua", "crimson", "blue", "dodgerblue", "gold", "greenyellow", "teal", "chartreuse", "darkmagenta", "hotpink"];
const colorPick = [...colors, ...colors]; // Duplicate colors to form pairs
const cardsCount = colorPick.length;

// Game state variables
let revealedCount = 0;
let activeCards = null;
let waiting = false;
let moves = 0;

/**
 * Function to create and return a card element
 */
function buildCard(color) {
    const element = document.createElement("div");
    element.classList.add("card");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    // Default card image (hidden state)
    element.style.backgroundImage = "url('card_photo.jpg')"; 

    // Attach event listener for clicks
    element.addEventListener("click", () => handleCardClick(element, color));

    return element;
}

/**
 * Function to handle card click event
 */
function handleCardClick(element, color) {
    // Prevent action if waiting for animation or card is already revealed
    if (waiting || element.getAttribute("data-revealed") === "true" || element === activeCards) {
        return;
    }

    // Reveal the card by showing its color and hiding the image
    element.style.backgroundColor = color;
    element.style.backgroundImage = "none"; 

    // If no active card is selected, store the clicked card and wait for the next one
    if (!activeCards) {
        activeCards = element;
        return;
    }

    // Increase move count
    updateMoves();

    // Check if the two selected cards match
    if (activeCards.getAttribute("data-color") === color) {
        activeCards.setAttribute("data-revealed", "true");
        element.setAttribute("data-revealed", "true");

        // Reset state and update match count
        activeCards = null;
        revealedCount++;
        updateMatches();

        // Check for win condition
        if (revealedCount === cardsCount / 2) {
            alert("You Won! Refresh to play again");
        }
        return;
    }

    // If cards don't match, wait and flip them back
    waiting = true;
    setTimeout(() => {
        hideCard(element);
        hideCard(activeCards);

        activeCards = null;
        waiting = false;
    }, 1000);
}

/**
 * Function to hide a card (set back to default hidden state)
 */
function hideCard(card) {
    card.style.backgroundImage = "url('card_photo.jpg')";
    card.style.backgroundColor = "";
}

/**
 * Function to update the move count on UI
 */
function updateMoves() {
    moves++;
    document.getElementById("movesCount").textContent = moves;
}

/**
 * Function to update the match count on UI
 */
function updateMatches() {
    document.getElementById("matchesCount").textContent = revealedCount;
}

/**
 * Function to reset the game
 */
function resetGame() {
    moves = 0;
    revealedCount = 0;
    activeCards = null;
    waiting = false;

    // Reset UI counters
    document.getElementById("movesCount").textContent = moves;
    document.getElementById("matchesCount").textContent = revealedCount;

    // Clear and reinitialize cards
    cardsContainer.innerHTML = "";
    initializeGame();
}

/**
 * Function to initialize the game (shuffle and create cards)
 */
function initializeGame() {
    let shuffledColors = [...colorPick]; // Copy color array for shuffling

    for (let i = 0; i < cardsCount; i++) {
        const randomIndex = Math.floor(Math.random() * shuffledColors.length);
        const cardColor = shuffledColors[randomIndex];
        shuffledColors.splice(randomIndex, 1);

        const card = buildCard(cardColor);
        cardsContainer.appendChild(card);
    }
}

// Initialize the game on page load
initializeGame();
