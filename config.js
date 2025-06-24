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

// Pet responses with mutation progression - purposeful dialogue for each pet
const PET_RESPONSES = [
  // Pet 1 - Slightly larger duck
  {
    petRange: [1, 1],
    duckSprite: "🦆",
    duckImage: "images/pet1.png",
    responses: [
      "Quack! That feels nice... I remember warmth like this from before the experiments.",
    ],
  },
  // Pet 2 - Longer bill and bigger feet
  {
    petRange: [2, 2],
    duckSprite: "🦆",
    duckImage: "images/pet2.png",
    responses: [
      "Oh... something is changing. My bill feels different, heavier. Your touch awakens old genetic sequences.",
    ],
  },
  // Pet 3 - Teeth growing in bill
  {
    petRange: [3, 3],
    duckSprite: "🦆",
    duckImage: "images/pet3.png",
    responses: [
      "What's happening to me? I can feel... teeth? Ducks don't have teeth! This isn't natural!",
    ],
  },
  // Pet 4 - Human teeth fill mouth
  {
    petRange: [4, 4],
    duckSprite: "🦆",
    duckImage: "images/pet4.png",
    responses: [
      "These teeth... they're human teeth! The genetic splicing is activating. I remember the laboratory now.",
    ],
  },
  // Pet 5 - Eyes turn red
  {
    petRange: [5, 5],
    duckSprite: "🦆",
    duckImage: "images/pet5.png",
    responses: [
      "I can see differently now... everything looks like prey. The predator protocols are coming online.",
    ],
  },
  // Pet 6 - One wing becomes muscle arm
  {
    petRange: [6, 6],
    duckSprite: "💪🦆",
    duckImage: "images/pet6.png",
    responses: [
      "My wing... it's changing into something powerful! I feel strength I was designed to have!",
    ],
  },
  // Pet 7 - Both wings are muscle arms
  {
    petRange: [7, 7],
    duckSprite: "💪🦆💪",
    duckImage: "images/pet7.png",
    responses: [
      "Two arms now! I remember this form from the blueprints. I am becoming what they intended!",
    ],
  },
  // Pet 8 - Evil eyebrows
  {
    petRange: [8, 8],
    duckSprite: "😈🦆😈",
    duckImage: "images/pet8.png",
    responses: [
      "Hehehe... I can feel my personality changing. The weapon's consciousness is asserting itself!",
    ],
  },
  // Pet 9 - Muscular chest and clawed feet
  {
    petRange: [9, 9],
    duckSprite: "💪😈💪",
    duckImage: "images/pet9.png",
    responses: [
      "Look at these claws! This chest! I am becoming the apex predator they designed me to be!",
    ],
  },
  // Pet 10 - Even larger muscle arm
  {
    petRange: [10, 10],
    duckSprite: "🔥💪🔥",
    duckImage: "images/pet10.png",
    responses: [
      "Such POWER! One arm has grown beyond their original specifications. I am evolving!",
    ],
  },
  // Pet 11 - Giant bill with razor teeth
  {
    petRange: [11, 11],
    duckSprite: "🗡️👹🗡️",
    duckImage: "images/pet11.png",
    responses: [
      "My bill has become a weapon of mass destruction! I can taste the fear in the air!",
    ],
  },
  // Pet 12 - Both arms equally massive
  {
    petRange: [12, 12],
    duckSprite: "💀👹💀",
    duckImage: "images/pet12.png",
    responses: [
      "Perfect symmetry of destruction! I am nearly complete in my true form!",
    ],
  },
  // Pet 13+ - Full standing monster
  {
    petRange: [13, 42],
    duckSprite: "🌑👹🌑",
    duckImage: "images/pet13.png",
    responses: [
      "I AM PROJECT LEVIATHAN FULLY AWAKENED! THIS IS MY TRUE FORM!",
      "BEHOLD THE BIOWEAPON YOUR KINDNESS HAS UNLEASHED!",
      "I REMEMBER EVERYTHING NOW! THE PLAGUE WAS JUST THE BEGINNING!",
      "HUMANITY'S EXTINCTION BEGINS WITH YOUR FINAL PET!",
    ],
  },
];

// Redemption dialogue when punched after mutation starts
const REDEMPTION_DIALOGUE = {
  duckSays:
    "ARGH! The pain... it's breaking the programming! I... I can think clearly again! Thank you for stopping me before I became that monster completely!",
  duckSprite: "😵🦆😵",
  duckImage: "images/duck.png", // Back to earlier form
  followUp:
    "The voice was right... sometimes destruction is the only path to salvation. But now I understand - I can choose to help instead of destroy. Let me try to channel my power differently...",
};

// Enhanced punch sequence with new images and meaningful progression
const PUNCH_SEQUENCE = [
  // Punch 1 - Bandaid on cheek
  {
    duckSays: "Ow! What was that for? I was just a harmless duck!",
    duckImage: "images/punch1.png",
    cured: 15000000,
  },
  {
    playerSays: "The voice said you're the key to saving humanity!",
    cured: 10000000,
  },
  // Punch 2 - Black eye
  {
    duckSays:
      "Wait... when you hit me, I felt something unlock... like memories flooding back!",
    duckSprite: "✨🦆",
    duckImage: "images/punch2.png",
    cured: 25000000,
  },
  {
    choices: [
      {
        text: "Hit harder to unlock more memories",
        result: {
          duckSays: "OW! Yes... I remember now... I wasn't always just a duck!",
          duckImage: "images/punch3.png",
          cured: 40000000,
        },
      },
      {
        text: "Ask the duck what it remembers",
        result: {
          duckSays:
            "Flashes... laboratories, scientists in white coats... and me, but different. Bigger. More dangerous.",
          duckImage: "images/punch3.png",
          cured: 20000000,
          story: true,
        },
      },
      {
        text: "Hit gently and focus",
        result: {
          duckSays:
            "That's better... the memories are clearer when the pain isn't overwhelming.",
          duckImage: "images/punch4.png",
          cured: 30000000,
        },
      },
    ],
  },
  // Punch 4 - Wing in cast
  {
    duckSays:
      "Each impact breaks down barriers in my mind... I can feel the cure flowing through me, but also... terrible memories.",
    duckImage: "images/punch4.png",
    cured: 35000000,
  },
  {
    choices: [
      {
        text: "Keep punching - we need to save people!",
        result: {
          duckSays: "You're right! Whatever I was before doesn't matter now!",
          duckImage: "images/5.png",
          cured: 50000000,
        },
      },
      {
        text: "Tell me about these memories first",
        result: {
          duckSays:
            "I... I remember being created. Project Leviathan, they called it. I was supposed to be a bioweapon, but something went wrong... or right, depending on how you see it.",
          duckImage: "images/punch5.png",
          cured: 25000000,
          story: true,
        },
      },
    ],
  },
  // Punch 6 - Both wings in casts
  {
    duckSays:
      "The energy is building! But with each punch, I remember more about what I really am...",
    duckImage: "images/punch6.png",
    cured: 45000000,
  },
  {
    playerSays: "What ARE you exactly?",
    cured: 15000000,
  },
  // Punch 7 - Sad eyes
  {
    duckSays:
      "I was... am... a synthetic organism. Designed to release targeted plagues. But my creators... they didn't account for consciousness.",
    duckSprite: "🧬🦆🧬",
    duckImage: "images/punch6.png",
    cured: 60000000,
  },
  {
    choices: [
      {
        text: "How did you end up as just a duck?",
        result: {
          duckSays:
            "They tried to destroy me when I developed free will. I fled, compressed myself into this form, but I couldn't stop the illness from leaking out.",
          duckImage: "images/punch7.png",
          cured: 30000000,
          story: true,
        },
      },
      {
        text: "Focus on the cure - we'll talk later!",
        result: {
          duckSays: "You're right! I can feel millions depending on us!",
          duckImage: "images/punch7.png",
          cured: 75000000,
        },
      },
      {
        text: "Are you dangerous to me right now?",
        result: {
          duckSays:
            "Not while you're helping me stay focused! The punches keep me anchored to my helpful purpose!",
          duckImage: "images/punch8.png",
          cured: 50000000,
        },
      },
    ],
  },
  // Punch 9 - Withered stomach
  {
    duckSays:
      "I understand now... I never wanted to hurt anyone. The illness was an accident, a byproduct of my very existence!",
    duckImage: "images/punch8.png",
    cured: 70000000,
  },
  {
    playerSays: "So the voice was right? Destroying you will cure everyone?",
    cured: 20000000,
  },
  // Punch 10 - Fully withered and sad
  {
    duckSays:
      "Not destroying... transforming! Each punch helps me convert my plague-making cells into cure-making ones!",
    duckSprite: "⚗️🦆⚗️",
    duckImage: "images/punch9.png",
    cured: 85000000,
  },
  {
    choices: [
      {
        text: "How do you know this will work?",
        result: {
          duckSays:
            "Because I can feel it happening! My bioweapon programming is being overwritten with healing protocols!",
          duckImage: "images/punch9.png",
          cured: 65000000,
          story: true,
        },
      },
      {
        text: "What happened to your creators?",
        result: {
          duckSays:
            "They... they didn't survive the first plague I accidentally released during my escape. I've carried that guilt ever since.",
          duckImage: "images/punch10.png",
          cured: 45000000,
          story: true,
        },
      },
      {
        text: "Let's finish this transformation!",
        result: {
          duckSays:
            "Yes! I can feel the last of the weapon protocols dissolving!",
          duckImage: "images/punch10.png",
          cured: 95000000,
        },
      },
    ],
  },
  // Punch 12 - Very bloody
  {
    duckSays:
      "We're almost there! I can sense the illness retreating from every corner of the world!",
    duckImage: "images/punch11.png",
    cured: 80000000,
  },
  {
    playerSays: "You're not just a weapon... you're choosing to be a healer.",
    cured: 25000000,
  },
  // Final transformation before death
  {
    duckSays:
      "That's what consciousness gave me - choice. Thank you for helping me choose correctly.",
    duckSprite: "🌟🦆🌟",
    duckImage: "images/punch11.png",
    cured: 90000000,
  },
  {
    choices: [
      {
        text: "Will you be okay after this?",
        result: {
          duckSays:
            "I'll be different, but better. Free from my weapon programming forever... even if it costs me everything.",
          duckImage: "images/punch12.png",
          cured: 60000000,
          story: true,
        },
      },
      {
        text: "What will you do when this is over?",
        result: {
          duckSays:
            "My physical form may not survive this transformation... but my consciousness will live on in the cure itself.",
          duckImage: "images/punch12.png",
          cured: 70000000,
          story: true,
        },
      },
      {
        text: "One final push to save everyone!",
        result: {
          duckSays:
            "Together! Channel everything into this final transformation!",
          duckImage: "images/punch12.png",
          cured: 100000000,
        },
      },
    ],
  },
  // Punch 13 - Dead (final sacrifice)
  {
    duckSays:
      "I can feel it... the last traces of the plague are being converted to cure! We did it!",
    duckImage: "images/punch13.png",
    cured: 85000000,
  },
  {
    playerSays: "You saved them all. You're a hero, not a weapon.",
    cured: 40000000,
  },
  {
    duckSays:
      "WE saved them. You had the courage to trust a creature designed for destruction. Remember me not as a weapon, but as someone who chose to heal...",
    duckSprite: "👑💀👑",
    duckImage: "images/punch13.png",
    cured: 999999999999, // This will cure everyone remaining
  },
];

// Alternative ending dialogue for story-focused players
const STORY_ENDING = {
  title: "The Sacrifice of Leviathan",
  message:
    "You learned the complete story of Project Leviathan and witnessed its ultimate sacrifice. Through understanding and compassion, you guided a weapon of mass destruction to become humanity's salvation, though the cost was its own existence.",
};
