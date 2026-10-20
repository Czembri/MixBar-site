# MixBar 30-day launch plan

Objective: establish a measurable baseline, acquire the first repeatable stream of qualified visitors and verified purchases, and learn which problem/message converts. The illustrative test budget is PLN 1,500. It is a ceiling, not a requirement.

## Budget

| Use | Maximum | Release condition |
|---|---:|---|
| Google Search | PLN 900 | Verified purchase event works end to end |
| Meta static creative test | PLN 350 | Consent/Pixel tests pass; Search baseline exists |
| Product screenshot/design contingencies | PLN 0–100 | Only if an asset cannot be produced in-house |
| Reserve/reallocation | PLN 150–250 | Move only toward a channel with verified purchases |
| Total | PLN 1,500 | Hard cap |

No budget is assigned to followers, backlinks, sponsored reviews, paid analytics infrastructure, or coordinated votes.

## Days 1–3 — measurement and release confidence

- [ ] Create GA4 and GTM, configure consent-aware tags, and keep the container unpublished.
- [ ] Apply D1 marketing-event migration in dev and store the dev GA4 API secret.
- [ ] Generate a dev measurement config and run reject/analytics/all consent tests.
- [ ] Complete a Stripe test purchase; verify one webhook purchase and zero purchase events from download-page refreshes.
- [ ] Test buy, restore, email, DMG, notarization, activation, and deactivation from a clean macOS user account.
- [ ] Fix any blocker before marketing. Do not buy traffic into a broken restore/activation path.

Exit criterion: a written test record with transaction ID, one GA4 purchase, no duplicate, and no PII in event payloads.

## Days 4–6 — proof and search readiness

- [ ] Capture one current real MixBar panel screenshot, one app-detail/EQ screenshot, one browser-tab screenshot, and one Audio Autopilot screenshot.
- [ ] Replace stale/generic marketing mockups where necessary; export 1080×1080, 1080×1350, and 1080×1920 variants.
- [ ] Submit the full sitemap URL in Search Console.
- [ ] Inspect/request indexing for home and three guides.
- [ ] Run Lighthouse on mobile/desktop as a regression check and record results; prioritize broken layout/large regressions rather than chasing a perfect score.
- [ ] Publish measurement only after privacy copy and consent behavior have been reviewed.

Exit criterion: public funnel works, current screenshots exist, Search Console accepts the sitemap.

## Day 7 — baseline

- [ ] Record Stripe visits/sales, GA4 consented users, checkout starts, purchases, and source/medium.
- [ ] Build the free Looker Studio scorecard from `SETUP.md` or use a simple weekly spreadsheet until connectors have data.
- [ ] Set stop conditions: maximum unpaid spend, tracking failure, landing outage, and support capacity.

Do not interpret a few visits as a stable conversion rate.

## Days 8–14 — high-intent Search test

- [ ] Launch only exact/phrase Mac mixer and per-app-volume groups at about PLN 20/day.
- [ ] Keep Search only; no Display expansion or Search Partners initially.
- [ ] Check search terms daily for the first three days and add negatives.
- [ ] Confirm Ads clicks have `google / cpc`, checkout links retain safe attribution, and Stripe webhooks create verified purchases.
- [ ] Compare message/keyword behavior; do not optimize to clicks alone.
- [ ] Pause a group if it is clearly irrelevant or tracking fails.

Decision at day 14:

- purchases and relevant queries: continue cautiously and test the browser group;
- checkout starts but no purchases: inspect price/compatibility/checkout and traffic quality;
- no checkout starts: improve ad-message/landing alignment or stop;
- no reliable measurement: pause all paid spend.

## Days 15–18 — community foundation

- [ ] Participate genuinely in r/macapps/r/SideProject before promotion; verify live rules.
- [ ] If r/macapps main-feed eligibility is absent, prepare the current App Pile PCP entry instead.
- [ ] Founder personally rewrites the Show HN outline; HN disallows generated or AI-edited posts.
- [ ] Prepare the Product Hunt page as a draft, not a rushed launch.
- [ ] Send at most a few individualized press/tip emails with an actual reason the recipient’s audience may care.

Track referral UTMs but judge community activity by useful feedback and qualified visits, not raw impressions.

## Days 19–23 — static creative test

- [ ] If consent/Pixel and baseline purchase reporting are sound, launch three distinct Meta concepts at a small combined cap (up to PLN 350 total).
- [ ] Prefer 4:5 feed; let placements adapt only if screenshots remain legible.
- [ ] Optimize for landing-page views/checkout starts only as a temporary creative signal until verified Meta Purchase exists.
- [ ] Read comments for promise gaps and answer accurately.
- [ ] Stop low-quality placements; do not broaden claims to improve click-through rate.

## Days 24–26 — organic launch

- [ ] Submit to one community at a time and remain available to answer.
- [ ] Use the Product Hunt checklist; schedule only when the production funnel and support inbox are healthy.
- [ ] Do not ask friends/customers to upvote. Ask for testing and honest feedback through channels where that is allowed.
- [ ] Convert recurring questions into FAQ/guide improvements.

## Days 27–30 — review and next experiment

Create a one-page review:

| Metric | Overall | Google | Meta | Organic |
|---|---:|---:|---:|---:|
| Consented visitors | | | | |
| Checkout starts | | | | |
| Verified purchases | | | | |
| Revenue | | | | |
| Spend | | | | |
| CPA | | | | |
| ROAS | | | | |

Also record refund/support rate, top objections, top Search Console queries, and data quality issues.

Choose one month-two experiment:

1. expand a proven Search keyword/message;
2. publish the highest-demand guide surfaced by Search Console/community questions;
3. improve screenshot/product proof if high-intent traffic fails to buy;
4. implement consent-aware Meta Conversions API if Meta showed credible purchase potential;
5. improve onboarding/compatibility copy if support shows the same confusion repeatedly.

Do not run all five simultaneously.

## Guardrails

- No claim of being #1, no guaranteed SEO rank, and no fake scarcity.
- No public spend when verified purchase measurement is broken.
- No customer email or support content in analytics/audience tools.
- No retargeting before Marketing consent.
- No feature/OS/browser claim that the current release does not support.
- Keep a 14-day-refund cash buffer; gross Stripe revenue is not net profit.
