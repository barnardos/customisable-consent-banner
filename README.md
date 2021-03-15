# Barnardo's consent banner

## Usage

Cloning this repo as a git submodule is recommended. A .gitignore can be used inside the submodule to prevent deploying unwanted files.

### Option 1: script element in HTML

Put the following near the end of the body element, replacing GTM-XXXXXX with the correct ID.

```html
<script src="path/to/consent-banner.es5.js"></script>
<script>BarnardosConsent({'gtmCode':'GTM-XXXXXX'});</script>
```

### Option 2: <abbr title="ECMAScript Module">ESM</a>

Import consent-banner.esm.js, replacing GTM-XXXXXX in gtm.esm.js with the correct ID.

```html
<script type="module" src="main.js"></script>
```

```js
import consentBanner from './path/to/consent-banner.esm.js';
consentBanner();
```

### Option 3: npm install

run `npm install barnardos-consent-banner`
