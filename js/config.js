// Game Configuration
const GAME_CONFIG = {
  // Population and Death System
  totalPopulation: 8000000000,
  initialDeaths: 423,
  deathRatePhase1: 1, // deaths per second for first 30 seconds
  deathRatePhase1Duration: 30, // seconds
  totalGameTime: 480, // 8 minutes in seconds

  // Action System
  actionCooldown: 250, // 0.25 seconds between actions
  dialogueDisplayTime: 3000, // 3 seconds

  // Idle Timer
  idleTimeForCrabRangoon: 480, // 8 minutes for crab rangoon ending

  // Visual Effects
  heartThreshold: 5, // pets needed for hearts to appear
  heartFrequencyNormal: 5, // show hearts every 5th pet
  heartFrequencyEvil: 10, // show hearts every 10th pet when mutated

  // Audio Settings
  audioEnabled: true,
  speechRate: {
    microphone: 0.9,
    duck: 1.1,
    duckEvil: 0.8,
    player: 1.0,
  },
  speechPitch: {
    microphone: 1.2,
    duck: 1.8,
    duckEvil: 0.6,
    player: 1.0,
  },
};

// Pet Path Configuration
const PET_PATH_CONFIG = {
  // Progressive pet requirements for each stage
  stageRequirements: [
    3, // Stage 1: 3 pets
    4, // Stage 2: 4 pets
    5, // Stage 3: 5 pets
    6, // Stage 4: 6 pets
    7, // Stage 5: 7 pets
    8, // Stage 6: 8 pets
    9, // Stage 7: 9 pets
    10, // Stage 8: 10 pets
    11, // Stage 9: 11 pets
    12, // Stage 10: 12 pets
    13, // Stage 11: 13 pets
    14, // Stage 12: 14 pets
    25, // Stage 13: 25 pets (final taunt sequence)
  ],

  // Duck sprites for each stage
  stageSprites: [
    "🦆", // Stage 1
    "🦆", // Stage 2
    "🦆", // Stage 3
    "🦆", // Stage 4
    "🦆", // Stage 5
    "💪🦆", // Stage 6
    "💪🦆💪", // Stage 7
    "😈🦆😈", // Stage 8
    "💪😈💪", // Stage 9
    "🔥💪🔥", // Stage 10
    "🗡️👹🗡️", // Stage 11
    "💀👹💀", // Stage 12
    "🌑👹🌑", // Stage 13
  ],

  // Stage where duck starts getting evil
  evilStartStage: 5,

  // Stage where duck becomes very evil
  veryEvilStartStage: 8,

  // Mutation visual start stage
  mutationStartStage: 6,
};

// Punch Path Configuration
const PUNCH_PATH_CONFIG = {
  // HP values for each stage (when to transition to next stage)
  stageHpThresholds: [
    90, // Stage 1 -> 2: at 90 HP
    80, // Stage 2 -> 3: at 80 HP
    70, // Stage 3 -> 4: at 70 HP
    60, // Stage 4 -> 5: at 60 HP
    50, // Stage 5 -> 6: at 50 HP
    40, // Stage 6 -> 7: at 40 HP
    30, // Stage 7 -> 8: at 30 HP
    20, // Stage 8 -> 9: at 20 HP
    10, // Stage 9 -> 10: at 10 HP
    5, // Stage 10 -> 11: at 5 HP
    2, // Stage 11 -> 12: at 2 HP
    0, // Stage 12 -> 13: at 0 HP (death)
  ],

  // Damage per punch for each stage
  damagePerPunch: [
    10, // Stage 1: 10 damage per punch
    10, // Stage 2: 10 damage per punch
    10, // Stage 3: 10 damage per punch
    10, // Stage 4: 10 damage per punch
    10, // Stage 5: 10 damage per punch
    10, // Stage 6: 10 damage per punch
    10, // Stage 7: 10 damage per punch
    10, // Stage 8: 10 damage per punch
    10, // Stage 9: 10 damage per punch
    5, // Stage 10: 5 damage per punch (harder to kill)
    3, // Stage 11: 3 damage per punch
    2, // Stage 12: 2 damage per punch
  ],

  // Duck sprites for each stage
  stageSprites: [
    "🦆", // Stage 1
    "🦆", // Stage 2
    "✨🦆", // Stage 3
    "🦆", // Stage 4
    "🦆", // Stage 5
    "🦆", // Stage 6
    "🦆", // Stage 7
    "🦆", // Stage 8
    "🦆", // Stage 9
    "🦆", // Stage 10
    "🦆", // Stage 11
    "🦆", // Stage 12
    "💀", // Stage 13 (death)
  ],

  // Starting HP
  maxHp: 100,

  // Stage where duck starts pleading
  pleadingStartStage: 4,

  // Stage where duck gives up
  giveUpStage: 7,

  // Stage where duck is barely holding on
  desperateStage: 10,
};

// Ending Configuration
const ENDING_CONFIG = {
  perfect: {
    title: "Perfect Ending - The Kindness Test",
    message:
      "You passed the ultimate test of kindness. Few planets have shown such compassion over the last million years. Everyone is cured and the dead are brought back to life.",
    class: "victory",
    cureAll: true,
    reviveAll: true,
  },

  violentHero: {
    title: "Violent Hero - Balanced Justice",
    message:
      "You saved lives while preserving the duck's existence. A balanced approach that shows both decisiveness and mercy.",
    class: "victory",
    cureAll: false,
    reviveAll: false,
  },

  violentAntihero: {
    title: "Violent Antihero - Necessary Sacrifice",
    message:
      "You saved humanity but broke your soul in the process. The duck's sacrifice was not in vain, but the cost was high.",
    class: "victory",
    cureAll: false,
    reviveAll: false,
  },

  judgedABook: {
    title: "Judged a Book - Fatal Hesitation",
    message:
      "You couldn't bring yourself to finish the job. Your kindness was admirable, but everyone died. Sometimes good intentions aren't enough.",
    class: "game-over",
    cureAll: false,
    reviveAll: false,
  },

  crabRangoon: {
    title: "Enjoy the Crab Rangoon",
    message:
      "You chose to wait and see what would happen. Sometimes the best choice is no choice at all... or maybe you just really like crab rangoon.",
    class: "game-over",
    cureAll: false,
    reviveAll: false,
  },
};

// System Messages
const SYSTEM_MESSAGES = {
  introMicrophone:
    "Emergency Protocol 7-Alpha activated. We've located the source in this military blacksite - Project Leviathan, designation 'Duck'. Our scientists believe controlled trauma may reverse its bioweapon protocols. You have been selected for psychological compatibility. You must... punch that duck. Time is running out.",

  gameStart: "The countdown has begun. Choose your approach carefully.",

  pathLocked:
    "You've started down this path. You can still change your mind... for now.",

  duckNoTrust: "The duck no longer trusts you. Violence is your only path now.",
};
