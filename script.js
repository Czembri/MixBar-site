const config = window.MIXBAR_SITE || {};
const supportEmail = config.supportEmail || "czembri@gmail.com";
const price = config.price || "59.99 PLN";
const sandboxMode = new URLSearchParams(location.search).get("sandbox") === "1";
const checkoutURL = sandboxMode ? config.sandboxCheckoutURL : config.checkoutURL;
const checkoutLinks = document.querySelectorAll(".checkout-link");

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
    link.href = `mailto:${supportEmail}?subject=${encodeURIComponent("Reserve the MixBar launch price")}`;
    link.textContent = `Reserve MixBar — ${price}`;
    link.title = "Checkout is opening soon. Reserve the launch price by email.";
  }
}

if (checkoutURL && config.paymentProvider === "stripe") {
  for (const link of checkoutLinks) {
    link.setAttribute("aria-label", `Buy MixBar securely with Stripe for ${price}`);
  }
}

if (!checkoutURL) {
  const note = document.querySelector(".price-note");
  if (note) note.textContent = `Checkout is opening soon. Reserve the ${price} launch price by email.`;
}

for (const link of document.querySelectorAll(".support-link")) {
  link.href = `mailto:${supportEmail}`;
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
