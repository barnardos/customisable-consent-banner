'use strict';

window.BarnardosConsent = function(options) {
  if (!options.gtmCode) {
    return;
  }

  var gtmCode = options.gtmCode;

  var getCookieValue = function(name) {
    var result = document.cookie.match(
      '(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)'
    );
    return result ? result.pop() : '';
  };

  // Build a button
  var buildButton = function(text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.id = text.toLowerCase();
    button.textContent = text;
    button.className = '_barnardos-consent-banner__button';
    return button;
  };

  // Create the two buttons and a placeholder for the banner
  var consentBanner = document.createElement('div');
  var rejectButton = buildButton('Reject');
  var acceptButton = buildButton('Accept');
  var cookieOverlay = document.createElement("div");
  var closeButton = document.createElement("button");

  // Build the banner
  var buildBanner = function() {    
    cookieOverlay.className = "_barnardos-cookie-overlay";
    cookieOverlay.id = "overlay";
    consentBanner.className = '_barnardos-consent-banner';    
    consentBanner.setAttribute("role", "dialog");
    consentBanner.setAttribute("aria-modal", "true");
    consentBanner.setAttribute("aria-labelledby", "dialog-title");
    consentBanner.setAttribute("aria-describedby", "dialog-description");
    consentBanner.setAttribute("tabindex", "-1");    
    closeButton.id = "close";
    closeButton.className = "_barnardos-cookie-close";
    closeButton.setAttribute("aria-label", "Close cookie tracking preference");
    closeButton.innerHTML = "&#x2715;";
    var heading = document.createElement("h2");
    heading.textContent = "Cookie tracking preference";
    heading.className = "_barnardos-cookie-heading";
    heading.id = "dialog-title";
    var text = document.createElement('p');
    text.id = "dialog-description";
    text.innerHTML = 'We use cookies to improve your experience on our site, show you personalised marketing and information and to help us understand how you use the site. By pressing accept, you agree to us storing those cookies on your device. By pressing reject, you refuse the use of all cookies except those that are essential to the running of our website. See our <a href="https://www.barnardos.org.uk/privacy-notice">privacy policy</a> and <a href="https://www.barnardos.org.uk/cookie-notice">cookie notice</a> for more details.';
    var style = document.createElement('style');
    style.textContent = "._barnardos-cookie-overlay{z-index:3;position:fixed;top:0;left:0;width:100%;height:100%;background-color: rgba(0,0,0,0.7);}._barnardos-consent-banner {background-color:#fff;padding:0.5rem 1rem 1rem;position:fixed;top:50%;left:50%;width:90%;max-width:36rem;transform:translate(-50%,-50%);z-index:4}._barnardos-consent-banner:focus{outline:none}.cooke-policy h2 {margin-right:2rem}._barnardos-consent-banner p {display:inline-block;margin:0.5rem 0 1.5rem;vertical-align:middle}._barnardos-consent-banner div{display:inline-block;white-space:nowrap}._barnardos-consent-banner button {margin:0 1em 0 0;}._barnardos-consent-banner a {text-decoration:underline}._barnardos-consent-banner ._barnardos-cookie-close{position:absolute;right:0;top:0;margin:0;line-height:1;padding:0.5rem}";
    consentBanner.appendChild(style);
    consentBanner.appendChild(heading);
    consentBanner.appendChild(text);
    var buttonWrap = document.createElement('div');
    buttonWrap.appendChild(rejectButton);
    buttonWrap.appendChild(acceptButton);
    consentBanner.appendChild(buttonWrap);
    consentBanner.appendChild(closeButton);
    // Put first in the DOM so keyboard and AT users can interact with it quickly
    var { firstChild } = document.body;
    firstChild.parentNode.insertBefore(consentBanner, firstChild);
    consentBanner.parentNode.insertBefore(cookieOverlay, consentBanner);
    // Get the focusable elements and focus the cookie notice
    var focusableElements = consentBanner.querySelectorAll("a, button");
    var focusableElementsArray = Array.from(focusableElements);
    var firstFocusableElement = focusableElementsArray[0];
    var lastFocusableElement =
      focusableElementsArray[focusableElementsArray.length - 1];
    consentBanner.focus();
  };

  // Close consent banner
  var closeConsentBanner = function() {
    consentBanner.parentNode.removeChild(consentBanner);
    cookieOverlay.parentNode.removeChild(cookieOverlay);
    var expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie =
      'consentBanner=closed; expires=' +
      expires +
      ';domain=.barnardos.org.uk; path=/; SameSite=Strict';
  };

  // Load the scripts and trackers
  // Using the minified code GTM gives us
  var loadScripts = function(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s);
    var dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
    // Add acceptance to cookie so we can load the
    // Trackers and scripts with subsequent page views
    var expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie =
      'consentAction=accept; expires=' +
      expires +
      ';domain=.barnardos.org.uk; path=/; SameSite=Strict';
  };

  // Create a YYYY-MM date format
  var formatDate = function(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    return year + '-' + month;
  };

  // Send a POST request to a click tracker
  var sendClickAction = function(button) {
    // Make a UNIX timestamp
    var time = Math.round(new Date().getTime() / 1000);
    var date = formatDate(time);
    // Build an object to send as JSON
    var obj = {
      time: time,
      date: date,
      value: button.id,
      subdomain: location.hostname.split('.')[0]
    };
    // Send the object
    if (window.XMLHttpRequest) {
      var request = new XMLHttpRequest();
      var url =
        'https://barnardos-cors-anywhere.herokuapp.com/https://cookie-banner-click-counter.herokuapp.com/ajax-accept.php';
      request.open('POST', url, true);
      request.setRequestHeader('Content-type', 'application/json');
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status !== 200) {
            console.error('Error sending data to click action tracker');
          }
        }
      };
      request.send(JSON.stringify(obj));
    }
  };

  // Send a banner load event to the counter
  var sendLoad = function() {
    // Make a UNIX timestamp
    var time = Math.round(new Date().getTime() / 1000);
    var date = formatDate(time);
    // Build an object to send as JSON
    var obj = {
      time: time,
      date: date
    };
    // Send the object
    if (window.XMLHttpRequest) {
      var request = new XMLHttpRequest();
      var url =
        "https://barnardos-cors-anywhere.herokuapp.com/https://cookie-banner-click-counter.herokuapp.com/ajax-load-accept.php";
      request.open("POST", url, true);
      request.setRequestHeader("Content-type", "application/json");
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status !== 200) {
            console.error("Error sending data to click action tracker");
          }
        }
      };
      request.send(JSON.stringify(obj));
    }
  };

  var handleForwardTab = function(e) {
    if (document.activeElement === lastFocusableElement) {
      e.preventDefault();
      firstFocusableElement.focus();
    }
  };

  var handleBackwardTab = function(e) {
    if (document.activeElement === firstFocusableElement) {
      e.preventDefault();
      lastFocusableElement.focus();
    }
  };

  if (getCookieValue('consentBanner') !== 'closed') {
    // Check if the banner has been loaded and if not send a session load to the counter
    if (sessionStorage.consentBannerSessionLoad !== "loaded") {
      sendLoad();
      sessionStorage.consentBannerSessionLoad = "loaded";
    }
    buildBanner();
  }

  // If cookies are previously accepted run the function
  // To load the trackers and scripts
  if (getCookieValue('consentAction') === 'accept') {
    loadScripts(window, document, 'script', 'dataLayer', gtmCode);
  }

  // Listeners
  if (rejectButton) {
    rejectButton.addEventListener('click', function(e) {
      closeConsentBanner();
      sendClickAction(e.target);
    });
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', function(e) {
      closeConsentBanner();
      loadScripts(window, document, 'script', 'dataLayer', gtmCode);
      sendClickAction(e.target);
    });
  }

  if (cookieOverlay) {
    cookieOverlay.addEventListener("click", function(e) {
      closeConsentBanner();
      sendClickAction(e.target);
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function(e) {
      closeConsentBanner();
      sendClickAction(e.target);
    });
  }

  if (consentBanner) {
    consentBanner.addEventListener("keydown", function(e) {
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
