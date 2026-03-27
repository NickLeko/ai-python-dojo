# AI Python Dojo

AI Python Dojo is a static, GitHub Pages-friendly MVP for learning Python specifically in AI builder workflows. It focuses on fast reps for reading code, spotting bugs, and making tiny patches in the kinds of snippets you see around agents, evals, structured outputs, parsing, and guardrails.

## Why this exists

A lot of people building with AI understand prompts, agents, evals, and guardrails before they feel fully sharp in raw Python. This project is for that learner. Instead of long exercises or generic CS drills, it offers short practical reps that build precision where AI workflows tend to break.

## Target user

This app is for someone who:

- understands AI systems concepts reasonably well
- wants stronger Python fluency for AI workflows
- prefers short sessions over long coding projects
- wants code-reading, bug-spotting, and one-line correction reps
- does not want LeetCode-style practice

## Features

- Three focused modes: Read, Debug, and Patch
- 24 handcrafted challenges tailored to AI engineering contexts
- Difficulty tiers across easy, medium, and hard
- Inline explanations and takeaways after each answer
- Local progress tracking with XP, streaks, accuracy, mode stats, and missed-question tracking
- Filters for mode, difficulty, tag, all challenges, unanswered only, and missed only
- Mobile-friendly layout with tap-sized controls and horizontally scrollable code blocks
- Keyboard shortcuts for fast desktop practice

## Challenge modes

### Read Mode

Multiple choice questions about:

- what code prints or returns
- which bug exists
- which snippet is safest
- how truthiness and access patterns behave

### Debug Mode

Short debugging reps that mix:

- bug-spotting multiple choice
- one-line corrections
- AI workflow parsing and guardrail mistakes

### Patch Mode

Tiny patch tasks with one-line or two-line answers for:

- required-key validation
- malformed JSON handling
- safe nested access
- lightweight guardrail logic

## Topics emphasized

The seeded challenge bank focuses on practical Python concepts that show up in AI workflows:

- `json.loads()` vs `json.load()`
- `dict.get()` vs direct key access
- truthiness for `0`, `""`, `[]`, and `None`
- loop syntax and counting
- equality vs assignment
- required-key validation
- empty response guardrails
- optional structured-output fields
- malformed JSON handling with `try/except`
- safe config and tool-output parsing
- refusal logic and normalization

## Tech stack

- Plain HTML
- Plain CSS
- Plain JavaScript
- `localStorage` for persistence
- No backend
- No framework
- No build step
- No Node requirement

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
├── data/
│   └── challenges.js
└── README.md
```

## Run locally

Because the app is fully static, you can either:

1. Open `index.html` directly in a browser.
2. Or serve the folder with a simple static server if you prefer.

Example with Python:

```bash
python3 -m http.server
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open `Settings` -> `Pages`.
3. Set the source to deploy from your main branch.
4. Choose the root folder (`/`) as the publish directory.
5. Save, then wait for GitHub Pages to publish the site.

Since the app uses only static files, it works cleanly on GitHub Pages without any backend setup.

## Extending the challenge bank

Challenges live in [`data/challenges.js`](/Users/nicholasleko/projects/Python%20Dojo/data/challenges.js). Each challenge has a small schema that is easy to edit manually:

- `id`
- `mode`
- `type`
- `title`
- `difficulty`
- `tags`
- `prompt`
- `code`
- `options`
- `correctAnswer`
- `acceptedAnswers`
- `explanation`
- `takeaway`

Patch validation is intentionally lightweight for the MVP. Answers are normalized for whitespace and simple quote variants, and some tasks accept multiple valid strings.

## Future improvements

- Add more challenges by tag and difficulty
- Add lightweight achievements or session summaries
- Track per-tag weak spots more deeply
- Add curated practice paths like "JSON week" or "Guardrails sprint"
- Add optional sound/theme variants while staying static-host friendly
