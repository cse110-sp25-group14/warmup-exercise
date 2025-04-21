// PT 3 !!!  GPTS intial run pts2 code with gpt mods for now-- will fix this as we go

const suits = ["spades", "hearts", "diamonds", "clubs"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const playerHandEl = document.getElementById("player-hand");
const dealerHandEl = document.getElementById("dealer-hand");
const startBtn = document.getElementById("start-button");
const hitBtn = document.getElementById("hit-button");
const standBtn = document.getElementById("stand-button");
const messageEl = document.getElementById("message");
const flipTpl = document.getElementById("flip-card-template");

let deck = [];
let playerHand = [];
let dealerHand = [];
let dealerHiddenCardEl = null;
let dealerHiddenCard = null;

// Build & shuffle deck
function buildDeck() {
    return suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
}
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Card logic
function getCardValue(card) {
    if (["J", "Q", "K"].includes(card.rank)) return 10;
    if (card.rank === "A") return 11;
    return parseInt(card.rank);
}
function calculateHandValue(hand) {
    let value = 0, aces = 0;
    for (const card of hand) {
        value += getCardValue(card);
        if (card.rank === "A") aces++;
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

// UI
function clearBoard() {
    playerHandEl.innerHTML = "";
    dealerHandEl.innerHTML = "";
    messageEl.textContent = "";
    dealerHiddenCardEl = null;
    dealerHiddenCard = null;
}
function renderCard(card, isHidden = false) {
    const clone = flipTpl.content.cloneNode(true);
    const container = clone.querySelector(".flip-card");
    const imgElem = clone.querySelector(".card-image");
    const rankLabel = clone.querySelector(".rank-label");

    if (!isHidden) {
        imgElem.src = `../cards/${card.suit}.png`;
        rankLabel.textContent = card.rank;
        if (card.suit === "hearts" || card.suit === "diamonds") {
            rankLabel.style.color = "#BC1E24";
        } else {
            rankLabel.style.color = "black";
        }
    }

    return container;
}
function revealDealerHiddenCard() {
    const newCard = renderCard(dealerHiddenCard);
    dealerHiddenCardEl.replaceWith(newCard);
}

function showMessage(text) {
    messageEl.textContent = text;
}

// Game logic
function startGame() {
    clearBoard();
    deck = shuffle(buildDeck());
    playerHand = [];
    dealerHand = [];

    // Player gets 2 cards
    playerHand.push(deck.pop());
    playerHand.push(deck.pop());

    // Dealer gets 1 face-up, 1 face-down
    dealerHand.push(deck.pop());
    dealerHiddenCard = deck.pop();

    // Render cards
    playerHand.forEach(card => playerHandEl.appendChild(renderCard(card)));
    dealerHandEl.appendChild(renderCard(dealerHand[0])); // visible card
    dealerHiddenCardEl = renderCard(dealerHiddenCard, true);
    dealerHandEl.appendChild(dealerHiddenCardEl);

    hitBtn.disabled = false;
    standBtn.disabled = false;
}

// Hit button
function playerHits() {
    const newCard = deck.pop();
    playerHand.push(newCard);
    playerHandEl.appendChild(renderCard(newCard));

    const value = calculateHandValue(playerHand);
    if (value > 21) {
        endGame("Player busts! Dealer wins.");
    } else if (playerHand.length === 5) {
        endGame("Player wins with 5 cards!");
    }
}

// Stand button
function playerStands() {
    revealDealerHiddenCard();
    dealerHand.push(dealerHiddenCard);

    while (calculateHandValue(dealerHand) < 17 ||
        (calculateHandValue(dealerHand) === 17 && hasSoft17(dealerHand))) {
        const card = deck.pop();
        dealerHand.push(card);
        dealerHandEl.appendChild(renderCard(card));
    }

    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (dealerTotal > 21) {
        endGame("Dealer busts! Player wins.");
    } else if (dealerTotal > playerTotal) {
        endGame("Dealer wins.");
    } else if (dealerTotal < playerTotal) {
        endGame("Player wins!");
    } else {
        endGame("It's a tie!");
    }
}

function hasSoft17(hand) {
    let value = 0, aces = 0;
    for (let card of hand) {
        value += getCardValue(card);
        if (card.rank === "A") aces++;
    }
    return value === 17 && aces > 0;
}

function endGame(message) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    showMessage(message);
}

// Button events
startBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", playerHits);
standBtn.addEventListener("click", playerStands);
