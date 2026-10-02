const config = window.MIXBAR_SITE || {};
const price = config.price || "$21 once";
const sandboxMode = new URLSearchParams(location.search).get("sandbox") === "1";
const checkoutLinks = document.querySelectorAll(".checkout-link");
const productionCheckoutFallback = "https://buy.stripe.com/14A4gydeS30BgJf1r51gs01";
const checkoutURL = sandboxMode
  ? config.sandboxCheckoutURL
  : (config.checkoutURL || productionCheckoutFallback);

if (sandboxMode) {
  const banner = document.createElement("aside");
  banner.className = "sandbox-banner";
  banner.setAttribute("role", "status");
  banner.textContent = "Stripe test mode — use a Stripe test card. No real payment will be collected.";
  document.body.prepend(banner);
}

for (const link of checkoutLinks) {
  if (checkoutURL) {
    link.href = checkoutURL;
    link.rel = "noopener";
    link.target = "_blank";
  } else {
    link.href = "#pricing";
    link.removeAttribute("target");
    link.setAttribute("aria-disabled", "true");
    link.title = "Checkout is temporarily unavailable.";
  }
}

if (checkoutURL && config.paymentProvider === "stripe") {
  for (const link of checkoutLinks) {
    link.setAttribute("aria-label", `Buy MixBar securely with Stripe for ${price}`);
  }
}

if (!checkoutURL) {
  const note = document.querySelector(".price-note");
  if (note) note.textContent = "Checkout is temporarily unavailable. Please try again shortly.";
}

document.querySelector("#year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}
