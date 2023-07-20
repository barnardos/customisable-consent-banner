# Barnardo's consent banner

## Usage

### Option 1: npm install / yarn add

Run `npm install @barnardoswebteam/consent-banner` or `yarn add @barnardoswebteam/consent-banner`.

In your code add the following:

```js
const consentBanner = require('@barnardoswebteam/consent-banner');
consentBanner();
```

And add the GTM container ID in .env or as a config variable as `GTM_CODE`.

Optionally add URLs for your privacy policy and cookie policy in .env as `PRIVACY_URL` and `COOKIE_URL`. If no privacy URL is declared it defaults to https://www.barnardos.org.uk/privacy-notice, and if no cookie URL is declared it defaults to https://www.barnardos.org.uk/cookie-notice.

### Option 2: <abbr title="ECMAScript Module">ESM</a>

In your HTML add the following:

```html
<script type="module" src="main.js"></script>
```
and in main.js:

```js
import consentBanner from './path/to/consent-banner.esm.js';
consentBanner();
```

And add the GTM container ID in .env or as a config variable as `GTM_CODE`.

Optionally add URLs for your privacy policy and cookie policy in .env as `PRIVACY_URL` and `COOKIE_URL`. If no privacy URL is declared it defaults to https://www.barnardos.org.uk/privacy-notice, and if no cookie URL is declared it defaults to https://www.barnardos.org.uk/cookie-notice.

### Option 3: script element in HTML

Put the following near the end of the body element, replacing GTM-XXXXXX with the correct ID.

```html
<script src="path/to/consent-banner.es5.js"></script>
<script>BarnardosConsent({'gtmCode':'GTM-XXXXXX'});</script>
```

Self hosting is recommended but if it's not possible you can use:

```html
<script src="https://unpkg.com/@barnardoswebteam/consent-banner@latest/consent-banner.es5.js"></script>
<script>BarnardosConsent({'gtmCode':'GTM-XXXXXX'});</script>
```

Optionally add URLs for your privacy policy and cookie policy to the code like so:

```html
<script>
BarnardosConsent(
  {
    'gtmCode': 'GTM-XXXXXX',
    'privacyURL': 'https://your-domain/privacy-policy',
    'cookieURL': 'https://your-domain/cookie-policy'
  }
);
</script>
```

Both are optional, and if either it missing they will default to https://www.barnardos.org.uk/privacy-notice and https://www.barnardos.org.uk/cookie-notice respectively.

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
