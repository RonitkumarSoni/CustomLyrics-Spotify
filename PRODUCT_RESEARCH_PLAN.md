# LyricsPlus: research, product direction and publishing plan

Research date: 1 October 2026. Planning assumptions: one primary developer, desktop Chrome first, limited infrastructure budget. Timelines are estimates, not commitments. This is a source-code review plus desk research; the extension and competitors were not live-tested. User demand, willingness to pay and retention remain unvalidated.

## Recommendation

Build a dependable multilingual reading companion: **Read the original. Follow the pronunciation. Understand the meaning.** Start with one audience and two well-supported source languages. Keep attractive themes as polish, not the main reason to install.

Initial audience hypothesis: adult Korean/Japanese music fans who already use Spotify Web on a laptop and currently switch to a second website for pronunciation or meaning. Test an alternative audience of Indian listeners navigating unfamiliar regional scripts. Do not assume either segment is large enough or underserved enough until interviews and a beta demonstrate it.

The near-term objective is 100 users who repeatedly benefit, followed by 1,000 retained users. A million active users is a long-term aspiration requiring distribution, reliable operation, rights clearance and likely broader platform reach; it is not a credible 90-day forecast.

## What the market already offers

| Evidence | Product implication |
|---|---|
| Spotify announced global translations for available tracks, Premium offline lyrics, and mobile/tablet lyric previews in February 2026. [Official announcement](https://newsroom.spotify.com/2026-02-04/lyric-translations-offline-previews/) | Translation and offline access alone are weak positioning. The announcement does not establish identical desktop-web coverage; verify device and song differences in interviews. |
| Spotify Karaoke advertises missing-lyrics retrieval, romanization and translation. Its store listing showed 1,000 users and nine ratings in the research snapshot. [Store](https://chromewebstore.google.com/detail/spotify-karaoke-fetches-m/bhhkohameknlmcgdfafkjplpjalfedie), [source repository](https://github.com/haroldalan/spotify-karaoke) | Direct competition exists. These counts are a changing snapshot, not market size or proof of retention. Feature claims are vendor claims, not independently verified quality. |
| Flying Lyrics advertises floating/PiP lyrics, translation and romanization across Spotify Web and YouTube Music. [Store](https://chromewebstore.google.com/detail/flying-lyrics-romanize-yo/ehjobcjhlmgmpaikciicipmlpknipikd) | Floating lyrics are a useful workflow, not an exclusive invention. |
| Moegi already styles, translates and romanizes Spotify lyrics. [Repository](https://github.com/sglkc/moegi) | Themes plus translation are established competition. |
| YouLy+ advertises word/syllable timing, multiple music services and translation. [Store](https://chromewebstore.google.com/detail/youly%2B/pboadpgpgabkmepmgchhlnlfnimlnmoe?hl=en) | Do not promise the first multi-platform or word-synced extension. |
| Spotify Community users request pronunciation support and describe lyric readability problems. [Romanization discussion](https://community.spotify.com/t5/Live-Ideas/All-Platforms-Other-Romanized-Lyrics-for-Songs-Not-In-Latin/idi-p/5000880/highlight/true/page/6), [desktop readability discussion](https://community.spotify.com/t5/Content-Questions/Lyrics-only-scrollable-on-mobile/td-p/5318844) | These are qualitative problem signals, including older reports; they do not establish today's prevalence or an unserved market. |

The opportunity is a hypothesis about execution: better language accuracy, comfortable reading, clear failure states and fewer interruptions. Research did not establish an uncontested feature gap.

## What the current repository really contains

Existing source includes visual customization, language-conversion calls, translation requests, screenshot export, a basic local editor and a PiP implementation. These are useful starting points, not a verified release.

| Finding | Evidence in repository | Required action |
|---|---|---|
| Browser entry includes raw CommonJS source and a bundle built from that same source | `LyricsPlus/manifest.json`, `webpack.config.js`, `content.js:3` | Ship a single production browser bundle. Raw `require` calls are not a normal browser content-script entry. Verify a clean install from the packaged ZIP. |
| A constant is later reassigned | `content.js:2`, around line 688 | Fix lifecycle state; this path can throw and leave timers accumulating on re-entry. |
| Broad body observer calls rendering repeatedly; render appends styles and edits observed DOM | `content.js:64–89`, `ActivateLyrics` | Use bounded observation, deduplication, one stylesheet, route handling and full teardown. Preserve original lyric text. |
| Karaoke uses a fixed four-second CSS sweep | `content.js:533–543` | Call it an effect or replace with timestamp-driven highlighting; it is not real word timing. |
| Sync offset changes the displayed number only | `content.js:245–259` | Connect offset to a real timed renderer and persist by track/version, or remove the claim. |
| Scoring and mood are random; playlist action is a mock | `content.js:201`, `280`, `575–589` | Remove from public release. Never show fabricated results as analysis. |
| Pro is hardcoded; party links and cloud backup are mocks | `popup.js:3`, `137–142`, `184–210` | Launch an honest free beta; do not sell these features. Browser preference sync is separate from a custom cloud service. |
| Stats are static HTML examples | `stats.html` | Remove or explicitly isolate demo content from product UI. |
| Editor saves one global text block and scroll speed | `lyrics-editor.js`, `content.js:131–159` | Add per-track data and genuine LRC timestamps only if validated. Current editor is not a synchronized community database. |
| User lyric text is interpolated into HTML | `content.js:156` | Use text nodes, validated structured data and safe styling. |
| Extension pages execute Tailwind from a remote CDN | `stats.html`, `lyrics-editor.html`, `theme-builder.html` | Compile CSS locally; remove remote executable scripts before submission. |
| Translation sends each line to a `client=gtx` endpoint and marks it done before success | `content.js:35–61` | Select an authorized production service; add consent, batching, cancellation, cache policy, retries and visible errors. Do not assume free unlimited production capacity. |
| Japanese conversion calls WanaKana directly | `content.js:17` | Audit mixed kanji/kana examples with native readers. WanaKana is a kana conversion tool; full Japanese reading needs additional capability. [Documentation](https://wanakana.com/) |

No project-owned test suite or root license file was found in the inspected file listing. Check upstream ownership and dependencies before redistribution, especially given the README's Spicetify origin. Existing user edits in `manifest.json` and `features.md` were left untouched. The existing roadmap's “Done” labels should be replaced with implemented / prototype / verified / deferred during implementation.

## Product gaps to validate, in priority order

| Priority | User problem | Proposed solution | Validation and boundary |
|---|---|---|---|
| P0 | I like this song but cannot read its script | Original + pronunciation + optional meaning, independently toggled; script preference remembered | Native-reader benchmark; handle mixed scripts and proper nouns. Two quality languages before a long dropdown. |
| P0 | Lyrics are distracting or difficult to read | Focus mode, size/spacing, high contrast, reduced motion, keyboard navigation | Observe five users with different reading preferences; basic accessibility stays free. |
| P0 | I do not trust what the extension is doing | No-account first use, clear source labels, explicit external-translation action, restore-native button | First useful result in under a minute; explain unavailable tracks honestly. |
| P1 | I lose the lyrics while working | Resizable floating view with original/phonetic/meaning controls | Verify browser/user-gesture support, pause/seek and track transitions. Supported browsers clearly listed. |
| P1 | Lyrics are missing or match the wrong version | Rights-cleared fallback, version chooser, local user-supplied import | Prefer no result over a confident wrong result; match artist/title/duration/version. Provider and copyright feasibility first. |
| P1 | I repeatedly forget a word or phrase | Private user-written notes and vocabulary bookmarks | Test repeat use. Content copying, dictionary licensing and platform terms must support implementation. |
| P2 | Timing is incorrect | Per-track offset and real LRC support | Requires reliable clock and lawful timed data; line sync before word sync. |
| P2 | I want to practice a difficult phrase | Phrase replay and learning workflow | Feasibility and platform-policy review first. No playback manipulation, scoring or API-dependent promise in launch scope. |
| P3 | I want personal aesthetics | A few curated themes, later a polished builder | Keep CPU use low. Retain only features used repeatedly. |

Do not prioritize party rooms, AI mood analysis, voice scoring, playlist generation, unlimited cloud lyrics, animated videos or 50 fonts for v1. They add substantial maintenance without proving the central need.

## First-release experience

1. Install; one button opens Spotify Web. No separate account required.
2. Choose reading language and a preference: Read, Pronounce or Understand. Preferences are editable in context.
3. Show original lyrics immediately when available; conversion must not block them.
4. Show pronunciation and optional authorized translation beneath each line. Keep source, processing status and error recovery clear.
5. Offer font controls, reduced motion and floating view from a compact toolbar. Keep advanced appearance controls out of onboarding.
6. On missing content, unsupported script or provider failure, show a precise explanation and safe fallback. Do not silently fabricate lyrics or translations.

Suggested positioning draft: “Follow songs across languages, comfortably.” Supporting claim: “Original lyrics, pronunciation and meaning in one readable view.” Only publish claims supported by the tested language/platform matrix. Choose an independent name after trademark and store-name checks.

## Architecture and quality plan

Separate the site adapter, immutable lyric model, language processing, presentation, settings and provider networking. Start with one site adapter; do not create multiple half-maintained integrations.

- Model track identity, version, source, language, lines and optional timestamps. Store transformations separately from originals.
- Own the overlay UI; use stable semantic selectors where available and isolate unavoidable Spotify selectors in one module. A separate UI still depends on the platform adapter and can break.
- Bound observers and timers; cancel obsolete requests on track changes; apply settings without page reloads; restore the page on disable.
- Run local language conversion where accurate. Batch external operations through the extension service worker or approved backend, keep secrets off clients, and validate message senders and payloads.
- Cache only where provider rights permit; key by track/version/language/provider version, set size limits and expiry. A public API is not proof of a redistribution license. LRCLIB remains a candidate: its docs did not expose readable terms in this research session. [Docs](https://lrclib.net/docs).
- Store settings locally first, use browser sync only within supported limits, and add schema migrations and reset/export controls. Do not store an unlimited lyrics library in browser sync.
- Use packaged assets and a reproducible production build; ZIP only required runtime files. Add build, lint and targeted test commands.

Release validation: fresh install, update from previous build, direct lyrics URL, SPA navigation, pause/seek/next, ads, missing lyrics, instrumental tracks, live/remix variants, network failure, mixed scripts, language change, two tabs, PiP close/reopen, disable/re-enable and a 30-minute session. Check supported Free/Premium behavior separately. Track memory and timer counts over repeated navigation, verify no monotonic growth, and test a representative low-end laptop. Timing budgets should follow measured baseline, not fabricated benchmarks.

Automated tests should cover parser correctness, track matching, stale-result cancellation, safe rendering and lifecycle cleanup. Native readers should review at least 50 representative lines per supported source language; assess critical pronunciation errors separately from cosmetic differences. Build a 100-track coverage set with permissions to use any stored fixtures.

## Validation before investing in breadth

Interview 20 people: eight Korean/Japanese music fans, eight Indian multilingual listeners, four people with strong readability or multitasking needs. Recruit existing desktop-web listeners; mobile-only fans are not the initial addressable market. Recruitment is proposed, not performed.

Ask for the last actual incident: Which song? Which device? What was missing? What did you do next? How often? What existing tool did you try? Ask them to demonstrate their workaround. Avoid “would you use my cool extension?”

Compare the prototype against native Spotify and one direct competitor on the same tasks. Record time to useful lyrics, language errors, permission concerns and willingness to switch. Pick a segment only if roughly half its interviewees describe recurring pain and at least five agree to use a beta. These are decision rules, not statistically representative market estimates.

Run a 50–100-person beta. Ask after a week what they actually used and what they would miss. If users prefer the existing competitor, identify a concrete quality advantage or narrow the audience before adding features.

## Ninety-day roadmap

| Window | Deliverable | Exit condition |
|---|---|---|
| Days 1–7 | Capability audit, mock removal plan, interviews, rights/provider feasibility, one target segment | No unsupported public claims; recurring user problem documented; viable source/permission route identified |
| Days 8–21 | One build entry, lifecycle fixes, safe renderer, accessible focus mode, settings, two-language prototype | Packaged install works; critical route/track transitions pass; native-reader review supports claims |
| Days 22–35 | Original/phonetic/meaning workflow, provider failure handling, optional floating view | 20 alpha users complete onboarding; major failures resolved; public claims match behavior |
| Days 36–50 | 50–100-user beta, comparable competitor tests, privacy/store assets | Core task success and initial retention measured; no critical security/data-loss issues |
| Days 51–65 | Submit Chrome Web Store release, support/diagnostics workflow, tutorial demos | Listing and privacy disclosures accurate; review feedback addressed; approval timing is external |
| Days 66–90 | Improve largest abandonment cause, run three acquisition experiments, pricing interviews | Evidence to continue, reposition or stop; second integration only if retention and rights support it |

Assumes consistent development time. Unsupported providers, language-quality work or store review can extend this schedule. If rights feasibility fails, narrow the launch to presentation/accessibility capabilities while revising the product thesis.

## Publishing and platform constraints

Chrome submission needs a developer account, packaged build, accurate listing/screenshots, privacy disclosures, permission explanations and review. Check current dashboard account verification and fees rather than relying on an old quoted amount. [Publishing guide](https://developer.chrome.com/docs/webstore/publish).

Use one clear purpose, narrow host access to needed pages such as `https://open.spotify.com/*`, and justify any external-service permission. Remove unused injection code rather than requesting permissions just to retain it. Bundle executable code; remote Tailwind scripts in this repository are a concrete MV3 issue. Provide clear consent and privacy descriptions for external text processing. [Program policies](https://developer.chrome.com/docs/webstore/program-policies/policies), [MV3 requirements](https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements).

Spotify Platform policy restricts various analytics, AI ingestion, games, certain integrations and streaming monetization. API development access is not a public-scale deployment plan. These restrictions require design-specific review; this document does not determine that every DOM extension is an SDA or that avoiding OAuth exempts it. Do not promise scoring, Spotify-derived AI analysis, shared music broadcasts or subscriptions until the applicable terms and content rights are resolved. [Developer Policy](https://developer.spotify.com/policy).

Current quota documentation and 2026 updates must be checked for any API architecture. Do not design around unlimited development-mode users, rotate client IDs or extract private tokens to work around access limits. [Quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), [July update](https://developer.spotify.com/blog/2026-07-23-web-api-quota-updates).

Before launch, document licenses for upstream code, dependencies, fonts, artwork and lyric sources. Translation, caching and export need their own permitted uses; merely limiting a share card to a few lines does not automatically clear rights. Defer community lyric hosting and lyric-image virality until rights, attribution and takedown operations are workable. Get qualified review for unresolved commercial/content rights questions.

## Growth strategy and measurement

Define active users as people who successfully use the product, not store installs. The Chrome extension initially serves desktop web sessions; do not treat all Spotify listeners as reachable users. This research does not establish a reliable total addressable market.

| Stage | Main job | Distribution experiment |
|---|---|---|
| First 100 | Prove usefulness and fix failures | Opt-in community beta and creator/user interviews; follow community rules |
| 100–1,000 | Find one repeatable acquisition source | Three short workflow demos; relevant search tutorials; a few small language/music creators |
| 1,000–10,000 | Improve onboarding and retention | Localized store pages, problem-specific tutorials, measured creator campaigns |
| 10,000–100,000 | Grow an already-working product | Additional validated languages and browsers; partnerships and support capacity |
| 100,000–1,000,000 | Broaden lawful reach and sustain reliability | Evaluate separate service adapters and mobile companion feasibility; provider agreements and operational team |

These are stages, not growth forecasts. A mobile companion cannot automatically overlay or modify native music apps just because a Chrome extension exists. Each platform needs separate technical and policy validation.

Test three acquisition messages with comparable small cohorts: “read another script,” “understand the meaning,” and “read while working.” Judge by retained users per channel, not video views. Use creator demonstrations with permission and appropriate disclosure. Request honest store reviews after successful use without rewards tied to ratings.

Potential sharing loop: export theme presets and user-authored study notes with optional attribution; recipient previews then installs. Lyrics/artwork sharing stays gated on rights. Treat virality as an experiment, not an assumed growth engine.

Initial internal targets (not industry benchmarks):

- Activation: at least 60% of consented beta installers complete one successful supported lyrics session within 24 hours.
- Core-task success: at least 95% across the supported test matrix; report missing content separately so coverage is not hidden.
- D7 return: at least 30% of activated users complete another useful session on days 7–13.
- Week-four retention: at least 20% return on days 22–28. For small cohorts, report counts as well as percentages.
- After 100 activated users, investigate if D7 is below 20%; if below 10%, fix or reposition before acquisition spending.

North-star hypothesis: weekly people completing three useful reading sessions. Measure only with a reviewed, consented and policy-compliant method. No raw lyrics, listening history, artist profiling or microphone collection for analytics. Prefer local counters and voluntary beta reporting initially; privacy-safe collection can still be restricted under platform terms. Interview evidence can substitute where telemetry is inappropriate.

Illustrative funnel: 10,000 qualified visits × 15% installs × 60% activation × 25% week-four return = 225 retained users. These are hypothetical inputs. They show why a million installs or impressions should not be confused with a million active users.

## Monetization and economics

Keep original reading, core pronunciation, accessibility and a useful starter experience free. Monetize only validated independent value with a permitted commercial model: advanced presentation presets, richer private workspace features or optional backup if it genuinely exists. Paid language services require sustainable provider economics and rights. Do not charge for mock functionality or promise unlimited processing.

Pricing experiment after retention: test an India offer around INR 99–149/month and an international offer around USD 2–4/month, with region-specific willingness-to-pay interviews. These are hypotheses, not researched market-clearing prices. Avoid lifetime unlimited translation because recurring costs persist. Do not introduce ad clutter that undermines the reading experience.

Calculate contribution per paying user = receipts minus taxes/payment fees, provider costs, hosting and support allocation. Track costs incurred by free users too. Example only: 100,000 monthly active users × 2% paying × INR 99 = INR 198,000 monthly gross, before all costs; this is not a revenue forecast.

Translation cost model: active users × translated tracks per month × uncached fraction × billable characters per track × contracted per-character price. Validate batching, lawful caching, quota limits and failure behavior before promising broad free translation. Do not assume a public free endpoint will support millions of users.

## Immediate implementation backlog

1. Replace false completion claims with an evidence-based capability matrix; remove mock scores, cloud, party, stats and playlist UI from the release.
2. Fix the bundle/manifest, constant reassignment, lifecycle cleanup and remote-script packaging.
3. Preserve immutable original lyrics and render safely; restore-native/disable must cleanly work.
4. Build readable focus mode and validate two source languages with real reviewers.
5. Resolve translation/source rights and provider costs before making them a central launch claim.
6. Run interviews and alpha tests, then select the smallest beta that demonstrates repeat use.
7. Prepare the actual release ZIP, privacy policy, store screenshots, support contact and honest listing only after verified capability is clear.

The product advantage to earn is reliability and language quality for a specific audience. A longer settings panel is not evidence of product-market fit.
