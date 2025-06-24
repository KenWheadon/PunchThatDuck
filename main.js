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
  isMutated: false, // tracks if duck has started mutating
  hasBeenRedeemed: false, // tracks if player punched after mutation
  storyChoicesMade: 0, // tracks how many story-focused choices player made
  exploredLore: false, // tracks if player learned the full story
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

// Helper function to get pet response based on pet count
function getPetResponse(petCount) {
  for (let responseGroup of PET_RESPONSES) {
    if (
      petCount >= responseGroup.petRange[0] &&
      petCount <= responseGroup.petRange[1]
    ) {
      const randomResponse =
        responseGroup.responses[
          Math.floor(Math.random() * responseGroup.responses.length)
        ];
      return {
        text: randomResponse,
        sprite: responseGroup.duckSprite,
        image: responseGroup.duckImage,
      };
    }
  }

  // Fallback for counts beyond defined ranges
  const lastGroup = PET_RESPONSES[PET_RESPONSES.length - 1];
  const randomResponse =
    lastGroup.responses[Math.floor(Math.random() * lastGroup.responses.length)];
  return {
    text: randomResponse,
    sprite: lastGroup.duckSprite,
    image: lastGroup.duckImage,
  };
}

// Helper function to update duck appearance
function updateDuckAppearance(sprite, imagePath = null) {
  if (imagePath) {
    // Use image if provided
    elements.duck.style.backgroundImage = `url(${imagePath})`;
    elements.duck.style.backgroundSize = "contain";
    elements.duck.style.backgroundRepeat = "no-repeat";
    elements.duck.style.backgroundPosition = "center";
    elements.duck.textContent = ""; // Hide emoji when using image
  } else {
    // Use emoji sprite
    elements.duck.style.backgroundImage = "none";
    elements.duck.textContent = sprite;
  }
}

// Duck animation functions
function animateDuckBob() {
  elements.duck.classList.remove("bob", "shake"); // Clear any existing animations
  elements.duck.classList.add("bob");

  // Remove the class after animation completes
  setTimeout(() => {
    elements.duck.classList.remove("bob");
  }, 600);
}

function animateDuckShake() {
  elements.duck.classList.remove("bob", "shake"); // Clear any existing animations
  elements.duck.classList.add("shake");

  // Remove the class after animation completes
  setTimeout(() => {
    elements.duck.classList.remove("shake");
  }, 500);
}

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
        // Adjust duck voice based on mutation state
        if (gameState.petCount >= GAME_CONFIG.mutationStartPet) {
          utterance.rate = 0.8; // Slower, more menacing
          utterance.pitch = 0.6; // Deeper, more evil
          utterance.volume = 1.0; // Louder
        } else {
          utterance.rate = 1.1;
          utterance.pitch = 1.8;
          utterance.volume = 0.9;
        }
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

  // Track story choices
  if (result.story) {
    gameState.storyChoicesMade++;
    if (gameState.storyChoicesMade >= 3) {
      gameState.exploredLore = true;
    }
  }

  if (result.cured) {
    // Ensure we never cure more than the living population
    const maxCurable =
      GAME_CONFIG.totalPopulation - gameState.deaths - gameState.cured;
    const actualCured = Math.min(result.cured, maxCurable);
    gameState.cured += actualCured;
    updateProgressBar();
  }

  if (result.duckSprite || result.duckImage) {
    updateDuckAppearance(result.duckSprite, result.duckImage);
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
  // Animate duck shake
  animateDuckShake();

  // Check if this is a redemption punch (duck has mutated but hasn't been redeemed)
  if (gameState.isMutated && !gameState.hasBeenRedeemed) {
    gameState.hasBeenRedeemed = true;

    // Show redemption dialogue and update appearance
    updateDuckAppearance(
      REDEMPTION_DIALOGUE.duckSprite,
      REDEMPTION_DIALOGUE.duckImage
    );
    showDialogue(REDEMPTION_DIALOGUE.duckSays, "duck");

    // Reset mutation state
    gameState.isMutated = false;

    // After redemption dialogue, show follow-up
    setTimeout(() => {
      showDialogue(REDEMPTION_DIALOGUE.followUp, "duck");
    }, 5000);

    return;
  }

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
    // Ensure we never cure more than the living population
    const maxCurable =
      GAME_CONFIG.totalPopulation - gameState.deaths - gameState.cured;
    const actualCured = Math.min(sequence.cured, maxCurable);
    gameState.cured += actualCured;
    updateProgressBar();
  }

  // Handle sprite/image change
  if (sequence.duckSprite || sequence.duckImage) {
    updateDuckAppearance(sequence.duckSprite, sequence.duckImage);
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

  // Animate duck bob
  animateDuckBob();

  // Get response for current pet count
  const response = getPetResponse(gameState.petCount);

  // Update duck appearance (sprite or image)
  updateDuckAppearance(response.sprite, response.image);

  // Check if duck has started mutating
  if (
    gameState.petCount >= GAME_CONFIG.mutationStartPet &&
    !gameState.isMutated
  ) {
    gameState.isMutated = true;
    // Add visual mutation effects
    elements.duck.classList.add("mutating");
  }

  // Show duck response
  showDialogue(response.text, "duck");

  // Show hearts every 5th pet (but less frequently as duck mutates)
  const heartFrequency = gameState.isMutated ? 10 : GAME_CONFIG.heartThreshold;
  if (gameState.petCount % heartFrequency === 0) {
    const hearts = document.createElement("div");
    hearts.className = "hearts";
    // Change heart type based on mutation state
    hearts.textContent = gameState.isMutated ? "💀" : "💕";
    elements.duckContainer.style.position = "relative";
    elements.duckContainer.appendChild(hearts);

    setTimeout(() => hearts.remove(), 1000);
  }

  // Check for passive ending (unchanged)
  if (gameState.petCount >= GAME_CONFIG.petThreshold) {
    updateDuckAppearance("👹", "images/pet_13_full_monster.png"); // Monster duck
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
      elements.endTitle.textContent = "Passive Ending - The Kindness Trap";
      elements.endMessage.textContent = `You saved ${remaining.toLocaleString()} people, but awakened something terrible through kindness. The duck revealed its true nature as Project Leviathan, yet chose to spare humanity in recognition of your compassion. A pyrrhic victory in a military blacksite where the greatest weapons are born.`;
      break;

    case "victory-violent":
      elements.endScreen.className = "end-screen victory fade-in";
      if (gameState.exploredLore) {
        elements.endTitle.textContent = STORY_ENDING.title;
        elements.endMessage.textContent = `${
          STORY_ENDING.message
        } You cured ${gameState.cured.toLocaleString()} people and witnessed that even in the darkest military facilities, redemption is possible through understanding and sacrifice.`;
      } else {
        elements.endTitle.textContent = "Violent Ending - Necessary Force";
        elements.endMessage.textContent = `You saved ${gameState.cured.toLocaleString()} people through decisive action in this military blacksite. The duck was transformed from weapon to healer through violence, though you may wonder what deeper truths you missed by focusing only on results.`;
      }
      break;

    case "game-over":
      elements.endScreen.className = "end-screen game-over fade-in";
      elements.endTitle.textContent = "Extinction Event";
      elements.endMessage.textContent =
        "All of humanity has perished. The bioweapon completed its original programming in this dark facility. Sometimes even the best intentions cannot overcome inaction in the face of military-grade threats.";
      break;
  }

  // Add replay hint for story seekers
  if (!gameState.exploredLore && type === "victory-violent") {
    elements.endMessage.textContent +=
      "\n\nHint: Try playing again and asking the duck more questions to uncover the full story of Project Leviathan and what really happens in military blacksites.";
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
    "Emergency Protocol 7-Alpha activated. We've located the source in this military blacksite - Project Leviathan, designation 'Duck'. Our scientists believe controlled trauma may reverse its bioweapon protocols. You have been selected for psychological compatibility. You must... punch that duck. Time is running out.";
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
  // Hide pet button after first punch (unless it's a redemption punch)
  if (!gameState.isMutated) {
    elements.petBtn.style.display = "none";
  }
  processPunch();
};

// Initialize the game
updateProgressBar();
