// index.js
const suits     = ['spades','hearts','diamonds','clubs'];
const ranks     = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

const deckStack = document.getElementById('deck-stack');
const shuffleBtn= document.getElementById('shuffle-button');
const deal5Btn  = document.getElementById('deal-5-button');
const deal1Btn  = document.getElementById('deal-1-button');
const river     = document.getElementById('river');
const stackTpl  = document.getElementById('stack-card-template');
const slotTpl   = document.getElementById('slot-template');
const flipTpl   = document.getElementById('flip-card-template');

let currentDeck = [];
let nextSlotIdx = 0;

const savedDeck = localStorage.getItem('currentDeck');
if (savedDeck) currentDeck = JSON.parse(savedDeck);

const savedIdx = localStorage.getItem('nextSlotIdx');
if (savedIdx) nextSlotIdx = parseInt(savedIdx);

// Generate 5‑layered deck
for (let i = 1; i <= 5; i++) {
  const li = stackTpl.content.cloneNode(true).firstElementChild;
  li.id = `card${i}`;
  deckStack.appendChild(li);
}

// Read in 5 slots from last time, else generate 5 blank slots

//fixing this

const savedCards = JSON.parse(localStorage.getItem('dealtCards')) || [];

// looping over 5 cards
for (let i = 0; i < 5; i++) {
  //copying element for empty slot
  const li = slotTpl.content.cloneNode(true).firstElementChild;
  //naming slot and adding to river
  li.id = `slot${i}`;
  river.appendChild(li);

  // if card is saved we get it and copying the whole flipcard thing
  if (savedCards[i]) {
    const card = savedCards[i];
    const clone = flipTpl.content.cloneNode(true);
    const container = clone.querySelector('.flip-card');
    const imgElem = clone.querySelector('.card-image');
    const rankLabel = clone.querySelector('.rank-label');

    // adding the card suit and stuff
    imgElem.src = `./cards/${card.suit}.png`;
    rankLabel.textContent = card.rank;

    //had to flip the card over because it came opposite direction
    container.classList.add('flipped');
    container.addEventListener('click', () =>
      container.classList.toggle('flipped')
    );

    li.appendChild(clone);
  }
}

/*for (let i = 0; i < 5; i++) {
  if (localStorage.getItem('cards')) {
    //load the saved cards instead of blank cards 
  } 
  
  const li = slotTpl.content.cloneNode(true).firstElementChild;
  li.id = `slot${i}`;
  river.appendChild(li);
}*/

function buildDeck() {
  return suits.flatMap(s => ranks.map(r => ({ suit:s, rank:r })));
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  localStorage.setItem('fullDeck', JSON.stringify(deck)); //i believe this saves the deck to local storage? <-- not quite, need to stringify
  return deck;
}

// Shuffle button to shake the 5 stack
shuffleBtn.addEventListener('click', () => {
  deckStack.classList.add('shuffling');
  setTimeout(() => deckStack.classList.remove('shuffling'), 1000);

  currentDeck = shuffle(buildDeck());
  // localStorage only saves strings so jsonified the deck object to a json string
  localStorage.setItem('currentDeck', JSON.stringify(currentDeck)); //This should save the 5 visible cards. This is in the wrong place, needs to be moved.
  //need to save the bottom two too
  localStorage.setItem('nextSlotIdx', "0");
  localStorage.removeItem('dealtCards');   
  nextSlotIdx = 0;
  // // clear slots
   for (let i = 0; i < 5; i++) {
     document.getElementById(`slot${i}`).innerHTML = '';
   }
});

// Deal 5, at invervals, currently set to 400ms
deal5Btn.addEventListener('click', () => {
  if (!currentDeck.length) currentDeck = shuffle(buildDeck());
  for (let i = 0; i < 5; i++) {
    dealOne(i, i * 400);
  }
});

// Deal 1 at a time
deal1Btn.addEventListener('click', () => {
  if (!currentDeck.length) currentDeck = shuffle(buildDeck());
  if (nextSlotIdx < 5) {
    dealOne(nextSlotIdx, 0);
    nextSlotIdx++;
  }
});

// Core deal logic
function dealOne(idx, delay) {
  setTimeout(() => {
    if (!currentDeck[idx]) return; //prevent out of bounds crash

    const { suit, rank } = currentDeck[idx];
    const slot = document.getElementById(`slot${idx}`);
    slot.innerHTML = '';

    const clone = flipTpl.content.cloneNode(true);
    const container = clone.querySelector('.flip-card');
    const imgElem   = clone.querySelector('.card-image');
    const rankLabel = clone.querySelector('.rank-label');

    imgElem.src = `./cards/${suit}.png`;
    rankLabel.textContent = rank;

    container.addEventListener('click', () => 
      container.classList.toggle('flipped')
    );

    slot.appendChild(clone);
    //need to save cards after each deal, used AI to generate the line directly below this because it wasn't working when I tried
    let dealtCards = JSON.parse(localStorage.getItem('dealtCards')) || [];
    dealtCards[idx] = currentDeck[idx];
    localStorage.setItem('dealtCards', JSON.stringify(dealtCards));
    localStorage.setItem('nextSlotIdx', (idx + 1).toString());
  }, delay);
}