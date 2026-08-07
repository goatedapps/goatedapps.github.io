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
*/

const APP_DATA = [
  {
    category: "Kids Study",
    apps: [
      {
        name: "Rui Min's P5 Ting Xie App",
        url: "https://goatedapps.github.io/learntingxie/",
        description: "Primary 5 Chinese dictation practice"
      },
      {
        name: "Rui Qi's Spelling",
        url: "https://goatedapps.github.io/rq-spelling/",
        description: "Weekly English spelling word drills"
      },
      {
        name: "P5 Chinese Learning App",
        url: "https://chinese-practice-theta.vercel.app",
        description: "Primary 5 Chinese language practice"
      }
    ]
  },
  {
    category: "Fun and Games",
    apps: [
      {
        name: "Sudoku",
        url: "https://goatedapps.github.io/sudoku/",
        description: "Classic logic puzzle, multiple difficulties"
      },
      {
        name: "Sushi Snake",
        url: "https://goatedapps.github.io/Sushi-snake/",
        description: "Classic snake game with a sushi twist"
      }
    ]
  },
  {
    category: "Utilities",
    apps: [
      {
        name: "Menu Planner",
        url: "https://goatedapps.github.io/menuplanner/",
        description: "Plan out the week's family meals"
      }
    ]
  },
  {
    category: "Travel",
    apps: [
      {
        name: "Beijing Trip Itinerary",
        url: "https://goatedapps.github.io/Beijing2026/",
        description: "Day-by-day plan for the Beijing trip"
      }
    ]
  }
];
