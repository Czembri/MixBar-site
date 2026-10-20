(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MixBarAnalyticsCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const publicEvents = new Set([
    "page_view",
    "download_click",
    "checkout_started",
    "outbound_click",
    "view_content"
  ]);
  const blockedKeys = /(?:^|_)(?:email|e_mail|name|phone|message|session_id|checkout_session|address|password|token)(?:$|_)/i;
  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function validIdentifier(value, expression) {
    return typeof value === "string" && expression.test(value.trim());
  }

  function validConfig(config) {
    const candidate = config && typeof config === "object" ? config : {};
    return {
      enabled: candidate.enabled === true,
      environment: candidate.environment === "production" ? "production" : "development",
      gtmContainerId: validIdentifier(candidate.gtmContainerId, /^GTM-[A-Z0-9]+$/i)
        ? candidate.gtmContainerId.trim().toUpperCase() : "",
      ga4MeasurementId: validIdentifier(candidate.ga4MeasurementId, /^G-[A-Z0-9]+$/i)
        ? candidate.ga4MeasurementId.trim().toUpperCase() : "",
      googleAdsConversionId: validIdentifier(candidate.googleAdsConversionId, /^AW-[0-9]+$/)
        ? candidate.googleAdsConversionId.trim() : "",
      metaPixelId: validIdentifier(candidate.metaPixelId, /^[0-9]{5,32}$/)
        ? candidate.metaPixelId.trim() : "",
      tiktokPixelId: validIdentifier(candidate.tiktokPixelId, /^[A-Z0-9]{10,32}$/i)
        ? candidate.tiktokPixelId.trim().toUpperCase() : ""
    };
  }

  function sanitizeURL(value, base) {
    try {
      const url = new URL(value, base || "https://getmixbar.com/");
      return `${url.origin}${url.pathname}`;
    } catch (_) {
      return "";
    }
  }

  function safeScalar(value) {
    if (typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value !== "string") return undefined;
    return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 150);
  }

  function sanitizeParameters(parameters) {
    if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) return {};
    const result = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (!/^[a-z][a-z0-9_]{0,39}$/i.test(key) || blockedKeys.test(key)) continue;
      if (key.endsWith("url") || key === "page_location" || key === "link_url") {
        const cleanURL = sanitizeURL(value);
        if (cleanURL) result[key] = cleanURL;
        continue;
      }
      const cleanValue = safeScalar(value);
      if (cleanValue !== undefined) result[key] = cleanValue;
    }
    return result;
  }

  function readAttribution(search) {
    const params = new URLSearchParams(search || "");
    const result = {};
    for (const key of attributionKeys) {
      const value = params.get(key);
      if (value && /^[a-z0-9 _.-]{1,150}$/i.test(value)) result[key] = value.slice(0, 150);
    }
    return result;
  }

  function normalizeAttribution(value) {
    const result = {};
    if (!value || typeof value !== "object") return result;
    for (const key of attributionKeys) {
      if (typeof value[key] === "string" && /^[a-z0-9 _.-]{1,150}$/i.test(value[key])) {
        result[key] = value[key].slice(0, 150);
      }
    }
    return result;
  }

  function clientReferenceId(clientId, marketingAllowed) {
    const opaque = String(clientId || "").replace(/[^a-f0-9]/gi, "").slice(0, 64).toLowerCase();
    if (opaque.length < 16) return "";
    return `${marketingAllowed ? "mbm" : "mba"}_${opaque}`;
  }

  function decorateCheckoutURL(value, options) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.hostname !== "buy.stripe.com") return value;
      const settings = options || {};
      const reference = clientReferenceId(settings.clientId, settings.marketingAllowed === true);
      if (reference) url.searchParams.set("client_reference_id", reference);
      const attribution = normalizeAttribution(settings.attribution);
      for (const [key, parameter] of Object.entries(attribution)) url.searchParams.set(key, parameter);
      return url.toString();
    } catch (_) {
      return value;
    }
  }

  function canTrack(eventName) {
    return publicEvents.has(eventName);
  }

  return Object.freeze({
    attributionKeys: Object.freeze([...attributionKeys]),
    canTrack,
    clientReferenceId,
    decorateCheckoutURL,
    normalizeAttribution,
    readAttribution,
    sanitizeParameters,
    sanitizeURL,
    validConfig
  });
});
