/*
  App directory — edit this file to add, remove, or update apps.
  No other file needs to change.

  To edit an existing app: change its "name", "url", or "description".
  To add an app: copy an { ... } entry inside the right category's
    "apps" array and fill in the fields.
  To add a new category: copy a whole { category: "...", apps: [...] }
    block and give it a new category name.

  Fields:
    name        (required) — shown as the app title
    url         (required) — where the "open" link goes
    description (optional) — one-line blurb shown under the name
    id          (recommended) — unique stable name; keep it when renaming an app
    screenshot  (optional) — image path from the site root, e.g. images/apps/app.jpg
    techStack   (optional) — list of technologies shown in the project details
    stackVerified (optional) — false if technology details still need confirmation
    learning    (optional) — your "What I learnt" paragraph
    learningDraft (optional) — true for suggested copy; set false after reviewing
*/

const APP_DATA = [
  {
    category: "Kids Study",
    apps: [
      {
        id: "chinese-practice",
        name: "Chinese Learning App",
        url: "https://chinese-practice-theta.vercel.app",
        description: "Little Owl Chinese language practice",
        screenshot: "images/apps/chinese-practice.jpg",
        techStack: ["Stack to be confirmed"],
        stackVerified: false,
        learning: "Designing short practice sessions around vocabulary, revision and feedback, with a guest experience that lets children start learning quickly.",
        learningDraft: true
      },
      {
        id: "rq-tingxie",
        name: "Rui Qi's Ting Xie",
        url: "https://goatedapps.github.io/RQtingxie/",
        description: "Primary 2 听写 Weekly Practice",
        screenshot: "images/apps/RQtingxie.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Breaking a spelling exercise into a clear listen, write and reveal sequence, and keeping weekly lesson content separate from the practice flow.",
        learningDraft: true
      },
      {
        id: "rq-spelling",
        name: "Rui Qi's Spelling",
        url: "https://goatedapps.github.io/rq-spelling/",
        description: "Weekly English spelling word drills",
        screenshot: "images/apps/rq-spelling.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Turning a weekly word list into repeatable practice, with simple navigation and encouraging feedback for younger learners.",
        learningDraft: true
      },
      {
        id: "s2-chinese-eoy",
        name: "S2 Chinese EOY",
        url: "https://goatedapps.github.io/S2-chinese-EOY/",
        description: "Secondary 2 Chinese vocabulary practice",
        screenshot: "images/apps/S2-chinese-EOY.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Structuring revision across flashcards, games and fill-in-the-blank exercises while keeping the vocabulary list easy to review.",
        learningDraft: true
      },
      {
        id: "word-spirit-quest",
        name: "Word Spirit Quest (P2 and P5)",
        url: "https://goatedapps.github.io/RPG-ChineseGame/game/",
        description: "Chinese vocabulary adventure for Primary 2 and 5",
        screenshot: "images/apps/RPG-ChineseGame.jpg",
        techStack: ["JavaScript", "Hanzi Writer", "YAML"],
        learning: "Sharing one adventure world between Primary 2 and Primary 5 while keeping each level's vocabulary, progression and saved progress separate.",
        learningDraft: true
      }
    ]
  },
  {
    category: "Fun and Games",
    apps: [
      {
        id: "sudoku",
        name: "Sudoku",
        url: "https://goatedapps.github.io/sudoku/",
        description: "Classic logic puzzle, multiple difficulties",
        screenshot: "images/apps/sudoku.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Working with puzzle state, difficulty settings and validation, while supporting both keyboard and touch input.",
        learningDraft: true
      },
      {
        id: "sushi-snake",
        name: "Sushi Snake",
        url: "https://goatedapps.github.io/Sushi-snake/",
        description: "Classic snake game with a sushi twist",
        screenshot: "images/apps/Sushi-snake.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Coordinating a game loop, collision detection and changing difficulty, with audio and visual feedback that responds to play.",
        learningDraft: true
      },
      {
        id: "learn-chinese-nouns",
        name: "Learn Chinese Nouns",
        url: "https://goatedapps.github.io/chinese-nouns-game/",
        description: "Practice Chinese nouns through play",
        screenshot: "images/apps/chinese-nouns-game.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Turning noun study into a group game with picture clues, matching rounds and timed descriptions.",
        learningDraft: true
      },
      {
        id: "pack-table-game",
        name: "Pack Table Game",
        url: "https://goatedapps.github.io/PackTableGame/",
        description: "Clear the mess before it piles up",
        screenshot: "images/apps/PackTableGame.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Making a familiar tidying task feel playful with clear controls, sound and a simple start-to-play flow.",
        learningDraft: true
      },
      {
        id: "tk-alien-exodus",
        name: "TK Alien Exodus",
        url: "https://goatedapps.github.io/TK-Alien-Exodus/",
        description: "A cinematic alien escape game",
        screenshot: "images/apps/TK-Alien-Exodus.jpg",
        techStack: ["HTML Canvas", "CSS", "JavaScript"],
        learning: "Coordinating a canvas-based game with character choices, touch controls, combat feedback and distinct mission zones.",
        learningDraft: true
      }
    ]
  },
  {
    category: "Utilities",
    apps: [
      {
        id: "menu-planner",
        name: "Menu Planner",
        url: "https://goatedapps.github.io/menuplanner/",
        description: "Plan out the week's family meals",
        screenshot: "images/apps/menuplanner.jpg",
        techStack: ["JavaScript", "CSS", "Local storage"],
        learning: "Modelling meals with reusable tags, generating plans from constraints, and saving choices locally so a plan survives a page refresh.",
        learningDraft: true
      },
      {
        id: "expense-tracker",
        name: "Expense Tracker",
        url: "https://goatedapps.github.io/Expense-tracker/",
        description: "Track cash flow, transactions and budgets",
        screenshot: "images/apps/Expense-tracker.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Bringing transactions, cash-flow charts and budgets into one view, with filters and CSV export for reviewing spending.",
        learningDraft: true
      }
    ]
  },
  {
    category: "Travel",
    apps: [
      {
        id: "beijing-itinerary",
        name: "Beijing Trip Itinerary",
        url: "https://goatedapps.github.io/Beijing2026/",
        description: "Day-by-day plan for the Beijing trip",
        screenshot: "images/apps/Beijing2026.jpg",
        techStack: ["JavaScript", "CSS", "Leaflet"],
        learning: "Organising a multi-day itinerary around geographic flow, and connecting schedules with maps so the next stop is easy to find.",
        learningDraft: true
      }
    ]
  },
  {
    category: "Archives",
    apps: [
      {
        id: "guangzhou-itinerary",
        name: "2026 Sep Guangzhou Trip Itinerary",
        url: "https://goatedapps.github.io/2026-Oct-Guangzhou/",
        description: "Day-by-day plan for the Guangzhou trip",
        screenshot: "images/apps/2026-Oct-Guangzhou.jpg",
        techStack: ["HTML", "CSS", "JavaScript"],
        learning: "Translating a travel plan into a passport-inspired interface while keeping daily schedules, transport and destination information easy to browse.",
        learningDraft: true
      }
    ]
  }
];
