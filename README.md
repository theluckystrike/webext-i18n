# webext-i18n — Chrome Extension Internationalization Toolkit

[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-i18n)](https://www.npmjs.com/package/@theluckystrike/webext-i18n)
[![npm](https://img.shields.io/npm/dt/@theluckystrike/webext-i18n)](https://www.npmjs.com/package/@theluckystrike/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github)](https://github.com/theluckystrike/webext-i18n/actions)

> **Built by [Zovo](https://zovo.one)** — used to localize 18+ extensions into 55 languages

**Generate, validate, extract, and manage `_locales/messages.json` files** for Chrome and Chromium-based extensions. Full CLI + programmatic TypeScript API.

---

## ✨ Features

| Feature | CLI | API | Description |
|---------|:---:|:---:|-------------|
| **Generate Locales** | ✅ | ✅ | Create `_locales/*/messages.json` from translation objects |
| **Validate** | ✅ | ✅ | Check structure, missing keys, empty messages |
| **Extract Keys** | ✅ | ✅ | Find `chrome.i18n.getMessage()` calls in source |
| **Find Unused** | ✅ | ✅ | Detect orphaned translation keys |
| **Coverage Stats** | ✅ | ✅ | Translation completeness per locale |
| **Merge** | — | ✅ | Merge new translations into existing files |
| **Runtime Helpers** | — | ✅ | Pluralization, interpolation, RTL detection |

---

## 📦 Install

```bash
# As a library (recommended)
npm install @theluckystrike/webext-i18n

# As a global CLI
npm install -g @theluckystrike/webext-i18n
```

**Requirements:** Node.js 18+

---

## 🚀 CLI Usage

### `webext-i18n validate [dir]`

Validate the `_locales` directory structure and check for missing translations.

```bash
# Validate current directory
webext-i18n validate

# Validate specific extension
webext-i18n validate ./my-extension
```

**Output:**
```
✅ i18n validation passed

Locales: en, es, fr, de, ja
```

### `webext-i18n stats [dir]`

Show translation coverage for all locales.

```bash
webext-i18n stats ./my-extension
```

**Output:**
```
# Translation Coverage

| Locale | Coverage | Missing |
|--------|----------|---------|
| en     | 100%     | 0       |
| es     | 95%      | 2       |
| fr     | 88%      | 5       |
| de     | 82%      | 8       |
```

### `webext-i18n extract [dir]`

Extract all i18n keys used in your source code.

```bash
# Extract from src directory
webext-i18n extract ./src

# Extract from entire extension
webext-i18n extract
```

**Output:**
```
Found 42 translation key(s):

  • extension_name
  • extension_description
  • action_title
  • settings_saved
  • confirm_delete
  ...
```

### `webext-i18n unused [dir]`

Find translation keys that are defined but not used in your source code.

```bash
webext-i18n unused ./my-extension
```

**Output:**
```
Found 3 unused key(s):
  • old_feature_removed
  • deprecated_api_warning
  • legacy_menu_item
```

---

## 📚 Programmatic API

Import the library in your TypeScript/JavaScript project:

```typescript
import { 
  I18nGenerator, 
  I18nValidator, 
  I18nRuntime, 
  StringExtractor, 
  CoverageStats 
} from '@theluckystrike/webext-i18n';
```

### Generating Locale Files

```typescript
// Generate all locales from a translations object
const translations = {
  en: {
    greeting: 'Hello, $1!',
    farewell: 'Goodbye!',
    items: 'You have $1 item(s)'
  },
  es: {
    greeting: '¡Hola, $1!',
    farewell: '¡Adiós!',
    items: 'Tienes $1 artículo(s)'
  },
  fr: {
    greeting: 'Bonjour, $1 !',
    farewell: 'Au revoir !',
    items: 'Vous avez $1 article(s)'
  }
};

// Generate _locales/en/messages.json, _locales/es/messages.json, etc.
const result = I18nGenerator.generate(translations, './my-extension');

console.log(result);
// { locales: ['en', 'es', 'fr'], totalKeys: 9 }
```

### Adding Descriptions

```typescript
const descriptions = {
  greeting: 'Displayed when user opens the app',
  farewell: 'Shown when user logs out',
  items: 'Count of items in cart'
};

I18nGenerator.generate(translations, './my-extension', descriptions);
```

### Auto-detecting Placeholders

The generator automatically detects `$1`, `$2`, etc. in your translations and creates Chrome-compatible placeholders:

```typescript
// Input: "Hello, $1!"
// Output:
{
  "greeting": {
    "message": "Hello, $1!",
    "placeholders": {
      "1": {
        "content": "$1",
        "example": "value1"
      }
    }
  }
}
```

### Validating Locales

```typescript
const result = I18nValidator.validate('./my-extension');

console.log(result.valid);        // boolean
console.log(result.errors);       // string[] - critical errors
console.log(result.warnings);     // string[] - missing keys, empty messages
console.log(result.locales);      // string[] - found locales
console.log(result.defaultLocale); // string | null
```

### Extracting Keys from Source

```typescript
// Extract from source files
const keys = StringExtractor.extractFromFiles('./src');
// Returns: string[] of all chrome.i18n.getMessage() keys

// Find unused keys
const unused = StringExtractor.findUnused('./my-extension');
// Returns: string[] of keys in messages.json but not used in source
```

### Coverage Statistics

```typescript
const stats = CoverageStats.getStats('./my-extension');
// Returns: LocaleStats[]

stats.forEach(s => {
  console.log(`${s.locale}: ${s.coveragePercent}%`);
  console.log(`  Missing: ${s.missingKeys.join(', ')}`);
});

// Get markdown summary
const summary = CoverageStats.getSummary('./my-extension');
```

### Runtime Helpers

```typescript
// Basic translation (wrapper around chrome.i18n.getMessage)
const greeting = I18nRuntime.t('greeting', ['World']);

// Pluralization
const items = I18nRuntime.plural(5, 'item', 'items');
// Returns translated 'items' when count ≠ 1

// Variable interpolation
const msg = I18nRuntime.interpolate('welcome', { name: 'Alice', plan: 'Pro' });

// Get current UI locale
const locale = I18nRuntime.getLocale(); // 'en', 'es-ES', etc.

// Check RTL
const isRTL = I18nRuntime.isRTL(); // true for Arabic, Hebrew, Persian, etc.
```

### Merging Translations

```typescript
// Merge new translations into existing messages.json
const result = I18nGenerator.merge(
  './my-extension/_locales/en/messages.json',
  { new_key: 'New translation', existing_key: 'Updated translation' }
);

console.log(result.added);   // 1
console.log(result.updated); // 1
```

---

## ⚙️ Configuration

### Using .i18nrc (JSON)

Create `.i18nrc` in your project root:

```json
{
  "defaultLocale": "en",
  "sourceDir": "./src",
  "localesDir": "./_locales",
  "extensions": [".ts", ".tsx", ".js", ".jsx"],
  "ignore": ["node_modules", "dist", "*.test.ts"]
}
```

### Using package.json

Add to your `package.json`:

```json
{
  "webext-i18n": {
    "defaultLocale": "en",
    "sourceDir": "./src",
    "localesDir": "./_locales"
  }
}
```

---

## 🌍 Supported Locales

webext-i18n supports all **55 Chrome Web Store locales**:

| Code | Language | Code | Language |
|------|----------|------|----------|
| `am` | Amharic | `lt` | Lithuanian |
| `ar` | Arabic | `lv` | Latvian |
| `bg` | Bulgarian | `ml` | Malayalam |
| `bn` | Bengali | `mr` | Marathi |
| `ca` | Catalan | `ms` | Malay |
| `cs` | Czech | `nl` | Dutch |
| `da` | Danish | `no` | Norwegian |
| `de` | German | `pl` | Polish |
| `el` | Greek | `pt-BR` | Portuguese (Brazil) |
| `en` | English | `pt-PT` | Portuguese (Portugal) |
| `en-GB` | English (UK) | `ro` | Romanian |
| `es` | Spanish | `ru` | Russian |
| `es-419` | Spanish (Latin America) | `sk` | Slovak |
| `et` | Estonian | `sl` | Slovenian |
| `fa` | Persian | `sv` | Swedish |
| `fi` | Finnish | `sw` | Swahili |
| `fil` | Filipino | `ta` | Tamil |
| `fr` | French | `te` | Telugu |
| `gu` | Gujarati | `th` | Thai |
| `he` | Hebrew | `tr` | Turkish |
| `hi` | Hindi | `uk` | Ukrainian |
| `hr` | Croatian | `ur` | Urdu |
| `hu` | Hungarian | `vi` | Vietnamese |
| `id` | Indonesian | `zh-CN` | Chinese (Simplified) |
| `it` | Italian | `zh-TW` | Chinese (Traditional) |
| `ja` | Japanese | | |

---

## 🔄 CI/CD Integration

### GitHub Actions

Add to your workflow (`.github/workflows/i18n.yml`):

```yaml
name: i18n Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install webext-i18n
        run: npm install -g @theluckystrike/webext-i18n
        
      - name: Validate i18n
        run: |
          webext-i18n validate .
          webext-i18n unused .
          
      - name: Check coverage
        run: webext-i18n stats .
```

### Pre-commit Hooks

Install with Husky:

```bash
npx husky add .husky/pre-commit "webext-i18n validate ."
```

Or use lint-staged:

```json
{
  "lint-staged": {
    "*.json": ["webext-i18n validate"]
  }
}
```

---

## 📦 Part of @zovo/webext

webext-i18n is part of the **@zovo/webext** ecosystem — a collection of tools for building production-ready Chrome extensions:

| Package | Description |
|---------|-------------|
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |
| [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) | Modern extension template |
| [extension-publisher](https://github.com/theluckystrike/extension-publisher) | Automated Chrome Web Store publishing |

---

## 🤝 Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — [Zovo](https://zovo.one)

---

## 🏢 Built by Zovo

<div align="center">

[![Zovo](https://zovo.one/logo.png)](https://zovo.one)

Built with ❤️ by [theluckystrike](https://github.com/theluckystrike)

[Website](https://zovo.one) · [GitHub](https://github.com/theluckystrike) · [Twitter](https://twitter.com/zovoone)

</div>
