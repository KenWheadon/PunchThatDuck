// Dialogue Management System
class DialogueManager {
  constructor() {
    this.currentDialogue = null;
    this.dialogueQueue = [];
    this.isDisplaying = false;
    this.audioEnabled = GAME_CONFIG.audioEnabled;
  }

  // Show dialogue with optional choices
  showDialogue(dialogueData, autoHide = true, showChoices = false) {
    const dialogueEl = document.getElementById("dialogue");

    // Clear any existing dialogue
    this.clearDialogue();

    // Set dialogue styling based on type and mood
    this.setDialogueStyle(dialogueEl, dialogueData);

    // Set dialogue text
    dialogueEl.textContent = dialogueData.dialogue;

    // Show the dialogue
    dialogueEl.style.display = "block";
    dialogueEl.classList.add("fade-in");

    // Play audio if enabled
    if (this.audioEnabled) {
      this.playDialogueAudio(dialogueData);
    }

    // Handle manipulation/choices
    if (dialogueData.manipulation && showChoices) {
      this.showManipulationChoice(dialogueEl, dialogueData.manipulation);
    }

    // Auto-hide if requested
    if (autoHide && !showChoices) {
      setTimeout(() => {
        this.hideDialogue();
      }, GAME_CONFIG.dialogueDisplayTime);
    }

    this.currentDialogue = dialogueData;
    this.isDisplaying = true;
  }

  // Set dialogue styling based on speaker type and mood
  setDialogueStyle(dialogueEl, dialogueData) {
    // Clear existing classes
    dialogueEl.className = "dialogue fade-in";

    // Add speaker type class
    if (dialogueData.type === "duck") {
      dialogueEl.classList.add("duck-speak");

      // Add mood-based styling for duck
      switch (dialogueData.mood) {
        case "evil":
        case "very-evil":
        case "monster":
          dialogueEl.classList.add("evil-duck");
          break;
        case "dying":
        case "desperate":
        case "final":
          dialogueEl.classList.add("dying-duck");
          break;
        case "urgent":
        case "pleading":
          dialogueEl.classList.add("urgent");
          break;
      }
    } else if (dialogueData.type === "player") {
      dialogueEl.classList.add("player-speak");
    } else {
      dialogueEl.classList.add("system-speak");
    }
  }

  // Show manipulation choice for punch dialogue
  showManipulationChoice(dialogueEl, manipulation) {
    const choiceContainer = document.createElement("div");
    choiceContainer.className = "choice-buttons";

    // Continue punching option
    const continueBtn = document.createElement("button");
    continueBtn.className = "choice-btn";
    continueBtn.textContent = "Continue Punching";
    continueBtn.onclick = () => {
      this.hideDialogue();
      // Allow punching to continue
    };

    // Listen to duck option
    const listenBtn = document.createElement("button");
    listenBtn.className = "choice-btn";
    listenBtn.textContent = "Listen to Duck";
    listenBtn.onclick = () => {
      this.showManipulationResponse(manipulation);
    };

    choiceContainer.appendChild(continueBtn);
    choiceContainer.appendChild(listenBtn);
    dialogueEl.appendChild(choiceContainer);
  }

  // Show duck's manipulation response
  showManipulationResponse(manipulation) {
    const responseDialogue = {
      dialogue: manipulation.text,
      type: "duck",
      mood: "manipulative",
    };

    this.showDialogue(responseDialogue, true, false);
  }

  // Play audio for dialogue
  playDialogueAudio(dialogueData) {
    if (!("speechSynthesis" in window)) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(dialogueData.dialogue);

    // Configure voice based on speaker and mood
    switch (dialogueData.type) {
      case "duck":
        if (
          dialogueData.mood === "evil" ||
          dialogueData.mood === "very-evil" ||
          dialogueData.mood === "monster"
        ) {
          utterance.rate = GAME_CONFIG.speechRate.duckEvil;
          utterance.pitch = GAME_CONFIG.speechPitch.duckEvil;
          utterance.volume = 1.0;
        } else {
          utterance.rate = GAME_CONFIG.speechRate.duck;
          utterance.pitch = GAME_CONFIG.speechPitch.duck;
          utterance.volume = 0.9;
        }
        break;

      case "player":
        utterance.rate = GAME_CONFIG.speechRate.player;
        utterance.pitch = GAME_CONFIG.speechPitch.player;
        utterance.volume = 0.8;
        break;

      default:
        utterance.rate = GAME_CONFIG.speechRate.microphone;
        utterance.pitch = GAME_CONFIG.speechPitch.microphone;
        utterance.volume = 0.8;
        break;
    }

    speechSynthesis.speak(utterance);
  }

  // Hide current dialogue
  hideDialogue() {
    const dialogueEl = document.getElementById("dialogue");
    dialogueEl.style.display = "none";
    dialogueEl.innerHTML = ""; // Clear any choice buttons
    this.isDisplaying = false;
    this.currentDialogue = null;
  }

  // Clear dialogue
  clearDialogue() {
    this.hideDialogue();

    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  // Process pet dialogue
  processPetDialogue(totalPets) {
    const dialogueData = getPetDialogue(totalPets);

    // Show manipulation choices for evil stages
    const showChoices =
      dialogueData.mood === "evil" ||
      dialogueData.mood === "very-evil" ||
      dialogueData.mood === "monster";

    this.showDialogue(dialogueData, !showChoices, showChoices);

    return dialogueData;
  }

  // Process punch dialogue
  processPunchDialogue(stage, punchInStage, showManipulation = true) {
    const dialogueData = getPunchDialogue(stage, punchInStage);

    // Show manipulation choices if duck is trying to manipulate
    const showChoices =
      showManipulation &&
      dialogueData.manipulation &&
      stage >= PUNCH_PATH_CONFIG.pleadingStartStage;

    this.showDialogue(dialogueData, !showChoices, showChoices);

    return dialogueData;
  }

  // Show system message
  showSystemMessage(message, autoHide = true) {
    const systemDialogue = {
      dialogue: message,
      type: "system",
      mood: "neutral",
    };

    this.showDialogue(systemDialogue, autoHide, false);
  }

  // Queue multiple dialogues
  queueDialogue(dialogueArray) {
    this.dialogueQueue = [...dialogueArray];
    this.processQueue();
  }

  // Process dialogue queue
  processQueue() {
    if (this.dialogueQueue.length === 0 || this.isDisplaying) return;

    const nextDialogue = this.dialogueQueue.shift();
    this.showDialogue(nextDialogue, true, false);

    // Continue processing queue after dialogue finishes
    setTimeout(() => {
      this.processQueue();
    }, GAME_CONFIG.dialogueDisplayTime + 500);
  }

  // Show redemption dialogue sequence
  showRedemptionDialogue() {
    const redemptionSequence = [
      PUNCH_DIALOGUE.redemption.initial,
      PUNCH_DIALOGUE.redemption.followUp,
    ];

    this.queueDialogue(redemptionSequence);
  }

  // Show final transformation dialogue
  showFinalTransformation() {
    this.showDialogue(PET_DIALOGUE.finalTransformation, false, false);
  }

  // Toggle audio on/off
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;

    if (!this.audioEnabled && "speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  // Get current dialogue state
  getCurrentDialogue() {
    return this.currentDialogue;
  }

  // Check if dialogue is currently displaying
  isDialogueDisplaying() {
    return this.isDisplaying;
  }

  // Force hide dialogue (for emergency situations)
  forceHide() {
    this.clearDialogue();
    this.dialogueQueue = [];
  }

  // Show choice dialogue with custom options
  showChoiceDialogue(message, choices, onChoice) {
    const dialogueEl = document.getElementById("dialogue");

    this.clearDialogue();

    dialogueEl.className = "dialogue system-speak fade-in";
    dialogueEl.textContent = message;
    dialogueEl.style.display = "block";

    const choiceContainer = document.createElement("div");
    choiceContainer.className = "choice-buttons";

    choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = () => {
        this.hideDialogue();
        onChoice(choice, index);
      };
      choiceContainer.appendChild(btn);
    });

    dialogueEl.appendChild(choiceContainer);
    this.isDisplaying = true;
  }

  // Show ending dialogue
  showEndingDialogue(endingType) {
    const ending = ENDING_CONFIG[endingType];
    if (!ending) return;

    const endingDialogue = {
      dialogue: ending.message,
      type: "system",
      mood: "final",
    };

    this.showDialogue(endingDialogue, false, false);
  }

  // Show hearts animation
  showHearts(container, isEvil = false) {
    const hearts = document.createElement("div");
    hearts.className = "hearts";
    hearts.textContent = isEvil ? "💀" : "💕";

    container.style.position = "relative";
    container.appendChild(hearts);

    setTimeout(() => {
      if (hearts.parentNode) {
        hearts.remove();
      }
    }, 1000);
  }

  // Show typing effect for dialogue (optional enhancement)
  showTypingDialogue(dialogueData, typingSpeed = 50) {
    const dialogueEl = document.getElementById("dialogue");

    this.clearDialogue();
    this.setDialogueStyle(dialogueEl, dialogueData);

    dialogueEl.style.display = "block";
    dialogueEl.classList.add("fade-in");

    const text = dialogueData.dialogue;
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        dialogueEl.textContent = text.substring(0, i + 1);
        i++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        // Typing complete, play audio if enabled
        if (this.audioEnabled) {
          this.playDialogueAudio(dialogueData);
        }

        // Auto-hide after completion
        setTimeout(() => {
          this.hideDialogue();
        }, GAME_CONFIG.dialogueDisplayTime);
      }
    };

    typeWriter();
    this.isDisplaying = true;
  }

  // Show emergency/urgent message
  showUrgentMessage(message) {
    const urgentDialogue = {
      dialogue: message,
      type: "system",
      mood: "urgent",
    };

    this.showDialogue(urgentDialogue, true, false);
  }

  // Show story dialogue with lore tracking
  showStoryDialogue(dialogueData, isLoreImportant = false) {
    this.showDialogue(dialogueData, true, false);

    // Track lore exploration for alternate endings
    if (isLoreImportant && window.duckPunchGame) {
      window.duckPunchGame.gameState.storyChoicesMade++;
      if (window.duckPunchGame.gameState.storyChoicesMade >= 3) {
        window.duckPunchGame.gameState.exploredLore = true;
      }
    }
  }

  // Show contextual help dialogue
  showHelpDialogue() {
    const helpDialogue = {
      dialogue:
        "Pet the duck to show kindness, or punch it to force a cure. Each path leads to different outcomes. Choose wisely - humanity's fate depends on your actions.",
      type: "system",
      mood: "helpful",
    };

    this.showDialogue(helpDialogue, true, false);
  }

  // Show warning dialogue for dangerous choices
  showWarningDialogue(message, onConfirm, onCancel) {
    const choices = [
      { text: "Continue", action: "confirm" },
      { text: "Cancel", action: "cancel" },
    ];

    this.showChoiceDialogue(message, choices, (choice) => {
      if (choice.action === "confirm") {
        onConfirm();
      } else {
        onCancel();
      }
    });
  }

  // Show progress update dialogue
  showProgressDialogue(curedCount, deathCount) {
    const progressDialogue = {
      dialogue: `Progress Update: ${curedCount.toLocaleString()} people cured, ${deathCount.toLocaleString()} deaths. Keep going or try a different approach?`,
      type: "system",
      mood: "informative",
    };

    this.showDialogue(progressDialogue, true, false);
  }

  // Show time warning dialogue
  showTimeWarning(remainingTime) {
    const timeDialogue = {
      dialogue: `Warning: Only ${Math.round(
        remainingTime / 60
      )} minutes remaining! The plague spreads faster as time runs out.`,
      type: "system",
      mood: "urgent",
    };

    this.showDialogue(timeDialogue, true, false);
  }

  // Advanced dialogue features for complex interactions
  showConversationTree(conversationData, currentNode = "start") {
    const node = conversationData[currentNode];
    if (!node) return;

    if (node.choices) {
      this.showChoiceDialogue(node.dialogue, node.choices, (choice) => {
        if (choice.nextNode) {
          this.showConversationTree(conversationData, choice.nextNode);
        }
        if (choice.action) {
          choice.action();
        }
      });
    } else {
      this.showDialogue(node, true, false);
    }
  }

  // Show multi-part dialogue sequence with delays
  showSequence(dialogueSequence, delayBetween = 1000) {
    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex < dialogueSequence.length) {
        const dialogueData = dialogueSequence[currentIndex];
        this.showDialogue(dialogueData, true, false);
        currentIndex++;

        setTimeout(showNext, GAME_CONFIG.dialogueDisplayTime + delayBetween);
      }
    };

    showNext();
  }

  // Show dialogue with custom positioning
  showPositionedDialogue(dialogueData, position = "center") {
    const dialogueEl = document.getElementById("dialogue");

    this.clearDialogue();
    this.setDialogueStyle(dialogueEl, dialogueData);

    // Apply custom positioning
    switch (position) {
      case "top":
        dialogueEl.style.top = "10%";
        dialogueEl.style.transform = "translateX(-50%)";
        break;
      case "bottom":
        dialogueEl.style.top = "80%";
        dialogueEl.style.transform = "translateX(-50%)";
        break;
      case "left":
        dialogueEl.style.left = "10px";
        dialogueEl.style.top = "50%";
        dialogueEl.style.transform = "translateY(-50%)";
        break;
      case "right":
        dialogueEl.style.right = "10px";
        dialogueEl.style.left = "auto";
        dialogueEl.style.top = "50%";
        dialogueEl.style.transform = "translateY(-50%)";
        break;
      default:
        dialogueEl.style.top = "50%";
        dialogueEl.style.left = "50%";
        dialogueEl.style.transform = "translate(-50%, -50%)";
    }

    dialogueEl.textContent = dialogueData.dialogue;
    dialogueEl.style.display = "block";
    dialogueEl.classList.add("fade-in");

    if (this.audioEnabled) {
      this.playDialogueAudio(dialogueData);
    }

    setTimeout(() => {
      this.hideDialogue();
    }, GAME_CONFIG.dialogueDisplayTime);

    this.isDisplaying = true;
  }

  // Destroy dialogue manager
  destroy() {
    this.forceHide();
    this.audioEnabled = false;
  }
}

// Create global dialogue manager instance
const dialogueManager = new DialogueManager();
