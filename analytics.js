(function () {
  "use strict";

  const core = window.MixBarAnalyticsCore;
  if (!core) return;
  const config = core.validConfig(window.MIXBAR_MARKETING_CONFIG);
  const productionHost = ["getmixbar.com", "www.getmixbar.com"].includes(location.hostname);
  const active = config.enabled && config.environment === "production" && productionHost;
  const consentKey = "mixbar_consent_v1";
  const attributionKey = "mixbar_attribution_v1";
  const clientKey = "mixbar_client_id_v1";
  const sent = new Set();
  let googleLoaded = false;
  let metaLoaded = false;
  let tiktokLoaded = false;
  let consent = readConsent();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* private mode */ }
  }

  function storageRemove(key) {
    try { localStorage.removeItem(key); } catch (_) { /* private mode */ }
  }

  function readConsent() {
    try {
      const value = JSON.parse(storageGet(consentKey));
      if (value && value.version === 1) {
        return { decided: true, analytics: value.analytics === true, marketing: value.marketing === true };
      }
    } catch (_) { /* invalid or absent choice */ }
    return { decided: false, analytics: false, marketing: false };
  }

  function persistConsent(next) {
    consent = { decided: true, analytics: next.analytics === true, marketing: next.marketing === true };
    storageSet(consentKey, JSON.stringify({ ...consent, version: 1, updatedAt: new Date().toISOString() }));
    applyConsent();
  }

  function randomClientId() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function clientId() {
    if (!consent.analytics) return "";
    let value = storageGet(clientKey);
    if (!/^[a-f0-9]{32}$/.test(value || "")) {
      value = randomClientId();
      storageSet(clientKey, value);
    }
    return value;
  }

  function attribution() {
    if (!consent.analytics) return {};
    const fromURL = core.readAttribution(location.search);
    if (Object.keys(fromURL).length) storageSet(attributionKey, JSON.stringify(fromURL));
    try { return core.normalizeAttribution(JSON.parse(storageGet(attributionKey)) || fromURL); }
    catch (_) { return fromURL; }
  }

  function removeTrackingCookies() {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=", 1)[0].trim();
      if (!/^(?:_(?:ga|gcl|fbp|fbc|ttp|tt_enable_cookie)|ttcsid(?:_|$)|tt_pixel_session_index$|tt_sessionid$|tt_appinfo$)/i.test(name)) continue;
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.getmixbar.com; SameSite=Lax`;
    }
  }

  function loadScript(source, id) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = source;
    document.head.append(script);
  }

  function loadGoogle() {
    if (googleLoaded || !consent.analytics || !active) return;
    googleLoaded = true;
    const id = config.gtmContainerId || config.ga4MeasurementId;
    if (!id) return;
    window.dataLayer.push({
      event: "mixbar_configuration",
      mixbar_client_id: clientId(),
      ga4_measurement_id: config.ga4MeasurementId,
      google_ads_conversion_id: config.googleAdsConversionId
    });
    if (config.gtmContainerId) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmContainerId)}`, "mixbar-gtm");
    } else {
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`, "mixbar-gtag");
      window.gtag("js", new Date());
      window.gtag("config", config.ga4MeasurementId, { send_page_view: false, client_id: clientId() });
    }
  }

  function loadMeta() {
    if (metaLoaded || !consent.marketing || !active || !config.metaPixelId) return;
    metaLoaded = true;
    window.fbq = window.fbq || function () { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments); };
    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq.queue = [];
    loadScript("https://connect.facebook.net/en_US/fbevents.js", "mixbar-meta-pixel");
    window.fbq("init", config.metaPixelId);
    window.fbq("track", "PageView");
    if (location.pathname === "/" || location.pathname.startsWith("/guides/")) {
      window.fbq("track", "ViewContent", { content_name: document.title, content_type: "product" });
    }
  }

  function loadTikTok() {
    if (tiktokLoaded || !consent.marketing || !active || !config.tiktokPixelId) return;
    tiktokLoaded = true;
    const objectName = "ttq";
    window.TiktokAnalyticsObject = objectName;
    const ttq = window[objectName] = window[objectName] || [];
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
    ttq.setAndDefer = function (target, method) {
      target[method] = function () { target.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
    };
    for (const method of ttq.methods) ttq.setAndDefer(ttq, method);
    ttq.instance = function (pixelId) {
      const instance = ttq._i[pixelId] || [];
      for (const method of ttq.methods) ttq.setAndDefer(instance, method);
      return instance;
    };
    ttq.load = function (pixelId, options) {
      const source = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[pixelId] = [];
      ttq._i[pixelId]._u = source;
      ttq._t = ttq._t || {};
      ttq._t[pixelId] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[pixelId] = options || {};
      loadScript(`${source}?sdkid=${encodeURIComponent(pixelId)}&lib=${objectName}`, "mixbar-tiktok-pixel");
    };
    ttq.enableCookie();
    ttq.grantConsent();
    ttq.load(config.tiktokPixelId);
    ttq.page();
    if (location.pathname === "/" || location.pathname.startsWith("/guides/")) {
      ttq.track("ViewContent", {
        content_type: "product",
        content_ids: ["mixbar"],
        description: document.title,
        value: 21,
        currency: "USD"
      });
    }
  }

  function applyConsent() {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied"
    });
    if (!consent.analytics) {
      storageRemove(attributionKey);
      storageRemove(clientKey);
      removeTrackingCookies();
    }
    if (!consent.marketing) {
      if (tiktokLoaded && window.ttq) {
        window.ttq.revokeConsent();
        window.ttq.disableCookie();
      }
      removeTrackingCookies();
    }
    if (consent.analytics) {
      loadGoogle();
      track("page_view", { page_location: location.href, page_title: document.title });
    }
    if (consent.marketing) {
      loadMeta();
      if (tiktokLoaded && window.ttq) {
        window.ttq.enableCookie();
        window.ttq.grantConsent();
      } else {
        loadTikTok();
      }
    }
    refreshCheckoutLinks();
  }

  function track(name, parameters) {
    if (!active || !consent.analytics || !core.canTrack(name)) return false;
    const clean = { ...core.sanitizeParameters(parameters), ...attribution() };
    const key = name === "page_view" ? `${name}:${location.pathname}` : "";
    if (key && sent.has(key)) return false;
    if (key) sent.add(key);
    loadGoogle();
    // Send through the Google tag command queue in both modes. When GTM is
    // configured, the mixbar_configuration event above loads/configures the
    // Google tag before these queued event commands are processed. This keeps
    // the container deliberately small and avoids four duplicate GA4 event
    // tags that can drift out of sync with the website event whitelist.
    window.gtag("event", name, clean);
    return true;
  }

  function decorateCheckoutURL(url) {
    if (!active || !consent.analytics) return url;
    return core.decorateCheckoutURL(url, {
      clientId: clientId(),
      marketingAllowed: consent.marketing,
      attribution: attribution()
    });
  }

  function refreshCheckoutLinks() {
    document.querySelectorAll("a.checkout-link").forEach((link) => {
      if (!link.dataset.checkoutBase) link.dataset.checkoutBase = link.href;
      link.href = decorateCheckoutURL(link.dataset.checkoutBase);
    });
  }

  function trackClick(event) {
    const link = event.target?.closest?.("a[href]");
    if (!link) return;
    if (link.classList.contains("checkout-link")) {
      link.href = decorateCheckoutURL(link.dataset.checkoutBase || link.href);
      track("checkout_started", { link_url: link.href, placement: link.dataset.analyticsLocation || "unknown" });
      if (consent.marketing && metaLoaded) window.fbq("track", "InitiateCheckout", { content_ids: ["mixbar"], content_type: "product" });
      if (consent.marketing && tiktokLoaded) {
        window.ttq.track("InitiateCheckout", {
          content_type: "product",
          content_ids: ["mixbar"],
          description: "MixBar for macOS",
          value: 21,
          currency: "USD"
        });
      }
      return;
    }
    const href = link.href || "";
    if (link.id === "secure-download" || /\.(?:dmg|zip)(?:$|\?)/i.test(href)) {
      track("download_click", { link_url: href, placement: link.dataset.analyticsLocation || "download" });
      return;
    }
    try {
      const target = new URL(href, location.href);
      if (target.origin !== location.origin) track("outbound_click", { link_url: target.href });
    } catch (_) { /* invalid href */ }
  }

  const copy = {
    en: { title: "Your privacy choices", body: "Optional analytics helps improve MixBar. Marketing cookies are used only if you allow them.", reject: "Reject optional", accept: "Accept all", customize: "Customize", save: "Save choices", analytics: "Analytics", marketing: "Marketing", settings: "Cookie settings" },
    pl: { title: "Twoje ustawienia prywatności", body: "Opcjonalna analityka pomaga ulepszać MixBar. Marketingowe pliki cookie są używane tylko za Twoją zgodą.", reject: "Odrzuć opcjonalne", accept: "Akceptuj wszystkie", customize: "Dostosuj", save: "Zapisz wybór", analytics: "Analityka", marketing: "Marketing", settings: "Ustawienia cookies" },
    de: { title: "Ihre Datenschutzauswahl", body: "Optionale Analysen helfen, MixBar zu verbessern. Marketing-Cookies werden nur mit Ihrer Zustimmung verwendet.", reject: "Optionale ablehnen", accept: "Alle akzeptieren", customize: "Anpassen", save: "Auswahl speichern", analytics: "Analyse", marketing: "Marketing", settings: "Cookie-Einstellungen" },
    es: { title: "Tus opciones de privacidad", body: "Los análisis opcionales ayudan a mejorar MixBar. Las cookies de marketing solo se usan si las permites.", reject: "Rechazar opcionales", accept: "Aceptar todo", customize: "Personalizar", save: "Guardar opciones", analytics: "Analítica", marketing: "Marketing", settings: "Ajustes de cookies" },
    fr: { title: "Vos choix de confidentialité", body: "Les statistiques facultatives aident à améliorer MixBar. Les cookies marketing ne sont utilisés qu'avec votre accord.", reject: "Refuser l'optionnel", accept: "Tout accepter", customize: "Personnaliser", save: "Enregistrer", analytics: "Statistiques", marketing: "Marketing", settings: "Réglages des cookies" }
  };

  function consentUI() {
    if (!active) return;
    const language = (document.documentElement.lang || "en").slice(0, 2);
    const words = copy[language] || copy.en;
    const panel = document.createElement("section");
    panel.className = "consent-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "consent-title");
    panel.hidden = consent.decided;
    panel.innerHTML = `<div><strong id="consent-title"></strong><p></p><div class="consent-options" hidden><label><input type="checkbox" data-consent="analytics"> <span></span></label><label><input type="checkbox" data-consent="marketing"> <span></span></label></div></div><div class="consent-actions"><button type="button" data-action="reject"></button><button type="button" data-action="customize"></button><button type="button" class="button button-primary" data-action="accept"></button></div>`;
    panel.querySelector("strong").textContent = words.title;
    panel.querySelector("p").textContent = words.body;
    panel.querySelector('[data-action="reject"]').textContent = words.reject;
    panel.querySelector('[data-action="customize"]').textContent = words.customize;
    panel.querySelector('[data-action="accept"]').textContent = words.accept;
    const inputs = panel.querySelectorAll("input");
    inputs[0].nextElementSibling.textContent = words.analytics;
    inputs[1].nextElementSibling.textContent = words.marketing;
    const settings = document.createElement("button");
    settings.type = "button";
    settings.className = "consent-settings";
    settings.textContent = words.settings;
    settings.addEventListener("click", () => {
      inputs[0].checked = consent.analytics;
      inputs[1].checked = consent.marketing;
      panel.hidden = false;
      panel.querySelector(".consent-options").hidden = false;
      panel.querySelector('[data-action="customize"]').textContent = words.save;
    });
    panel.addEventListener("click", (event) => {
      const action = event.target.closest("button")?.dataset.action;
      if (action === "reject") { persistConsent({ analytics: false, marketing: false }); panel.hidden = true; }
      if (action === "accept") { persistConsent({ analytics: true, marketing: true }); panel.hidden = true; }
      if (action === "customize") {
        const options = panel.querySelector(".consent-options");
        if (options.hidden) {
          options.hidden = false;
          event.target.textContent = words.save;
        } else {
          persistConsent({ analytics: inputs[0].checked, marketing: inputs[1].checked });
          panel.hidden = true;
        }
      }
    });
    document.body.append(panel, settings);
  }

  window.MixBarAnalytics = Object.freeze({
    track,
    decorateCheckoutURL,
    openPreferences() { document.querySelector(".consent-settings")?.click(); },
    get consent() { return { ...consent }; }
  });
  if (consent.decided) applyConsent();
  document.addEventListener("click", trackClick, true);
  document.addEventListener("DOMContentLoaded", () => {
    consentUI();
    refreshCheckoutLinks();
  }, { once: true });
})();
