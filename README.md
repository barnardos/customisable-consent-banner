# Barnardo's consent banner

## Usage

Cloning this repo as a git submodule is recommended. Watch this repository and run XXXX when it changes. Otherwise watch this repository and perform manual updates when it changes.

Steps for creating a git submodule:

1. `cd` to the directory the submodule will live.
2. Create a new directory for it e.g. `mkdir submodule-consent-banner`.
3. `cd` into that directory.
4. Type `git submodule add -b main git@github.com:barnardos/consent-banner.git` and press <kbd>enter</kbd> to add the submodule.
5. Type `git submodule init` and press <kbd>enter</kbd>.
6. `cd` out of the submodule into the parent repository.
7. Add and commit the new files to the parent repository.

Demos are in the gh-pages branch and visible online at...

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
