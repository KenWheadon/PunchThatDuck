// Extended Game Engine Configuration for 5-minute experience
const GAME_CONFIG = {
  totalPopulation: 8000000000,
  initialDeaths: 423,
  deathRatePhase1: 1, // deaths per second for first 30 seconds
  deathRatePhase1Duration: 30, // seconds
  totalGameTime: 1200, // 20 minutes in seconds
  petThreshold: 42, // pets needed for passive ending
  heartThreshold: 5, // pets needed for hearts to appear
};

// Extended punch sequence for ~5 minute gameplay experience
const PUNCH_SEQUENCE = [
  {
    duckSays: "Ow! What was that for?",
    cured: 50000000,
  },
  {
    playerSays: "I'm trying to save humanity! The voice said to punch you!",
    cured: 30000000,
  },
  {
    duckSays:
      "Wait... I can feel something changing... There's energy flowing through me!",
    duckSprite: "🦆",
    cured: 80000000,
  },
  {
    choices: [
      {
        text: "Punch harder to amplify the effect",
        result: {
          duckSays:
            "OWWW! That really hurt! But... I can feel the cure spreading faster!",
          cured: 200000000,
        },
      },
      {
        text: "Punch more gently and focus",
        result: {
          duckSays:
            "That's... actually better. I can channel the healing energy more precisely.",
          cured: 150000000,
        },
      },
      {
        text: "Ask the duck what's happening",
        result: {
          duckSays:
            "I don't understand it either, but each impact seems to unlock something inside me!",
          cured: 100000000,
        },
      },
    ],
  },
  {
    duckSays:
      "The energy is building! I can sense the illness in every human... Keep going!",
    cured: 120000000,
  },
  {
    playerSays: "This feels wrong, but if it's saving people...",
    cured: 90000000,
  },
  {
    duckSays:
      "Don't hesitate now! I can feel their pain lessening with each strike!",
    duckSprite: "✨🦆✨", // Glowing duck
    cured: 180000000,
  },
  {
    choices: [
      {
        text: "Continue the rhythm - punch steadily",
        result: {
          duckSays:
            "Yes! There's a pattern to this... like a heartbeat of healing!",
          cured: 250000000,
        },
      },
      {
        text: "Try a different approach - multiple quick punches",
        result: {
          duckSays:
            "Whoa! That's intense but it's working! The cure is spreading in waves!",
          cured: 300000000,
        },
      },
    ],
  },
  {
    duckSays:
      "I understand now... Each punch channels the cure through me! I'm a conduit!",
    cured: 200000000,
  },
  {
    playerSays: "A conduit? You mean this was planned?",
    cured: 100000000,
  },
  {
    duckSays:
      "I... I think I was created for this purpose. The illness, the cure... it's all connected!",
    duckSprite: "🌟🦆🌟",
    cured: 220000000,
  },
  {
    choices: [
      {
        text: "Who created you? Why a duck?",
        result: {
          duckSays:
            "I don't remember... but I know this is my destiny. Keep punching!",
          cured: 180000000,
        },
      },
      {
        text: "Focus on saving everyone first, questions later",
        result: {
          duckSays: "You're right! There's no time to waste. Hit me again!",
          cured: 240000000,
        },
      },
    ],
  },
  {
    duckSays:
      "We're making incredible progress! I can feel millions being cured!",
    cured: 280000000,
  },
  {
    playerSays: "The bar is filling up! We might actually do this!",
    cured: 150000000,
  },
  {
    duckSays: "But wait... something's wrong. The energy is becoming unstable!",
    duckSprite: "⚡🦆⚡",
    cured: 200000000,
  },
  {
    choices: [
      {
        text: "Punch harder to push through the instability",
        result: {
          duckSays:
            "ARGH! It's working but I don't know how much more I can take!",
          cured: 400000000,
        },
      },
      {
        text: "Stop and let the duck stabilize",
        result: {
          duckSays: "Thank you... I need a moment. But we can't stop for long!",
          cured: 100000000,
        },
      },
      {
        text: "Try a gentler, more focused approach",
        result: {
          duckSays:
            "Yes! That's it! Quality over quantity - each punch counts!",
          cured: 350000000,
        },
      },
    ],
  },
  {
    duckSays: "I can see the end! The cure is almost complete!",
    cured: 300000000,
  },
  {
    playerSays: "Just a little more! Stay with me, duck!",
    cured: 200000000,
  },
  {
    duckSays:
      "The energy... it's reaching critical mass! One final sequence should do it!",
    duckSprite: "💫🦆💫",
    cured: 250000000,
  },
  {
    choices: [
      {
        text: "One powerful final punch",
        result: {
          duckSays:
            "Perfect! The cure is spreading across the globe like wildfire!",
          cured: 500000000,
        },
      },
      {
        text: "Three quick successive punches",
        result: {
          duckSays: "Brilliant! Each punch is hitting a different continent!",
          cured: 600000000,
        },
      },
      {
        text: "A gentle but determined final punch",
        result: {
          duckSays: "Sometimes the gentlest touch has the greatest power...",
          cured: 450000000,
        },
      },
    ],
  },
  {
    duckSays:
      "We did it! I can feel the illness retreating from every corner of the Earth!",
    cured: 400000000,
  },
  {
    playerSays: "I can't believe it actually worked... We saved them!",
    cured: 300000000,
  },
  {
    duckSays:
      "You showed incredible determination. Humanity is lucky to have someone like you.",
    duckSprite: "👑🦆👑", // Crown duck - hero duck
    cured: 200000000,
  },
  {
    playerSays: "What happens to you now? Will you be okay?",
    cured: 150000000,
  },
  {
    duckSays:
      "I'll be fine. This is what I was meant to do. The world is safe now.",
    cured: 100000000,
  },
  {
    duckSays: "Thank you for having the courage to do what seemed impossible.",
    cured: 999999999999, // This will cure everyone remaining
  },
];
