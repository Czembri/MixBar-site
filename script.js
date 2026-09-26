const config = window.MIXBAR_SITE || {};
const supportEmail = config.supportEmail || "czembri@gmail.com";
const price = config.price || "$19";
const checkoutLinks = document.querySelectorAll(".checkout-link");

for (const link of checkoutLinks) {
  if (config.checkoutURL) {
    link.href = config.checkoutURL;
    link.rel = "noopener";
    if (config.paymentProvider === "lemonsqueezy") {
      link.classList.add("lemonsqueezy-button");
    } else {
      link.target = "_blank";
    }
  } else {
    link.href = `mailto:${supportEmail}?subject=${encodeURIComponent("Reserve the MixBar launch price")}`;
    link.textContent = `Reserve MixBar — ${price}`;
    link.title = "Checkout is opening soon. Reserve the launch price by email.";
  }
}

// Lemon Squeezy's overlay is loaded only after a real checkout URL is set.
// The links remain normal hosted-checkout links if the overlay cannot load.
if (config.checkoutURL && config.paymentProvider === "lemonsqueezy") {
  const checkoutScript = document.createElement("script");
  checkoutScript.src = "https://app.lemonsqueezy.com/js/lemon.js";
  checkoutScript.defer = true;
  document.head.append(checkoutScript);
}

if (!config.checkoutURL) {
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
