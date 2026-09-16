# Seth's Birthday Scavenger Hunt Invite 🟩⛏️

A Minecraft-PvP-themed birthday invite/scavenger hunt. Every page is
static HTML/CSS/JS — no build step, no server, no backend.

## How the hunt works

**Stop 0 — you text the group chat.** You send the first clue yourself,
however you want (text, group chat, Instagram, whatever). It should
link to `spawn.html`, which isn't linked from the homepage — it only
exists for people who got your link.

Then it's four minigames in a row, each its own hidden page, each on a
`<canvas>` with no build step:

| Page | Game | To pass |
|---|---|---|
| `spawn.html` (Q1) | Green-Hill-Zone-style side-scroller. Intro: a big man carries her to the end of the course; then you run/jump the obstacle course chasing them. | Survive the full run with 3 HP (jump = Space/click/tap) |
| `roblox.html` (Q2) | Tetris, but every piece is stamped with a letter cycling through S-M-E-G-M-A. | Clear 3 lines (arrows/buttons, Space to hard-drop) |
| `channel.html` (Q3) | Balance stones: a moving stone slides left-right, drop it to land on the one below; land off-center and it topples (with a spring-damped wobble for the "physics" feel). | Stack 3 stones without one toppling |
| `boss.html` (Q4) | Undertale-style dodge fight — a red heart soul dodges a blocky pixel "SETH" sprite's kicks. Mouse always drives the heart on desktop; touch only moves it while pressed and dragged, since there's no hover on mobile. | Survive 25 seconds with 3 HP |

Each game shows a "NEXT QUESTION" button only once you've won, and a
death/topple/game-over screen with a RETRY button that resets just that
game in place (no page reload) if you lose.

**`achievement.html`** comes after Q4 — styled like a locked Minecraft
achievement, it asks for the date "this legend respawns every year" (your
birthday). Solving it reveals the code and a button to go type it in.

**`index.html`** is where that code actually gets typed in (on purpose,
it's not auto-filled). Getting it right sends guests to **`quiz.html`**,
a 6-question multiple-choice final trial. A perfect 6/6 sends them back
to `index.html`, which plays the chest-opening animation and shows the
invite. Any wrong answer tells them which question numbers they missed
and resets just the quiz (not the earlier stops) so they can retry.

`index.html` also has a link straight to the invite for anyone who just
wants the details without doing the hunt, and a "need a clue" link that
drops people back at `spawn.html` (Q1) as a fallback entry point.

## Tuning each game

All the tunable constants (durations, HP, speeds, spawn rates, lines/
stones needed to win) sit at the top of each page's own `.js` file:
`spawn.js`, `roblox.js`, `channel.js`, `boss.js`. The birthday answer on
`achievement.html` lives in `achievement.js`, and the quiz answer key is
`ANSWER_KEY` in `quiz.js`.

The shared code that gates the quiz lives in `config.js` (`SHARED_CODE`).
The party details on the final invite (date, location, what to bring,
RSVP) are directly in `index.html`.

## Preview it locally

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Host it on GitHub Pages (free, recommended)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. **Settings → Pages** → Source: `Deploy from a branch` → pick this
   branch, folder `/ (root)` → Save.
3. Live in a minute or two at `https://<your-username>.github.io/<repo-name>/`.

## Or host it on Vercel

1. [vercel.com](https://vercel.com) → sign in with GitHub → "Add New… → Project" → import this repo.
2. Framework preset: **Other** (plain static HTML, no build command).
3. Deploy — you get a `your-project.vercel.app` URL instantly.
