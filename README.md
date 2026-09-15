# Seth's Birthday Scavenger Hunt Invite 🟩⛏️

A Minecraft-PvP-themed birthday invite. It's 7 static files —
`index.html`, `spawn.html`, `achievement.html`, `style.css`, `script.js`,
`spawn.js`, `achievement.js`, `config.js` — no build step, no server.

## How the hunt works (2 stops)

**Stop 0 — you text the group chat.** You send the first clue yourself,
however you want. Something like:

> "yo. before you can pull up you gotta prove you know me.
> [link to spawn.html]"

**Stop 1 — `spawn.html`.** A secret page not linked from the homepage —
only exists for people who got the link. Themed around your old Roblox
tag (`Sethgamer357`), it asks for your sword PvP rank (`LT3`) to prove
whoever's there actually knows you. Solving it unlocks a "follow the
signal" button to the next page — no code yet.

**Stop 2 — `achievement.html`.** A second secret page, styled like a
locked Minecraft achievement. It asks for the date "this legend respawns
every year" — your birthday (accepts `October 3`, `Oct 3`, `10/3`, etc.).
Solving it finally reveals the code and a button back to the main site.

**`index.html`** takes that code, plays the chest-opening animation, and
shows the invite. It also has a **"skip the hunt"** link straight to the
invite for anyone who doesn't want to bother, and a **"lost your clue"**
link that drops people back at `spawn.html` (stop 1) as a fallback.

You can make the chain feel even more "scattered across the web" by
posting the `spawn.html` link through a link shortener, or via Instagram/
Discord instead of texting it directly — the pages don't care how someone
arrives, only that they do.

## 1. Edit your party details

In `index.html`, search for `EDIT ME`:

- `#detail-datetime` — date & time
- `#detail-location` — address / venue (see note below)
- `#detail-bring` — what to bring / dress code
- `#detail-rsvp` — how people RSVP (descriptive text)

**Location:** you mentioned two options in Urdaneta Village — 24 Santo
Tomas or 8 Recoletos. Once you decide, just replace the placeholder text
in `#detail-location`.

In `config.js`:

- `SHARED_CODE` — the code that unlocks the invite (default `PVP18`)
- `SPAWN_ANSWER` — answer to the spawn-page challenge (default `LT3`)
- `RSVP_HREF` — where "RSVP NOW" links to (`mailto:`, `tel:`, or a form URL)

## Optional: inside joke / close-friend fact

In `spawn.html` there's a commented-out spot (search `OPTIONAL`) right
after the code is revealed, for one more personal line — an inside joke
with the boys, or a close-friend-only fact. Totally optional; uncomment
and fill it in yourself since it's yours to know, not mine to guess. If
you want help landing on a close-friend fact, try picking one of these
angles and I can help phrase it into a line: something you're weirdly
good/bad at, a food thing, a pet, an embarrassing PvP moment, or a habit
your friends always clock ("he always does ___ before a match").

## 2. Preview it locally (optional)

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## 3. Host it on GitHub Pages (free, recommended)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. **Settings → Pages** → Source: `Deploy from a branch` → pick this
   branch, folder `/ (root)` → Save.
3. Live in a minute or two at `https://<your-username>.github.io/<repo-name>/`.

## 4. Or host it on Vercel

1. [vercel.com](https://vercel.com) → sign in with GitHub → "Add New… → Project" → import this repo.
2. Framework preset: **Other** (plain static HTML, no build command).
3. Deploy — you get a `your-project.vercel.app` URL instantly.
