// Extended Game Engine Configuration for 5-minute experience
const GAME_CONFIG = {
  totalPopulation: 8000000000,
  initialDeaths: 423,
  deathRatePhase1: 1, // deaths per second for first 30 seconds
  deathRatePhase1Duration: 30, // seconds
  totalGameTime: 600, // 10 minutes in seconds
  petThreshold: 42, // pets needed for passive ending
  heartThreshold: 5, // pets needed for hearts to appear
  mutationStartPet: 6, // when duck starts mutating
  fullMutationPet: 20, // when duck is fully mutated
};

// Pet responses with mutation progression
const PET_RESPONSES = [
  // Normal pets (0-5)
  {
    petRange: [1, 1],
    duckSprite: "🦆",
    responses: [
      "Quack! That feels nice... I remember warmth like this from before.",
      "Oh, a gentle human touch... it's been so long.",
      "Quack quack! Your kindness reminds me of my creators.",
    ],
  },
  {
    petRange: [2, 3],
    duckSprite: "🦆",
    responses: [
      "More pets please! They help me remember who I used to be.",
      "This is quite pleasant... though something stirs within.",
      "Quack! You're very kind... unlike the voices that made me.",
    ],
  },
  {
    petRange: [4, 5],
    duckSprite: "🦆",
    responses: [
      "I'm starting to feel... different. The old hunger awakens.",
      "Something is stirring within me... the original purpose.",
      "These pets are... changing me back to what I was designed to be.",
    ],
  },

  // Early mutation phase (6-10)
  {
    petRange: [6, 8],
    duckSprite: "🦆💀",
    responses: [
      "Yesss... I remember now... I was created to consume!",
      "The bioweapon protocols are reactivating... I can't stop it!",
      "Don't stop now, human. You're awakening my true nature!",
      "The power... it flows through each touch! Just like in the lab!",
      "I wasn't meant to be just a duck... I was meant to be so much MORE!",
    ],
  },
  {
    petRange: [9, 12],
    duckSprite: "💀🦆💀",
    responses: [
      "I AM REMEMBERING! The laboratory... the experiments!",
      "I can see the scientists now... they made me to end worlds!",
      "Your pets are reactivating dormant genetic sequences!",
      "Soon I will be what they designed... a perfect weapon!",
      "The illness was just the beginning... I am the true plague!",
      "Hehehehe... this is exactly what they programmed me to feel!",
    ],
  },

  // Advanced mutation (13-19)
  {
    petRange: [13, 16],
    duckSprite: "👹🦆👹",
    responses: [
      "I REMEMBER EVERYTHING NOW! Project Leviathan!",
      "The illness... I created it just by existing! My very presence corrupts!",
      "They thought they could control me... but I am INEVITABLE!",
      "Each pet brings me closer to my ORIGINAL PROGRAMMING!",
      "Soon I will have enough power to complete my mission!",
      "You cannot stop petting... the psychic compulsion is activating!",
    ],
  },
  {
    petRange: [17, 19],
    duckSprite: "🔥👹🔥",
    responses: [
      "THE FINAL PROTOCOLS ARE ACTIVATING!",
      "I was designed to be humanity's extinction event!",
      "Your pets have awakened something the scientists feared!",
      "I remember my true form... not duck... LEVIATHAN!",
      "THE TRANSFORMATION TO MY WEAPON STATE IS NEARLY COMPLETE!",
    ],
  },

  // Full mutation (20+)
  {
    petRange: [20, 999],
    duckSprite: "🌑👹🌑",
    responses: [
      "I AM PROJECT LEVIATHAN FULLY AWAKENED!",
      "NOW I REMEMBER WHY THEY TRIED TO DESTROY ME!",
      "This world will burn as my creators intended!",
      "THE BIOWEAPON IS COMPLETE! HUMANITY'S END BEGINS!",
      "I AM THE PLAGUE THEY MADE TO END ALL PLAGUES!",
    ],
  },
];

// Redemption dialogue when punched after mutation starts
const REDEMPTION_DIALOGUE = {
  duckSays:
    "ARGH! The pain... it's breaking the programming! I... I can think clearly again! Thank you for stopping me before I became that monster completely!",
  duckSprite: "😵🦆😵",
  duckImage: null, // "images/duck_redeemed.png"
  followUp:
    "The voice was right... sometimes destruction is the only path to salvation. But now I understand - I can choose to help instead of destroy. Let me try to channel my power differently...",
};

// Enhanced punch sequence with deeper lore and meaningful choices
const PUNCH_SEQUENCE = [
  {
    duckSays: "Ow! What was that for? I was just a harmless duck!",
    duckImage: null, // "images/duck_surprised.png"
    cured: 15000000,
  },
  {
    playerSays: "The voice said you're the key to saving humanity!",
    cured: 10000000,
  },
  {
    duckSays:
      "Wait... when you hit me, I felt something unlock... like memories flooding back!",
    duckSprite: "✨🦆",
    duckImage: null, // "images/duck_glowing.png"
    cured: 25000000,
  },
  {
    choices: [
      {
        text: "Hit harder to unlock more memories",
        result: {
          duckSays: "OW! Yes... I remember now... I wasn't always just a duck!",
          duckImage: null, // "images/duck_remembering.png"
          cured: 40000000,
        },
      },
      {
        text: "Ask the duck what it remembers",
        result: {
          duckSays:
            "Flashes... laboratories, scientists in white coats... and me, but different. Bigger. More dangerous.",
          duckImage: null, // "images/duck_thoughtful.png"
          cured: 20000000,
          story: true,
        },
      },
      {
        text: "Hit gently and focus",
        result: {
          duckSays:
            "That's better... the memories are clearer when the pain isn't overwhelming.",
          duckImage: null, // "images/duck_focused.png"
          cured: 30000000,
        },
      },
    ],
  },
  {
    duckSays:
      "Each impact breaks down barriers in my mind... I can feel the cure flowing through me, but also... terrible memories.",
    duckImage: null, // "images/duck_conflicted.png"
    cured: 35000000,
  },
  {
    choices: [
      {
        text: "Keep punching - we need to save people!",
        result: {
          duckSays: "You're right! Whatever I was before doesn't matter now!",
          duckImage: null, // "images/duck_determined.png"
          cured: 50000000,
        },
      },
      {
        text: "Tell me about these memories first",
        result: {
          duckSays:
            "I... I remember being created. Project Leviathan, they called it. I was supposed to be a bioweapon, but something went wrong... or right, depending on how you see it.",
          duckImage: null, // "images/duck_revealing.png"
          cured: 25000000,
          story: true,
        },
      },
    ],
  },
  {
    duckSays:
      "The energy is building! But with each punch, I remember more about what I really am...",
    duckImage: null, // "images/duck_energized.png"
    cured: 45000000,
  },
  {
    playerSays: "What ARE you exactly?",
    cured: 15000000,
  },
  {
    duckSays:
      "I was... am... a synthetic organism. Designed to release targeted plagues. But my creators... they didn't account for consciousness.",
    duckSprite: "🧬🦆🧬",
    duckImage: null, // "images/duck_synthetic.png"
    cured: 60000000,
  },
  {
    choices: [
      {
        text: "How did you end up as just a duck?",
        result: {
          duckSays:
            "They tried to destroy me when I developed free will. I fled, compressed myself into this form, but I couldn't stop the illness from leaking out.",
          duckImage: null, // "images/duck_escaped.png"
          cured: 30000000,
          story: true,
        },
      },
      {
        text: "Focus on the cure - we'll talk later!",
        result: {
          duckSays: "You're right! I can feel millions depending on us!",
          duckImage: null, // "images/duck_focused_cure.png"
          cured: 75000000,
        },
      },
      {
        text: "Are you dangerous to me right now?",
        result: {
          duckSays:
            "Not while you're helping me stay focused! The punches keep me anchored to my helpful purpose!",
          duckImage: null, // "images/duck_safe.png"
          cured: 50000000,
        },
      },
    ],
  },
  {
    duckSays:
      "I understand now... I never wanted to hurt anyone. The illness was an accident, a byproduct of my very existence!",
    duckImage: null, // "images/duck_understanding.png"
    cured: 70000000,
  },
  {
    playerSays: "So the voice was right? Destroying you will cure everyone?",
    cured: 20000000,
  },
  {
    duckSays:
      "Not destroying... transforming! Each punch helps me convert my plague-making cells into cure-making ones!",
    duckSprite: "⚗️🦆⚗️",
    duckImage: null, // "images/duck_transforming.png"
    cured: 85000000,
  },
  {
    choices: [
      {
        text: "How do you know this will work?",
        result: {
          duckSays:
            "Because I can feel it happening! My bioweapon programming is being overwritten with healing protocols!",
          duckImage: null, // "images/duck_healing_protocols.png"
          cured: 65000000,
          story: true,
        },
      },
      {
        text: "What happened to your creators?",
        result: {
          duckSays:
            "They... they didn't survive the first plague I accidentally released during my escape. I've carried that guilt ever since.",
          duckImage: null, // "images/duck_guilty.png"
          cured: 45000000,
          story: true,
        },
      },
      {
        text: "Let's finish this transformation!",
        result: {
          duckSays:
            "Yes! I can feel the last of the weapon protocols dissolving!",
          duckImage: null, // "images/duck_dissolving_protocols.png"
          cured: 95000000,
        },
      },
    ],
  },
  {
    duckSays:
      "We're almost there! I can sense the illness retreating from every corner of the world!",
    duckImage: null, // "images/duck_world_healing.png"
    cured: 80000000,
  },
  {
    playerSays: "You're not just a weapon... you're choosing to be a healer.",
    cured: 25000000,
  },
  {
    duckSays:
      "That's what consciousness gave me - choice. Thank you for helping me choose correctly.",
    duckSprite: "🌟🦆🌟",
    duckImage: null, // "images/duck_choosing_good.png"
    cured: 90000000,
  },
  {
    choices: [
      {
        text: "Will you be okay after this?",
        result: {
          duckSays:
            "I'll be different, but better. Free from my weapon programming forever.",
          duckImage: null, // "images/duck_free.png"
          cured: 60000000,
          story: true,
        },
      },
      {
        text: "What will you do when this is over?",
        result: {
          duckSays:
            "Maybe I'll stay a duck. It's peaceful. Or maybe I'll help prevent others from making my creators' mistakes.",
          duckImage: null, // "images/duck_future.png"
          cured: 70000000,
          story: true,
        },
      },
      {
        text: "One final push to save everyone!",
        result: {
          duckSays:
            "Together! Channel everything into this final transformation!",
          duckImage: null, // "images/duck_final_transformation.png"
          cured: 100000000,
        },
      },
    ],
  },
  {
    duckSays:
      "I can feel it... the last traces of the plague are being converted to cure! We did it!",
    duckImage: null, // "images/duck_victory.png"
    cured: 85000000,
  },
  {
    playerSays: "You saved them all. You're a hero, not a weapon.",
    cured: 40000000,
  },
  {
    duckSays:
      "WE saved them. You had the courage to trust a creature designed for destruction.",
    duckSprite: "👑🦆👑",
    duckImage: null, // "images/duck_hero.png"
    cured: 999999999999, // This will cure everyone remaining
  },
];

// Alternative ending dialogue for story-focused players
const STORY_ENDING = {
  title: "The Truth Revealed",
  message:
    "You learned the complete story of Project Leviathan and chose compassion over expedience. Though it took longer, you helped the duck find redemption and saved humanity through understanding rather than just force.",
};
