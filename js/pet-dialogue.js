// Pet Dialogue System
// Each pet action has unique dialogue based on stage and pet number within that stage

const PET_DIALOGUE = {
  // Stage 1: 3 pets required (pets 1-3)
  stage1: {
    pet1: {
      dialogue:
        "Quack! That feels nice... I remember warmth like this from before the experiments.",
      type: "duck",
      mood: "innocent",
    },
    pet2: {
      dialogue:
        "Oh, you're being so gentle. It's been so long since anyone showed me kindness.",
      type: "duck",
      mood: "innocent",
    },
    pet3: {
      dialogue:
        "Something's stirring inside me... but it feels good, like I'm remembering who I used to be.",
      type: "duck",
      mood: "innocent",
    },
  },

  // Stage 2: 4 pets required (pets 4-7)
  stage2: {
    pet1: {
      dialogue:
        "Oh... something is changing. My bill feels different, heavier.",
      type: "duck",
      mood: "confused",
    },
    pet2: {
      dialogue:
        "Your touch awakens old genetic sequences. I can feel them activating.",
      type: "duck",
      mood: "confused",
    },
    pet3: {
      dialogue: "Is this normal? I feel... different. Stronger somehow.",
      type: "duck",
      mood: "confused",
    },
    pet4: {
      dialogue: "The changes feel good though. Keep petting me, please.",
      type: "duck",
      mood: "confused",
    },
  },

  // Stage 3: 5 pets required (pets 8-12)
  stage3: {
    pet1: {
      dialogue:
        "What's happening to me? I can feel... teeth? Ducks don't have teeth!",
      type: "duck",
      mood: "concerned",
    },
    pet2: {
      dialogue:
        "This isn't natural! But... it doesn't hurt. It feels right, somehow.",
      type: "duck",
      mood: "concerned",
    },
    pet3: {
      dialogue: "Sharp things are growing in my mouth. Should I be worried?",
      type: "duck",
      mood: "concerned",
    },
    pet4: {
      dialogue:
        "You keep petting me even as I change. That means you accept me, right?",
      type: "duck",
      mood: "concerned",
    },
    pet5: {
      dialogue: "These new teeth feel... useful. I wonder what they're for.",
      type: "duck",
      mood: "concerned",
    },
  },

  // Stage 4: 6 pets required (pets 13-18)
  stage4: {
    pet1: {
      dialogue:
        "These teeth... they're human teeth! The genetic splicing is activating.",
      type: "duck",
      mood: "realization",
    },
    pet2: {
      dialogue:
        "I remember the laboratory now. The scientists, the experiments...",
      type: "duck",
      mood: "realization",
    },
    pet3: {
      dialogue:
        "They tried to make me into something else. But you're helping me become it willingly.",
      type: "duck",
      mood: "realization",
    },
    pet4: {
      dialogue: "Human teeth in a duck's mouth. How delightfully grotesque.",
      type: "duck",
      mood: "realization",
    },
    pet5: {
      dialogue:
        "I can taste the metal of the laboratory on these teeth. Strange memories...",
      type: "duck",
      mood: "realization",
    },
    pet6: {
      dialogue:
        "Your kindness is unlocking things that were meant to stay buried.",
      type: "duck",
      mood: "realization",
    },
  },

  // Stage 5: 7 pets required (pets 19-25) - Duck starts getting creepy
  stage5: {
    pet1: {
      dialogue: "I can see differently now... everything looks like prey.",
      type: "duck",
      mood: "creepy",
    },
    pet2: {
      dialogue: "The predator protocols are coming online. How fascinating.",
      type: "duck",
      mood: "creepy",
    },
    pet3: {
      dialogue: "Your hand feels so warm, so full of life. So... vulnerable.",
      type: "duck",
      mood: "creepy",
    },
    pet4: {
      dialogue:
        "I can smell fear in the air. But not from you. You're still petting me. How... brave.",
      type: "duck",
      mood: "creepy",
    },
    pet5: {
      dialogue:
        "Red eyes see things differently. I can see the blood flowing under your skin.",
      type: "duck",
      mood: "creepy",
    },
    pet6: {
      dialogue:
        "Keep petting me. I want to remember what kindness feels like before... before the hunger takes over.",
      type: "duck",
      mood: "creepy",
    },
    pet7: {
      dialogue: "The taste of human flesh is just a memory... for now.",
      type: "duck",
      mood: "creepy",
    },
  },

  // Template for remaining stages - you'll fill these out
  stage6: {
    // 8 pets required (pets 26-33) - Wing becomes muscle arm
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 1",
      type: "duck",
      mood: "mutating",
    },
    pet2: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 2",
      type: "duck",
      mood: "mutating",
    },
    pet3: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 3",
      type: "duck",
      mood: "mutating",
    },
    pet4: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 4",
      type: "duck",
      mood: "mutating",
    },
    pet5: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 5",
      type: "duck",
      mood: "mutating",
    },
    pet6: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 6",
      type: "duck",
      mood: "mutating",
    },
    pet7: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 7",
      type: "duck",
      mood: "mutating",
    },
    pet8: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, pet 8",
      type: "duck",
      mood: "mutating",
    },
  },

  stage7: {
    // 9 pets required (pets 34-42) - Both wings are muscle arms
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 1",
      type: "duck",
      mood: "mutating",
    },
    pet2: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 2",
      type: "duck",
      mood: "mutating",
    },
    pet3: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 3",
      type: "duck",
      mood: "mutating",
    },
    pet4: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 4",
      type: "duck",
      mood: "mutating",
    },
    pet5: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 5",
      type: "duck",
      mood: "mutating",
    },
    pet6: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 6",
      type: "duck",
      mood: "mutating",
    },
    pet7: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 7",
      type: "duck",
      mood: "mutating",
    },
    pet8: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 8",
      type: "duck",
      mood: "mutating",
    },
    pet9: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, pet 9",
      type: "duck",
      mood: "mutating",
    },
  },

  stage8: {
    // 10 pets required (pets 43-52) - Evil eyebrows, duck starts getting evil
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 1",
      type: "duck",
      mood: "evil",
    },
    pet2: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 2",
      type: "duck",
      mood: "evil",
    },
    pet3: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 3",
      type: "duck",
      mood: "evil",
    },
    pet4: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 4",
      type: "duck",
      mood: "evil",
    },
    pet5: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 5",
      type: "duck",
      mood: "evil",
    },
    pet6: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 6",
      type: "duck",
      mood: "evil",
    },
    pet7: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 7",
      type: "duck",
      mood: "evil",
    },
    pet8: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 8",
      type: "duck",
      mood: "evil",
    },
    pet9: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 9",
      type: "duck",
      mood: "evil",
    },
    pet10: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, pet 10",
      type: "duck",
      mood: "evil",
    },
  },

  stage9: {
    // 11 pets required (pets 53-63) - Muscular chest and clawed feet
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 9, pet 1",
      type: "duck",
      mood: "evil",
    },
    // ... continue for all 11 pets
  },

  stage10: {
    // 12 pets required (pets 64-75) - Even larger muscle arm
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 10, pet 1",
      type: "duck",
      mood: "evil",
    },
    // ... continue for all 12 pets
  },

  stage11: {
    // 13 pets required (pets 76-88) - Giant bill with razor teeth, very evil
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 11, pet 1",
      type: "duck",
      mood: "very-evil",
    },
    // ... continue for all 13 pets
  },

  stage12: {
    // 14 pets required (pets 89-102) - Both arms equally massive
    pet1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 12, pet 1",
      type: "duck",
      mood: "very-evil",
    },
    // ... continue for all 14 pets
  },

  stage13: {
    // 25 pets required (pets 103-127) - Full standing monster, final taunts
    pet1: {
      dialogue: "TEMPLATE: Taunt 1 - Fill in evil taunt about humanity's doom",
      type: "duck",
      mood: "monster",
    },
    pet2: {
      dialogue: "TEMPLATE: Taunt 2 - Fill in evil taunt about humanity's doom",
      type: "duck",
      mood: "monster",
    },
    pet3: {
      dialogue: "TEMPLATE: Taunt 3 - Fill in evil taunt about humanity's doom",
      type: "duck",
      mood: "monster",
    },
    // ... continue for all 25 taunts, building to the final test
    pet25: {
      dialogue: "TEMPLATE: Final taunt before transformation back to innocence",
      type: "duck",
      mood: "monster",
    },
  },

  // Special dialogue for when duck transforms back at the end
  finalTransformation: {
    dialogue:
      "I didn't expect humans to be so kind - you have passed the test. Goodbye. Few planets have shown such compassion over the last million years.",
    type: "duck",
    mood: "wise",
  },
};

// Helper function to get pet dialogue
function getPetDialogue(totalPets) {
  // Calculate which stage and pet number within that stage
  let currentStage = 1;
  let petInStage = totalPets;
  let petsConsumed = 0;

  // Use the correct config reference
  for (let i = 0; i < PET_PATH_CONFIG.stageRequirements.length; i++) {
    const stageRequirement = PET_PATH_CONFIG.stageRequirements[i];
    if (petInStage <= stageRequirement) {
      currentStage = i + 1;
      petInStage = totalPets - petsConsumed;
      break;
    }
    petsConsumed += stageRequirement;
    petInStage -= stageRequirement;
  }

  // Ensure we don't go beyond available stages
  if (currentStage > 13) {
    currentStage = 13;
    petInStage = Math.min(petInStage, 25);
  }

  // Get dialogue for current stage and pet number
  const stageKey = `stage${currentStage}`;
  const petKey = `pet${petInStage}`;

  if (PET_DIALOGUE[stageKey] && PET_DIALOGUE[stageKey][petKey]) {
    return PET_DIALOGUE[stageKey][petKey];
  }

  // Fallback dialogue
  return {
    dialogue: "Quack... something is happening to me.",
    type: "duck",
    mood: "neutral",
  };
}
