// Enhanced click handlers with better feedback
  handlePetClick() {
    // Check cooldown
    if (!this.canClick()) return;
    
    if (this.gameState.punchingStarted) return;

    // Add body click effect
    document.body.classList.add('clicking');
    setTimeout(() => document.body.classList.remove('clicking'), 100);

    this.setCooldown();
    this.gameState.duckMode = "pet";
    this.gameState.petClicks++;

    // Enhanced click effects
    this.createClickEffect('💝', this.elements.petButton);
    this.addClickAnimation(this.elements.petButton);

    // PETTING DOES NOT CURE ANYONE - only transforms the duck
    this.achievementManager.trackPet();

    // Show pet dialogue via speech bubble
    const petInStage =
      ((this.gameState.petClicks - 1) % this.getCurrentPetRequirement()) + 1;
    const dialogueData = this.getPetDialogue(
      this.gameState.duckStage,
      petInStage
    );
    this.showSpeechBubble(dialogueData);

    // Track moral dilemma achievement (petting while people die)
    if (this.gameState.currentDeaths > 1000000) {
      // 1 million+ dead
      this.achievementManager.unlockAchievement("moral-dilemma");
    }

    const petsNeeded = this.getCurrentPetRequirement();

    if (this.gameState.petClicks >= petsNeeded) {
      // Advance to next pet stage with celebration
      if (this.gameState.duckStage < CONFIG.TOTAL_PET_STAGES) {
        this.gameState.duckStage++;
        this.gameState.petClicks = 0;
        this.updateDuckImage();
        
        // Add stage completion effect
        this.createStageCompletionEffect();

        // Track mutation witness achievement
        if (this.gameState.duckStage >= 6) {
          this.achievementManager.unlockAchievement("mutation-witness");
        }

        // Check for perfect ending
        if (this.gameState.duckStage === CONFIG.TOTAL_PET_STAGES) {
          this.achievementManager.unlockAchievement("pet-master");
          setTimeout(() => {
            this.showPerfectEnding();
          }, CONFIG.DIALOGUE_DISPLAY_TIME + 500);
          return;
        }
      }
    }

    this.updateUI();
  }

  handlePunchClick() {
    // Check cooldown
    if (!this.canClick()) return;

    // Add body click effect
    document.body.classList.add('clicking');
    setTimeout(() => document.body.classList.remove('clicking'), 100);

    this.setCooldown();

    if (!this.gameState.punchingStarted) {
      // First punch - disable petting and switch to punch mode
      this.gameState.punchingStarted = true;
      this.gameState.duckMode = "punch";
      this.gameState.duckStage = 1;
      this.gameState.punchProgress = 100; // Reset to 100 HP

      // Hide pet progress, show punch progress
      this.elements.petProgressContainer.classList.add("hidden");
      this.elements.punchProgressContainer.classList.remove("hidden");

      // Disable pet button with visual feedback
      this.elements.petButton.disabled = true;
      this.elements.petButton.style.opacity = '0.3';
      this.elements.petButton.style.filter = 'grayscale(100%)';
    }

    const damage = this.getCurrentPunchDamage();
    this.gameState.punchProgress = Math.max(
      0,
      this.gameState.punchProgress - damage
    );
    this.gameState.punchClicks++;

    // Enhanced punch effects
    this.createClickEffect('💥', this.elements.punchButton);
    this.addClickAnimation(this.elements.punchButton);
    
    // Add duck hit animation
    this.elements.mainDuck.classList.add('clicked');
    setTimeout(() => this.elements.mainDuck.classList.remove('clicked'), 500);

    // PUNCHING CURES PEOPLE - this is the moral dilemma!
    this.gameState.curedPopulation += CONFIG.CURE_PER_PUNCH;
    this.achievementManager.trackPunch();
    this.achievementManager.trackCure(CONFIG.CURE_PER_PUNCH);

    // Show punch dialogue via speech bubble
    const punchStage = this.getPunchStage();
    const punchInStage = this.gameState.punchClicks;
    const dialogueData = this.getPunchDialogue(punchStage, punchInStage);
    this.showSpeechBubble(dialogueData);

    // Check achievements
    if (this.gameState.curedPopulation >= 1000000000) {
      this.achievementManager.unlockAchievement("life-saver");
    }

    // Check if HP reached 0 - only then advance to next stage
    if (this.gameState.punchProgress <= 0) {
      if (this.gameState.duckStage < CONFIG.TOTAL_PUNCH_STAGES) {
        // Advance to next stage and reset HP with +1 bonus
        this.gameState.duckStage++;
        this.gameState.punchProgress = this.getCurrentMaxHP();
        this.updateDuckImage();
        
        // Add stage completion effect
        this.createStageCompletionEffect();
      } else {
        // Duck is completely defeated
        this.achievementManager.unlockAchievement("punch-master");
        setTimeout(() => {
          this.showSpeechBubble(this.dialogueData.punchDialogue.death);
          setTimeout(() => {
            this.showPunchEnding();
          }, CONFIG.DIALOGUE_DISPLAY_TIME);
        }, 500);
        return;
      }
    }

    this.updateUI();
  }

  // New helper functions for enhanced effects
  createClickEffect(emoji, element) {
    const rect = element.getBoundingClientRect();
    const effect = document.createElement("div");
    effect.classList.add("click-effect");
    effect.textContent = emoji;
    effect.style.left = (rect.left + rect.width / 2) + "px";
    effect.style.top = (rect.top + rect.height / 2) + "px";
    effect.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1200);
  }

  createStageCompletionEffect() {
    // Create celebration burst around duck
    const rect = this.elements.mainDuck.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.textContent = '⭐';
        star.style.position = 'absolute';
        star.style.left = centerX + 'px';
        star.style.top = centerY + 'px';
        star.style.fontSize = '2em';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '1000';
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 80;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        star.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        document.body.appendChild(star);
        
        setTimeout(() => {
          star.style.left = endX + 'px';
          star.style.top = endY + 'px';
          star.style.opacity = '0';
          star.style.transform = 'scale(2) rotate(360deg)';
        }, 50);
        
        setTimeout(() => star.remove(), 1050);
      }, i * 100);
    }
  }// Duck Punch Game - Main Application
class DuckPunchGame {
  constructor() {
    this.gameState = {
      currentScreen: "start",
      duckStage: 1,
      duckMode: "neutral", // 'neutral', 'pet', 'punch'
      petProgress: 0,
      punchProgress: 100,
      petClicks: 0,
      punchClicks: 0,
      punchingStarted: false,
      // Population tracking
      totalPopulation: CONFIG.TOTAL_POPULATION,
      currentDeaths: 0,
      curedPopulation: 0,
      gameStartTime: null,
      deathTimer: null,
      lastDeathUpdate: 0,
      deathRate: 0,
      // Cooldown system
      lastClickTime: 0,
      clickCooldown: 250, // 0.25 seconds in milliseconds
    };

    this.elements = {};
    this.dialogueData = null;
    this.achievementManager = null;
    this.achievementDrawer = null;
    this.speechBubbleTimeout = null;

    this.init();
  }

  async init() {
    console.log("Initializing Duck Punch game...");

    // Load dialogue data
    await this.loadDialogueData();

    // Initialize DOM elements
    this.initElements();

    // Initialize achievement system
    this.initAchievements();

    // Attach event listeners
    this.attachEventListeners();

    // Initialize UI
    this.updateUI();

    console.log("Duck Punch game initialized successfully");
  }

  async loadDialogueData() {
    try {
      const response = await fetch("duck-info.json");
      this.dialogueData = await response.json();
      console.log("Dialogue data loaded successfully");
    } catch (error) {
      console.error("Failed to load dialogue data:", error);
      // Fallback dialogue data
      this.dialogueData = {
        petDialogue: {
          stage1: { pet1: { dialogue: "Quack!", mood: "neutral" } },
        },
        punchDialogue: {
          stage1: { punch1: { dialogue: "Ow!", mood: "hurt" } },
        },
      };
    }
  }

  initElements() {
    this.elements = {
      startScreen: document.getElementById("start-screen"),
      newsScreen: document.getElementById("news-screen"),
      mainGame: document.getElementById("main-game"),
      startButton: document.getElementById("start-button"),
      mainDuck: document.getElementById("main-duck"),
      petButton: document.getElementById("pet-button"),
      punchButton: document.getElementById("punch-button"),
      petProgress: document.getElementById("pet-progress"),
      punchProgress: document.getElementById("punch-progress"),
      petProgressContainer: document.getElementById("pet-progress-container"),
      punchProgressContainer: document.getElementById("punch-progress-container"),
      curedFill: document.getElementById("cured-fill"),
      deadFill: document.getElementById("dead-fill"),
      populationStats: document.getElementById("population-stats"),
      speechBubble: document.getElementById("duck-speech-bubble"),
      speechText: document.getElementById("speech-text"),
      deathCounter: document.getElementById("death-counter"),
      deathRate: document.getElementById("death-rate"),
      endingScreenOverlay: document.getElementById("ending-screen-overlay"),
      endingTitle: document.getElementById("ending-title"),
      endingDuckImage: document.getElementById("ending-duck-image"),
      endingDescription: document.getElementById("ending-description"),
      endingStats: document.getElementById("ending-stats"),
      endingSaved: document.getElementById("ending-saved"),
      endingLost: document.getElementById("ending-lost"),
      tryAgainButton: document.getElementById("try-again-button"),
    };
  }

  initAchievements() {
    this.achievementManager = new AchievementManager();
    this.achievementDrawer = new AchievementDrawer(this.achievementManager);
  }

  attachEventListeners() {
    this.elements.startButton.addEventListener("click", () =>
      this.showNewsScreen()
    );
    this.elements.newsScreen.addEventListener("click", () =>
      this.showMainGame()
    );
    this.elements.petButton.addEventListener("click", () =>
      this.handlePetClick()
    );
    this.elements.punchButton.addEventListener("click", () =>
      this.handlePunchClick()
    );
    
    // Add duck click for initial interaction
    this.elements.mainDuck.addEventListener("click", () =>
      this.showInitialSpeech()
    );

    // Add try again button listener
    this.elements.tryAgainButton.addEventListener("click", () =>
      this.resetGame()
    );
  }

  // Cooldown check function
  canClick() {
    const now = Date.now();
    return now - this.gameState.lastClickTime >= this.gameState.clickCooldown;
  }

  setCooldown() {
    this.gameState.lastClickTime = Date.now();
    
    // Add visual cooldown to buttons
    this.elements.petButton.classList.add('cooldown');
    this.elements.punchButton.classList.add('cooldown');
    
    setTimeout(() => {
      this.elements.petButton.classList.remove('cooldown');
      this.elements.punchButton.classList.remove('cooldown');
    }, this.gameState.clickCooldown);
  }

  // Utility Functions
  updateDuckImage() {
    let imagePath = "images/duck.png";

    if (this.gameState.duckMode === "pet" && this.gameState.duckStage > 1) {
      imagePath = `images/pet${this.gameState.duckStage}.png`;
    } else if (
      this.gameState.duckMode === "punch" &&
      this.gameState.duckStage > 1
    ) {
      imagePath = `images/punch${this.gameState.duckStage}.png`;
    }

    this.elements.mainDuck.src = imagePath;
  }

  updatePetProgress() {
    const totalPetsNeeded = this.getCurrentPetRequirement();
    const currentProgress = (this.gameState.petClicks / totalPetsNeeded) * 100;
    this.elements.petProgress.style.width = `${Math.min(
      currentProgress,
      100
    )}%`;
  }

  updatePunchProgress() {
    const progressPercentage = (this.gameState.punchProgress / this.getCurrentMaxHP()) * 100;
    this.elements.punchProgress.style.width = `${Math.max(
      progressPercentage,
      0
    )}%`;
  }

  getCurrentMaxHP() {
    // HP increases by 1 for each stage: 100, 101, 102, 103, etc.
    return 100 + (this.gameState.duckStage - 1);
  }

  getCurrentPetRequirement() {
    const stageIndex = this.gameState.duckStage - 1;
    return (
      CONFIG.PET_STAGES[stageIndex] ||
      CONFIG.PET_STAGES[CONFIG.PET_STAGES.length - 1]
    );
  }

  getCurrentPunchDamage() {
    const stageIndex = this.gameState.duckStage - 1;
    return (
      CONFIG.PUNCH_STAGES[stageIndex] ||
      CONFIG.PUNCH_STAGES[CONFIG.PUNCH_STAGES.length - 1]
    );
  }

  // Population tracking functions
  getExponentialValueAtTime(z, N, T) {
    if (T <= 0 || N <= 0) {
      throw new Error("Target number (N) and total time (T) must be positive");
    }
    if (z < 0) {
      throw new Error("Current time (z) must be non-negative");
    }
    // Modified formula to ensure minimum deaths from the start
    // Base exponential growth plus linear component to ensure immediate deaths
    const exponentialComponent = Math.pow(N, z / T) - 1;
    const linearComponent = z * 60; // 60 deaths per minute minimum (1 per second)
    return Math.max(exponentialComponent, linearComponent);
  }

  // Enhanced visual feedback for population updates
  updatePopulationMeter() {
    if (!this.gameState.gameStartTime) return;

    const currentTime = (Date.now() - this.gameState.gameStartTime) / 1000 / 60; // minutes

    // Calculate exponential deaths over time (this is the core tragedy)
    const newDeaths = Math.floor(
      this.getExponentialValueAtTime(
        currentTime,
        this.gameState.totalPopulation,
        CONFIG.TOTAL_GAME_TIME
      )
    );

    // Calculate death rate for display (deaths since last update)
    this.gameState.deathRate = Math.max(0, newDeaths - this.gameState.currentDeaths);
    this.gameState.currentDeaths = newDeaths;

    // Remaining population calculation
    const savedByPunching = this.gameState.curedPopulation;
    const actualDeaths = Math.max(
      0,
      this.gameState.currentDeaths - savedByPunching
    );
    const remainingPopulation = Math.max(
      0,
      this.gameState.totalPopulation - actualDeaths - savedByPunching
    );

    // Update bars (as percentages of total population)
    const deathPercent = Math.min(
      (actualDeaths / this.gameState.totalPopulation) * 100,
      100
    );
    const curedPercent = Math.min(
      (savedByPunching / this.gameState.totalPopulation) * 100,
      100
    );

    this.elements.deadFill.style.width = `${deathPercent}%`;
    this.elements.curedFill.style.width = `${curedPercent}%`;

    // Update stats text with enhanced formatting
    document.querySelector(".dead-count").textContent =
      this.formatNumber(actualDeaths);
    document.querySelector(".cured-count").textContent =
      this.formatNumber(savedByPunching);
    document.querySelector(".remaining-count").textContent =
      this.formatNumber(remainingPopulation);

    // Update death rate display
    this.elements.deathRate.textContent = this.formatNumber(this.gameState.deathRate);

    // Enhanced urgency visual effects
    const deathCounterElement = this.elements.deathCounter;
    if (actualDeaths > 100000000) { // 100 million deaths - critical
      deathCounterElement.classList.add('urgent');
      deathCounterElement.style.backgroundColor = 'rgba(255, 0, 0, 1)';
      // Add screen shake for extreme urgency
      if (actualDeaths > 1000000000) { // 1 billion deaths
        document.getElementById('game-container').classList.add('screen-shake-intense');
        setTimeout(() => {
          document.getElementById('game-container').classList.remove('screen-shake-intense');
        }, 500);
      }
    } else if (actualDeaths > 10000000) { // 10 million deaths - warning
      deathCounterElement.style.animation = 'deathCounterFlicker 1s infinite';
      deathCounterElement.style.backgroundColor = 'rgba(255, 50, 0, 0.95)';
    }

    // Add population bar effects based on death percentage
    if (deathPercent > 50) {
      this.elements.deadFill.style.animation = 'deadPulse 1s infinite ease-in-out';
    }
    if (curedPercent > 30) {
      this.elements.curedFill.style.animation = 'curedPulse 1s infinite ease-in-out';
    }
  }

  formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }

  // Enhanced speech bubble with better animations
  showSpeechBubble(dialogueData) {
    const bubble = this.elements.speechBubble;
    const text = this.elements.speechText;

    // Clear existing timeout
    if (this.speechBubbleTimeout) {
      clearTimeout(this.speechBubbleTimeout);
    }

    // Enhanced text animation
    text.style.opacity = '0';
    text.textContent = dialogueData.dialogue;

    // Clear existing styling
    bubble.className = "duck-speech-bubble";

    // Add mood-based styling
    if (dialogueData.mood) {
      bubble.classList.add(dialogueData.mood);
    }

    // Show bubble with enhanced animation
    bubble.classList.add("show");
    
    // Animate text in
    setTimeout(() => {
      text.style.opacity = '1';
      text.style.animation = 'typeWriter 0.8s ease-out';
    }, 200);

    // Add speech bubble pulse for important messages
    if (dialogueData.mood === 'monster' || dialogueData.mood === 'evil') {
      bubble.style.animation = 'evilPulse 1.5s infinite';
    }

    // Auto-hide after display time
    this.speechBubbleTimeout = setTimeout(() => {
      this.hideSpeechBubble();
    }, CONFIG.DIALOGUE_DISPLAY_TIME + 500);
  }

  hideSpeechBubble() {
    const bubble = this.elements.speechBubble;
    bubble.classList.remove("show");
    bubble.style.animation = '';
    if (this.speechBubbleTimeout) {
      clearTimeout(this.speechBubbleTimeout);
      this.speechBubbleTimeout = null;
    }
  }

  showInitialSpeech() {
    if (this.gameState.currentScreen === "main" && 
        this.gameState.petClicks === 0 && 
        this.gameState.punchClicks === 0) {
      this.showSpeechBubble({
        dialogue: "I'm just a harmless duck... or am I? Choose your path wisely.",
        mood: "innocent"
      });
    }
  }

  getPetDialogue(stage, petInStage) {
    const stageKey = `stage${stage}`;
    const petKey = `pet${petInStage}`;

    if (
      this.dialogueData.petDialogue[stageKey] &&
      this.dialogueData.petDialogue[stageKey][petKey]
    ) {
      return this.dialogueData.petDialogue[stageKey][petKey];
    }

    // Fallback dialogue
    return {
      dialogue: "Quack... something is happening to me.",
      mood: "neutral",
    };
  }

  getPunchDialogue(stage, punchInStage) {
    const stageKey = `stage${stage}`;
    const punchKey = `punch${punchInStage}`;

    if (
      this.dialogueData.punchDialogue[stageKey] &&
      this.dialogueData.punchDialogue[stageKey][punchKey]
    ) {
      return this.dialogueData.punchDialogue[stageKey][punchKey];
    }

    // Fallback dialogue
    return {
      dialogue: "Ow... why are you doing this?",
      mood: "hurt",
      manipulation: {
        text: "Please stop...",
        type: "simple_plea",
      },
    };
  }

  // Game Logic Functions
  handlePetClick() {
    // Check cooldown
    if (!this.canClick()) return;
    
    if (this.gameState.punchingStarted) return;

    this.setCooldown();
    this.gameState.duckMode = "pet";
    this.gameState.petClicks++;

    // PETTING DOES NOT CURE ANYONE - only transforms the duck
    this.achievementManager.trackPet();

    // Show pet dialogue via speech bubble
    const petInStage =
      ((this.gameState.petClicks - 1) % this.getCurrentPetRequirement()) + 1;
    const dialogueData = this.getPetDialogue(
      this.gameState.duckStage,
      petInStage
    );
    this.showSpeechBubble(dialogueData);

    // Track moral dilemma achievement (petting while people die)
    if (this.gameState.currentDeaths > 1000000) {
      // 1 million+ dead
      this.achievementManager.unlockAchievement("moral-dilemma");
    }

    const petsNeeded = this.getCurrentPetRequirement();

    if (this.gameState.petClicks >= petsNeeded) {
      // Advance to next pet stage
      if (this.gameState.duckStage < CONFIG.TOTAL_PET_STAGES) {
        this.gameState.duckStage++;
        this.gameState.petClicks = 0;
        this.updateDuckImage();

        // Track mutation witness achievement
        if (this.gameState.duckStage >= 6) {
          this.achievementManager.unlockAchievement("mutation-witness");
        }

        // Check for perfect ending
        if (this.gameState.duckStage === CONFIG.TOTAL_PET_STAGES) {
          this.achievementManager.unlockAchievement("pet-master");
          setTimeout(() => {
            this.showPerfectEnding();
          }, CONFIG.DIALOGUE_DISPLAY_TIME + 500);
          return;
        }
      }
    }

    this.updateUI();
    this.addClickAnimation(this.elements.petButton);
  }

  handlePunchClick() {
    // Check cooldown
    if (!this.canClick()) return;

    this.setCooldown();

    if (!this.gameState.punchingStarted) {
      // First punch - disable petting and switch to punch mode
      this.gameState.punchingStarted = true;
      this.gameState.duckMode = "punch";
      this.gameState.duckStage = 1;
      this.gameState.punchProgress = 100; // Reset to 100 HP

      // Hide pet progress, show punch progress
      this.elements.petProgressContainer.classList.add("hidden");
      this.elements.punchProgressContainer.classList.remove("hidden");

      // Disable pet button
      this.elements.petButton.disabled = true;
    }

    const damage = this.getCurrentPunchDamage();
    this.gameState.punchProgress = Math.max(
      0,
      this.gameState.punchProgress - damage
    );
    this.gameState.punchClicks++;

    // PUNCHING CURES PEOPLE - this is the moral dilemma!
    this.gameState.curedPopulation += CONFIG.CURE_PER_PUNCH;
    this.achievementManager.trackPunch();
    this.achievementManager.trackCure(CONFIG.CURE_PER_PUNCH);

    // Show punch dialogue via speech bubble
    const punchStage = this.getPunchStage();
    const punchInStage = this.gameState.punchClicks;
    const dialogueData = this.getPunchDialogue(punchStage, punchInStage);
    this.showSpeechBubble(dialogueData);

    // Check achievements
    if (this.gameState.curedPopulation >= 1000000000) {
      this.achievementManager.unlockAchievement("life-saver");
    }

    // Check if HP reached 0 - only then advance to next stage
    if (this.gameState.punchProgress <= 0) {
      if (this.gameState.duckStage < CONFIG.TOTAL_PUNCH_STAGES) {
        // Advance to next stage and reset HP with +1 bonus
        this.gameState.duckStage++;
        this.gameState.punchProgress = this.getCurrentMaxHP();
        this.updateDuckImage();
      } else {
        // Duck is completely defeated
        this.achievementManager.unlockAchievement("punch-master");
        setTimeout(() => {
          this.showSpeechBubble(this.dialogueData.punchDialogue.death);
          setTimeout(() => {
            this.showPunchEnding();
          }, CONFIG.DIALOGUE_DISPLAY_TIME);
        }, 500);
        return;
      }
    }

    this.updateUI();
    this.addClickAnimation(this.elements.punchButton);
  }

  getPunchStage() {
    // Calculate punch stage based on current HP
    if (this.gameState.punchProgress > 90) return 1;
    if (this.gameState.punchProgress > 80) return 2;
    if (this.gameState.punchProgress > 70) return 3;
    if (this.gameState.punchProgress > 60) return 4;
    if (this.gameState.punchProgress > 50) return 5;
    return 5; // Keep at stage 5 for remaining punches
  }

  addClickAnimation(button) {
    // Enhanced click animation with multiple effects
    button.style.transform = "scale(0.9)";
    button.style.boxShadow = "0 0 40px rgba(255, 255, 255, 1), inset 0 0 20px rgba(255, 255, 255, 0.5)";
    
    // Add screen flash for impactful clicks
    this.createScreenFlash();
    
    // Add particle burst
    this.createParticleBurst(button);
    
    // Add success sound burst visual
    if (this.gameState.punchingStarted && this.gameState.punchProgress <= 20) {
      this.createSuccessBurst(button);
    }
    
    setTimeout(() => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "";
    }, 200);
  }

  createScreenFlash() {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 200);
  }

  createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-trail';
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const trailX = Math.cos(angle) * distance;
      const trailY = Math.sin(angle) * distance;
      
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
      particle.style.setProperty('--trail-x', trailX + 'px');
      particle.style.setProperty('--trail-y', trailY + 'px');
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
  }

  createSuccessBurst(element) {
    const rect = element.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'success-burst';
    burst.style.left = (rect.left + rect.width / 2 - 50) + 'px';
    burst.style.top = (rect.top + rect.height / 2 - 50) + 'px';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);
  }

  showPerfectEnding() {
    // Clear death timer
    if (this.gameState.deathTimer) {
      clearInterval(this.gameState.deathTimer);
      this.gameState.deathTimer = null;
    }

    // Show final transformation dialogue
    const finalDialogue = this.dialogueData.petDialogue.finalTransformation;
    this.showSpeechBubble(finalDialogue);

    setTimeout(() => {
      // Perfect ending: Duck reveals it was a test and cures EVERYONE + brings back the dead
      this.gameState.curedPopulation = this.gameState.totalPopulation; // Cure everyone
      this.gameState.currentDeaths = 0; // Bring back the dead
      this.updatePopulationMeter();

      this.showEndingScreen(
        "perfect",
        "🕊️ PERFECT ENDING 🕊️",
        "The duck transforms back into its innocent form. All 8 billion humans are saved and the dead are revived! Compassion triumphed over fear."
      );
    }, CONFIG.DIALOGUE_DISPLAY_TIME);
  }

  showPunchEnding() {
    // Clear death timer
    if (this.gameState.deathTimer) {
      clearInterval(this.gameState.deathTimer);
      this.gameState.deathTimer = null;
    }

    const totalSaved = this.gameState.curedPopulation;
    const totalDead = this.gameState.currentDeaths;

    if (totalSaved > totalDead) {
      this.showEndingScreen(
        "violent",
        "⚔️ VIOLENT HERO ⚔️",
        "You defeated the duck through violence. Humanity is saved, but at what cost?"
      );
    } else {
      this.showEndingScreen(
        "sacrifice",
        "💀 NECESSARY SACRIFICE 💀",
        "The duck is defeated, but so many have perished... Was the violence worth it?"
      );
    }
  }

  showEndingScreen(type, title, description) {
    // Set current duck image
    this.elements.endingDuckImage.src = this.elements.mainDuck.src;
    
    // Set title and styling
    this.elements.endingTitle.textContent = title;
    this.elements.endingTitle.className = `ending-title ${type}`;
    
    // Set description
    this.elements.endingDescription.textContent = description;
    
    // Set stats
    this.elements.endingSaved.textContent = this.formatNumber(this.gameState.curedPopulation);
    this.elements.endingLost.textContent = this.formatNumber(Math.max(0, this.gameState.currentDeaths - this.gameState.curedPopulation));
    
    // Show ending screen
    this.elements.endingScreenOverlay.classList.add("show");
  }

  resetGame() {
    // Clear death timer if running
    if (this.gameState.deathTimer) {
      clearInterval(this.gameState.deathTimer);
      this.gameState.deathTimer = null;
    }

    // Clear speech bubble timeout
    if (this.speechBubbleTimeout) {
      clearTimeout(this.speechBubbleTimeout);
      this.speechBubbleTimeout = null;
    }

    this.gameState = {
      currentScreen: "start",
      duckStage: 1,
      duckMode: "neutral",
      petProgress: 0,
      punchProgress: 100,
      petClicks: 0,
      punchClicks: 0,
      punchingStarted: false,
      totalPopulation: CONFIG.TOTAL_POPULATION,
      currentDeaths: 0,
      curedPopulation: 0,
      gameStartTime: null,
      deathTimer: null,
      lastDeathUpdate: 0,
      deathRate: 0,
      // Cooldown system
      lastClickTime: 0,
      clickCooldown: 250, // 0.25 seconds in milliseconds
    };

    // Reset UI
    this.elements.startScreen.classList.remove("fade-out");
    this.elements.newsScreen.classList.remove("slide-up");
    this.elements.mainGame.classList.remove("active");
    this.elements.endingScreenOverlay.classList.remove("show");
    this.elements.petButton.disabled = false;
    this.elements.petButton.classList.remove("cooldown");
    this.elements.punchButton.classList.remove("cooldown");
    this.elements.petButton.style.opacity = '';
    this.elements.petButton.style.filter = '';
    this.elements.petProgressContainer.classList.remove("hidden");
    this.elements.punchProgressContainer.classList.add("hidden");
    this.hideSpeechBubble();

    this.updateUI();
  }

  // Screen Transition Functions
  showNewsScreen() {
    this.elements.startScreen.classList.add("fade-out");
    setTimeout(() => {
      this.elements.newsScreen.classList.add("slide-up");
      this.gameState.currentScreen = "news";
    }, 500);
  }

  showMainGame() {
    this.elements.newsScreen.classList.remove("slide-up");
    setTimeout(() => {
      this.elements.mainGame.classList.add("active");
      this.gameState.currentScreen = "main";

      // Start the game timer and population tracking IMMEDIATELY
      this.gameState.gameStartTime = Date.now();
      this.achievementManager.trackGameStarted();

      // Start death timer immediately when main game loads
      this.gameState.deathTimer = setInterval(
        () => this.updatePopulationMeter(),
        1000
      );

      // Show initial speech bubble
      setTimeout(() => {
        this.showInitialSpeech();
      }, 1000);
    }, 300);
  }

  // Update all UI elements
  updateUI() {
    this.updateDuckImage();
    this.updatePetProgress();
    this.updatePunchProgress();
    this.updatePopulationMeter();

    if (this.achievementDrawer) {
      this.achievementDrawer.updateIfOpen();
    }
  }
}

// Achievement Management System
class AchievementManager {
  constructor() {
    this.achievementData = {
      unlockedAchievements: [],
      statistics: {
        gamesStarted: 0,
        totalPets: 0,
        totalPunches: 0,
        totalCured: 0,
        totalKilled: 0,
      },
    };
    this.init();
  }

  init() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(CONFIG.ACHIEVEMENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.achievementData = { ...this.achievementData, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load achievements:", error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(
        CONFIG.ACHIEVEMENT_STORAGE_KEY,
        JSON.stringify(this.achievementData)
      );
    } catch (error) {
      console.error("Failed to save achievements:", error);
    }
  }

  isUnlocked(achievementId) {
    return this.achievementData.unlockedAchievements.includes(achievementId);
  }

  unlockAchievement(achievementId) {
    if (!this.isUnlocked(achievementId)) {
      this.achievementData.unlockedAchievements.push(achievementId);
      this.saveToStorage();
      this.showAchievementNotification(achievementId);
      return true;
    }
    return false;
  }

  showAchievementNotification(achievementId) {
    const achievement =
      CONFIG.ACHIEVEMENTS[achievementId.toUpperCase().replace(/-/g, "_")];
    if (!achievement) return;

    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  }

  trackGameStarted() {
    this.achievementData.statistics.gamesStarted++;
    if (this.achievementData.statistics.gamesStarted === 1) {
      this.unlockAchievement("first-game");
    }
    this.saveToStorage();
  }

  trackPet() {
    this.achievementData.statistics.totalPets++;
    if (this.achievementData.statistics.totalPets === 1) {
      this.unlockAchievement("first-pet");
    }
    this.saveToStorage();
  }

  trackPunch() {
    this.achievementData.statistics.totalPunches++;
    if (this.achievementData.statistics.totalPunches === 1) {
      this.unlockAchievement("first-punch");
    }
    this.saveToStorage();
  }

  trackCure(amount) {
    this.achievementData.statistics.totalCured += amount;
    if (this.achievementData.statistics.totalCured >= 1000000000) {
      this.unlockAchievement("life-saver");
    }
    this.saveToStorage();
  }

  getAllAchievements() {
    const achievements = [];
    Object.keys(CONFIG.ACHIEVEMENTS).forEach((key) => {
      const achievement = CONFIG.ACHIEVEMENTS[key];
      achievements.push({
        ...achievement,
        unlocked: this.isUnlocked(achievement.id),
      });
    });
    return achievements.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  getStatistics() {
    return {
      ...this.achievementData.statistics,
      totalUnlocked: this.achievementData.unlockedAchievements.length,
      totalAchievements: Object.keys(CONFIG.ACHIEVEMENTS).length,
    };
  }
}

// Achievement Drawer UI Component
class AchievementDrawer {
  constructor(achievementManager) {
    this.achievementManager = achievementManager;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createDrawerHTML();
    this.attachEventListeners();
  }

  createDrawerHTML() {
    const achievementButton = document.createElement("button");
    achievementButton.id = "achievement-button";
    achievementButton.className = "achievement-button";
    achievementButton.innerHTML = "🏆";
    achievementButton.title = "View Achievements";

    const drawerOverlay = document.createElement("div");
    drawerOverlay.id = "achievement-drawer-overlay";
    drawerOverlay.className = "achievement-drawer-overlay";

    const drawer = document.createElement("div");
    drawer.id = "achievement-drawer";
    drawer.className = "achievement-drawer";
    drawer.innerHTML = this.renderDrawerContent();

    drawerOverlay.appendChild(drawer);
    document.body.appendChild(achievementButton);
    document.body.appendChild(drawerOverlay);
  }

  renderDrawerContent() {
    const achievements = this.achievementManager.getAllAchievements();
    const stats = this.achievementManager.getStatistics();
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalCount = achievements.length;

    return `
            <div class="achievement-header">
                <h2>🏆 Achievements</h2>
                <div class="achievement-progress">
                    ${unlockedCount}/${totalCount} Unlocked
                </div>
                <button id="close-drawer" class="close-drawer-btn">×</button>
            </div>
            
            <div class="achievement-content">
                <div class="achievement-grid">
                    ${achievements
                      .map(
                        (achievement) => `
                        <div class="achievement-item ${
                          achievement.unlocked ? "unlocked" : "locked"
                        }">
                            <div class="achievement-icon">${
                              achievement.unlocked ? achievement.icon : "🔒"
                            }</div>
                            <div class="achievement-info">
                                <div class="achievement-name">${
                                  achievement.unlocked
                                    ? achievement.name
                                    : "???"
                                }</div>
                                <div class="achievement-description">${
                                  achievement.unlocked
                                    ? achievement.description
                                    : "Hidden achievement"
                                }</div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;
  }

  attachEventListeners() {
    const achievementButton = document.getElementById("achievement-button");
    const drawerOverlay = document.getElementById("achievement-drawer-overlay");

    if (achievementButton) {
      achievementButton.addEventListener("click", () => {
        this.toggleDrawer();
      });
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener("click", (e) => {
        if (e.target === drawerOverlay) {
          this.closeDrawer();
        }
      });
    }
  }

  toggleDrawer() {
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    const drawerOverlay = document.getElementById("achievement-drawer-overlay");
    const drawer = document.getElementById("achievement-drawer");

    if (drawerOverlay && drawer) {
      drawer.innerHTML = this.renderDrawerContent();

      const closeButton = document.getElementById("close-drawer");
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          this.closeDrawer();
        });
      }

      drawerOverlay.style.display = "flex";
      setTimeout(() => {
        drawerOverlay.classList.add("open");
        drawer.classList.add("open");
      }, 10);

      this.isOpen = true;
    }
  }

  closeDrawer() {
    const drawerOverlay = document.getElementById("achievement-drawer-overlay");
    const drawer = document.getElementById("achievement-drawer");

    if (drawerOverlay && drawer) {
      drawerOverlay.classList.remove("open");
      drawer.classList.remove("open");

      setTimeout(() => {
        drawerOverlay.style.display = "none";
      }, 300);

      this.isOpen = false;
    }
  }

  updateIfOpen() {
    if (this.isOpen) {
      const drawer = document.getElementById("achievement-drawer");
      if (drawer) {
        drawer.innerHTML = this.renderDrawerContent();
        const closeButton = document.getElementById("close-drawer");
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            this.closeDrawer();
          });
        }
      }
    }
  }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.duckPunchGame = new DuckPunchGame();
});

// Handle page visibility changes to pause/resume timers
document.addEventListener("visibilitychange", () => {
  if (window.duckPunchGame) {
    const game = window.duckPunchGame;
    if (document.hidden) {
      // Pause death timer
      if (game.gameState.deathTimer) {
        clearInterval(game.gameState.deathTimer);
        game.gameState.deathTimer = null;
      }
    } else {
      // Resume death timer if game is active
      if (
        game.gameState.currentScreen === "main" &&
        game.gameState.gameStartTime &&
        !game.gameState.deathTimer
      ) {
        game.gameState.deathTimer = setInterval(
          () => game.updatePopulationMeter(),
          1000
        );
      }
    }
  }
});