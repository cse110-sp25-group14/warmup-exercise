// step1/step1.js
const deckStack = document.getElementById("deck-stack");
const river = document.getElementById("river");
const stackTpl = document.getElementById("stack-card-template");
const slotTpl = document.getElementById("slot-template");
const shuffleBtn = document.getElementById("shuffle-button");

// Create 5-layered deck stack
for (let i = 1; i <= 5; i++) {
  const li = stackTpl.content.cloneNode(true).firstElementChild;
  li.id = `card${i}`;
  deckStack.appendChild(li);
}

// Display one visible card in the river
river.appendChild(slotTpl.content.cloneNode(true));

// Shuffle animation only
shuffleBtn.addEventListener("click", () => {
  deckStack.classList.add("shuffling");
  setTimeout(() => deckStack.classList.remove("shuffling"), 1000);
});