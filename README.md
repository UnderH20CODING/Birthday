# Seth's Birthday Scavenger Hunt Invite 🟩⛏️

A Minecraft-PvP-themed birthday invite/scavenger hunt. Every page is
static HTML/CSS/JS — no build step, no server, no backend.

## How the hunt works

**Stop 0 — you text the group chat.** You send the first clue yourself,
however you want (text, group chat, Instagram, whatever). It should
link to `spawn.html`, which isn't linked from the homepage — it only
exists for people who got your link.

Then it's three off-site lookup questions, followed by an on-site boss
fight, each on its own hidden page:

| Page | Question | Answer comes from |
|---|---|---|
| `spawn.html` (Q1) | underh2o's sword PvP rank | mcpvp.com |
| `roblox.html` (Q2) | First game in Sethgamer357's Roblox favorites | roblox.com |
| `channel.html` (Q3) | Who Judelow is joke-shipped with | YouTube / searching "Judelow" |
| `boss.html` (Q4) | Survive a dodge fight against a pixel "SETH" | playing the minigame itself |

Q1-Q3 each have a wrong-answer hint pointing them to the right site, and
a "NEXT QUESTION" button that only appears once they're right.

**`boss.html`** is a small Undertale-style bullet-dodge minigame built
on a `<canvas>`: a red heart soul (controlled by mouse on desktop, or by
press-and-hold-and-drag on touch devices, since there's no hover on
mobile) has to dodge a blocky pixel "SETH" sprite's kick attacks for 25
seconds with 3 HP. Difficulty ramps up over that time. Losing all HP
shows a "YOU DIED" screen with a retry button that just resets the
fight; surviving unlocks the "NEXT QUESTION" button. Tweak `DURATION_MS`,
`MAX_HP`, or the speed/spawn-rate constants at the top of `boss.js` to
retune difficulty.

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

## Editing answers or hints

Each stop's answer key and hint text lives in that page's own `.js` file:

- `spawn.js` — rank answer (`LT3`)
- `roblox.js` — Roblox game answer (`Slap Battles`)
- `channel.js` — ship answer (`Sharpness`)
- `boss.js` — the dodge-fight minigame (no answer key, just survive)
- `achievement.js` — birthday answer (`October 3`)
- `quiz.js` — the 6-question `ANSWER_KEY`

The shared code that gates the quiz lives in `config.js` (`SHARED_CODE`).
The party details on the final invite (date, location, what to bring,
RSVP) are directly in `index.html`.

## Optional: inside joke / close-friend fact

In `spawn.html` there's a commented-out spot (search `OPTIONAL`) right
after Q1 is solved, for one more personal line if you ever want one.
Totally optional.

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
