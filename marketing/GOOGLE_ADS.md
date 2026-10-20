# Google Ads Search launch plan

Do not launch until verified GA4 purchases have passed a complete Stripe test and one controlled live validation. Search should be the first paid channel because the product answers explicit desktop-audio intent.

## Campaign structure

Location: United States, United Kingdom, Canada, Australia, and New Zealand. Language: English. Network: Google Search only initially; disable Display expansion and Search Partners during the first test.

1. **Mac Volume Mixer — Exact/Phrase**
   - mac volume mixer
   - volume mixer for mac
   - macbook volume mixer
   - per app volume mac
   - control app volume mac
2. **Browser Tab Audio — Exact/Phrase**
   - chrome tab volume control
   - individual tab volume chrome mac
   - control browser tab audio mac
   - lower volume one chrome tab mac
3. **Mac App EQ — Exact/Phrase**
   - per app equalizer mac
   - app volume equalizer mac
   - mac app audio mixer

Keep the browser group separate: Chrome/Opera require the companion extension, Safari has media limitations, and Firefox exposes audio subprocesses rather than named tabs. Ads and landing copy must preserve those qualifications.

Start with exact and phrase match. Add broad match only after verified purchase volume is large enough for smart bidding and the search-term report demonstrates control.

## Negative keywords

Add at campaign level initially:

`windows`, `windows 10`, `windows 11`, `android`, `iphone`, `ipad`, `linux`, `ubuntu`, `mixer hardware`, `mixing console`, `dj mixer`, `audio interface`, `music production`, `fl studio`, `ableton`, `logic pro tutorial`, `source code`, `github`, `crack`, `torrent`, `keygen`, `free download`, `apk`, `driver download`, `volume booster`, `chrome android`, `extension only`

Review search terms twice weekly. Do not negative-match “free” blindly if it appears in a high-intent comparison query; evaluate the full query.

## Responsive Search Ad headlines

All suggestions are within Google’s 30-character headline limit. Pin only when a legal or qualification message must always appear; excessive pinning reduces learning.

1. Mac Volume Mixer — MixBar
2. Control Each Mac App
3. Per-App Volume on Mac
4. Control Chrome Tab Volume
5. A Mixer for Your Mac
6. Mute Any Mac App
7. Per-App EQ for macOS
8. Mix Mac Audio Your Way
9. No Subscription — $21
10. One-Time Mac Audio Tool
11. Native macOS Menu Bar App
12. No Virtual Audio Driver
13. Save App Volume Levels
14. Balance Calls and Music
15. Apple Silicon + Intel

## Descriptions

All suggestions are within Google’s 90-character description limit.

1. Set volume, mute and EQ for each Mac app from one native menu-bar mixer.
2. Control supported browser tabs separately. Chrome and Opera use a free extension.
3. Pay $21 once. Keep your MixBar feature release and its fix updates forever.
4. Signed and notarized for macOS 14.2+. Audio stays local and no driver is installed.

## Landing pages

- Core and per-app groups: `https://getmixbar.com/?utm_source=google&utm_medium=cpc&utm_campaign=search_mac_mixer&utm_content={adgroupid}_{creative}`
- Browser group: `https://getmixbar.com/guides/control-chrome-tab-volume-mac?utm_source=google&utm_medium=cpc&utm_campaign=search_tab_audio&utm_content={adgroupid}_{creative}`
- EQ group: home page until a dedicated, substantive EQ guide exists.

The guide CTA currently returns visitors to pricing rather than opening Stripe abruptly. This is appropriate for informational traffic. Consider a contextual sticky CTA only after mobile behavior data exists.

## Budget and bidding

Use PLN 900 of the illustrative first-month PLN 1,500 budget for Google Search:

- Days 1–7: PLN 20/day, Maximize Clicks with a conservative CPC cap while validating search terms and conversion wiring.
- Days 8–30: up to PLN 33/day only if terms are relevant and purchases are verified; otherwise pause poor groups and keep spend below plan.
- Move to Maximize Conversions only after enough real purchase volume exists. Do not use checkout starts as the primary bidding goal.

This is a test budget, not a forecast. Pause if tracking breaks, irrelevant search terms dominate, or spend reaches a pre-agreed loss limit without meaningful checkout/purchase evidence.

## Conversion measurement

- Primary: GA4 `purchase`, generated only by the signed Stripe webhook; count every transaction, use dynamic value/currency.
- Secondary: `checkout_started` and `download_click` for funnel diagnosis, not bidding.
- Attribution: Google auto-tagging plus UTM parameters. MixBar copies safe UTMs and a consented opaque client reference into the Stripe Payment Link.
- Deduplication: Stripe PaymentIntent/Session is the GA4 `transaction_id`, and D1 stores a unique provider/event/dedup key.
- Never add a separate button-based purchase conversion. If a direct Google Ads purchase tag is later added, either remove the imported GA4 primary conversion or make one Secondary to avoid double counting.

## Weekly optimization

1. Search-term relevance and new negatives.
2. Purchase rate by keyword/ad/landing page.
3. Mobile vs desktop behavior—MixBar requires a Mac, so mobile traffic may research but cannot install immediately.
4. Geography and hour-of-day only after adequate data.
5. Ad strength and asset coverage, without trading factual accuracy for a score.

Do not claim “best,” “#1,” universal browser support, or “free.”
