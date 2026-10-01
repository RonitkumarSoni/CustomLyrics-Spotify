# Chrome beta release

This is a technical beta, not a store-approved release. Current version: 1.1.4.

Package these exact files at the ZIP root:

- `manifest.json`
- `LRicon.png`
- `popup.html`
- `popup.js`
- `popup.css`
- `content.css`
- `dist/bundle.js`

Run `npm ci`, `npm test` and `npm run build`, then `powershell -NoProfile -ExecutionPolicy Bypass -File build-release.ps1`. The script checks the manifest and creates `release/LyricsPlus-beta-1.1.4.zip`. Do not include `node_modules`, source, tests or legacy prototype HTML. The ZIP can then be extracted and loaded unpacked for a clean-install test and submitted to the Chrome Web Store after completing the dashboard's listing, privacy, permission and identity requirements.

Manual smoke test: open Spotify Web lyrics, switch original/pronunciation/both, change font settings, toggle enhancement off/on, switch tracks, navigate away and return, and test a track without lyrics. Check Korean, kana, Chinese and Thai with native readers before making strong accuracy claims. Repeat in a fresh Chrome profile.

Store listing draft: **LyricsPlus — Read Along**. “Read Spotify Web lyrics at a comfortable size. Add an optional pronunciation line for Korean, Japanese kana, Chinese pinyin and Thai. Choose original, pronunciation or both, with high contrast and reduced motion controls.” Do not mention translation, missing lyrics, sync correction, AI, cloud backup, karaoke scoring or Pro subscriptions in this release.

Publication still requires review of upstream code ownership, dependency/font/icon licenses, name/trademark, current Chrome policies, and live browser behavior. The repository currently lacks a project-owned license file; determine whether you have the necessary redistribution rights before public release. Chrome Web Store approval is external.
