# Seth's Birthday Scavenger Hunt Invite 🟩⛏️

A Minecraft-PvP-themed birthday invite site. Guests get a code from you (sent
however you want — text, DM, printed note), type it in, and get a
chest-opening animation that reveals the party details. There's also:

- A **backup on-site puzzle** ("Lost your clue?") for anyone who loses the
  code you sent them.
- A **"skip the hunt"** link for people who just want the invite straight up.

No build step, no server, no database. It's 3 files: `index.html`,
`style.css`, `script.js`.

## 1. Edit your party details

Open `index.html` and find these lines (search for `EDIT ME`):

- `#detail-datetime` — date & time
- `#detail-location` — address / venue
- `#detail-bring` — what to bring / dress code
- `#detail-rsvp` — how people RSVP (just descriptive text)

Then open `script.js` at the very top — the `CONFIG` block:

- `SHARED_CODE` — the code you'll send people as their "clue" (default `PVP18`)
- `PUZZLE_ANSWER` — answer to the backup puzzle (default `Lao`, from
  Seth **Gabriel Lao** Yang)
- `RSVP_HREF` — where the "RSVP NOW" button links to (a `mailto:`, `tel:`,
  or a Google Form URL)

That's it — no other code needs to change for a basic edit.

## 2. Preview it locally (optional)

Just open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 3. Host it on GitHub Pages (free, recommended)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. On GitHub: **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   pick this branch, and folder `/ (root)`.
4. Save. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/` in a minute or two.

## 4. Or host it on Vercel

1. Go to [vercel.com](https://vercel.com), sign in with GitHub.
2. "Add New… → Project", import this repo.
3. Framework preset: **Other** (it's plain static HTML — no build command needed).
4. Deploy. You'll get a `your-project.vercel.app` URL instantly.

Either works great — Vercel gives you a slightly faster edge network and
nicer preview URLs if you keep editing; GitHub Pages is simplest since it's
already the same place your code lives.

## Sending out the hunt

Since the code-entry site is the *finale*, send your friends the actual
clues yourself first (text, group chat, printed cards — whatever). The
last clue should just be "go to [your site URL] and enter the code."
