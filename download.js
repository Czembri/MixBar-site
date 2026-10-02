(() => {
  const config = window.MIXBAR_SITE || {};
  const status = document.querySelector("#download-status");
  const button = document.querySelector("#secure-download");
  const help = document.querySelector("#download-help");
  const search = new URLSearchParams(location.search);
  const sessionID = search.get("session_id");
  const sandboxMode = search.get("sandbox") === "1";
  const fulfillmentURL = sandboxMode ? config.sandboxFulfillmentURL : config.fulfillmentURL;

  if (!sessionID) {
    status.textContent = "This download link is missing its Stripe Checkout Session. Use the link from your payment confirmation or contact support.";
  } else if (!fulfillmentURL) {
    status.textContent = "The secure download service is not live yet. Your payment is safe—contact support and include your Stripe receipt email.";
  } else {
    try {
      const endpoint = new URL(fulfillmentURL);
      if (endpoint.protocol !== "https:" && endpoint.hostname !== "localhost") {
        throw new Error("The fulfillment endpoint must use HTTPS.");
      }
      endpoint.searchParams.set("session_id", sessionID);
      button.href = endpoint.toString();
      button.hidden = false;
      help.hidden = false;
      status.textContent = "Verifying the Stripe payment and starting your MixBar download automatically…";
      window.setTimeout(() => window.location.assign(endpoint.toString()), 650);
    } catch (_) {
      status.textContent = "The secure download service is temporarily unavailable. Contact support and include your Stripe receipt email.";
    }
  }
})();
