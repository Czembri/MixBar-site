(() => {
  const config = window.MIXBAR_SITE || {};
  const form = document.querySelector("#contact-form");
  const submit = form.querySelector('button[type="submit"]');
  const status = document.querySelector("#contact-status");
  const startedAt = document.querySelector("#contact-started-at");
  const endpoint = config.contactEndpoint || "";
  const siteKey = config.turnstileSiteKey || "";
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
    widgetID = window.turnstile.render("#contact-turnstile", {
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
        showStatus("We could not send your message right now. Please try again shortly.", "error");
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
  const contactEndpoint = safeEndpoint();
  if (!contactEndpoint || !siteKey) {
    showStatus("The contact form is temporarily unavailable.", "error");
  } else {
    const turnstileScript = document.createElement("script");
    turnstileScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    turnstileScript.async = true;
    turnstileScript.defer = true;
    turnstileScript.onload = renderChallenge;
    turnstileScript.onerror = () => showStatus("The contact form is temporarily unavailable.", "error");
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
    submit.textContent = translate("Sending…");
    showStatus("");
    const fields = new FormData(form);
    const payload = {
      name: fields.get("name"),
      email: fields.get("email"),
      subject: fields.get("subject"),
      message: fields.get("message"),
      company: fields.get("company"),
      startedAt: fields.get("startedAt"),
      language: document.documentElement.lang || "en",
      turnstileToken
    };

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        showStatus(
          response.status === 429
            ? "Too many messages were sent. Please try again in a minute."
            : "We could not send your message right now. Please try again shortly.",
          "error"
        );
        resetChallenge();
        return;
      }

      form.reset();
      startedAt.value = String(Date.now());
      showStatus("Thanks — your message has been sent.", "success");
      resetChallenge();
    } catch (_) {
      showStatus("We could not send your message right now. Please try again shortly.", "error");
      resetChallenge();
    } finally {
      submit.textContent = translate("Send message");
    }
  });
})();
