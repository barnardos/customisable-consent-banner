# Barnardo's consent banner

## Usage

### Option 1: npm install / yarn add

Run `npm install @barnardoswebteam/consent-banner` or `yarn add @barnardoswebteam/consent-banner`.

In your code add the following:

```js
const consentBanner = require('@barnardoswebteam/consent-banner');
consentBanner();
```

And add the GMT container ID in .env or as a config variable as `GTM_CODE`.

### Option 2: <abbr title="ECMAScript Module">ESM</a>

Import consent-banner.esm.js, replacing GTM-XXXXXX in gtm.esm.js with the correct ID.

In your HTML add the following:

```html
<script type="module" src="main.js"></script>
```
and in main.js:

```js
import consentBanner from './path/to/consent-banner.esm.js';
consentBanner();
```

Finally add the GTM container ID to gtm.esm.js, replacing `GTM-XXXXXX`.

### Option 3: script element in HTML

Put the following near the end of the body element, replacing GTM-XXXXXX with the correct ID.

```html
<script src="path/to/consent-banner.es5.js"></script>
<script>BarnardosConsent({'gtmCode':'GTM-XXXXXX'});</script>
```

Self hosting is recommended but if it's not possible you can use:

```html
<script src="https://unpkg.com/@barnardoswebteam/consent-banner@0.0.7/consent-banner.node.js"></script>
<script>BarnardosConsent({'gtmCode':'GTM-XXXXXX'});</script>
```

### Updating

Cloning this repo as a git submodule is recommended if not using NPM or Yarn. Watch this repository and run `git pull` from inside the submodule directory when there are changes. Otherwise watch this repository and perform manual updates.

Steps for creating a git submodule:

1. `cd` to the directory the submodule will live.
2. Type `git submodule add -b main git@github.com:barnardos/consent-banner.git` and press <kbd>enter</kbd> to add the submodule.
3. Type `git submodule init` and press <kbd>enter</kbd>.
4. `cd` out of the submodule into the parent repository.
5. Add and commit the new files to the parent repository.
