# webext-i18n — Chrome Extension Internationalization Toolkit

[![npm](https://img.shields.io/npm/v/webext-i18n?color=10b981&label=npm)](https://www.npmjs.com/package/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml)
[![npm downloads](https://img.shields.io/npm/dm/webext-i18n)](https://www.npmjs.com/package/webext-i18n)

> **Built by [Zovo](https://zovo.one)** — Internationalization toolkit used to localize 18+ Chrome extensions into **55 languages**

**webext-i18n** is a comprehensive internationalization toolkit for Chrome extensions. Generate, validate, sort, diff, and manage your `_locales/messages.json` files with a powerful CLI and programmatic API.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏗️ **Generate** | Create `_locales/messages.json` from translation objects |
| ✅ **Validate** | Validate locale structure and catch missing translations |
| 📊 **Stats** | Translation coverage reports per locale |
| 🔍 **Extract** | Extract i18n keys from source code |
| 🧹 **Unused Keys** | Find translation keys that are no longer used |
| 🔧 **CLI + API** | Powerful command-line interface + full TypeScript API |
| 🌐 **55 Locales** | Support for all Chrome Web Store locales |

## 📦 Installation

```bash
# As a library (recommended)
npm install webext-i18n

# Or globally for CLI
npm install -g webext-i18n
```

## 🚀 CLI Usage

### `webext-i18n validate [dir]`

Validate the `_locales` directory structure and check for missing translations.

```bash
# Validate current directory
webext-i18n validate

# Validate specific extension directory
webext-i18n validate ./my-extension

# Validate with full path
webext-i18n validate /path/to/extension
```

**Output:**
```
✅ i18n validation passed

Locales: en, es, fr, de, ja, zh_CN
```

### `webext-i18n stats [dir]`

Show translation coverage for all locales.

```bash
# Get coverage stats for current directory
webext-i18n stats

# Get stats for specific extension
webext-i18n stats ./my-extension
```

**Output:**
```
# Translation Coverage

| Locale  | Coverage | Missing |
|---------|----------|---------|
| en      | 100%     | 0       |
| es      | 95%      | 3       |
| fr      | 88%      | 7       |
| de      | 92%      | 5       |
```

### `webext-i18n extract [dir]`

Extract all i18n keys from source code.

```bash
# Extract from default ./src directory
webext-i18n extract

# Extract from specific source directory
webext-i18n extract ./my-extension/src
```

**Output:**
```
Found 42 translation key(s):

  • extension_name
  • extension_description
  • popup_title
  • settings_saved
  • error_network
  • ...
```

### `webext-i18n unused [dir]`

Find translation keys that are defined but no longer used in source code.

```bash
# Find unused keys in current directory
webext-i18n unused

# Find unused keys in specific extension
webext-i18n unused ./my-extension
```

**Output:**
```
Found 5 unused key(s):
  • old_feature_title
  • deprecated_message
  • legacy_setting
  • ...
```

## 📚 Programmatic API

### I18nGenerator

Generate `_locales/messages.json` files from translation objects.

```typescript
import { I18nGenerator } from 'webext-i18n';

// Generate all locales at once
const translations = {
  en: {
    greeting: 'Hello',
    farewell: 'Goodbye',
    items_count: 'You have $1 item(s)'
  },
  es: {
    greeting: 'Hola',
    farewell: 'Adiós',
    items_count: 'Tienes $1 artículo(s)'
  },
  fr: {
    greeting: 'Bonjour',
    farewell: 'Au revoir',
    items_count: 'Vous avez $1 article(s)'
  }
};

// Add descriptions for translators
const descriptions = {
  greeting: 'A friendly greeting',
  farewell: 'A goodbye message',
  items_count: 'Message showing number of items'
};

const result = I18nGenerator.generate(translations, './my-extension', descriptions);
console.log(`Generated ${result.totalKeys} keys in ${result.locales.length} locales`);

// Generate single locale
I18nGenerator.generateSingle(
  { title: 'My Extension', settings: 'Settings' },
  './_locales/en/messages.json'
);

// Merge translations into existing file
const mergeResult = I18nGenerator.merge('./_locales/es/messages.json', {
  new_key: 'Nueva traducción'
});
console.log(`Added ${mergeResult.added}, updated ${mergeResult.updated}`);
```

### I18nValidator

Validate your extension's locale structure.

```typescript
import { I18nValidator } from 'webext-i18n';

const result = I18nValidator.validate('./my-extension');

if (result.valid) {
  console.log('✅ Validation passed!');
  console.log(`Found ${result.locales.length} locales`);
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(err => console.log(`  - ${err}`));
}

// Warnings include missing translations
result.warnings.forEach(warning => console.log(`⚠️ ${warning}`));
```

### StringExtractor

Extract i18n keys from source code.

```typescript
import { StringExtractor } from 'webext-i18n';

// Extract all keys from source files
const keys = StringExtractor.extractFromFiles('./src');
console.log('Found keys:', keys);

// Find unused translation keys
const unusedKeys = StringExtractor.findUnused('./my-extension');
if (unusedKeys.length > 0) {
  console.log('Unused keys:', unusedKeys);
}
```

### CoverageStats

Get detailed translation coverage statistics.

```typescript
import { CoverageStats } from 'webext-i18n';

const stats = CoverageStats.getStats('./my-extension');

stats.forEach(locale => {
  console.log(`${locale.locale}: ${locale.coveragePercent}%`);
  console.log(`  Translated: ${locale.translatedKeys}/${locale.totalKeys}`);
  console.log(`  Missing: ${locale.missingKeys.join(', ')}`);
});

// Get markdown-formatted summary
const summary = CoverageStats.getSummary('./my-extension');
console.log(summary);
```

## ⚙️ Configuration

### Package.json

Add webext-i18n commands to your extension's `package.json`:

```json
{
  "scripts": {
    "i18n:validate": "webext-i18n validate",
    "i18n:stats": "webext-i18n stats",
    "i18n:extract": "webext-i18n extract ./src",
    "i18n:unused": "webext-i18n unused"
  }
}
```

### .i18nrc Configuration File

Create an `.i18nrc` file in your project root:

```json
{
  "sourceDir": "./src",
  "localesDir": "./_locales",
  "defaultLocale": "en",
  "supportedLocales": ["en", "es", "fr", "de", "ja", "zh_CN"],
  "fileExtensions": [".js", ".ts", ".tsx", ".jsx", ".html"]
}
```

## 🌍 Supported Locales

webext-i18n supports all **55 Chrome Web Store locales**:

| Code | Language | Code | Language |
|------|----------|------|----------|
| am | Amharic | kn | Kannada |
| ar | Arabic | ko | Korean |
| bg | Bulgarian | lt | Lithuanian |
| bn | Bengali | lv | Latvian |
| ca | Catalan | ml | Malayalam |
| cs | Czech | mr | Marathi |
| da | Danish | nl | Dutch |
| de | German | no | Norwegian |
| el | Greek | pl | Polish |
| en | English | pt_BR | Portuguese (Brazil) |
| es | Spanish | pt_PT | Portuguese (Portugal) |
| et | Estonian | ro | Romanian |
| fa | Persian | ru | Russian |
| fi | Finnish | sk | Slovak |
| fil | Filipino | sl | Slovenian |
| fr | French | sr | Serbian |
| gu | Gujarati | sv | Swedish |
| he | Hebrew | sw | Swahili |
| hi | Hindi | ta | Tamil |
| hr | Croatian | te | Telugu |
| hu | Hungarian | th | Thai |
| id | Indonesian | tr | Turkish |
| it | Italian | uk | Ukrainian |
| ja | Japanese | vi | Vietnamese |
| jv | Javanese | zh_CN | Chinese (Simplified) |
| ka | Georgian | zh_TW | Chinese (Traditional) |

## 🔄 CI Integration

Add to your GitHub Actions workflow:

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
      - run: npm install
      - run: npm install -g webext-i18n
      - run: webext-i18n validate
```

## 🔗 Related Projects

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) — Modern Chrome extension starter
- [extension-publisher](https://github.com/theluckystrike/extension-publisher) — Publish extensions to Chrome Web Store
- [webext-manifest](https://github.com/theluckystrike/webext-manifest) — Manifest.json utilities
- [@zovo/webext](https://github.com/theluckystrike/webext) — Full Chrome extension toolkit

## 📄 License

MIT — [Zovo](https://zovo.one)

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
