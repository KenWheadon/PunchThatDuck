// Main Game Logic
class DuckPunchGame {
  constructor() {
    this.gameState = {
      phase: "intro", // intro, playing, ended
      deaths: GAME_CONFIG.initialDeaths,
      displayedDeaths: GAME_CONFIG.initialDeaths,
      cured: 0,
      gameStartTime: null,
      deathInterval: null,
      lastActionTime: 0,

      // Pet path state
      petPath: {
        active: false,
        currentStage: 1,
        currentPets: 0,
        totalPets: 0,
        isEvil: false,
        isMutated: false,
      },

      // Punch path state
      punchPath: {
        active: false,
        currentStage: 1,
        currentHp: PUNCH_PATH_CONFIG.maxHp,
        maxHp: PUNCH_PATH_CONFIG.maxHp,
        punchesInStage: 0,
        totalPunches: 0,
        stageMaxHp: PUNCH_PATH_CONFIG.maxHp, // Track max HP for current stage
      },

      // Special states
      hasBeenRedeemed: false,
      storyChoicesMade: 0,
      exploredLore: false,
    };

    this.elements = this.initializeElements();
    this.setupEventListeners();
    this.initializeGame();
  }

  // Initialize DOM elements
  initializeElements() {
    return {
      headline: document.getElementById("headline"),
      speaker: document.getElementById("speaker"),
      duckContainer: document.getElementById("duckContainer"),
      duck: document.getElementById("duck"),
      progressBars: document.getElementById("progressBars"),
      loveMeter: document.getElementById("loveMeter"),
      loveFill: document.getElementById("loveFill"),
      hpBar: document.getElementById("hpBar"),
      hpFill: document.getElementById("hpFill"),
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
  }

  // Setup event listeners
  setupEventListeners() {
    // Game start
    this.elements.headline.onclick = () => this.startGame();

    // Action buttons
    this.elements.petBtn.onclick = () => this.processPet();
    this.elements.punchBtn.onclick = () => this.processPunch();

    // Setup event manager
    eventManager.setupGameEvents();

    // Listen for game events
    eventManager.on("game-end", (data) => {
      this.endGame(data.endingType);
    });

    eventManager.on("idle-timeout", () => {
      this.endGame("crab-rangoon");
    });
  }

  // Initialize game
  initializeGame() {
    this.updateProgressBar();
    eventManager.startIdleTracking();
    // FIXED: Initialize duck with default image
    this.elements.duck.textContent = ""; // Clear emoji since we're using background image
  }

  // Start the game
  startGame() {
    this.elements.headline.style.display = "none";
    this.elements.duckContainer.style.display = "block";
    this.elements.speaker.classList.add("wiggle");

    // Show intro message
    dialogueManager.showSystemMessage(SYSTEM_MESSAGES.introMicrophone, false);

    setTimeout(() => {
      this.elements.speaker.classList.add("broken");
      this.elements.progressContainer.style.display = "block";
      this.elements.actionButtons.style.display = "flex";
      this.updateProgressBar();
      this.startDeathTimer();
      this.gameState.phase = "playing";

      eventManager.triggerGameStart();
      dialogueManager.showSystemMessage(SYSTEM_MESSAGES.gameStart);
    }, 3000);
  }

  // Action cooldown system
  canPerformAction() {
    return (
      Date.now() - this.gameState.lastActionTime >= GAME_CONFIG.actionCooldown
    );
  }

  applyCooldown(button) {
    this.gameState.lastActionTime = Date.now();
    button.classList.add("cooldown");
    setTimeout(() => {
      button.classList.remove("cooldown");
    }, GAME_CONFIG.actionCooldown);

    // Reset idle tracking
    eventManager.resetIdleTracking();
  }

  // Duck animation functions
  animateDuckBob() {
    this.elements.duck.classList.remove("bob", "shake");
    this.elements.duck.classList.add("bob");
    setTimeout(() => this.elements.duck.classList.remove("bob"), 600);
  }

  animateDuckShake() {
    this.elements.duck.classList.remove("bob", "shake");
    this.elements.duck.classList.add("shake");
    setTimeout(() => this.elements.duck.classList.remove("shake"), 500);
  }

  // Update duck appearance
  updateDuckAppearance(sprite, imagePath = null) {
    if (imagePath) {
      this.elements.duck.style.backgroundImage = `url(${imagePath})`;
      this.elements.duck.style.backgroundSize = "contain";
      this.elements.duck.style.backgroundRepeat = "no-repeat";
      this.elements.duck.style.backgroundPosition = "center";
      this.elements.duck.textContent = "";
    } else {
      this.elements.duck.style.backgroundImage = "none";
      this.elements.duck.textContent = sprite;
    }
  }

  // Process pet action
  processPet() {
    if (!this.canPerformAction()) return;
    this.applyCooldown(this.elements.petBtn);

    // Initialize pet path on first pet
    if (!this.gameState.petPath.active) {
      this.gameState.petPath.active = true;
      this.elements.progressBars.style.display = "flex";
      this.elements.loveMeter.style.display = "block";
      // DON'T hide punch button - player can still abandon petting and punch

      eventManager.triggerPathLock("pet");
      dialogueManager.showSystemMessage(SYSTEM_MESSAGES.pathLocked);
    }

    // Increment pet counts
    this.gameState.petPath.currentPets++;
    this.gameState.petPath.totalPets++;

    // Animate duck
    this.animateDuckBob();

    // Update love meter
    this.updateLoveMeter();

    // Process dialogue
    const dialogueData = dialogueManager.processPetDialogue(
      this.gameState.petPath.totalPets
    );

    // Check for stage progression
    this.checkPetStageProgression();

    // Show hearts occasionally
    this.showHeartsIfNeeded();

    // Trigger events
    eventManager.triggerPetAction(
      this.gameState.petPath.totalPets,
      this.gameState.petPath.currentStage
    );
  }

  // Check pet stage progression
  checkPetStageProgression() {
    // Ensure we don't go beyond available stages
    if (
      this.gameState.petPath.currentStage >
      PET_PATH_CONFIG.stageRequirements.length
    ) {
      return;
    }

    const currentStageRequirement =
      PET_PATH_CONFIG.stageRequirements[
        this.gameState.petPath.currentStage - 1
      ];

    if (this.gameState.petPath.currentPets >= currentStageRequirement) {
      const oldStage = this.gameState.petPath.currentStage;

      // Advance to next stage
      this.gameState.petPath.currentStage++;
      this.gameState.petPath.currentPets = 0;

      // Update duck appearance with images
      this.updateDuckAppearanceForPetStage(oldStage);

      // Check for evil/mutation states
      if (
        this.gameState.petPath.currentStage >= PET_PATH_CONFIG.evilStartStage
      ) {
        this.gameState.petPath.isEvil = true;
      }

      if (
        this.gameState.petPath.currentStage >=
        PET_PATH_CONFIG.mutationStartStage
      ) {
        this.gameState.petPath.isMutated = true;
        this.elements.duck.classList.add("mutating");
        eventManager.triggerDuckMutation(this.gameState.petPath.currentStage);
      }

      // Check for final stage (perfect ending)
      if (
        this.gameState.petPath.currentStage >
        PET_PATH_CONFIG.stageRequirements.length
      ) {
        setTimeout(() => {
          eventManager.triggerFinalTransformation();
          dialogueManager.showFinalTransformation();
          setTimeout(() => eventManager.triggerGameEnd("perfect"), 3000);
        }, 1000);
      }

      eventManager.triggerStageChange(
        "pet",
        this.gameState.petPath.currentStage,
        oldStage
      );
    }
  }

  // Update duck appearance for pet stages (with images)
  updateDuckAppearanceForPetStage(stage) {
    const imagePath = `images/pet${stage}.png`;
    const fallbackSprite =
      PET_PATH_CONFIG.stageSprites[
        Math.min(stage - 1, PET_PATH_CONFIG.stageSprites.length - 1)
      ];

    // Try to use image first, fallback to emoji
    this.updateDuckAppearance(fallbackSprite, imagePath);
  }

  // Update love meter
  updateLoveMeter() {
    if (!this.gameState.petPath.active) return;

    // Ensure we don't go beyond available stages
    const stageIndex = Math.min(
      this.gameState.petPath.currentStage - 1,
      PET_PATH_CONFIG.stageRequirements.length - 1
    );
    const currentStageRequirement =
      PET_PATH_CONFIG.stageRequirements[stageIndex];
    const progress =
      (this.gameState.petPath.currentPets / currentStageRequirement) * 100;

    this.elements.loveFill.style.width = `${progress}%`;
    this.elements.loveFill.classList.add("filling");

    setTimeout(() => {
      this.elements.loveFill.classList.remove("filling");
    }, 300);
  }

  // Show hearts animation
  showHeartsIfNeeded() {
    const frequency = this.gameState.petPath.isEvil
      ? GAME_CONFIG.heartFrequencyEvil
      : GAME_CONFIG.heartFrequencyNormal;

    if (this.gameState.petPath.totalPets % frequency === 0) {
      dialogueManager.showHearts(
        this.elements.duckContainer,
        this.gameState.petPath.isEvil
      );
    }
  }

  // Process punch action
  processPunch() {
    if (!this.canPerformAction()) return;
    this.applyCooldown(this.elements.punchBtn);

    // Check for redemption (punching mutated duck)
    if (this.gameState.petPath.isMutated && !this.gameState.hasBeenRedeemed) {
      this.processRedemption();
      return;
    }

    // Initialize punch path on first punch
    if (!this.gameState.punchPath.active) {
      this.gameState.punchPath.active = true;
      this.elements.progressBars.style.display = "flex";
      this.elements.hpBar.style.display = "block";
      // Hide pet button ONLY when punching - duck doesn't trust you anymore
      this.elements.petBtn.style.display = "none";

      eventManager.triggerPathLock("punch");
      dialogueManager.showSystemMessage(
        "The duck no longer trusts you. Violence is your only path now."
      );
    }

    // Animate duck
    this.animateDuckShake();

    // Calculate damage
    const damage =
      PUNCH_PATH_CONFIG.damagePerPunch[
        this.gameState.punchPath.currentStage - 1
      ] || 10;
    this.gameState.punchPath.currentHp = Math.max(
      0,
      this.gameState.punchPath.currentHp - damage
    );
    this.gameState.punchPath.punchesInStage++;
    this.gameState.punchPath.totalPunches++;

    // Update HP bar
    this.updateHpBar();

    // Process dialogue with manipulation options
    const currentStage = this.gameState.punchPath.currentStage;
    const showManipulation =
      currentStage >= PUNCH_PATH_CONFIG.pleadingStartStage;
    dialogueManager.processPunchDialogue(
      currentStage,
      this.gameState.punchPath.punchesInStage,
      showManipulation
    );

    // Check for stage progression
    this.checkPunchStageProgression();

    // Trigger events
    eventManager.triggerPunchAction(
      this.gameState.punchPath.currentHp,
      currentStage
    );
  }

  // Check punch stage progression - FIXED
  checkPunchStageProgression() {
    // If HP reaches 0, move to next stage
    if (this.gameState.punchPath.currentHp <= 0) {
      const oldStage = this.gameState.punchPath.currentStage;

      // Check if we've reached the final stage (death)
      if (
        this.gameState.punchPath.currentStage >=
        PUNCH_PATH_CONFIG.stageHpThresholds.length + 1
      ) {
        setTimeout(() => {
          eventManager.triggerGameEnd("violent-antihero");
        }, 2000);
        return;
      }

      // Advance to next stage
      this.gameState.punchPath.currentStage++;
      this.gameState.punchPath.punchesInStage = 0;

      // Calculate new HP for this stage based on stage progression
      // Each stage gets progressively less HP: 10, 8, 6, 4, 2, 1...
      const baseHp = Math.max(
        1,
        12 - this.gameState.punchPath.currentStage * 2
      );
      this.gameState.punchPath.currentHp = baseHp;
      this.gameState.punchPath.stageMaxHp = baseHp;

      // Update duck appearance with images for punch stages
      this.updateDuckAppearanceForPunchStage(
        this.gameState.punchPath.currentStage
      );

      eventManager.triggerStageChange(
        "punch",
        this.gameState.punchPath.currentStage,
        oldStage
      );
    }
  }

  // Update duck appearance for punch stages (with images)
  updateDuckAppearanceForPunchStage(stage) {
    const imagePath = `images/punch${stage}.png`;
    const fallbackSprite =
      PUNCH_PATH_CONFIG.stageSprites[
        Math.min(stage - 1, PUNCH_PATH_CONFIG.stageSprites.length - 1)
      ] || "💀";

    // Try to use image first, fallback to emoji
    this.updateDuckAppearance(fallbackSprite, imagePath);
  }

  // Update HP bar - FIXED
  updateHpBar() {
    if (!this.gameState.punchPath.active) return;

    const progress =
      (this.gameState.punchPath.currentHp /
        this.gameState.punchPath.stageMaxHp) *
      100;

    this.elements.hpFill.style.width = `${progress}%`;
    this.elements.hpFill.classList.add("depleting");

    setTimeout(() => {
      this.elements.hpFill.classList.remove("depleting");
    }, 300);
  }

  // Process redemption sequence
  processRedemption() {
    this.gameState.hasBeenRedeemed = true;
    this.gameState.petPath.isMutated = false;

    // Reset duck appearance
    this.updateDuckAppearance("🦆");
    this.elements.duck.classList.remove("mutating", "monster");

    // Show redemption dialogue
    eventManager.triggerRedemptionSequence();
    dialogueManager.showRedemptionDialogue();

    // Continue with normal punch path
    this.gameState.punchPath.active = true;
    this.elements.progressBars.style.display = "flex";
    this.elements.hpBar.style.display = "block";
  }

  // Death timer system - FIXED
  startDeathTimer() {
    this.gameState.gameStartTime = Date.now();

    this.gameState.deathInterval = setInterval(() => {
      if (this.gameState.phase !== "playing") return;

      const deathRate = this.calculateDeathRate();
      this.gameState.deaths = Math.round(this.gameState.deaths + deathRate);

      this.updateProgressBar();
      eventManager.triggerDeathUpdate(this.gameState.deaths);

      // Check for idle timeout - FIXED: Trigger when everyone is dead
      if (this.gameState.deaths >= GAME_CONFIG.totalPopulation) {
        eventManager.triggerGameEnd("crab-rangoon");
        return;
      }

      // Check for game over conditions
      if (
        this.gameState.deaths + this.gameState.cured >=
        GAME_CONFIG.totalPopulation
      ) {
        if (
          this.gameState.petPath.active &&
          !this.gameState.petPath.totalPets >= 127
        ) {
          eventManager.triggerGameEnd("judged-a-book");
        } else if (
          this.gameState.punchPath.active &&
          this.gameState.punchPath.currentHp > 0
        ) {
          eventManager.triggerGameEnd("violent-hero");
        }
      }
    }, 1000);
  }

  // FIXED: New death rate calculation
  calculateDeathRate() {
    const elapsedTime = (Date.now() - this.gameState.gameStartTime) / 1000;

    // First 10 seconds: 1 death per second
    if (elapsedTime < 10) {
      return 1;
    }

    // After 10 seconds: Calculate rate to reach 8 billion by 8 minutes (480 seconds)
    const remainingTime = GAME_CONFIG.totalGameTime - elapsedTime;
    const remainingDeaths =
      GAME_CONFIG.totalPopulation -
      this.gameState.deaths -
      this.gameState.cured;

    if (remainingTime <= 0 || remainingDeaths <= 0) return 0;

    // Calculate exponential growth rate to reach total population
    const deathsAfter10Seconds = GAME_CONFIG.totalPopulation - 10; // 10 deaths in first 10 seconds
    const timeAfter10Seconds = GAME_CONFIG.totalGameTime - 10; // 470 seconds remaining

    // Use exponential formula: deaths = initial * e^(rate * time)
    const currentTimeAfter10 = elapsedTime - 10;
    const exponentialRate = Math.log(deathsAfter10Seconds) / timeAfter10Seconds;

    return Math.max(
      1,
      Math.exp(exponentialRate * currentTimeAfter10) * exponentialRate
    );
  }

  // Smooth counter animation
  animateCounter(targetValue, currentValue, callback) {
    const difference = targetValue - currentValue;
    const increment = difference * 0.1;

    if (Math.abs(difference) < 1) {
      callback(Math.round(targetValue));
      return;
    }

    const newValue = currentValue + increment;
    callback(Math.round(newValue));

    requestAnimationFrame(() =>
      this.animateCounter(targetValue, newValue, callback)
    );
  }

  // FIXED: Progress bar visual logic
  updateProgressBar() {
    const deathPercentage =
      (this.gameState.displayedDeaths / GAME_CONFIG.totalPopulation) * 100;
    const curedPercentage =
      (this.gameState.cured / GAME_CONFIG.totalPopulation) * 100;

    // FIXED: Death bar grows from left (black bar growing over red)
    this.elements.progressDeath.style.width = `${deathPercentage}%`;

    // FIXED: Cured bar grows from right, positioned correctly
    this.elements.progressCured.style.width = `${curedPercentage}%`;
    this.elements.progressCured.style.right = "0px";

    // Animate death counter
    this.animateCounter(
      this.gameState.deaths,
      this.gameState.displayedDeaths,
      (displayValue) => {
        this.gameState.displayedDeaths = displayValue;
        this.elements.deathCount.textContent = `Deaths: ${displayValue.toLocaleString()}`;
      }
    );

    if (this.gameState.cured > 0) {
      this.elements.curedCount.style.display = "block";
      this.elements.curedCount.textContent = `Cured: ${this.gameState.cured.toLocaleString()}`;
    }
  }

  // End game
  endGame(type) {
    clearInterval(this.gameState.deathInterval);
    this.gameState.phase = "ended";

    dialogueManager.forceHide();

    this.elements.actionButtons.style.display = "none";
    this.elements.dialogue.style.display = "none";

    const ending = ENDING_CONFIG[type];
    if (!ending) return;

    // Handle special ending effects
    if (ending.cureAll) {
      this.gameState.cured = GAME_CONFIG.totalPopulation;
      if (ending.reviveAll) {
        this.gameState.deaths = 0;
      }
      this.updateProgressBar();
      eventManager.triggerCureUpdate(this.gameState.cured);
    }

    // Show ending screen
    this.elements.endScreen.className = `end-screen ${ending.class} fade-in`;
    this.elements.endTitle.textContent = ending.title;
    this.elements.endMessage.textContent = ending.message;
    this.elements.endScreen.style.display = "block";

    // Show ending dialogue
    dialogueManager.showEndingDialogue(type);

    console.log("Game Stats:", eventManager.getPlayerStats());
    console.log("Performance:", eventManager.getPerformanceMetrics());
  }

  // Get current game state
  getGameState() {
    return { ...this.gameState };
  }

  // Destroy game instance
  destroy() {
    clearInterval(this.gameState.deathInterval);
    dialogueManager.destroy();
    eventManager.destroy();
  }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.duckPunchGame = new DuckPunchGame();
});
