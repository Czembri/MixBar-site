# Instagram and Facebook advertising plan

Meta is a visual problem/solution channel, not the first place to prove demand. Start after Search and organic traffic establish a baseline purchase conversion rate. The founder does not need to appear or record a video.

## Tracking implementation

The site has a configurable Meta Pixel integration. It loads only after Marketing consent and supports:

- PageView on each measured page;
- ViewContent on the product home page and search guides;
- InitiateCheckout when a buy link is used.

Purchase is intentionally absent from the browser. The current verified server purchase is sent to GA4 only. Before optimizing Meta for Purchase, add a reviewed Conversions API path with explicit marketing-consent linkage and a shared `event_id` for browser/server deduplication. Until then, Meta campaigns may optimize for landing-page views or InitiateCheckout but business decisions must use Stripe/GA4 purchases.

## Campaign sequence

1. **Prospecting test — Mac productivity**
   - Conversion location: website.
   - Objective: Sales if verified Meta Purchase exists later; otherwise Traffic/Landing Page Views as a limited creative test.
   - Broad age 18+, English-speaking target countries, macOS/Apple/productivity interests only where available. Avoid excessive interest stacking.
2. **Problem-aware test**
   - Creatives about calls vs music, loud browser tabs, and per-app EQ.
   - Separate ad sets only when each can receive enough budget.
3. **Remarketing**
   - 7-day visitors and checkout starters excluding known purchasers after a compliant purchase audience is available.
   - 30-day guide readers with product proof and one-time-price message.

Do not upload customer email lists for the first test.

## Static creative concepts

Use actual MixBar UI screenshots. Existing exports in `MarketingAssets/` provide square, portrait, and story canvases; replace any generic interface placeholder with a current shipped-build screenshot before spending.

1. **Every app, its own volume**
   - UI: MixBar with FaceTime, Music, and Slack at visibly different levels.
   - Overlay: “Your Mac has one volume. MixBar gives every app its own.”
   - Proof strip: “Native macOS · $21 once · No virtual driver.”
2. **The tab is too loud**
   - UI: Chrome expanded with two controlled tabs and separate sliders.
   - Overlay: “Turn down one Chrome tab—not the whole browser.”
   - Qualification: “Free companion extension. MixBar for Mac required.”
3. **Build the mix once**
   - UI: Audio Autopilot scene and compact mixer.
   - Overlay: “Calls up. Music down. Let the scene switch itself.”
   - Avoid claiming AI; scenes are rule-based local automation.

## Carousel concepts

### Carousel A — One problem per card

1. Loud app? Per-app volume.
2. Distracting alert? One-click mute.
3. Harsh audio? Three-band EQ.
4. Repeating routine? Audio Autopilot scenes.
5. Need another output? Switch speakers, Bluetooth, or AirPlay.

### Carousel B — Browser support without overclaiming

1. Chrome: choose a tab with the reviewed extension.
2. Opera: companion extension tab control.
3. Safari: standard HTML media through the bundled extension.
4. Firefox: detected audio subprocess controls, not named tabs.
5. MixBar: keep the browser-level master control.

## Formats

- Feed square: 1080×1080.
- Feed portrait: 1080×1350 (preferred for feed screen area).
- Stories/Reels placement: 1080×1920; keep critical text inside safe zones.

Use PNG for crisp UI. Do not create fake controls or show features absent from the shipped build.

## Copy proposals

### Ad 1 — app control

Primary: Your Mac’s master volume should not decide how loud every app is. MixBar gives music, calls, games, videos, and alerts their own volume, mute, and EQ—from the menu bar.

Headline: Every Mac app, its own volume

Description: Native for macOS 14.2+. $21 once.

CTA: Learn More

### Ad 2 — browser tabs

Primary: One loud tab should not force you to lower every Chrome window. Choose the playing tab with MixBar Tab Control, then mix it separately on your Mac.

Headline: Control individual Chrome tabs

Description: Free extension; MixBar for Mac required.

CTA: Learn More

### Ad 3 — trust/price

Primary: A native Mac volume mixer with no subscription and no permanent virtual audio driver. Your audio is processed locally in memory.

Headline: MixBar — $21 once

Description: Signed, notarized, Apple silicon + Intel.

CTA: Shop Now

## UTM convention

`utm_source=meta&utm_medium=paid_social&utm_campaign={market}_{concept}_{yyyymm}&utm_content={placement}_{format}_{variant}`

Example:

`?utm_source=meta&utm_medium=paid_social&utm_campaign=en_app_control_202610&utm_content=instagram_feed_4x5_a`

Use lowercase ASCII, underscores, and stable names. Never put audience names, emails, or personal identifiers in UTMs.

## Budget and decisions

Reserve PLN 350 of the illustrative month-one budget for Meta, but spend it only after Pixel consent tests pass. Test three concepts rather than minor colors. Stop an ad for misleading clicks, hostile comments revealing a promise gap, broken tracking, or spend beyond the agreed loss threshold—not just because of one quiet day.
