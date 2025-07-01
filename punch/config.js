// Duck Punch Game Configuration
const CONFIG = {
  // Game mechanics
  PET_STAGES: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 25], // pets needed for each stage
  PUNCH_STAGES: [10, 10, 10, 10, 10, 10, 10, 5, 5, 3, 2, 1, 1], // punch damage for each stage
  TOTAL_PET_STAGES: 13,
  TOTAL_PUNCH_STAGES: 13,

  // Population/cure settings
  TOTAL_GAME_TIME: 8, // 8 minutes total
  TOTAL_POPULATION: 8000000000, // 8 billion humans
  CURE_PER_PUNCH: 200000000, // 200 million cured per punch (punching = curing)

  // UI settings
  DIALOGUE_DISPLAY_TIME: 3000, // 3 seconds

  // Achievement system
  ACHIEVEMENT_STORAGE_KEY: "duck-punch-achievements",
  ACHIEVEMENTS: {
    FIRST_GAME: {
      id: "first-game",
      name: "Duck Encounter",
      description: "Started your first Duck Punch session",
      icon: "🦆",
    },
    FIRST_PET: {
      id: "first-pet",
      name: "Gentle Touch",
      description: "Pet the duck for the first time",
      icon: "🤗",
    },
    FIRST_PUNCH: {
      id: "first-punch",
      name: "Violence Chosen",
      description: "Chose violence to save humanity",
      icon: "👊",
    },
    PET_MASTER: {
      id: "pet-master",
      name: "Perfect Ending",
      description: "Completed the duck's test through kindness",
      icon: "🕊️",
    },
    PUNCH_MASTER: {
      id: "punch-master",
      name: "Necessary Violence",
      description: "Defeated the duck to save humanity",
      icon: "⚔️",
    },
    MUTATION_WITNESS: {
      id: "mutation-witness",
      name: "Witnessed Horror",
      description: "Saw the duck's true mutated form",
      icon: "👹",
    },
    LIFE_SAVER: {
      id: "life-saver",
      name: "Life Saver",
      description: "Cured over 1 billion people through violence",
      icon: "💙",
    },
    MORAL_DILEMMA: {
      id: "moral-dilemma",
      name: "Moral Conflict",
      description: "Pet the duck while people were dying",
      icon: "😰",
    },
  },
};
