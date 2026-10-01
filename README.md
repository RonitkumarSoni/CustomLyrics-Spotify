# LyricsPlus — Read Along

LyricsPlus is an independent Chrome extension for the Spotify web player. It makes lyrics easier to read and can show an optional pronunciation line for Korean, Japanese kana, Chinese pinyin and Thai. It keeps Spotify's original lyrics available and does not provide lyrics for tracks where Spotify has none.

This repository also contains the older Spicetify experiment in `Spicetify/` and legacy prototype files in `LyricsPlus/`. The Chrome release is defined by `LyricsPlus/manifest.json`; see `LyricsPlus/RELEASE.md` for the exact package contents.

## Current features

- Original lyrics, pronunciation only, or both together
- Adjustable text size and line spacing
- High contrast and reduced motion options
- Settings synced with Chrome's extension storage
- One switch to turn enhancement on or off

Japanese conversion currently handles kana; mixed kanji text needs separate reading support. Pronunciation output can contain mistakes with names, slang and mixed-language lines. Spotify's native translations remain available where Spotify provides them; this extension does not translate lyrics.

## Build and install for testing

1. Run `npm ci`, `npm test` and `npm run build` inside `LyricsPlus/`.
2. In Chrome, visit `chrome://extensions`, enable Developer mode and choose **Load unpacked**.
3. Select the `LyricsPlus/` directory, then open `https://open.spotify.com/lyrics`.

The release package contains only the files listed in `LyricsPlus/RELEASE.md`. Unpacked development installs include legacy files, but the manifest does not load them.

## Feedback

Report a reproducible issue at [GitHub Issues](https://github.com/dupitydumb/LyricsPlus-Spotify/issues). Include the browser version, track link, source language and what appeared. Do not paste full copyrighted song lyrics into a report.

The independent product plan and research notes are in [PRODUCT_RESEARCH_PLAN.md](PRODUCT_RESEARCH_PLAN.md). This extension is not affiliated with or endorsed by Spotify.
