(() => {
  const supportedLanguages = ["en", "pl", "de", "es", "fr"];
  const catalog = window.MIXBAR_TRANSLATIONS || {};

  function normalizedLanguage(value) {
    const language = String(value || "").toLowerCase().split("-")[0];
    return supportedLanguages.includes(language) ? language : null;
  }

  function selectedLanguage() {
    const queryLanguage = normalizedLanguage(new URLSearchParams(location.search).get("lang"));
    if (queryLanguage) return queryLanguage;
    try {
      const savedLanguage = normalizedLanguage(localStorage.getItem("mixbar-language"));
      if (savedLanguage) return savedLanguage;
    } catch (_) {
      // Private browsing can make storage unavailable; browser language remains a safe fallback.
    }
    return normalizedLanguage(navigator.language) || "en";
  }

  function translation(text, language) {
    if (language === "en") return text;
    return catalog[text]?.[language] || text;
  }

  function translateTextNode(node, language) {
    const parentName = node.parentElement?.tagName;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "TEXTAREA"].includes(parentName)) return;
    const match = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match) return;
    const source = match[2].replace(/\s+/g, " ");
    if (!source) return;
    const localized = translation(source, language);
    if (localized !== source) node.nodeValue = `${match[1]}${localized}${match[3]}`;
  }

  function translatePage(language) {
    document.documentElement.lang = language;
    document.title = translation(document.title, language);
    for (const meta of document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]')) {
      meta.content = translation(meta.content, language);
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      translateTextNode(node, language);
    }

    for (const element of document.querySelectorAll("[title], [aria-label], [data-label]")) {
      for (const attribute of ["title", "aria-label", "data-label"]) {
        if (!element.hasAttribute(attribute)) continue;
        const source = element.getAttribute(attribute);
        element.setAttribute(attribute, translation(source, language));
      }
    }
  }

  function preserveLanguageInLinks(language) {
    for (const link of document.querySelectorAll('a[href$=".html"], a[href*=".html?"]')) {
      const original = link.getAttribute("href");
      const url = new URL(original, location.href);
      if (url.origin !== location.origin) continue;
      url.searchParams.set("lang", language);
      link.setAttribute("href", `${url.pathname.split("/").pop()}${url.search}${url.hash}`);
    }
  }

  function addLegalTranslationNotice(language) {
    if (language === "en") return;
    const legal = document.querySelector("main.legal");
    const updated = legal?.querySelector(".updated");
    if (!legal || !updated) return;
    const notice = document.createElement("p");
    notice.className = "translation-notice";
    notice.textContent = translation(
      "This translation is provided for convenience. If its wording differs, the English version controls.",
      language
    );
    updated.insertAdjacentElement("afterend", notice);
  }

  function addLanguageSelector(language) {
    const container = document.createElement("div");
    container.className = "language-picker";
    const label = document.createElement("label");
    label.htmlFor = "site-language";
    label.textContent = translation("Language", language);
    const select = document.createElement("select");
    select.id = "site-language";
    select.setAttribute("aria-label", translation("Choose language", language));
    const names = { en: "English", pl: "Polski", de: "Deutsch", es: "Español", fr: "Français" };
    for (const code of supportedLanguages) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = names[code];
      option.selected = code === language;
      select.append(option);
    }
    select.addEventListener("change", () => {
      try { localStorage.setItem("mixbar-language", select.value); } catch (_) { /* no-op */ }
      const url = new URL(location.href);
      url.searchParams.set("lang", select.value);
      location.assign(url.toString());
    });
    container.append(label, select);
    document.body.append(container);
  }

  const language = selectedLanguage();
  try { localStorage.setItem("mixbar-language", language); } catch (_) { /* no-op */ }
  translatePage(language);
  addLegalTranslationNotice(language);
  preserveLanguageInLinks(language);
  addLanguageSelector(language);
  document.documentElement.classList.add("i18n-ready");

  window.MixBarI18n = { supportedLanguages, normalizedLanguage, translation };
})();
