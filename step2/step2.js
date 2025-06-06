// step2/step2.js
const suits = ["spades", "hearts", "diamonds", "clubs"];
const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
];

const deckStack = document.getElementById("deck-stack");
const shuffleBtn = document.getElementById("shuffle-button");
const deal5Btn = document.getElementById("deal-5-button");
const deal1Btn = document.getElementById("deal-1-button");
const river = document.getElementById("river");
const stackTpl = document.getElementById("stack-card-template");
const slotTpl = document.getElementById("slot-template");
const flipTpl = document.getElementById("flip-card-template");

let currentDeck = [];
let nextSlotIdx = 0;
let eventInProgress = false;

//localStorage function
function saveState() {
    localStorage.setItem("deck", JSON.stringify(currentDeck));
    localStorage.setItem("nextSlotIdx", nextSlotIdx.toString());
}
function loadState() { //loads previous state if it exists
    const savedDeck = localStorage.getItem("deck");
    const savedIdx = localStorage.getItem("nextSlotIdx");

    if (savedDeck) {
        currentDeck = JSON.parse(savedDeck);
    }
    if (savedIdx) {
        nextSlotIdx = parseInt(savedIdx, 10);
    }

    clearBoard();
    for (let i = 0; i < nextSlotIdx; i++) {
        if (currentDeck[i]) {
            dealOne(i, 0, currentDeck[i]);
        }
    }
}


// Generate 5‑layered deck
for (let i = 1; i <= 5; i++) {
    // clones card-slot (first li under stackTpl) and changes id then adds to deck
    const li = stackTpl.content.cloneNode(true).firstElementChild;
    li.id = `card${i}`;
    //deckStack is empty ul
    deckStack.appendChild(li);
}

// Generate 5 blank slots
for (let i = 0; i < 5; i++) {
    const li = slotTpl.content.cloneNode(true).firstElementChild;
    li.id = `slot${i}`;
    //river is empty ul
    river.appendChild(li);
}
loadState();

/**
 * created clearBoard function for clearer code (just clears the HTML of slots) 
 */
function clearBoard() {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`slot${i}`).innerHTML = "";
    }
    //nextSlotIdx = 0; //--check if I actually should remove this
}


/**
 * builds deck array with each element a data struct containing suit and rank
 */
function buildDeck() {
    return suits.flatMap((s) => ranks.map((r) => ({ suit: s, rank: r })));
}

/**
 * shuffle algo written by chat (probably works)
 * @param {*} deck
 * @returns
 */
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

/**
 * Shuffle button to shake the 5 stack
 */
shuffleBtn.addEventListener("click", () => {
    if (eventInProgress) return;

    deckStack.classList.add("shuffling");
    setTimeout(() => deckStack.classList.remove("shuffling"), 1000);
    currentDeck = shuffle(buildDeck());
    nextSlotIdx = 0;
    //clear slots (this was commented out before since the card replacement didn't work, so clearing the board didn't do anything)
    clearBoard();
    saveState();
});

// Deal 5, at invervals, currently set to 400ms
deal5Btn.addEventListener("click", () => {
    if (eventInProgress) return;
    eventInProgress = true;

    //reset board for visual coherence (optional, won't affect deck logic)
    clearBoard();
    if (!currentDeck.length) currentDeck = shuffle(buildDeck());
    for (let i = 0; i < 5; i++) {
        dealOne(i, i * 400);
        //currentDeck.shift();
    }
    nextSlotIdx = 5;
    saveState();
    setTimeout(() => {
        eventInProgress = false;
    }, 4 * 400);
});

// Deal 1 at a time
deal1Btn.addEventListener("click", () => {
    if (eventInProgress) return;

    //reset board at first and last card
    if (nextSlotIdx == 0 || nextSlotIdx == 5) {
        clearBoard();
    }
    //reset board if too many cards
    if (nextSlotIdx == 5) {
        nextSlotIdx = 0;
    }
    if (!currentDeck.length) currentDeck = shuffle(buildDeck());
    if (nextSlotIdx < 5) {
        dealOne(nextSlotIdx, 0);
        //currentDeck.shift();
        nextSlotIdx++;
    }
    saveState();
});

// Core deal logic
function dealOne(idx, delay, card = null) {

    setTimeout(() => {
        const { suit, rank } = card || currentDeck[idx];
        const slot = document.getElementById(`slot${idx}`);
        slot.innerHTML = "";

        const clone = flipTpl.content.cloneNode(true);
        const container = clone.querySelector(".flip-card");
        const imgElem = clone.querySelector(".card-image");
        const rankLabel = clone.querySelector(".rank-label");

        imgElem.src = `../cards/${suit}.png`;
        rankLabel.textContent = rank;

        container.addEventListener("click", () =>
            container.classList.toggle("flipped")
        );

        //coloring the text of the cards accordingly
        if (suit === "hearts" || suit === "diamonds") {
            rankLabel.style.color = "#BC1E24";
        } else {
            rankLabel.style.color = "black";
        }

        slot.appendChild(clone);
    }, delay);
}