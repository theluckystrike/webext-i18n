# webext-i18n — Chrome Extension Internationalization Toolkit

<div align="center">

[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-i18n?color=10B981&label=npm)](https://npmjs.com/package/@theluckystrike/webext-i18n)
[![npm downloads](https://img.shields.io/npm/dt/@theluckystrike/webext-i18n?color=10B981)](https://npmjs.com/package/@theluckystrike/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)
[![Build Status](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-i18n/actions)
[![Package Size](https://img.shields.io/bundlephobia/min/@theluckystrike/webext-i18n?color=10B981)](https://bundlephobia.com/package/@theluckystrike/webext-i18n)

**Built by [Zovo](https://zovo.one)** — powering 18+ Chrome extensions in 55 languages

</div>

---

**webext-i18n** is a comprehensive internationalization toolkit for Chrome extensions. Generate, validate, sort, and diff locale files with a full-featured CLI and programmatic API. Part of the [@zovo/webext](https://github.com/theluckystrike) ecosystem.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🔍 Validate** | Validate `_locales/messages.json` structure and message format |
| **📊 Stats** | Translation coverage analysis across all locales |
| **🔑 Extract** | Extract i18n keys from source code (JS/TS/HTML) |
| **🗑 Unused Keys** | Find translation keys that are no longer used |
| **🧹 Sort** | Alphabetically sort translation keys for consistency |
| **⚡ CLI** | Full-featured command-line interface |
| **📦 Library** | Programmatic API for build pipelines |

## 📦 Install

```bash
# As a library (recommended)
npm install @theluckystrike/webext-i18n

# Or globally for CLI
npm install -g @theluckystrike/webext-i18n
```

Or with pnpm:
```bash
pnpm add @theluckystrike/webext-i18n
```

## 🚀 CLI Commands

### `validate` — Validate Locale Structure

Validates that your `_locales` directory has the correct structure and that all `messages.json` files are properly formatted.

```bash
webext-i18n validate ./my-extension
```

**Output:**
```
✅ i18n validation passed

Locales: en, es, fr, de, ja, zh_CN
```

**With errors:**
```
❌ Validation failed
  ✗ Missing 'message' field for key 'greeting' in messages.json (es)
  ✗ Duplicate key 'settings_title' found (fr)

Warnings:
  ⚠ Unused placeholder {count} in key 'items_left'

Locales: en, es, fr, de
```

### `stats` — Translation Coverage Report

Shows translation completeness across all locales, highlighting missing keys and percentage coverage.

```bash
webext-i18n stats ./my-extension
```

**Output:**
```
┌────────────┬────────┬────────┬──────────┐
│ Locale     │ Keys   │ Cov.   │ Missing  │
├────────────┼────────┼────────┼──────────┤
│ en         │ 142    │ 100%   │ —        │
│ es         │ 140    │ 98.6%  │ 2        │
│ fr         │ 138    │ 97.2%  │ 4        │
│ de         │ 135    │ 95.1%  │ 7        │
│ ja         │ 142    │ 100%   │ —        │
│ zh_CN      │ 142    │ 100%   │ —        │
└────────────┴────────┴────────┴──────────┘
Total: 142 keys across 6 locales
```

### `extract` — Extract Keys from Source

Scans your source code for translation keys and extracts them for comparison with your locale files.

```bash
webext-i18n extract ./src
```

**Output:**
```
Found 47 translation key(s):

  • extension_name
  • extension_description
  • menu_settings
  • menu_about
  • dialog_confirm
  • dialog_cancel
  • notification_synced
  • ...
```

### `unused` — Find Unused Translation Keys

Identifies translation keys in your locale files that are no longer referenced in your source code.

```bash
webext-i18n unused ./my-extension
```

**Output:**
```
Found 5 unused key(s):
  • legacy_import_export
  • old_settings_migration
  • deprecated_api_notice
  • old_welcome_screen
  • unused_placeholder_key
```

### `sort` — Sort Translation Keys

Alphabetically sorts all keys in your `messages.json` files for consistent ordering and cleaner diffs.

```bash
webext-i18n sort ./my-extension/_locales/en
```

This is especially useful in CI pipelines to minimize diff noise in PRs.

---

## 📚 Library API

### Basic Setup

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
// Generate _locales/messages.json from a translation object
const translations = {
  en: {
    extension_name: 'My Extension',
    greeting: 'Hello, {name}!',
    items_count: 'You have {count, plural, =0 {no items} one {# item} other {# items}}'
  },
  es: {
    extension_name: 'Mi Extensión',
    greeting: '¡Hola, {name}!',
    items_count: 'Tienes {count, plural, =0 {ningún elemento} one {# elemento} other {# elementos}}'
  },
  fr: {
    extension_name: 'Mon Extension',
    greeting: 'Bonjour, {name} !',
    items_count: 'Vous avez {count, plural, =0 {aucun élément} one {# élément} other {# éléments}}'
  }
};

// Generate all locale files
I18nGenerator.generate(translations, './my-extension');

// Or generate a single locale
I18nGenerator.generateLocale('de', translations.de, './my-extension');
```

### Validating Locale Files

```typescript
// Validate all locales in an extension
const result = I18nValidator.validate('./my-extension');

if (result.valid) {
  console.log('All locales are valid!');
} else {
  console.error('Validation failed:', result.errors);
}

// Result shape:
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  locales: string[];
  files: Map<string, MessageEntry[]>;
}
```

### Extracting Keys from Source

```typescript
// Extract i18n keys from TypeScript/JavaScript/HTML files
const keys = StringExtractor.extractFromFiles('./src');
console.log(`Found ${keys.length} keys:`, keys);

// Find unused keys (compares against source)
const unused = StringExtractor.findUnused('./my-extension');
console.log('Unused keys:', unused);

// Supported patterns:
const customPatterns = StringExtractor.extractWithPatterns(
  './src',
  [/t\(['"`]([^'"`]+)['"`]\)/g]  // Custom i18n function
);
```

### Coverage Statistics

```typescript
// Get detailed coverage stats
const stats = CoverageStats.getStats('./my-extension');

console.log(stats);
/*
{
  locales: {
    en: { total: 142, covered: 142, missing: [], percentage: 100 },
    es: { total: 142, covered: 140, missing: ['key1', 'key2'], percentage: 98.6 },
    ...
  },
  overall: { totalKeys: 142, totalLocales: 6, avgCoverage: 98.2 }
}
*/

// Get a summary string
console.log(CoverageStats.getSummary('./my-extension'));
```

### Runtime Translation

```typescript
import { I18nRuntime } from '@theluckystrike/webext-i18n';

// Pluralization support
const label = I18nRuntime.plural(count, 'item', 'items');
// count=1 → "1 item"
// count=5 → "5 items"
// count=0 → "no items"

// Simple message with placeholders
const greeting = I18nRuntime.format('Hello, {name}!', { name: 'World' });

// Load translations for runtime use
I18nRuntime.loadTranslations('./my-extension/_locales/en/messages.json');
const msg = I18nRuntime.t('greeting', { name: 'Alice' });
```

---

## ⚙️ Configuration

### Package.json Integration

Add i18n scripts to your `package.json`:

```json
{
  "scripts": {
    "i18n:validate": "webext-i18n validate",
    "i18n:stats": "webext-i18n stats",
    "i18n:extract": "webext-i18n extract ./src",
    "i18n:unused": "webext-i18n unused",
    "i18n:sort": "webext-i18n sort ./_locales/en",
    "i18n:check": "npm run i18n:validate && npm run i18n:unused"
  }
}
```

### .i18nrc Configuration File

Create an `.i18nrc` file in your project root for default options:

```json
{
  "localesDir": "_locales",
  "defaultLocale": "en",
  "sourceLocale": "en",
  "sortKeys": true,
  "validateOnBuild": true,
  "extractPatterns": [
    "chrome.i18n.getMessage\\(['\"`]([^'\"]+)['\"`]\\)",
    "__\\(['\"`]([^'\"]+)['\"`]\\)"
  ],
  "ignoreKeys": [
    "extraction_placeholder",
    "debug_message"
  ]
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
| `el` | Greek | `pt_BR` | Portuguese (Brazil) |
| `en` | English (GB) | `pt_PT` | Portuguese (Portugal) |
| `en_GB` | English (UK) | `ro` | Romanian |
| `es` | Spanish | `ru` | Russian |
| `es_419` | Spanish (Latin America) | `sk` | Slovak |
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
| `id` | Indonesian | `zh_CN` | Chinese (Simplified) |
| `it` | Italian | `zh_TW` | Chinese (Traditional) |
| `ja` | Japanese | | |

---

## 🔄 CI Integration

### GitHub Actions Example

```yaml
name: i18n Check

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
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Validate i18n files
        run: npx webext-i18n validate ./my-extension
        
      - name: Check for unused keys
        run: npx webext-i18n unused ./my-extension
        
      - name: Generate coverage report
        run: npx webext-i18n stats ./my-extension
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx webext-i18n validate . || exit 1
npx webext-i18n unused . || exit 1
```

---

## 📁 Project Structure

```
webext-i18n/
├── src/
│   ├── cli.ts          # Command-line interface
│   ├── generator.ts    # Generate locale files
│   ├── validator.ts    # Validate locale structure
│   ├── extractor.ts    # Extract keys from source
│   ├── stats.ts        # Coverage statistics
│   ├── runtime.ts      # Runtime translation helpers
│   └── index.ts        # Main exports
├── .github/
│   └── workflows/
│       └── ci.yml       # CI pipeline
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🤝 Related Projects

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) — Modern Chrome extension template
- [extension-publisher](https://github.com/theluckystrike/extension-publisher) — Automate Chrome Web Store publishing
- [@zovo/webext](https://github.com/theluckystrike) — Full ecosystem for Chrome extension development

---

## 📄 License

MIT — [Zovo](https://zovo.one)

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)

</div>
