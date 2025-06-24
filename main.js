// Game State
let gameState = {
  phase: "intro", // intro, playing, ended
  deaths: GAME_CONFIG.initialDeaths,
  cured: 0,
  petCount: 0,
  punchIndex: 0,
  gameStartTime: null,
  deathInterval: null,
  waitingForResponse: false,
};

// DOM Elements
const elements = {
  headline: document.getElementById("headline"),
  speaker: document.getElementById("speaker"),
  duckContainer: document.getElementById("duckContainer"),
  duck: document.getElementById("duck"),
  progressContainer: document.getElementById("progressContainer"),
  progressDeath: document.getElementById("progressDeath"),
  progressCured: document.getElementById("progressCured"),
  deathCount: document.getElementById("deathCount"),
  curedCount: document.getElementById("curedCount"),
  actionButtons: document.getElementById("actionButtons"),
  petBtn: document.getElementById("petBtn"),
  punchBtn: document.getElementById("punchBtn"),
  dialogue: document.getElementById("dialogue"),
  endScreen: document.getElementById("endScreen"),
  endTitle: document.getElementById("endTitle"),
  endMessage: document.getElementById("endMessage"),
};

// Audio simulation (you can replace with actual audio)
function playAudio(text) {
  console.log("Audio:", text);
  // You could use Web Speech API here: speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function updateProgressBar() {
  const totalAlive = GAME_CONFIG.totalPopulation - gameState.deaths;
  const deathPercentage =
    (gameState.deaths / GAME_CONFIG.totalPopulation) * 100;
  const curedPercentage = (gameState.cured / GAME_CONFIG.totalPopulation) * 100;

  elements.progressDeath.style.width = `${Math.max(0, 100 - curedPercentage)}%`;
  elements.progressCured.style.width = `${Math.min(100, curedPercentage)}%`;

  elements.deathCount.textContent = `Deaths: ${gameState.deaths.toLocaleString()}`;

  if (gameState.cured > 0) {
    elements.curedCount.style.display = "block";
    elements.curedCount.textContent = `Cured: ${gameState.cured.toLocaleString()}`;
  }
}

function calculateDeathRate() {
  const elapsedTime = (Date.now() - gameState.gameStartTime) / 1000;

  if (elapsedTime < GAME_CONFIG.deathRatePhase1Duration) {
    return GAME_CONFIG.deathRatePhase1;
  }

  // Exponential growth formula to reach 8 billion in 20 minutes
  const remainingTime = GAME_CONFIG.totalGameTime - elapsedTime;
  const remainingDeaths =
    GAME_CONFIG.totalPopulation - gameState.deaths - gameState.cured;

  if (remainingTime <= 0 || remainingDeaths <= 0) return 0;

  // Calculate rate needed to kill remaining population in remaining time
  return Math.max(1, remainingDeaths / remainingTime);
}

function startDeathTimer() {
  gameState.gameStartTime = Date.now();

  gameState.deathInterval = setInterval(() => {
    if (gameState.phase !== "playing") return;

    const deathRate = calculateDeathRate();
    gameState.deaths += deathRate;

    updateProgressBar();

    // Check for game over
    if (gameState.deaths + gameState.cured >= GAME_CONFIG.totalPopulation) {
      if (gameState.cured === 0) {
        endGame("game-over");
      } else {
        endGame("victory-violent");
      }
    }
  }, 1000);
}

function showDialogue(text, type = "duck", choices = null) {
  elements.dialogue.textContent = text;
  elements.dialogue.className = `dialogue ${
    type === "duck" ? "duck-speak" : "player-speak"
  } fade-in`;
  elements.dialogue.style.display = "block";

  // Clear any existing choice buttons
  const existingChoices = elements.dialogue.querySelector(".choice-buttons");
  if (existingChoices) existingChoices.remove();

  if (choices) {
    const choiceContainer = document.createElement("div");
    choiceContainer.className = "choice-buttons";

    choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = () => handleChoice(choice.result);
      choiceContainer.appendChild(btn);
    });

    elements.dialogue.appendChild(choiceContainer);
  } else {
    // Auto-hide dialogue after 3 seconds if no choices
    setTimeout(() => {
      elements.dialogue.style.display = "none";
      gameState.waitingForResponse = false;
      elements.punchBtn.disabled = false;
    }, 3000);
  }
}

function handleChoice(result) {
  elements.dialogue.style.display = "none";

  if (result.cured) {
    gameState.cured += result.cured;
    updateProgressBar();
  }

  if (result.duckSprite) {
    elements.duck.textContent = result.duckSprite;
  }

  if (result.duckSays) {
    showDialogue(result.duckSays, "duck");
  } else if (result.playerSays) {
    showDialogue(result.playerSays, "player");
  } else {
    gameState.waitingForResponse = false;
    elements.punchBtn.disabled = false;
  }
}

function processPunch() {
  if (
    gameState.waitingForResponse ||
    gameState.punchIndex >= PUNCH_SEQUENCE.length
  )
    return;

  gameState.waitingForResponse = true;
  elements.punchBtn.disabled = true;

  const sequence = PUNCH_SEQUENCE[gameState.punchIndex];
  gameState.punchIndex++;

  // Handle curing
  if (sequence.cured) {
    gameState.cured += sequence.cured;
    updateProgressBar();
  }

  // Handle sprite change
  if (sequence.duckSprite) {
    elements.duck.textContent = sequence.duckSprite;
  }

  // Handle dialogue or choices
  if (sequence.choices) {
    showDialogue("Choose your approach:", "duck", sequence.choices);
  } else if (sequence.duckSays) {
    showDialogue(sequence.duckSays, "duck");
  } else if (sequence.playerSays) {
    showDialogue(sequence.playerSays, "player");
  } else {
    gameState.waitingForResponse = false;
    elements.punchBtn.disabled = false;
  }

  // Check if sequence is complete
  if (gameState.punchIndex >= PUNCH_SEQUENCE.length) {
    setTimeout(() => endGame("victory-violent"), 2000);
  }

  // Check if everyone is cured
  if (gameState.cured >= GAME_CONFIG.totalPopulation - gameState.deaths) {
    setTimeout(() => endGame("victory-violent"), 2000);
  }
}

function processPet() {
  gameState.petCount++;

  // Duck quack animation
  elements.duck.style.transform = "scale(1.2)";
  setTimeout(() => {
    elements.duck.style.transform = "scale(1)";
  }, 200);

  // Show hearts every 5th pet
  if (gameState.petCount % GAME_CONFIG.heartThreshold === 0) {
    const hearts = document.createElement("div");
    hearts.className = "hearts";
    hearts.textContent = "💕";
    elements.duckContainer.style.position = "relative";
    elements.duckContainer.appendChild(hearts);

    setTimeout(() => hearts.remove(), 1000);
  }

  // Check for passive ending
  if (gameState.petCount >= GAME_CONFIG.petThreshold) {
    elements.duck.textContent = "👹"; // Monster duck
    elements.duck.classList.add("monster");

    setTimeout(() => {
      showDialogue(
        "I didn't expect humans to be so kind - you have passed the test. Goodbye",
        "duck"
      );

      // Cure everyone
      gameState.cured = GAME_CONFIG.totalPopulation - gameState.deaths;
      updateProgressBar();

      setTimeout(() => endGame("victory-passive"), 3000);
    }, 1000);
  }
}

function endGame(type) {
  clearInterval(gameState.deathInterval);
  gameState.phase = "ended";

  elements.actionButtons.style.display = "none";
  elements.dialogue.style.display = "none";

  const remaining = GAME_CONFIG.totalPopulation - gameState.deaths;

  switch (type) {
    case "victory-passive":
      elements.endScreen.className = "end-screen victory fade-in";
      elements.endTitle.textContent = "Passive Ending";
      elements.endMessage.textContent = `You saved ${remaining.toLocaleString()} people and the world thanks you for your kindness.`;
      break;

    case "victory-violent":
      elements.endScreen.className = "end-screen victory fade-in";
      elements.endTitle.textContent = "Violent Ending";
      elements.endMessage.textContent = `You saved ${gameState.cured.toLocaleString()} people and the world thanks you for your determination.`;
      break;

    case "game-over":
      elements.endScreen.className = "end-screen game-over fade-in";
      elements.endTitle.textContent = "Game Over";
      elements.endMessage.textContent =
        "All of humanity has perished. The cure was never found.";
      break;
  }

  elements.endScreen.style.display = "block";
}

// Event Listeners
elements.headline.onclick = () => {
  elements.headline.style.display = "none";
  elements.duckContainer.style.display = "block";

  // Speaker animation and audio
  elements.speaker.classList.add("wiggle");
  playAudio(
    "We have found it - a way to cure the illness. You are the only one who can do it, the only one with the will power to do what must be done. You must.... punch that duck."
  );

  setTimeout(() => {
    elements.speaker.classList.add("broken");
    elements.progressContainer.style.display = "block";
    elements.actionButtons.style.display = "flex";
    updateProgressBar();
    startDeathTimer();
    gameState.phase = "playing";
  }, 3000);
};

elements.petBtn.onclick = processPet;

elements.punchBtn.onclick = () => {
  // Hide pet button after first punch
  elements.petBtn.style.display = "none";
  processPunch();
};

// Initialize the game
updateProgressBar();
