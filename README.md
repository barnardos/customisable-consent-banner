# Barnardo's consent banner

## Usage

### Option 1: npm install / yarn add

Run `npm install @barnardoswebteam/customisable-consent-banner` or `yarn add @barnardoswebteam/customisable-consent-banner`.

For the standard consent banner, in your code add the following:

```js
const consentBanner = require("@barnardoswebteam/consent-banner");
consentBanner();
```

And add the GTM container ID in .env or as a config variable as `GTM_CODE`.

You can customise the standard consent banner by passing options, either in .env in block-caps snake case, or as camelCase config variables in an options hash.

- PRIVACY_URL: URL for your privacy policy. Defaults to https://www.barnardos.org.uk/privacy-notice.
- COOKIE_URL: URL for your cookie policy. Defaults to https://www.barnardos.org.uk/cookie-notice.
- BANNER_HEADING: Heading text for the consent banner. Defaults to "Cookie tracking preferences".
- BANNER_CONTENT: Custom text content (but not buttons)
- CLOSE_BUTTON_CONTENT: Custom text or an svg for the close button. Defaults to "&#x2715;".
- ADDITIONAL_SCRIPTS: An array of additional tracking scripts to be ran when the consent banner is accepted. If you have other scripts to use instead, GTM_CODE is optional and omitting it will prevent the banner attempting to load GTM scripts. Scripts are described by JSON objects with the properties name (arbitrary, for your reference), script (a function to execute), and args (an array of arguments to pass when the script is accepted). Defaults to none.
- RESTRICT_DOMAIN: defaults to `'.barnardos.org.uk'` but you can use this to set another domain, or if set to the string `*` it will allow the banner to be shown on any domain.
- RELOAD_ON_ACCEPT: set this to `true` to set the cookie and then reload the page if you have scripts which cannot be provided above for architectural reasons, and which have loaded with defaults that cannot be easily toggled at run time. Defaults to `false`.
- STYLE_CONTENT: Custom styles for the consent banner. Defaults to those outlined in `consent-banner.template.css` in the package. You can copy this template to help you customise the styles.
- USE_EXTERNAL_STYLESHEET: use this instead of STYLE_CONTENT to link to an external stylesheet provied by your application. You can copy the template above to your own stylesheet to help you customise the styles.
- BUTTON_ELEMENT: If you are using your own stylesheet you may prefer to use a different element for the accept/reject buttons. Defaults to "button".
- BUTTON_CONTENT: Use this to add HTML content such as an SVG icon after the Accept/Reject button text. Defaults to none.
- BUTTON_CLASS: If you are using your own stylesheet you may prefer your own class name for the button styling. Defaults to "\_barnardos-consent-banner\_\_button".
- CLOSE_BUTTON_ELEMENT: If you are using your own stylesheet you may prefer to use a different element for the close button. Defaults to "button".
- CLOSE_BUTTON_CLASS: If you are using your own stylesheet you may prefer your own class name for the close button styling. Defaults to "\_barnardos-cookie-close".

If you have extensively customised the styles and the banner content, you can reduce the size of your JavaScript by bypassing the `ConsentBanner` wrapper (`barnardosConsent` if using es5) and calling `ConsentBanner.Custom` (or `barnardosCustomConsent` if using es5) directly to avoid loading the redundant default styles and content.

### Option 2: <abbr title="ECMAScript Module">ESM</a>

For the standard consent banner, in your HTML add the following:

```html
<script type="module" src="main.js"></script>
```

and in main.js:

```js
import consentBanner from "./path/to/consent-banner.esm.js";
consentBanner();
```

And add the GTM container ID in .env or as a config variable as `GTM_CODE`.

You can customise the standard consent banner by passing options, either in .env in block-caps snake case, or as camelCase config variables in an options hash. See Option 1 above for option syntax.

### Option 3: script element in HTML

For the standard consent banner, put the following near the end of the body element, replacing GTM-XXXXXX with the correct ID.

```html
<script src="path/to/consent-banner.es5.js"></script>
<script>
  BarnardosConsent({ gtmCode: "GTM-XXXXXX" });
</script>
```

Self hosting is recommended ~~but if it's not possible you can use:~~

~~```html

<script src="https://unpkg.com/@barnardoswebteam/consent-banner@latest/consent-banner.es5.js"></script>
<script>BarnardosConsent({'gtmCode':'GTM-XXXXXX'});</script>

````~~

You can customise the standard consent banner by passing camelCase config variables in an options hash. See Option 1 above for option syntax. For example:

```html
<script>
BarnardosConsent(
  {
    'gtmCode': 'GTM-XXXXXX',
    'privacyURL': 'https://your-domain/privacy-policy',
    'cookieURL': 'https://your-domain/cookie-policy',
    'bannerHeading': 'Your custom heading',
    'useExternalStylesheet': true
  }
);
</script>
````

### Updating

Cloning this repo as a git submodule is recommended if not using NPM or Yarn. Watch this repository and run `git pull` from inside the submodule directory when there are changes. Otherwise watch this repository and perform manual updates.

Steps for creating a git submodule:

1. `cd` to the directory the submodule will live.
2. Type `git submodule add -b main git@github.com:barnardos/consent-banner.git` and press <kbd>enter</kbd> to add the submodule.
3. Type `git submodule init` and press <kbd>enter</kbd>.
4. `cd` out of the submodule into the parent repository.
5. Add and commit the new files to the parent repository.

## Safari and Firefox

Safari and Firefox now both delete scripted storage fairly quickly. In Safari's case it can be 24 hours. Therefore the consent banner is shown on repeat visits, which is making the banner even more annoying than it already is.

Therefore it's recommended re-setting the appropriate cookies with the server-side language of your choice, with a 1 year expiration. This has been cleared by the Barnardo's Head of Information Governance and Data Protection Officer.
