# MixBar growth and measurement audit

Audited: 20 October 2026. Scope: repository, storefront, fulfillment Worker, release scripts, public marketing assets, and the live-site architecture represented by this repository. No production deployment or account change was made.

## Executive summary

MixBar already has a credible product, a clear one-time price, a signed/notarized delivery path, a private Stripe-verified download, purchase restore, license activation, responsive pages, technical guides, and a solid SEO foundation. The missing layer was measurement: there was no analytics, consent mechanism, campaign attribution, or verified advertising conversion.

This change adds a disabled-by-default, environment-configurable measurement layer. It records public website interactions only after consent, carries an opaque client reference and safe UTM parameters into Stripe, and reports `purchase` from a signed Stripe webhook with transaction deduplication. It does not add analytics to the Mac app.

## Architecture

- Native product: Swift/AppKit macOS menu-bar app in `VolumeMixer/`, built with Xcode. Requires macOS 14.2 or later and supports Apple silicon and Intel.
- Browser companions: Manifest V3 Chrome/Opera extension in `ChromeExtension/`; bundled Safari web extension in `SafariWebExtension/`.
- Storefront: static HTML, CSS, and vanilla JavaScript in `docs/`; no frontend framework or runtime dependency.
- Production hosting: Cloudflare Pages, deployed from the `docs/` subtree through `Scripts/deploy-site.sh`.
- Development hosting: separate Cloudflare Pages project through `Scripts/deploy-dev-site.sh`; dev pages are noindex.
- Fulfillment: Cloudflare Worker in `storefront-worker/`, D1 for entitlements/licenses, private R2 for releases.
- Checkout: Stripe Payment Link, $21 USD one-time purchase. Stripe redirects successful buyers to the private download flow.
- Email: Resend for contact, activation codes, and one-time restore links. Cloudflare Turnstile protects public forms.

## Existing funnel before this work

1. Visitor lands on `getmixbar.com` or an SEO guide.
2. Buy buttons open a Stripe-hosted Payment Link.
3. Stripe redirects a successful payment to `/download?session_id={CHECKOUT_SESSION_ID}`.
4. The Worker retrieves and validates that exact Stripe Checkout Session before streaming a private R2 release.
5. Signed Stripe webhooks create or revoke a D1 entitlement.
6. Buyers can restore a purchase by email and activate up to three Macs.

The flow was secure but unmeasured. A button click could not prove revenue, and no attribution survived checkout in a form GA4 could reconcile.

## Analytics and consent findings

Before this work:

- no GA4, Google Tag Manager, Google Ads tag, or Meta Pixel;
- no cookie/measurement consent UI;
- no first-party attribution persistence;
- no client-to-Stripe attribution link;
- no verified purchase event;
- privacy copy explicitly said there was no website analytics.

Implemented locally:

- `marketing-config.js` with disabled, blank public IDs in source control;
- environment generator with strict public-ID validation;
- basic Google Consent Mode v2 defaults: all four relevant states denied before tag load;
- explicit Reject, Accept all, and granular Analytics/Marketing choices;
- GTM preferred, with direct GA4 fallback when GTM is absent;
- configurable, consent-gated Meta Pixel;
- deduplicated `page_view`, plus `download_click`, `checkout_started`, `outbound_click`, and semantically appropriate Meta events;
- opaque client ID and UTM propagation into Stripe Payment Links;
- signed-webhook-only GA4 `purchase` with a unique transaction ID and D1 deduplication;
- strict parameter and URL sanitization; browser code cannot emit `purchase`.

`app_activated` and `first_launch` remain intentionally unimplemented. The app currently promises no in-app analytics SDK, and there is no in-app consent flow. Activation records can support aggregated operational reporting later, but should not be exported to advertising systems without a product/privacy decision.

## SEO findings

Strengths:

- valid `robots.txt`, clean canonical URLs, and XML sitemap;
- download completion excluded from the sitemap and marked `noindex,nofollow`;
- strong home-page title/description, Open Graph, X card, and SoftwareApplication JSON-LD;
- three substantive search guides with Article and BreadcrumbList schema;
- semantic headings, responsive layout, lightweight static delivery, local fonts/assets;
- honest price, OS requirements, browser limitations, privacy, refund, and compatibility copy.

Gaps and opportunities:

- social metadata is complete on the home page/guides but inconsistent on support/legal pages;
- there is no real full-app screenshot in the committed storefront assets; the hero uses an accurate CSS interface representation;
- current guide cluster is small and has almost no external links/backlinks yet;
- Search Console data is too new to support aggressive keyword decisions;
- no Core Web Vitals field history is available in the repository.

## Landing-page conversion audit

- Five-second clarity: good. The hero says native Mac volume mixer, per-app/tab volume, mute, EQ, and no subscription.
- macOS qualification: prominent (`Native for macOS 14.2+`).
- primary CTA: visible in navigation and hero, with a clear `$21 once` label.
- pricing: one-time price and optional future feature releases are explained.
- trust: signed/notarized delivery is described elsewhere; local audio/no driver/no subscription claims are verifiable in code and documentation.
- screenshots: interface representation is useful, but a current real app screenshot would improve proof.
- mobile: responsive grid and CTA rules are present. Consent UI has a dedicated narrow layout.
- purchase friction: Stripe-hosted checkout and instant verified download are strong. Restore and contact flows reduce support risk.

Safe CRO changes in this work are limited to measurable CTA placements and privacy controls. No testimonials, counters, discounts, ratings, or guarantees were invented.

## Available marketing assets

- brand mark and 1200×630 social card in `docs/assets/`;
- real Chrome extension screenshot in `MarketingAssets/`;
- static ad concepts already exported at 1080×1080, 1080×1350, and 1080×1920;
- CSS product-interface composition on the landing page;
- no founder video is required by any launch plan in this folder.

## Priority order

1. Create GA4/GTM, configure tags exactly as described in `SETUP.md`, and validate in Preview/DebugView.
2. Apply D1 migration 0005, set the Worker GA4 secret, deploy first to dev, and complete a Stripe test purchase.
3. Deploy the website configuration to dev and verify reject/accept/customize paths before production approval.
4. Submit the sitemap and request indexing for the home page and three guides.
5. Capture one current real MixBar application screenshot and use it in the storefront, Product Hunt, and static ads.
6. Accumulate clean baseline data before paid acquisition; do not optimize on checkout clicks when verified purchase data exists.

## Risks

- Consent and privacy compliance depends on the founder configuring tags to respect consent. GTM tags must not use “All Pages” without consent requirements.
- Measurement Protocol returns a success response even for some malformed payloads; use GA4 validation/DebugView during setup.
- A Payment Link is an external domain. Cross-domain continuity uses the opaque `client_reference_id`; GTM must set the documented MixBar client ID in GA4.
- Meta Purchase is not sent in this implementation. Adding it safely requires a configured Conversions API, marketing-consent linkage, hashed identifiers, and browser/server `event_id` deduplication.
- No marketing can guarantee a number-one Google position. The plan targets qualified rankings, conversion rate, and profitable acquisition instead.
