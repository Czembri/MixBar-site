# Technical SEO and content plan

## Implemented foundation

- Indexable production pages use clean canonicals under `https://getmixbar.com/`.
- `/download` is deliberately `noindex,nofollow` and excluded from the sitemap because it carries a private checkout-session parameter.
- `robots.txt` allows normal crawling and points to the absolute sitemap URL.
- `sitemap.xml` contains the product page, install/restore/contact/legal pages, and all three search guides using clean paths rather than `.html` URLs.
- The home page has a descriptive title and meta description, Open Graph and X cards, a 1200×630 social image, and WebSite/SoftwareApplication JSON-LD.
- Guides have unique titles/descriptions, Article and BreadcrumbList schema, internal links, and substantive original copy.
- Product schema states only facts supported by the product and repository: $21 USD, macOS 14.2+, current version, and actual features. There are no invented ratings or reviews.
- Static delivery, local assets, explicit image dimensions, responsive CSS, reduced-motion support, and non-blocking optional analytics protect page experience.

## Primary keyword themes

Use one theme per page; do not stuff variants.

| Intent | Primary phrase | Supporting phrases | Best page |
|---|---|---|---|
| Commercial | mac volume mixer | volume mixer for mac, macbook volume mixer | `/` and `/guides/mac-volume-mixer` |
| Task | control volume per app mac | separate app volume mac, lower one app on mac | `/guides/control-volume-per-app-mac` |
| Browser | chrome tab volume control | individual tab volume chrome mac, control browser tab audio | `/guides/control-chrome-tab-volume-mac` |
| Feature | mac app volume equalizer | per-app EQ mac, app audio equalizer | future guide |
| Automation | automate app volume mac | meeting volume profile mac, audio scenes mac | future guide |
| Alternative | mac volume mixer without driver | Core Audio process tap mixer | future comparison/explainer |

Do not target Windows queries, Android/iOS volume apps, music-production hardware mixers, source code, cracks, or generic “free volume booster” traffic.

## Search Console steps

1. Use the verified Domain property `getmixbar.com`.
2. Submit `https://getmixbar.com/sitemap.xml` as the complete address. This avoids the “invalid sitemap address” problem shown when the property/path prefix is ambiguous.
3. Inspect the live home URL and each guide; request indexing only after a successful live test.
4. Wait at least several days before diagnosing a new property. Submission does not guarantee indexing or rank.
5. Weekly: check Pages, HTTPS, Core Web Vitals, rich-result enhancements, manual actions, and Security Issues.
6. Monthly: export queries/pages. Improve pages with impressions and positions 8–25 before creating unrelated content.

## Content roadmap

1. “Per-app equalizer on Mac: when volume is not enough.”
2. “How to keep notification sounds quieter on macOS.”
3. “Mac meeting audio setup: balance calls, music, and alerts.”
4. “Core Audio process taps vs virtual audio devices.”
5. “AirPlay latency and per-app volume: what changes.”
6. An honest comparison page after manually validating current competitors, price, OS support, and limitations. Never publish a comparison from memory.

Each article should solve the query without requiring a purchase, show the limitation honestly, link to a relevant existing guide, and use a contextual CTA only after the answer.

## Remaining opportunities

- Capture and compress a current real app screenshot at 2× resolution. Use it on the product page and as `ImageObject` content only when it accurately matches the shipped build.
- Add unique OG/X metadata to every support/legal page if those URLs begin receiving shares.
- Earn links through useful technical explanations, launch discussions, extension store listings, and genuine product directories; do not buy links.
- Monitor field Core Web Vitals after sufficient traffic. Lighthouse lab scores are not a substitute for real-user data.
- Consider localized canonical pages only after there is enough search demand and each language can have stable URL-specific content. The current query-string localization should not be turned into hreflang declarations prematurely.

## Validation commands

```sh
cd storefront-worker && npm test
node --check ../docs/analytics.js
curl -I https://getmixbar.com/
curl https://getmixbar.com/robots.txt
curl https://getmixbar.com/sitemap.xml
```

Also validate the structured data with Google Rich Results Test after deployment and inspect rendered canonicals, robots directives, status codes, and CSP in Search Console’s live test.

## Sources

- [Google sitemap report](https://support.google.com/webmasters/answer/7451001)
- [Google URL Inspection](https://support.google.com/webmasters/answer/9012289)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
