# Games

A static showcase for the browser games. Three HTML files, one stylesheet, one
small script, a folder of screenshots. No build step, no dependencies, nothing
fetched from anywhere but this folder — the same house rule the games
themselves keep, so this deploys anywhere that can serve files and also works
straight off the disk.

```sh
open index.html          # that's it
```

## What is where

| | |
|---|---|
| `index.html` | the shelf. One `<article class="game">` per game |
| `games/*.html` | one detail page per game |
| `assets/css/site.css` | the whole design. Tokens at the top |
| `assets/js/theme.js` | the only script on the site: the theme cycle |
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

   There is a third, `--accent-text`, but you never set it: on the light theme
   an accent bright enough to sit under a thumb is not dark enough to be read
   as a word, so the stylesheet mixes one down from `--accent` for anything
   set as type. On dark it stays the accent itself.

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
- **Light and dark.** Light is the base; dark swaps the token *values*. Token
  names are roles — `--ground*` is the surface, `--mark*` is the ink laid on it
  — so every rule below reads correctly in both.

  The masthead control cycles **auto → light → dark**. Auto is the default and
  follows `prefers-color-scheme` for as long as it is selected; the other two
  are stored in `localStorage` under `mk-theme` and set `data-theme` on
  `<html>`. Choosing auto again *removes* the key rather than storing the word,
  which is the point of having three states: a plain light/dark switch has to
  store something, and whatever it stores is wrong the next time the reader's
  machine changes theme at sunset.

  The dark palette therefore appears **twice** in `site.css` — once under
  `@media (prefers-color-scheme: dark)` guarded by `:not([data-theme="light"])`,
  once under `[data-theme="dark"]`. Keep the two blocks identical; only their
  selectors differ. CSS cannot spell both conditions in one selector, and the
  repetition is easier to edit than the `var()` switch tricks that would avoid
  it.

  `theme.js` is a blocking `<script src>` in the `<head>` on purpose: the
  attribute has to be on `<html>` before the first paint or every load flashes
  the wrong colour. The button ships with `hidden` and the script removes it,
  so a reader without JS gets auto and no dead control.
- **Every `<img>` carries `width`/`height`** so the page does not jump while
  art loads. Those attributes land as CSS presentational hints, which is why
  `img { height: auto }` is in the reset: set a width alone anywhere and the
  height stays pinned at the intrinsic pixel value and stretches the picture.
- Hover lift, the plate zoom and the play cue are all switched off under
  `prefers-reduced-motion`.
