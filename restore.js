(() => {
  const config = window.MIXBAR_SITE || {};
  const form = document.querySelector("#restore-form");
  const submit = form.querySelector('button[type="submit"]');
  const status = document.querySelector("#restore-status");
  const startedAt = document.querySelector("#restore-started-at");
  const developmentHosts = new Set(config.developmentHosts || []);
  const endpoint = developmentHosts.has(window.location.hostname)
    ? config.sandboxRestoreEndpoint
    : config.restoreEndpoint;
  const siteKey = config.turnstileSiteKey || "";
  const requestedVersion = new URLSearchParams(window.location.search).get("version") || "";
  let turnstileToken = "";
  let widgetID = null;

  const translate = (source) => window.MixBarI18n?.translation(
    source,
    document.documentElement.lang || "en"
  ) || source;

  function showStatus(message, type = "") {
    status.textContent = translate(message);
    status.className = `contact-status ${type}`.trim();
  }

  function resetChallenge() {
    turnstileToken = "";
    submit.disabled = true;
    if (widgetID !== null && window.turnstile) window.turnstile.reset(widgetID);
  }

  function renderChallenge() {
    widgetID = window.turnstile.render("#restore-turnstile", {
      sitekey: siteKey,
      theme: "dark",
      size: "flexible",
      callback(token) {
        turnstileToken = token;
        submit.disabled = false;
        showStatus("");
      },
      "expired-callback": resetChallenge,
      "error-callback"() {
        resetChallenge();
        showStatus("We could not request a download link right now. Please try again shortly.", "error");
      }
    });
  }

  function safeEndpoint() {
    try {
      const url = new URL(endpoint);
      return url.protocol === "https:" ? url.toString() : "";
    } catch (_) {
      return "";
    }
  }

  startedAt.value = String(Date.now());
  const restoreEndpoint = safeEndpoint();
  if (!restoreEndpoint || !siteKey) {
    showStatus("The purchase restore service is temporarily unavailable.", "error");
  } else {
    const turnstileScript = document.createElement("script");
    turnstileScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    turnstileScript.async = true;
    turnstileScript.defer = true;
    turnstileScript.onload = renderChallenge;
    turnstileScript.onerror = () => showStatus("The purchase restore service is temporarily unavailable.", "error");
    document.head.append(turnstileScript);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      showStatus("Please check the highlighted fields and try again.", "error");
      return;
    }
    if (!turnstileToken) {
      showStatus("Please complete the anti-spam check.", "error");
      return;
    }

    submit.disabled = true;
    submit.textContent = translate("Requesting…");
    showStatus("");
    const fields = new FormData(form);
    try {
      const response = await fetch(restoreEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: fields.get("email"),
          company: fields.get("company"),
          startedAt: fields.get("startedAt"),
          version: requestedVersion,
          turnstileToken
        })
      });
      if (!response.ok) {
        showStatus(
          response.status === 429
            ? "Too many requests were sent. Please try again in a minute."
            : "We could not request a download link right now. Please try again shortly.",
          "error"
        );
        resetChallenge();
        return;
      }
      form.reset();
      startedAt.value = String(Date.now());
      showStatus("If that address has an active MixBar purchase, a secure link is on its way.", "success");
      resetChallenge();
    } catch (_) {
      showStatus("We could not request a download link right now. Please try again shortly.", "error");
      resetChallenge();
    } finally {
      submit.textContent = translate("Send secure download link");
    }
  });
})();
