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

Without a key, Mood DJ still works, but in a limited form: built-in catalog, a small set of canned phrases (in English for any radio language other than French) and your computer's voice. With an AI key (Claude or Gemini), the hosts write fresh, varied scripts in the language of your choice.

Keys are entered in the extension's secure page (Settings › API keys):

- **Claude** (Anthropic) or **Gemini** (Google): the hosts' scripts, playlists described in plain words, adding styles.
- **Gemini**: the hosts' voices, solo or duo. Free key at [aistudio.google.com](https://aistudio.google.com) (“Get API key” button). On its own, the free key lets you try Mood DJ every day: it has a limit, which resets every 24 hours. With a paid key as well, the two take turns for longer listening: the free key always goes first, and the paid key takes over without interrupting anything.
- **Last.fm, Discogs, Setlist.fm**: extra trivia. Upcoming concert dates come from a Google search run by Gemini (the “Upcoming concerts” setting, no extra key).

With a Claude or Gemini key, each host has a personality and remembers what they say from one show to the next. The **AI power** setting (Economy, Normal or Full power) and an hourly call cap let you choose between livelier hosts and lower usage.

Keys stay in your browser and are only sent to their own service.

## Documentation

- [`mood-dj/GUIDE-EN.md`](mood-dj/GUIDE-EN.md): user guide, feature by feature.
- [`mood-dj/legal.en.html`](mood-dj/legal.en.html): legal notice, privacy, sources and credits.
- [`mood-dj/LISEZMOI.txt`](mood-dj/LISEZMOI.txt): full changelog, version by version (in French).

## License

© 2026 Breizhad. All rights reserved. Private use only: copying, modifying or distributing is not permitted without the publisher's consent.

Independent project, not affiliated with YouTube, Google or Anthropic.
