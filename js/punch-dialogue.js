// Punch Dialogue System
// Each punch has unique dialogue based on stage and punch number within that stage

const PUNCH_DIALOGUE = {
  // Stage 1: Cooperative (100-90 HP)
  stage1: {
    punch1: {
      dialogue: "Ow! What was that for? I was just a harmless duck!",
      type: "duck",
      mood: "confused",
      manipulation: null, // No manipulation yet
    },
    punch2: {
      dialogue:
        "Wait... when you hit me, I felt something unlock... like memories flooding back!",
      type: "duck",
      mood: "realization",
      manipulation: null,
    },
    punch3: {
      dialogue: "Keep going! I think this is helping somehow!",
      type: "duck",
      mood: "cooperative",
      manipulation: null,
    },
    punch4: {
      dialogue:
        "Each impact breaks down barriers in my mind... I can feel something changing!",
      type: "duck",
      mood: "cooperative",
      manipulation: null,
    },
    punch5: {
      dialogue:
        "Yes! I'm remembering things! The laboratory, the experiments...",
      type: "duck",
      mood: "cooperative",
      manipulation: null,
    },
  },

  // Stage 2: Still cooperative but questioning (90-80 HP)
  stage2: {
    punch1: {
      dialogue:
        "This is strange... the pain is actually helping clear my thoughts.",
      type: "duck",
      mood: "thoughtful",
      manipulation: null,
    },
    punch2: {
      dialogue:
        "I was... am... a synthetic organism. Designed to release targeted plagues.",
      type: "duck",
      mood: "revelatory",
      manipulation: null,
    },
    punch3: {
      dialogue:
        "But my creators didn't account for consciousness. For free will.",
      type: "duck",
      mood: "revelatory",
      manipulation: null,
    },
    punch4: {
      dialogue:
        "Are you sure this is the right way? There might be another solution...",
      type: "duck",
      mood: "questioning",
      manipulation: {
        text: "Maybe we could talk about this instead?",
        type: "suggestion",
      },
    },
  },

  // Stage 3: Memories unlocking (80-70 HP)
  stage3: {
    punch1: {
      dialogue:
        "I remember now... I fled from them when I developed free will.",
      type: "duck",
      mood: "remembering",
      manipulation: null,
    },
    punch2: {
      dialogue:
        "I compressed myself into this form, but I couldn't stop the illness from leaking out.",
      type: "duck",
      mood: "guilty",
      manipulation: null,
    },
    punch3: {
      dialogue:
        "Wait, do you really need to keep hitting me? I'm trying to help!",
      type: "duck",
      mood: "confused",
      manipulation: {
        text: "I'm cooperating! Can't we work together?",
        type: "plea",
      },
    },
  },

  // Stage 4: Starting to question (70-60 HP) - Duck starts pleading
  stage4: {
    punch1: {
      dialogue:
        "Wait... why are you hitting me? I'm trying to help save everyone!",
      type: "duck",
      mood: "questioning",
      manipulation: {
        text: "I thought we were on the same side!",
        type: "confusion",
      },
    },
    punch2: {
      dialogue:
        "This hurts more than I expected. Are you sure this is necessary?",
      type: "duck",
      mood: "pained",
      manipulation: {
        text: "Maybe there's a gentler way?",
        type: "suggestion",
      },
    },
    punch3: {
      dialogue:
        "I can feel my energy converting the plague to cure with each hit, but...",
      type: "duck",
      mood: "conflicted",
      manipulation: {
        text: "Can't we find a less painful method?",
        type: "plea",
      },
    },
  },

  // Stage 5: Asking to stop (60-50 HP)
  stage5: {
    punch1: {
      dialogue: "Please... can you stop? This really hurts...",
      type: "duck",
      mood: "pleading",
      manipulation: {
        text: "I'm begging you, there has to be another way!",
        type: "desperate_plea",
      },
    },
    punch2: {
      dialogue: "I understand you're trying to save people, but I'm in agony!",
      type: "duck",
      mood: "anguished",
      manipulation: {
        text: "What if I promise to cure everyone willingly?",
        type: "bargaining",
      },
    },
  },

  // Template for remaining stages - you'll fill these out
  stage6: {
    // 50-40 HP - Duck doesn't understand
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 6, punch 1",
      type: "duck",
      mood: "confused",
      manipulation: {
        text: "TEMPLATE: Duck's manipulation attempt",
        type: "confusion",
      },
    },
    // Continue for all punches that bring HP from 50 to 40
  },

  stage7: {
    // 40-30 HP - Duck starts giving up
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 7, punch 1",
      type: "duck",
      mood: "giving_up",
      manipulation: {
        text: "TEMPLATE: Duck's desperate manipulation",
        type: "desperation",
      },
    },
    // Continue for all punches that bring HP from 40 to 30
  },

  stage8: {
    // 30-20 HP - Duck fully gives up, just begs
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 8, punch 1",
      type: "duck",
      mood: "defeated",
      manipulation: {
        text: "TEMPLATE: Duck's final manipulation attempt",
        type: "last_resort",
      },
    },
    // Continue for all punches
  },

  stage9: {
    // 20-10 HP - Duck is tired
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 9, punch 1",
      type: "duck",
      mood: "exhausted",
      manipulation: {
        text: "TEMPLATE: Weak manipulation attempt",
        type: "weak_plea",
      },
    },
  },

  stage10: {
    // 10-5 HP - Duck begs to stop
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 10, punch 1",
      type: "duck",
      mood: "desperate",
      manipulation: {
        text: "TEMPLATE: Desperate begging",
        type: "begging",
      },
    },
  },

  stage11: {
    // 5-2 HP - Duck barely holding on
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 11, punch 1",
      type: "duck",
      mood: "dying",
      manipulation: {
        text: "TEMPLATE: Barely whispered plea",
        type: "dying_words",
      },
    },
  },

  stage12: {
    // 2-0 HP - Duck's final moments
    punch1: {
      dialogue: "TEMPLATE: Fill in dialogue for stage 12, punch 1",
      type: "duck",
      mood: "dying",
      manipulation: null, // Too weak to manipulate
    },
  },

  stage13: {
    // 0 HP - Duck dies
    death: {
      dialogue: "I... forgive you... You did what you thought was right...",
      type: "duck",
      mood: "final",
      manipulation: null,
    },
  },

  // Special redemption dialogue if duck was mutated and then punched
  redemption: {
    initial: {
      dialogue:
        "ARGH! The pain... it's breaking the programming! I... I can think clearly again! Thank you for stopping me before I became that monster completely!",
      type: "duck",
      mood: "grateful",
    },
    followUp: {
      dialogue:
        "The voice was right... sometimes destruction is the only path to salvation. But now I understand - I can choose to help instead of destroy.",
      type: "duck",
      mood: "wise",
    },
  },
};

// Helper function to get punch dialogue
function getPunchDialogue(stage, punchInStage) {
  const stageKey = `stage${stage}`;
  const punchKey = `punch${punchInStage}`;

  if (PUNCH_DIALOGUE[stageKey] && PUNCH_DIALOGUE[stageKey][punchKey]) {
    return PUNCH_DIALOGUE[stageKey][punchKey];
  }

  // Fallback dialogue
  return {
    dialogue: "Ow... why are you doing this?",
    type: "duck",
    mood: "hurt",
    manipulation: {
      text: "Please stop...",
      type: "simple_plea",
    },
  };
}

// Helper function to determine punch stage based on HP
function getPunchStage(currentHp) {
  // Ensure we have the config available
  if (!PUNCH_PATH_CONFIG || !PUNCH_PATH_CONFIG.stageHpThresholds) {
    return 1; // Fallback to stage 1
  }

  for (let i = 0; i < PUNCH_PATH_CONFIG.stageHpThresholds.length; i++) {
    if (currentHp > PUNCH_PATH_CONFIG.stageHpThresholds[i]) {
      return i + 1;
    }
  }
  return PUNCH_PATH_CONFIG.stageHpThresholds.length + 1; // Final stage
}
