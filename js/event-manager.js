// Event Management System
class EventManager {
  constructor() {
    this.listeners = {};
    this.gameEvents = [];
    this.eventHistory = [];
  }

  // Add event listener
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  // Remove event listener
  off(eventName, callback) {
    if (!this.listeners[eventName]) return;

    const index = this.listeners[eventName].indexOf(callback);
    if (index > -1) {
      this.listeners[eventName].splice(index, 1);
    }
  }

  // Emit event
  emit(eventName, data = null) {
    // Record event in history
    this.eventHistory.push({
      name: eventName,
      data: data,
      timestamp: Date.now(),
    });

    // Call all listeners for this event
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }

  // Get event history
  getEventHistory() {
    return [...this.eventHistory];
  }

  // Clear event history
  clearHistory() {
    this.eventHistory = [];
  }

  // Setup game-specific event listeners
  setupGameEvents() {
    // Pet events
    this.on("pet-start", () => {
      console.log("Pet path started");
    });

    this.on("pet-action", (data) => {
      console.log(
        `Pet action: ${data.totalPets} total pets, stage ${data.stage}`
      );
    });

    this.on("pet-stage-change", (data) => {
      console.log(`Pet stage changed to ${data.newStage}`);
    });

    // Punch events
    this.on("punch-start", () => {
      console.log("Punch path started");
    });

    this.on("punch-action", (data) => {
      console.log(
        `Punch action: ${data.currentHp} HP remaining, stage ${data.stage}`
      );
    });

    this.on("punch-stage-change", (data) => {
      console.log(`Punch stage changed to ${data.newStage}`);
    });

    // Game state events
    this.on("game-start", () => {
      console.log("Game started");
    });

    this.on("game-end", (data) => {
      console.log(`Game ended with: ${data.endingType}`);
    });

    this.on("path-locked", (data) => {
      console.log(`Path locked: ${data.pathType}`);
    });

    // Death counter events
    this.on("death-update", (data) => {
      console.log(`Deaths updated: ${data.deaths}`);
    });

    this.on("cure-update", (data) => {
      console.log(`Cured updated: ${data.cured}`);
    });

    // Special events
    this.on("duck-mutation", (data) => {
      console.log(`Duck mutation stage: ${data.stage}`);
    });

    this.on("redemption-sequence", () => {
      console.log("Redemption sequence triggered");
    });

    this.on("final-transformation", () => {
      console.log("Final transformation triggered");
    });
  }

  // Analytics and tracking
  trackPlayerAction(actionType, actionData) {
    this.emit("player-action", {
      type: actionType,
      data: actionData,
      timestamp: Date.now(),
    });
  }

  // Get player statistics
  getPlayerStats() {
    const actions = this.eventHistory.filter(
      (event) => event.name === "player-action"
    );
    const petActions = actions.filter((action) => action.data.type === "pet");
    const punchActions = actions.filter(
      (action) => action.data.type === "punch"
    );

    return {
      totalActions: actions.length,
      petActions: petActions.length,
      punchActions: punchActions.length,
      gameStartTime: this.eventHistory.find(
        (event) => event.name === "game-start"
      )?.timestamp,
      gameEndTime: this.eventHistory.find((event) => event.name === "game-end")
        ?.timestamp,
      pathTaken:
        petActions.length > 0
          ? "pet"
          : punchActions.length > 0
          ? "punch"
          : "none",
    };
  }

  // Performance monitoring
  getPerformanceMetrics() {
    const gameStart = this.eventHistory.find(
      (event) => event.name === "game-start"
    );
    const gameEnd = this.eventHistory.find(
      (event) => event.name === "game-end"
    );

    if (!gameStart || !gameEnd) {
      return null;
    }

    const totalGameTime = gameEnd.timestamp - gameStart.timestamp;
    const actions = this.eventHistory.filter(
      (event) => event.name === "player-action"
    );

    return {
      totalGameTimeMs: totalGameTime,
      totalGameTimeSeconds: Math.round(totalGameTime / 1000),
      actionsPerSecond: actions.length / (totalGameTime / 1000),
      totalActions: actions.length,
    };
  }

  // Debug information
  getDebugInfo() {
    return {
      totalEvents: this.eventHistory.length,
      eventTypes: [...new Set(this.eventHistory.map((event) => event.name))],
      listenerCount: Object.keys(this.listeners).length,
      lastEvent: this.eventHistory[this.eventHistory.length - 1],
    };
  }

  // Save event log (for debugging or analytics)
  exportEventLog() {
    return JSON.stringify(
      {
        gameSession: Date.now(),
        events: this.eventHistory,
        playerStats: this.getPlayerStats(),
        performance: this.getPerformanceMetrics(),
      },
      null,
      2
    );
  }

  // Load event log (for replay or analysis)
  importEventLog(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.eventHistory = data.events || [];
      return true;
    } catch (error) {
      console.error("Failed to import event log:", error);
      return false;
    }
  }

  // Cleanup
  destroy() {
    this.listeners = {};
    this.gameEvents = [];
    this.eventHistory = [];
  }

  // Custom game events
  triggerPetAction(totalPets, stage) {
    this.trackPlayerAction("pet", { totalPets, stage });
    this.emit("pet-action", { totalPets, stage });
  }

  triggerPunchAction(currentHp, stage) {
    this.trackPlayerAction("punch", { currentHp, stage });
    this.emit("punch-action", { currentHp, stage });
  }

  triggerStageChange(pathType, newStage, oldStage) {
    this.emit(`${pathType}-stage-change`, { newStage, oldStage });
  }

  triggerGameStart() {
    this.emit("game-start");
  }

  triggerGameEnd(endingType) {
    this.emit("game-end", { endingType });
  }

  triggerPathLock(pathType) {
    this.emit("path-locked", { pathType });
  }

  triggerDeathUpdate(deaths) {
    this.emit("death-update", { deaths });
  }

  triggerCureUpdate(cured) {
    this.emit("cure-update", { cured });
  }

  triggerDuckMutation(stage) {
    this.emit("duck-mutation", { stage });
  }

  triggerRedemptionSequence() {
    this.emit("redemption-sequence");
  }

  triggerFinalTransformation() {
    this.emit("final-transformation");
  }

  // Idle tracking
  startIdleTracking() {
    this.idleStartTime = Date.now();
    this.emit("idle-start");
  }

  resetIdleTracking() {
    if (this.idleStartTime) {
      const idleDuration = Date.now() - this.idleStartTime;
      this.emit("idle-reset", { duration: idleDuration });
      this.idleStartTime = null;
    }
  }

  checkIdleTimeout() {
    if (this.idleStartTime) {
      const idleDuration = Date.now() - this.idleStartTime;
      if (idleDuration >= GAME_CONFIG.idleTimeForCrabRangoon * 1000) {
        this.emit("idle-timeout");
        return true;
      }
    }
    return false;
  }
}

// Create global event manager instance
const eventManager = new EventManager();
