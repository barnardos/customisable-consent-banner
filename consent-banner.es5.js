"use strict";
// Compatibility function, use this as entry point
// if Barnardos banner default content is required
window.BarnardosConsent = function (options) {
  if (!options.gtmCode) {
    return;
  }
  var static_defaults = {
    privacyURL: "https://www.barnardos.org.uk/privacy-notice",
    cookieURL: "https://www.barnardos.org.uk/cookie-notice",
    bannerHeading: "Cookie tracking preference",
    styleContent:
      "._barnardos-cookie-overlay{z-index:3;position:fixed;top:0;left:0;width:100%;height:100%;background-color: rgba(0,0,0,0.7);}._barnardos-consent-banner {background-color:#fff;padding:0.5rem 1rem 1rem;position:fixed;top:10%;right:5%;bottom:10%;left:5%;z-index:4;overflow-y:scroll}@media screen and (min-width:360px) and (min-height:600px){._barnardos-consent-banner {top:50%;left:50%;bottom:30%;width:90%;max-width:36rem;transform:translate(-50%,-50%);bottom:auto}}._barnardos-consent-banner:focus{outline:none}._barnardos-consent-banner h2 {margin-right:2rem}._barnardos-consent-banner p {display:inline-block;margin:0.5rem 0 1.5rem;vertical-align:middle}._barnardos-consent-banner div{display:inline-block;white-space:nowrap}._barnardos-consent-banner button {appearance: none; background-color: #558200; border: 1px solid #558200; border-radius: 0; color: #fff; display: inline-block; font-size: 1.125rem; font-weight: 800; letter-spacing: 0; line-height: 1.5rem; padding: 0.5rem 2rem; text-align: center; user-select: none; vertical-align: middle; white-space: nowrap; margin:0 1em 0 0;}._barnardos-consent-banner button:hover, ._barnardos-consent-banner button:focus { background-color: #192700; border-color: #192700; }._barnardos-consent-banner a {text-decoration:underline}._barnardos-consent-banner ._barnardos-cookie-close{position:absolute;right:0;top:0;margin:0;line-height:1;padding:0.5rem}",
  };
  Object.keys(static_defaults).forEach((key) => {
    options[key] = options[key] || static_defaults[key];
  });
  //dynamic defaults
  options.bannerContent =
    options.bannerContent ||
    `We use cookies to improve your experience on our site, show you personalised marketing and information and to help us understand how you use the site. By pressing accept, you agree to us storing those cookies on your device. By pressing reject, you refuse the use of all cookies except those that are essential to the running of our website. See our <a href="${options.privacyURL}">privacy policy</a> and <a href="${options.cookieURL}">cookie notice</a> for more details.`;
  barnardosCustomConsent(options);
};

// new entry point without Barnardos default content
function barnardosCustomConsent(options) {
  var missingMandatoryOptions = "missing mandatory options";
  "bannerHeading bannerContent"
    .split(" ")
    .forEach(
      (option) =>
        (missingMandatoryOptions += options[option] ? "" : `, ${option}`),
    );

  missingMandatoryOptions +=
    options.useExternalStylesheet || options.styleContent
      ? ""
      : ",styleContent";

  if (missingMandatoryOptions != "missing mandatory options") {
    console.warn(missingMandatoryOptions);
    return;
  }

  var static_defaults = {
    buttonClass: "_barnardos-consent-banner__button",
    buttonElement: "button",
    closeButtonContent: "&#x2715;",
    closeButtonClass: "_barnardos-cookie-close",
  };
  Object.keys(static_defaults).forEach((key) => {
    options[key] = options[key] || static_defaults[key];
  });

  var scripts = options.additionalScripts;

  var getCookieValue = function (name) {
    var result = document.cookie.match(
      "(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)",
    );
    return result ? result.pop() : "";
  };

  // Build a button
  var buildButton = function (text) {
    var button = document.createElement(options.buttonElement);
    switch (options.buttonElement) {
      case "button":
        button.type = "button";
      case "a":
        button.setAttribute("href", "#");
    }
    button.id = text.toLowerCase();
    button.textContent = text;
    button.className = options.buttonClass;
    return button;
  };

  // Create the two buttons and a placeholder for the banner
  var consentBanner = document.createElement("div");
  var rejectButton = buildButton("Reject");
  var acceptButton = buildButton("Accept");
  var cookieOverlay = document.createElement("div");
  var closeButton = document.createElement(options.buttonElement);
  if (options.buttonElement == "a") {
    closeButton.setAttribute("href", "#");
  }

  // Build the banner
  var buildBanner = function () {
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
    var heading = document.createElement("h2");
    heading.textContent = options.bannerHeading;
    heading.className = "_barnardos-cookie-heading";
    heading.id = "dialog-title";
    var text = document.createElement("p");
    text.id = "dialog-description";
    text.innerHTML = options.bannerContent;
    if (!options.useExternalStylesheet) {
      const style = document.createElement("style");
      style.textContent = options.styleContent;
      consentBanner.appendChild(style);
    }
    consentBanner.appendChild(heading);
    consentBanner.appendChild(text);
    var buttonWrap = document.createElement("div");
    buttonWrap.appendChild(rejectButton);
    buttonWrap.appendChild(acceptButton);
    consentBanner.appendChild(buttonWrap);
    consentBanner.appendChild(closeButton);
    // Put first in the DOM so keyboard and AT users can interact with it quickly
    var firstChild = document.body.firstChild;
    firstChild.parentNode.insertBefore(consentBanner, firstChild);
    consentBanner.parentNode.insertBefore(cookieOverlay, consentBanner);
    // Get the focusable elements and focus the cookie notice
    var focusableElements = consentBanner.querySelectorAll("a, button");
    var focusableElementsArray = Array.prototype.slice.call(focusableElements);
    var firstFocusableElement = focusableElementsArray[0];
    var lastFocusableElement =
      focusableElementsArray[focusableElementsArray.length - 1];
    consentBanner.focus();
  };

  // Close consent banner
  var closeConsentBanner = function () {
    consentBanner.parentNode.removeChild(consentBanner);
    cookieOverlay.parentNode.removeChild(cookieOverlay);
    var expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie =
      "consentBanner=closed; expires=" +
      expires +
      ";domain=.barnardos.org.uk; path=/; SameSite=Strict";
  };

  // Load the scripts and trackers
  options.gtmCode &&
    (scripts = scripts || []).push({
      // GTM script using the minified code GTM gives us
      name: "GTM",
      script: function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
          "gtm.start": new Date().getTime(),
          event: "gtm.js",
        });
        var f = d.getElementsByTagName(s)[0];
        var j = d.createElement(s);
        var dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
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
    // Add acceptance to cookie so we can load the
    // Trackers and scripts with subsequent page views
    var expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie =
      "consentAction=accept; expires=" +
      expires +
      ";domain=.barnardos.org.uk; path=/; SameSite=Strict";
  };

  // Create a YYYY-MM date format
  var formatDate = function (timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return year + "-" + month;
  };

  var handleForwardTab = function (e) {
    if (document.activeElement === lastFocusableElement) {
      e.preventDefault();
      firstFocusableElement.focus();
    }
  };

  var handleBackwardTab = function (e) {
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

  // If cookies are previously accepted run the function
  // To load the trackers and scripts
  if (getCookieValue("consentAction") === "accept") {
    loadScripts();
  }

  // Listeners
  if (rejectButton) {
    rejectButton.addEventListener("click", function (e) {
      closeConsentBanner();
    });
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", function (e) {
      closeConsentBanner();
      loadScripts();
      options.reloadOnAccept && location.reload();
    });
  }

  if (cookieOverlay) {
    cookieOverlay.addEventListener("click", function (e) {
      closeConsentBanner();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function (e) {
      closeConsentBanner();
    });
  }

  if (consentBanner) {
    consentBanner.addEventListener("keydown", function (e) {
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
}
