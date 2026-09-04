# Games

A static showcase for the browser games. Three HTML files, one stylesheet, a
folder of screenshots. No build step, no dependencies, nothing fetched at
runtime — the same house rule the games themselves keep, so this deploys
anywhere that can serve files and also works straight off the disk.

```sh
open index.html          # that's it
```

## What is where

| | |
|---|---|
| `index.html` | the shelf. One `<article class="game">` per game |
| `games/*.html` | one detail page per game |
| `assets/css/site.css` | the whole design. Tokens at the top |
| `assets/img/` | thumbnails (1200×750), social cards (1200×630), extra shots |
| `.nojekyll` | so GitHub Pages serves the folder verbatim |

## Adding a game

1. **Take a screenshot.** 1200×750 (8:5) for the card, saved as
   `assets/img/<slug>.jpg`. Headless Chrome does it without a build:

   ```sh
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless --disable-gpu --window-size=1280,800 \
     --virtual-time-budget=8000 --allow-file-access-from-files \
     --screenshot=shot.png "file:///path/to/game.html"

   magick shot.png -crop 1280x800+0+0 +repage -resize 1200x -quality 88 \
     assets/img/<slug>.jpg
   ```

   Crop the game's own HUD chrome off the edges — the card wants the art, and
   the detail page is where a real HUD belongs.

2. **Copy one card.** In `index.html`, duplicate a whole
   `<article class="game">` block. Bump the `01` / `02`, change the copy, and
   set the two custom properties in its `style` attribute:

   ```html
   <article class="game" style="--accent:#e8a33d; --accent-ink:#17110a;">
   ```

   `--accent` is that game's own ink — pull it straight out of the game's
   palette. `--accent-ink` is the text colour that sits **on** the accent, so
   pick whichever of near-black or near-white passes contrast against it. Every
   button, rule, pill and hover state on that card follows from those two
   values; nothing else needs touching.

3. **Copy a detail page.** Duplicate one of `games/*.html`, and put the same
   two accent values on its `<body>` so the whole page takes the game's ink.

4. **Update the count** in the hero (`Two games · more coming`) and the date
   next to it.

The cards alternate which side the art sits on automatically — odd cards put it
left, even cards right, and the column widths flip with it.

## Notes

- **Social previews.** `og:image` paths are relative. Facebook and Slack want
  absolute URLs, so prefix them with the real domain once there is one. There
  is a comment in `index.html` at the spot.
- **Type** is system-only: a serif for display, the UI sans for body, mono for
  every label. Nothing is downloaded, so nothing can fail to load.
- **Dark by design**, not by preference query. Both games are dark-warm and the
  page is the mat they are mounted on.
- Hover lift, the plate zoom and the play cue are all switched off under
  `prefers-reduced-motion`.
