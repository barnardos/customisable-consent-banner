//common options routines
function check(options) {
  let i = 1,
    found = {},
    key;
  while ((key = arguments[i])) {
    const snakeCapsKey = key.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
    if (options[key]) {
      return options[key];
    }
    if (process.env[snakeCapsKey]) {
      return process.env[snakeCapsKey];
    }
    i++;
  }
  return null;
}

const set_static_defaults = (options, defaults) => {
  Object.keys(defaults).forEach((key) => {
    options[key] = check(options, key) || defaults[key];
  });
  return options;
};

// Compatibility function, use this as entry point
// if Barnardos banner default content is required
const barnardosConsent = (options) => {
  const gtmCode = check(options, "gtmCode");
  if (!gtmCode) {
    return;
  }
  set_static_defaults(options, {
    privacyURL: "https://www.barnardos.org.uk/privacy-notice",
    cookieURL: "https://www.barnardos.org.uk/cookie-notice",
    bannerHeading: "Cookie tracking preference",
    styleContent:
      "._barnardos-cookie-overlay{z-index:3;position:fixed;top:0;left:0;width:100%;height:100%;background-color: rgba(0,0,0,0.7);}._barnardos-consent-banner {background-color:#fff;padding:0.5rem 1rem 1rem;position:fixed;top:10%;right:5%;bottom:10%;left:5%;z-index:4;overflow-y:scroll}@media screen and (min-width:360px) and (min-height:600px){._barnardos-consent-banner {top:50%;left:50%;bottom:30%;width:90%;max-width:36rem;transform:translate(-50%,-50%);bottom:auto}}._barnardos-consent-banner:focus{outline:none}._barnardos-consent-banner h2 {margin-right:2rem}._barnardos-consent-banner p {display:inline-block;margin:0.5rem 0 1.5rem;vertical-align:middle}._barnardos-consent-banner div{display:inline-block;white-space:nowrap}._barnardos-consent-banner button {appearance: none; background-color: #558200; border: 1px solid #558200; border-radius: 0; color: #fff; display: inline-block; font-size: 1.125rem; font-weight: 800; letter-spacing: 0; line-height: 1.5rem; padding: 0.5rem 2rem; text-align: center; user-select: none; vertical-align: middle; white-space: nowrap; margin:0 1em 0 0;}._barnardos-consent-banner button:hover, ._barnardos-consent-banner button:focus { background-color: #192700; border-color: #192700; }._barnardos-consent-banner a {text-decoration:underline}._barnardos-consent-banner ._barnardos-cookie-close{position:absolute;right:0;top:0;margin:0;line-height:1;padding:0.5rem}",
  });
  //dynamic defaults
  options.bannerContent =
    check(options, bannerContent) ||
    `We use cookies to improve your experience on our site, show you personalised marketing and information and to help us understand how you use the site. By pressing accept, you agree to us storing those cookies on your device. By pressing reject, you refuse the use of all cookies except those that are essential to the running of our website. See our <a href="${options.privacyURL}">privacy policy</a> and <a href="${options.cookieURL}">cookie notice</a> for more details.`;
  barnardosCustomConsent(options);
};

// new entry point without Barnardos default content
const barnardosCustomConsent = (options) => {
  const missingMandatoryOptions =
    "bannerHeading bannerContent"
      .split(" ")
      .map((option) => (check(options, option) ? "" : option))
      .filter((option) => option.length)
      .join(",") + check(options, "useExternalStylesheet", "styleContent")
      ? ""
      : ",styleContent";

  if (missingMandatoryOptions.length) {
    console.warn("missing mandatory options:", missingMandatoryOptions);
    return;
  }

  set_static_defaults(options, {
    buttonClass: "_barnardos-consent-banner__button",
    buttonElement: "button",
    closeButtonContent: "&#x2715;",
    closeButtonClass: "_barnardos-cookie-close",
    closeButtonElement: "button",
    restrictDomain: ".barnardos.org.uk",
  });

  let scripts = check(options, "additionalScripts");

  const getCookieValue = (name) => {
    const result = document.cookie.match(
      `(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`,
    );
    return result ? result.pop() : "";
  };

  const setCookieValue = function (name, value) {
    var days = arguments[2] || 365;
    var expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie =
      name +
      "=" +
      value +
      "; expires=" +
      expires +
      (options.restrictDomain != "*"
        ? ";domain=" + options.restrictDomain
        : "") +
      "; path=/; SameSite=Strict";
  };

  // Build a button
  const buildButton = function (text) {
    const content = arguments[1];
    const button = document.createElement(options.buttonElement);
    switch (options.buttonElement) {
      case "button":
        button.type = "button";
      case "a":
        button.setAttribute("href", "#");
    }
    button.id = text.toLowerCase();
    button.innerHTML = text + (content || "");
    button.className = options.buttonClass;
    return button;
  };

  // Create the two buttons and a placeholder for the banner
  const consentBanner = document.createElement("div");
  var rejectButton = buildButton("Reject", options.buttonContent);
  var acceptButton = buildButton("Accept", options.buttonContent);
  const cookieOverlay = document.createElement("div");
  const closeButton = document.createElement(options.closeButtonElement);
  if (options.buttonElement == "a") {
    closeButton.setAttribute("href", "#");
  }
  // Build the banner
  const buildBanner = () => {
    cookieOverlay.className = "_barnardos-cookie-overlay";
    cookieOverlay.id = "overlay";
    consentBanner.className = "_barnardos-consent-banner";
    consentBanner.setAttribute("role", "dialog");
    consentBanner.setAttribute("aria-modal", "true");
    consentBanner.setAttribute("aria-labelledby", "dialog-title");
    consentBanner.setAttribute("aria-describedby", "dialog-description");
    consentBanner.setAttribute("tabindex", "-1");
    closeButton.id = "close";
    closeButton.className = options.closeButtonClass;
    closeButton.setAttribute("aria-label", "Close cookie tracking preference");
    closeButton.innerHTML = options.closeButtonContent;
    const heading = document.createElement("h2");
    heading.textContent = options.bannerHeading;
    heading.className = "_barnardos-cookie-heading";
    heading.id = "dialog-title";
    const text = document.createElement("p");
    text.id = "dialog-description";
    text.innerHTML = options.bannerContent;
    if (!options.useExternalStylesheet) {
      const style = document.createElement("style");
      style.textContent = options.styleContent;
      consentBanner.appendChild(style);
    }
    consentBanner.appendChild(heading);
    consentBanner.appendChild(text);
    const buttonWrap = document.createElement("div");
    buttonWrap.appendChild(rejectButton);
    buttonWrap.appendChild(acceptButton);
    consentBanner.appendChild(buttonWrap);
    consentBanner.appendChild(closeButton);
    // Put first in the DOM so keyboard and AT users can interact with it quickly
    const { firstChild } = document.body;
    firstChild.parentNode.insertBefore(consentBanner, firstChild);
    consentBanner.parentNode.insertBefore(cookieOverlay, consentBanner);
    // Get the focusable elements and focus the cookie notice
    const focusableElements = consentBanner.querySelectorAll("a, button");
    const focusableElementsArray = [].slice.call(focusableElements);
    const firstFocusableElement = focusableElementsArray[0];
    const lastFocusableElement =
      focusableElementsArray[focusableElementsArray.length - 1];
    consentBanner.focus();
  };

  // Close consent banner
  const closeConsentBanner = () => {
    consentBanner.parentNode.removeChild(consentBanner);
    cookieOverlay.parentNode.removeChild(cookieOverlay);
    setCookieValue("consentBanner", "closed");
  };

  // Load the scripts and trackers
  options.gtmCode &&
    (scripts = scripts || []).push({
      // GTM script using the minified code GTM gives us
      name: "GTM",
      script: (w, d, s, l, i) => {
        w[l] = w[l] || [];
        w[l].push({
          "gtm.start": new Date().getTime(),
          event: "gtm.js",
        });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s);
        const dl = l != "dataLayer" ? `&l=${l}` : "";
        j.async = true;
        j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
        f.parentNode.insertBefore(j, f);
      },
      args: [window, document, "script", "dataLayer", options.gtmCode],
    });
  if (!scripts) {
    return;
  }

  var loadScripts = function () {
    scripts.forEach(function (script) {
      script.script(...script.args);
    });

    // Add acceptance to cookie so we can load the trackers and scripts with subsequent page views
    setCookieValue("consentAction", "accept");
  };

  // Create a YYYY-MM date format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    return `${year}-${month}`;
  };

  const handleForwardTab = function (e) {
    if (document.activeElement === lastFocusableElement) {
      e.preventDefault();
      firstFocusableElement.focus();
    }
  };

  const handleBackwardTab = function (e) {
    if (document.activeElement === firstFocusableElement) {
      e.preventDefault();
      lastFocusableElement.focus();
    }
  };

  if (getCookieValue("consentBanner") !== "closed") {
    // Check if the banner has been loaded and if not send a session load to the counter
    if (sessionStorage.consentBannerSessionLoad !== "loaded") {
      sessionStorage.consentBannerSessionLoad = "loaded";
    }
    buildBanner();
  }

  // If cookies are previously accepted run the function to load the trackers and scripts
  if (getCookieValue("consentAction") === "accept") {
    loadScripts();
  }

  // Listeners
  if (rejectButton) {
    rejectButton.addEventListener("click", (e) => {
      closeConsentBanner();
    });
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", (e) => {
      closeConsentBanner();
      loadScripts();
      options.reloadOnAccept && location.reload();
    });
  }

  if (cookieOverlay) {
    cookieOverlay.addEventListener("click", (e) => {
      closeConsentBanner();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", (e) => {
      closeConsentBanner();
    });
  }

  if (consentBanner) {
    consentBanner.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Tab":
          if (e.shiftKey) {
            handleBackwardTab(e);
          } else {
            handleForwardTab(e);
          }
          break;
        case "Escape":
          closeConsentBanner();
          break;
        default:
          break;
      }
    });
  }
};

barnardosConsent.custom = barnardosCustomConsent;
module.exports = barnardosConsent;
