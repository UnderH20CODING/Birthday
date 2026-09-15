# Seth's Birthday Scavenger Hunt Invite 🟩⛏️

A Minecraft-PvP-themed birthday invite. It's 5 static files —
`index.html`, `spawn.html`, `style.css`, `script.js`, `spawn.js`,
`config.js` — no build step, no server.

## How the hunt works

1. **You send the actual clues** — text, group chat, Instagram story, a
   printed note, whatever platforms you want. This is the "around the web"
   part; the site is just where it lands.
2. Somewhere in that chain, you drop the link to **`spawn.html`** — a
   secret page that isn't linked from the homepage, so it only exists for
   people who followed your clues. It's themed around your old Roblox tag
   (`Sethgamer357`) and asks for your sword PvP rank (`LT3`) to prove
   whoever's there actually knows you.
3. Solving `spawn.html` reveals the code and a button back to the main
   site (`index.html`), which plays the chest-opening animation and shows
   the invite.
4. `index.html` also has a **"skip the hunt"** link for anyone who just
   wants the invite straight up, and a **"lost your clue"** link that
   points to `spawn.html` as a fallback.

Since it's just one extra page, you can make it feel more "scattered
across the web" by posting the `spawn.html` link through a link shortener,
or burying it in an Instagram bio / story / Discord pin instead of texting
it directly — up to you.

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
