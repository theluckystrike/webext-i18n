# webext-i18n — Chrome Extension Internationalization Toolkit

[![npm](https://img.shields.io/npm/v/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![npm](https://img.shields.io/npm/dm/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml)

> **Built by [Zovo](https://zovo.one)** — powering localization for 18+ Chrome extensions across 55 languages

**webext-i18n** is a comprehensive internationalization toolkit for Chrome extensions. Generate, validate, sort, and diff `_locales/messages.json` files with a powerful CLI and programmatic API.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Generate** | Create `_locales` directory structure from translation objects |
| **Validate** | Verify locale structure, detect missing keys, empty messages |
| **Extract** | Pull i18n keys from source code (`chrome.i18n.getMessage()`) |
| **Unused Keys** | Find translation keys that are no longer used |
| **Stats** | Translation coverage reports per locale |
| **Sort** | Alphabetically sort keys in messages.json |
| **Diff** | Compare translations between locales |
| **CLI + API** | Use as command-line tool or import as TypeScript library |

## 📦 Install

```bash
# As a library (recommended)
npm install webext-i18n

# Or with pnpm
pnpm add webext-i18n

# As a global CLI
npm install -g webext-i18n
```

## 🚀 CLI Usage

### `validate` — Validate locale structure

Validates your `_locales` directory, checks for missing `default_locale`, detects missing keys across translations, and warns about empty messages.

```bash
webext-i18n validate ./my-extension
# ✅ i18n validation passed
# Locales: en, es, fr, de, ja
```

### `stats` — Translation coverage report

Shows translation coverage percentage for each locale, highlighting missing keys.

```bash
webext-i18n stats ./my-extension
# | Locale | Coverage | Missing |
# |--------|----------|---------|
# | en     | 100%     | 0       |
# | es     | 95%      | 3       |
# | fr     | 88%      | 7       |
```

### `extract` — Extract i18n keys from source

Finds all `chrome.i18n.getMessage()` calls and `__MSG_key__` patterns in your source code.

```bash
webext-i18n extract ./src
# Found 24 translation key(s):
#   • extension_name
#   • greeting_message
#   • settings_title
```

### `unused` — Find unused translation keys

Detects translation keys defined in `messages.json` that are no longer referenced in your source code.

```bash
webext-i18n unused ./my-extension
# Found 5 unused key(s):
#   • old_feature_title
#   • deprecated_message
```

### Full CLI Options

```bash
webext-i18n --help
# Usage: webext-i18n [command]
#
# Commands:
#   validate [dir]   Validate _locales directory
#   stats [dir]      Show translation coverage
#   extract [dir]    Extract i18n keys from source
#   unused [dir]     Find unused translation keys
#   --version        Show version number
```

## 📚 Programmatic API

Import `webext-i18n` as a TypeScript/JavaScript library:

```typescript
import {
  I18nGenerator,
  I18nValidator,
  I18nRuntime,
  StringExtractor,
  CoverageStats,
} from 'webext-i18n';
```

### I18nGenerator — Generate locale files

```typescript
// Generate _locales from a translations object
const result = I18nGenerator.generate(
  {
    en: { greeting: 'Hello', farewell: 'Goodbye' },
    es: { greeting: 'Hola', farewell: 'Adiós' },
    fr: { greeting: 'Bonjour', farewell: 'Au revoir' },
  },
  './my-extension'
);
// { locales: ['en', 'es', 'fr'], totalKeys: 6 }
```

```typescript
// Generate a single locale file
I18nGenerator.generateSingle(
  { title: 'My Extension', description: 'An awesome extension' },
  './my-extension/_locales/en/messages.json',
  { title: 'The extension title', description: 'What the extension does' }
);
```

```typescript
// Merge translations into existing messages.json
const mergeResult = I18nGenerator.merge(
  './my-extension/_locales/en/messages.json',
  { new_key: 'New translation' }
);
// { added: 1, updated: 0 }
```

### I18nValidator — Validate locale structure

```typescript
const result = I18nValidator.validate('./my-extension');

if (result.valid) {
  console.log('✅ All locales are valid');
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(e => console.log(`  - ${e}`));
}

console.log(`Found ${result.locales.length} locales`);
console.log(`Default locale: ${result.defaultLocale}`);

if (result.warnings.length) {
  result.warnings.forEach(w => console.log(`⚠️ ${w}`));
}
```

### StringExtractor — Extract keys from source

```typescript
// Extract all i18n keys from source files
const keys = StringExtractor.extractFromFiles('./src');
// ['extension_name', 'greeting', 'settings_title', ...]

// Find unused keys (defined but not referenced)
const unused = StringExtractor.findUnused('./my-extension');
// ['old_feature', 'deprecated_message']
```

### CoverageStats — Translation coverage

```typescript
const stats = CoverageStats.getStats('./my-extension');
// [
//   { locale: 'en', totalKeys: 50, translatedKeys: 50, missingKeys: [], coveragePercent: 100 },
//   { locale: 'es', totalKeys: 50, translatedKeys: 48, missingKeys: ['key1', 'key2'], coveragePercent: 96 },
// ]

// Get a markdown-formatted summary
console.log(CoverageStats.getSummary('./my-extension'));
```

### I18nRuntime — Runtime translation helpers

```typescript
// Basic translation
const message = I18nRuntime.t('greeting');

// With substitutions
const personalized = I18nRuntime.t('welcome_user', ['John']);

// Pluralization
const itemCount = I18nRuntime.plural(count, 'item', 'items');
// count=1 → "1 item"
// count=5 → "5 items"

// Variable interpolation
const interpolated = I18nRuntime.interpolate('welcome_name', { name: 'John' });

// Get current UI locale
const locale = I18nRuntime.getLocale(); // 'en', 'es-ES', etc.

// Check RTL (right-to-left)
if (I18nRuntime.isRTL()) {
  document.body.dir = 'rtl';
}
```

## ⚙️ Configuration

### Using `.i18nrc` (JSON)

Create a `.i18nrc` file in your project root:

```json
{
  "defaultLocale": "en",
  "locales": ["en", "es", "fr", "de", "ja", "zh_CN"],
  "sourceDir": "./src",
  "excludeDirs": ["node_modules", "dist", ".git"],
  "sortKeys": true
}
```

### Using `package.json`

You can also configure via `package.json`:

```json
{
  "webext-i18n": {
    "defaultLocale": "en",
    "sourceDir": "./src"
  }
}
```

## 🌍 Supported Locales

webext-i18n supports all **55 Chrome Web Store locales**:

| Code | Locale |
|------|--------|
| `en` | English (US) |
| `en_GB` | English (UK) |
| `af` | Afrikaans |
| `ar` | Arabic |
| `am` | Amharic |
| `bg` | Bulgarian |
| `bn` | Bengali |
| `ca` | Catalan |
| `zh_CN` | Chinese (Simplified) |
| `zh_TW` | Chinese (Traditional) |
| `hr` | Croatian |
| `cs` | Czech |
| `da` | Danish |
| `nl` | Dutch |
| `et` | Estonian |
| `fil` | Filipino |
| `fi` | Finnish |
| `fr` | French |
| `fr_CA` | French (Canada) |
| `de` | German |
| `el` | Greek |
| `gu` | Gujarati |
| `he` | Hebrew |
| `hi` | Hindi |
| `hu` | Hungarian |
| `id` | Indonesian |
| `it` | Italian |
| `ja` | Japanese |
| `kn` | Kannada |
| `ko` | Korean |
| `lv` | Latvian |
| `lt` | Lithuanian |
| `ms` | Malay |
| `ml` | Malayalam |
| `mr` | Marathi |
| `no` | Norwegian |
| `fa` | Persian |
| `pl` | Polish |
| `pt_BR` | Portuguese (Brazil) |
| `pt_PT` | Portuguese (Portugal) |
| `ro` | Romanian |
| `ru` | Russian |
| `sr` | Serbian |
| `sk` | Slovak |
| `sl` | Slovenian |
| `es` | Spanish |
| `es_419` | Spanish (Latin America) |
| `sw` | Swahili |
| `sv` | Swedish |
| `ta` | Tamil |
| `te` | Telugu |
| `th` | Thai |
| `tr` | Turkish |
| `uk` | Ukrainian |
| `ur` | Urdu |
| `vi` | Vietnamese |

## 🔄 CI Integration

### GitHub Actions

Add to your `.github/workflows/i18n.yml`:

```yaml
name: i18n

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx webext-i18n validate .
      - run: npx webext-i18n stats .
```

### Pre-commit Hook

Run validation before every commit:

```bash
npm install --save-dev husky
npx husky add .husky/pre-commit "npx webext-i18n validate ."
```

## 📦 Part of @zovo/webext

webext-i18n is part of the **@zovo/webext** ecosystem — a collection of tools for building professional Chrome extensions:

- [webext-i18n](https://github.com/theluckystrike/webext-i18n) — Internationalization
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) — Extension boilerplate
- [extension-publisher](https://github.com/theluckystrike/extension-publisher) — Automated publishing

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT — [Zovo](https://zovo.one)

---

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)
