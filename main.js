// Game State
let gameState = {
  phase: "intro", // intro, playing, ended
  deaths: GAME_CONFIG.initialDeaths,
  displayedDeaths: GAME_CONFIG.initialDeaths,
  cured: 0,
  petCount: 0,
  punchIndex: 0,
  gameStartTime: null,
  deathInterval: null,
  waitingForResponse: false,
  animationFrameId: null,
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

// Audio system with different voices
function playAudio(text, speaker = "microphone") {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice based on speaker
    switch (speaker) {
      case "microphone":
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        // Try to find a female voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen")
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        break;

      case "duck":
        utterance.rate = 1.1;
        utterance.pitch = 1.8;
        utterance.volume = 0.9;
        break;

      case "player":
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        break;
    }

    speechSynthesis.speak(utterance);
  } else {
    console.log(`${speaker.toUpperCase()} Audio:`, text);
  }
}

// Smooth counter animation
function animateCounter(targetValue, currentValue, callback) {
  const difference = targetValue - currentValue;
  const increment = difference * 0.1;

  if (Math.abs(difference) < 1) {
    callback(Math.round(targetValue));
    return;
  }

  const newValue = currentValue + increment;
  callback(Math.round(newValue));

  gameState.animationFrameId = requestAnimationFrame(() =>
    animateCounter(targetValue, newValue, callback)
  );
}

function updateProgressBar() {
  const totalAlive = GAME_CONFIG.totalPopulation - gameState.deaths;
  const deathPercentage =
    (gameState.displayedDeaths / GAME_CONFIG.totalPopulation) * 100;
  const curedPercentage = (gameState.cured / GAME_CONFIG.totalPopulation) * 100;

  // Update progress bar visually
  // Red represents alive but not cured, Blue represents cured, Black represents dead
  const alivePercentage = Math.max(0, 100 - deathPercentage - curedPercentage);

  elements.progressDeath.style.width = `${alivePercentage}%`;
  elements.progressCured.style.width = `${curedPercentage}%`;

  // Animate death counter
  animateCounter(
    gameState.deaths,
    gameState.displayedDeaths,
    (displayValue) => {
      gameState.displayedDeaths = displayValue;
      elements.deathCount.textContent = `Deaths: ${displayValue.toLocaleString()}`;
    }
  );

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
    gameState.deaths = Math.round(gameState.deaths + deathRate);

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
  // Create or update dialogue element
  let dialogueEl = elements.dialogue;

  // Position dialogue based on speaker
  if (type === "duck") {
    dialogueEl.className = "dialogue duck-speak fade-in";
    dialogueEl.style.position = "absolute";
    dialogueEl.style.left = "20px";
    dialogueEl.style.right = "auto";
    dialogueEl.style.maxWidth = "300px";
    dialogueEl.style.top = "50%";
    dialogueEl.style.transform = "translateY(-50%)";
  } else if (type === "player") {
    dialogueEl.className = "dialogue player-speak fade-in";
    dialogueEl.style.position = "absolute";
    dialogueEl.style.right = "20px";
    dialogueEl.style.left = "auto";
    dialogueEl.style.maxWidth = "300px";
    dialogueEl.style.top = "50%";
    dialogueEl.style.transform = "translateY(-50%)";
  } else {
    // Default positioning for other types (like microphone)
    dialogueEl.className = "dialogue fade-in";
    dialogueEl.style.position = "relative";
    dialogueEl.style.left = "auto";
    dialogueEl.style.right = "auto";
    dialogueEl.style.maxWidth = "90%";
    dialogueEl.style.transform = "none";
    dialogueEl.style.top = "auto";
  }

  dialogueEl.textContent = text;
  dialogueEl.style.display = "block";

  // Play audio
  if (type === "duck") {
    playAudio(text, "duck");
  } else if (type === "player") {
    playAudio(text, "player");
  }

  // Clear any existing choice buttons
  const existingChoices = dialogueEl.querySelector(".choice-buttons");
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

    dialogueEl.appendChild(choiceContainer);
  } else {
    // Auto-hide dialogue after 4 seconds if no choices (longer for audio)
    setTimeout(() => {
      dialogueEl.style.display = "none";
      gameState.waitingForResponse = false;
      elements.punchBtn.disabled = false;
    }, 4000);
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
  if (gameState.animationFrameId) {
    cancelAnimationFrame(gameState.animationFrameId);
  }
  gameState.phase = "ended";

  // Stop any ongoing speech
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }

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
  const microphoneText =
    "We have found it - a way to cure the illness. You are the only one who can do it, the only one with the will power to do what must be done. You must.... punch that duck.";
  playAudio(microphoneText, "microphone");

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
