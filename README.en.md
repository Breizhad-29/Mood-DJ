# Mood DJ for YouTube Music

[🇫🇷 Français](README.md) · 🇬🇧 English

A Chrome extension that turns YouTube Music into your personal radio station: moods, an energy curve, crossfades, an equalizer, and hosts with synthetic voices (announcements, interludes, guests, games, dedications).

## Installation

1. Download this repository (**Code › Download ZIP** button) and unzip it.
2. In Chrome, open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the **`mood-dj`** folder.
4. Open [YouTube Music](https://music.youtube.com): the Mood DJ panel appears.

After updating the files: reload the extension in `chrome://extensions`, then press F5 on YouTube Music.

## Language

The interface is available in English: Settings › Hosts, voices, languages › “Languages”. On *Automatic*, it switches to English as soon as Chrome isn't set to French. The radio language can be chosen separately (English, German, Spanish, Japanese and many more): the hosts then speak that language.

## API keys (highly recommended)

> **To get the most out of Mood DJ, API keys are highly recommended.** They are what bring the radio to life: hosts who write real announcements about every track, natural voices in solo or duo, trivia and concert dates. A free Gemini key is already enough to unlock everything.

Without a key, Mood DJ still works, but in a limited form: built-in catalog, canned phrases (**in French only**) and your computer's voice. For an English-speaking radio, an AI key (Claude or Gemini) is therefore essential.

Keys are entered in the extension's secure page (Settings › API keys):

- **Claude** (Anthropic) or **Gemini** (Google): the hosts' scripts, playlists described in plain words, adding styles.
- **Gemini**: the hosts' voices, solo or duo. Free key at [aistudio.google.com](https://aistudio.google.com) (“Get API key” button).
- **Last.fm, Discogs, Setlist.fm, Ticketmaster**: extra trivia and concert dates.

Keys stay in your browser and are only sent to their own service.

## Documentation

The detailed documentation is in French for now:

- [`mood-dj/LISEZMOI.txt`](mood-dj/LISEZMOI.txt): every feature, version by version.
- [`mood-dj/legal.html`](mood-dj/legal.html): legal notice, privacy, sources and credits.

## License

© 2026 Breizhad. All rights reserved. Private use only: copying, modifying or distributing is not permitted without the publisher's consent.

Independent project, not affiliated with YouTube, Google or Anthropic.
