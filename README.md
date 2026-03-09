# webext-i18n — Chrome Extension Internationalization Toolkit

[![npm](https://img.shields.io/npm/v/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![npm](https://img.shields.io/npm/dm/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml)

> **Built by [Zovo](https://zovo.one)** — used to localize 18+ extensions into 55 languages

**webext-i18n** is a comprehensive internationalization toolkit for Chrome Extensions. Generate, validate, sort, and diff `_locales/messages.json` files with a powerful CLI and programmatic API.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Generate** | Create `_locales/{locale}/messages.json` from translation objects |
| **Validate** | Verify locale structure, message keys, and placeholders |
| **Extract** | Pull i18n keys from your source code automatically |
| **Unused Keys** | Find translation keys no longer used in your extension |
| **Sort** | Alphabetically sort keys in messages.json for consistency |
| **Diff** | Compare translation coverage across locales |
| **Stats** | Translation coverage reports with completeness metrics |

## 📦 Install

```bash
# As a library (recommended)
npm install webext-i18n

# Or with pnpm
pnpm add webext-i18n

# Global CLI
npm install -g webext-i18n
```

## 🚀 CLI Usage

### `webext-i18n validate [dir]`

Validate the `_locales` directory structure and message format.

```bash
# Validate current directory
webext-i18n validate

# Validate specific extension
webext-i18n validate ./my-extension

# Validate and show all locales
webext-i18n validate ./dist
```

**Exit codes:** `0` = valid, `1` = validation errors

---

### `webext-i18n stats [dir]`

Show translation coverage statistics for all locales.

```bash
# Get stats for current directory
webext-i18n stats

# Get stats for specific extension
webext-i18n stats ./my-extension
```

**Output includes:**
- Total keys per locale
- Missing keys per locale
- Completion percentage
- Placeholder coverage

---

### `webext-i18n extract [dir]`

Extract all i18n keys used in your source code.

```bash
# Extract from ./src (default)
webext-i18n extract

# Extract from specific directory
webext-i18n extract ./my-extension/src
```

**Supported patterns:**
- `chrome.i18n.getMessage('key')`
- `getMessage('key')`
- `__('key')`, `$t('key')`, `t('key')`

---

### `webext-i18n unused [dir]`

Find translation keys in `_locales` that are not used in your source code.

```bash
# Find unused keys
webext-i18n unused

# For specific extension
webext-i18n unused ./my-extension
```

**Use case:** Clean up stale translations after refactoring.

---

### `webext-i18n generate <translations> <output>`

Generate locale files from a translations object.

```bash
# Generate via stdin
echo '{"en":{"greeting":"Hello"},"es":{"greeting":"Hola"}}' | webext-i18n generate

# Generate to output directory
webext-i18n generate ./translations.json ./output-dir
```

---

## 📚 Programmatic API

### TypeScript / JavaScript

```typescript
import { 
  I18nGenerator, 
  I18nValidator, 
  I18nRuntime, 
  StringExtractor, 
  CoverageStats 
} from 'webext-i18n';
```

### I18nGenerator

Generate `_locales/{locale}/messages.json` files from translation objects.

```typescript
import { I18nGenerator } from 'webext-i18n';

const translations = {
  en: {
    extension_name: 'My Extension',
    greeting: 'Hello, $1!',
    items_count: 'You have $1 item(s)'
  },
  es: {
    extension_name: 'Mi Extensión',
    greeting: '¡Hola, $1!',
    items_count: 'Tienes $1 elemento(s)'
  },
  fr: {
    extension_name: 'Mon Extension',
    greeting: 'Bonjour, $1 !',
    items_count: 'Vous avez $1 élément(s)'
  }
};

// Generate all locale files
I18nGenerator.generate(translations, './my-extension');

// Generate specific locale
I18nGenerator.generateLocale(translations.en, 'en', './my-extension');
```

### I18nValidator

Validate `_locales` structure and message format.

```typescript
import { I18nValidator } from 'webext-i18n';

const result = I18nValidator.validate('./my-extension');

if (result.valid) {
  console.log('✅ Validation passed');
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(e => console.log(`  - ${e}`));
}

// Validation checks:
// - Directory structure (_locales/{locale}/messages.json)
// - Valid JSON format
// - Required message properties (message)
// - Placeholder consistency ($1, $2, etc.)
// - Duplicate key detection

console.log('Locales found:', result.locales);
console.log('Warnings:', result.warnings);
```

### StringExtractor

Extract i18n keys from source code and find unused keys.

```typescript
import { StringExtractor } from 'webext-i18n';

// Extract all keys used in source files
const usedKeys = StringExtractor.extractFromFiles('./src');
console.log('Keys used in code:', usedKeys);

// Find keys in locales that aren't used anywhere
const unusedKeys = StringExtractor.findUnused('./my-extension');
console.log('Unused keys:', unusedKeys);

// Custom extraction with patterns
const customKeys = StringExtractor.extractFromFiles('./src', [
  /i18n\.t\(['"]([^'"]+)['"]\)/g
]);
```

### CoverageStats

Get detailed translation coverage statistics.

```typescript
import { CoverageStats } from 'webext-i18n';

// Get complete stats for all locales
const stats = CoverageStats.getStats('./my-extension');

console.log('Coverage by locale:');
stats.forEach(locale => {
  console.log(`${locale.locale}:`);
  console.log(`  Total keys: ${locale.totalKeys}`);
  console.log(`  Translated: ${locale.translated}`);
  console.log(`  Missing: ${locale.missing}`);
  console.log(`  Completion: ${locale.percentage}%`);
});

// Get summary string (for CLI display)
const summary = CoverageStats.getSummary('./my-extension');
console.log(summary);
```

### I18nRuntime

Runtime translation helpers with pluralization support.

```typescript
import { I18nRuntime } from 'webext-i18n';

// Plural support
const label = I18nRuntime.plural(5, 'item', 'items'); 
// → "5 items" (singular/plural forms)

// Gender-aware translations
const greeting = I18nRuntime.gender('male', 'Mr.', 'Ms.');
// → "Mr."

// Placeholder replacement
const message = I18nRuntime.format('Hello, $1!', ['World']);
// → "Hello, World!"
```

## ⚙️ Configuration

### `.i18nrc` (JSON)

```json
{
  "locales": ["en", "es", "fr", "de", "ja", "zh_CN"],
  "defaultLocale": "en",
  "sourceDir": "./src",
  "localesDir": "./_locales",
  "sortKeys": true,
  "validatePlaceholders": true,
  "extractPatterns": [
    "chrome.i18n.getMessage(['\"]([^'\"]+)['\"])",
    "__(['\"]([^'\"]+)['\"])"
  ]
}
```

### `package.json`

```json
{
  "webext-i18n": {
    "locales": ["en", "es", "fr"],
    "defaultLocale": "en"
  }
}
```

## 🌍 Supported Locales

webext-i18n supports **55 Chrome Web Store locales**:

| Code | Language | Code | Language |
|------|----------|------|----------|
| `ar` | Arabic | `ko` | Korean |
| `am` | Amharic | `lt` | Lithuanian |
| `bg` | Bulgarian | `lv` | Latvian |
| `bn` | Bengali | `ms` | Malay |
| `ca` | Catalan | `ml` | Malayalam |
| `cs` | Czech | `mr` | Marathi |
| `da` | Danish | `nl` | Dutch |
| `de` | German | `no` | Norwegian |
| `el` | Greek | `fa` | Persian |
| `en` | English | `pl` | Polish |
| `en_GB` | English (UK) | `pt_BR` | Portuguese (Brazil) |
| `es` | Spanish | `pt_PT` | Portuguese (Portugal) |
| `es_419` | Spanish (Latin America) | `ro` | Romanian |
| `et` | Estonian | `ru` | Russian |
| `fa` | Persian | `sk` | Slovak |
| `fi` | Finnish | `sl` | Slovenian |
| `fil` | Filipino | `sv` | Swedish |
| `fr` | French | `sw` | Swahili |
| `gu` | Gujarati | `ta` | Tamil |
| `he` | Hebrew | `te` | Telugu |
| `hi` | Hindi | `th` | Thai |
| `hr` | Croatian | `tr` | Turkish |
| `hu` | Hungarian | `uk` | Ukrainian |
| `id` | Indonesian | `ur` | Urdu |
| `it` | Italian | `vi` | Vietnamese |
| `ja` | Japanese | `zh_CN` | Chinese (Simplified) |
| `kn` | Kannada | `zh_TW` | Chinese (Traditional) |

[Full list →](https://developer.chrome.com/docs/webstore/i18n#locales)

## 🔄 CI Integration

### GitHub Actions

```yaml
name: i18n

on: [push, pull_request]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Validate i18n
        run: npx webext-i18n validate ./dist
      
      - name: Check translation coverage
        run: npx webext-i18n stats ./dist
      
      - name: Find unused keys
        run: npx webext-i18n unused ./dist
```

### GitLab CI

```yaml
i18n:
  image: node:20
  script:
    - npm install -g webext-i18n
    - webext-i18n validate ./dist
    - webext-i18n stats ./dist
```

## 🔗 Related Projects

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) — Modern Chrome extension starter with TypeScript, Vite, and hot reload
- [extension-publisher](https://github.com/theluckystrike/extension-publisher) — Publish Chrome extensions to the Web Store from CLI
- [@zovo/webext](https://github.com/zovo/webext) — Zovo's Chrome extension toolkit

## 📄 License

MIT — [Zovo](https://zovo.one)

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
