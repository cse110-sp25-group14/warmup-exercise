// Define full deck data for a standard 52-card deck
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const deck = [];

// Create a card object for each suit and value combination
for (let suit of suits) {
  for (let value of values) {
    deck.push({ suit, value });
  }
}

// Variable to hold the current hand of 5 cards
let currentHand = [];

/**
 * Shuffle the deck using the Fisher-Yates algorithm.
 * Returns a new shuffled array.
 */
function shuffleDeck(sourceDeck) {
  const deckClone = [...sourceDeck];
  for (let i = deckClone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deckClone[i], deckClone[j]] = [deckClone[j], deckClone[i]];
  }
  return deckClone;
}

/**
 * Deals 5 random cards to the current hand and renders them.
 */
function dealHand() {
  const shuffledDeck = shuffleDeck(deck);
  // Select the first 5 cards from the shuffled deck
  currentHand = shuffledDeck.slice(0, 5);
  renderHand();
}

/**
 * Render the current hand of cards to the page.
 * Each card initially shows the card back.
 */
function renderHand() {
  // Assuming you have an element with id "hand-container" in your HTML
  const handContainer = document.getElementById('hand-container');
  // Clear any existing cards
  handContainer.innerHTML = '';

  currentHand.forEach((card, index) => {
    // Create a card element (you might later replace this with a custom web component)
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index; // tag the element for easy lookup

    // Initially, cards are face down
    cardElement.textContent = "Card Back";

    // Add a click event listener to flip the card
    cardElement.addEventListener('click', () => flipCard(index));

    handContainer.appendChild(cardElement);
  });
}

/**
 * Flip the specified card to reveal its face.
 * Clicking again might un-flip or could be disabled based on your design.
 */
function flipCard(index) {
  // Select the card element by its data-index attribute
  const cardElement = document.querySelector(`.card[data-index="${index}"]`);

  // Toggle card display based on current state
  if (cardElement.classList.contains('flipped')) {
    // If already flipped, show back of card (or you could choose to do nothing)
    cardElement.classList.remove('flipped');
    cardElement.textContent = "Card Back";
  } else {
    // Reveal the card face
    cardElement.classList.add('flipped');
    // Use the card's data to show its value and suit
    const cardData = currentHand[index];
    cardElement.textContent = `${cardData.value} of ${cardData.suit}`;
  }
}

/**
 * Event listener for the "Deal New Hand" button.
 * This replaces the current hand with 5 new random cards.
 */
document.getElementById('deal-button').addEventListener('click', () => {
  dealHand();
});

// Optionally, deal an initial hand when the page loads
// dealHand();
