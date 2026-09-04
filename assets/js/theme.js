/* ==========================================================================
   THEME — three states, cycled in this order:

     auto    whatever the operating system says, and it keeps following it
     light   forced
     dark    forced

   Only an explicit choice is stored. Picking "auto" again CLEARS the key, so
   the page goes back to tracking the OS and keeps tracking it — that is the
   whole reason there is a third state rather than a plain light/dark switch.
   A two-state toggle has to store something, and whatever it stores is wrong
   the next time the reader's machine changes theme at sunset.

   Loaded as a blocking <script src> in <head>, on purpose: it must set the
   attribute before the first paint or the page flashes the wrong colour.
   Everything below runs without a DOM, except the button wiring, which waits.
   ========================================================================== */

(function () {
  'use strict';

  var KEY = 'mk-theme';
  var ORDER = ['auto', 'light', 'dark'];
  var root = document.documentElement;
  var mode;

  /* Private browsing and "block all cookies" both make localStorage throw on
     ACCESS, not just on write, so every touch is wrapped. A reader with
     storage off still gets a working toggle — it just forgets on reload. */
  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function write(value) {
    try {
      if (value === 'auto') window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, value);
    } catch (e) { /* nothing to do, and nothing worth telling the reader */ }
  }

  /* "auto" is the ABSENCE of the attribute, which is what lets the stylesheet
     fall through to the prefers-color-scheme media query. */
  function apply(value) {
    if (value === 'light' || value === 'dark') root.setAttribute('data-theme', value);
    else root.removeAttribute('data-theme');
  }

  mode = read();
  if (ORDER.indexOf(mode) < 0) mode = 'auto';
  apply(mode);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;

    var text = btn.querySelector('.theme-btn-text');

    function label() {
      text.textContent = mode;
      /* The visible word is the current state; the accessible name has to say
         so out loud, because "DARK" on its own could just as easily read as
         the thing the button is about to do. */
      btn.setAttribute('aria-label', 'Colour theme: ' + mode + '. Activate to change.');
    }

    /* Ships hidden so a reader without JS is never offered a dead control. */
    btn.hidden = false;
    label();

    btn.addEventListener('click', function () {
      mode = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
      apply(mode);
      write(mode);
      label();
    });
  });
}());
