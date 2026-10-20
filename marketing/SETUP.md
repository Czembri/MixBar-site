# Marketing measurement setup

Everything in source control is safe and disabled. Complete these steps in order. Start in Stripe test mode and the dev Cloudflare environments. Do not enable production tracking until all validation checks pass.

## 1. Create GA4

1. In Google Analytics, create a property named **MixBar** with the correct company country, currency, and time zone.
2. Create one Web data stream for `https://getmixbar.com`.
3. Copy the Measurement ID (`G-...`). It is public configuration, not a secret.
4. In Admin → Data collection and modification → Data streams → MixBar, keep enhanced measurement only for interactions you actually want. Disable automatic outbound/file events if they would duplicate the explicit events in `analytics.js`.
5. In Admin → Data display → Events, mark only `purchase` as a primary key event initially. Keep `download_click` and `checkout_started` as secondary diagnostic events.
6. In the stream’s Measurement Protocol API secrets, create a secret named **MixBar Stripe Worker**. The value is a secret and belongs only in the Worker secret store.

## 2. Create and configure GTM

1. Create a Web container for `getmixbar.com`; copy its `GTM-...` ID.
2. Create Data Layer Variables:
   - `DLV - mixbar_client_id` → `mixbar_client_id`
   - `DLV - ga4_measurement_id` → `ga4_measurement_id`
3. Create a Google tag using the actual GA4 Measurement ID. Set **Send a page view event when this configuration loads** to off. Set `client_id` to `{{DLV - mixbar_client_id}}`.
4. Fire the Google tag on the `mixbar_configuration` custom event and require `analytics_storage` consent.
5. Do not create separate GA4 Event tags. After the Google tag is configured, the consent-aware site code sends the whitelisted `page_view`, `download_click`, `checkout_started`, and `outbound_click` commands through the Google tag queue. Separate GTM event tags would double-count them.
6. Do not create a browser `purchase` tag. The Worker sends that event after a verified payment.
7. Preview the container with Tag Assistant. Confirm nothing loads before consent, one page view appears after analytics consent, and changing preferences updates all four Consent Mode v2 states.
8. Publish the GTM container only after dev testing.

If GTM is deliberately not used, provide only `MIXBAR_GA4_MEASUREMENT_ID`. The website loads gtag.js after analytics consent and sends the same allowed browser events. Never configure both a duplicate GTM event tag and the direct fallback.

## 3. Generate public site configuration

Use public IDs only:

```sh
export MIXBAR_MARKETING_ENABLED=true
export MIXBAR_MARKETING_ENVIRONMENT=production
export MIXBAR_GTM_CONTAINER_ID=GTM-XXXXXXX
export MIXBAR_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
export MIXBAR_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX
export MIXBAR_META_PIXEL_ID=123456789012345
export MIXBAR_TIKTOK_PIXEL_ID=DBBMQF3C77U4J2JQ6TM0
Scripts/generate-marketing-config.sh /tmp/marketing-config.js
```

The production deployment script generates `marketing-config.js` inside a temporary staging directory from these environment variables, so public IDs do not need to be committed and the checked-in configuration remains disabled. The dev deployment script forces tracking off. To test real tags safely, use a temporary local host override or a dedicated preview configuration approved for that purpose rather than turning the committed default on.

The generator refuses malformed IDs. `marketing-config.js` is public and must never contain a Measurement Protocol secret, Stripe key, Meta access token, email address, or password.

## 4. Configure verified purchase reporting in the Worker

1. Apply migration `0005_marketing_events.sql` to the dev D1 database first.
2. Add `GA4_MEASUREMENT_ID=G-...` as a non-secret Worker variable in the dev environment.
3. Add the secret interactively:

```sh
cd storefront-worker
npx wrangler secret put GA4_API_SECRET --env dev
```

4. Deploy only the dev Worker after approval.
5. Make a Stripe test-mode Payment Link purchase with the standard test card.
6. Confirm:
   - one entitlement row was created;
   - one `marketing_events` row exists for provider `ga4`, event `purchase`, status `sent`;
   - GA4 DebugView/Realtime shows one purchase with the Stripe PaymentIntent as `transaction_id`;
   - refreshing `/download` does not create another purchase;
   - replaying the same signed webhook does not create another purchase.
7. After validation, apply the migration to production D1, add the non-secret ID, and store the production API secret with `npx wrangler secret put GA4_API_SECRET`.

The webhook omits purchase measurement when consented attribution is absent. It never sends the checkout email or card/payment details to GA4.

## 5. Google Ads

1. Link Google Ads to the GA4 property.
2. Import the GA4 `purchase` key event into Google Ads.
3. Set **Purchase** as Primary, value from GA4, count **Every**.
4. Import `download_click` only as Secondary/observation; do not include it in the account conversion goal used for bidding.
5. Enable auto-tagging. Use the UTM convention in `GOOGLE_ADS.md` in final URLs or tracking templates.
6. Verify Ads Data Manager/GA4 Diagnostics after the first dev-to-production test. Avoid also installing a direct Google Ads purchase tag unless there is a deliberate deduplication design.

## 6. Meta Business Manager

1. Create or select the MixBar Business Portfolio, ad account, and Pixel/data source.
2. Verify `getmixbar.com` in Business Settings using the already managed DNS zone.
3. Copy the numeric Pixel ID into public config.
4. In Events Manager Test Events, grant Marketing consent and verify one PageView, one ViewContent on product/guide pages, and InitiateCheckout on a buy link.
5. Reject Marketing and confirm no Meta script or request loads.
6. Do not optimize for Meta Purchase yet. A server-side verified Meta purchase needs a separate Conversions API implementation, explicit marketing consent linkage, and browser/server event ID deduplication.

## 7. TikTok Ads Manager

1. Create a Web data source named **MixBar Website** and choose the browser-side TikTok Pixel setup.
2. Copy the public Pixel ID into `MIXBAR_TIKTOK_PIXEL_ID` for production deployment.
3. Keep automatic advanced matching and automatic event discovery disabled. The site explicitly sends only PageView, ViewContent, and InitiateCheckout after Marketing consent.
4. In Events Manager Test Events, verify no TikTok request occurs before consent, then verify one PageView and one ViewContent after consent and one InitiateCheckout on a buy link.
5. Do not optimize for TikTok Purchase yet. A verified Purchase event requires a reviewed Events API integration from the signed Stripe webhook with marketing-consent linkage and deduplication.

## 8. Search Console

1. Keep the verified Domain property for `getmixbar.com`.
2. Open Sitemaps and submit the full URL `https://getmixbar.com/sitemap.xml`. If the UI rejects a relative entry, the full URL removes property/path ambiguity.
3. Use URL Inspection → Test live URL for the home page and the three guides, then Request indexing.
4. Check Pages, HTTPS, Core Web Vitals, and Enhancements weekly. Indexing can take days and is not guaranteed.

## 9. Consent verification checklist

- Fresh private window: no `_ga`, `_fbp`, `_ttp`, GTM, Analytics, Meta, or TikTok network request before a choice.
- Reject optional: no measurement request; checkout still works and contains no MixBar client reference.
- Analytics only: Google loads; Meta and TikTok do not. Checkout contains an `mba_...` opaque reference and safe UTM values.
- Accept all: Google, Meta, and TikTok load; checkout contains an `mbm_...` opaque reference.
- Preferences: switching back to denied sends a consent update, stops further custom events, and deletes known first-party analytics cookies where possible.
- No event payload contains email, name, phone, support message, Stripe Checkout Session ID, or URL query/hash.
- One page load creates at most one custom `page_view`.

## 10. Measurement and dashboard

Use a free Looker Studio report connected to GA4, Google Ads, and (when available) a manually maintained Meta spend sheet. Do not add paid data infrastructure yet.

Recommended scorecard definitions:

| Metric | Definition |
|---|---|
| Visitors | GA4 active users (consented traffic only) |
| Acquisition | Session source / medium / campaign |
| Download clicks | Count of `download_click` |
| Checkout starts | Count of `checkout_started` |
| Purchases | Unique `purchase.transaction_id` |
| Visitor conversion | Purchases ÷ active users |
| Spend | Google Ads cost + entered Meta cost |
| CPA | Spend ÷ purchases attributed to ads |
| Revenue | Sum of verified purchase value |
| ROAS | Attributed revenue ÷ spend |

Build funnel steps in GA4 Explore: `page_view` → `checkout_started` → `purchase`. Treat `download_click` as a separate delivery/interest diagnostic because the first purchase download is an automatic verified flow.

## Sources

- [Google Consent Mode setup](https://developers.google.com/tag-platform/security/guides/consent)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 purchase event](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#purchase)
- [Stripe Payment Link URL tracking](https://docs.stripe.com/payment-links/url-parameters)
- [Stripe post-payment redirects](https://docs.stripe.com/payment-links/post-payment)
