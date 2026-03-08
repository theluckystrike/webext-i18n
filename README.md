# webext-i18n — Chrome Extension Internationalization Toolkit

[![npm](https://img.shields.io/npm/v/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![npm](https://img.shields.io/npm/dm/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-i18n/actions/workflows/ci.yml)

> **Built by [Zovo](https://zovo.one)** — Internationalization toolkit used to localize 18+ Chrome extensions into 55 languages

**webext-i18n** is a comprehensive internationalization toolkit for Chrome extensions. Generate, validate, sort, and diff locale files with full CLI and programmatic API support.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Generate** | Create `_locales/messages.json` from translation objects |
| ✅ **Validate** | Verify locale structure and check for missing keys |
| 📊 **Stats** | Translation coverage reports per locale |
| 🔍 **Extract** | Pull i18n keys from source code automatically |
| 🧹 **Unused** | Find translation keys that are no longer used |
| 🌐 **55 Locales** | Full support for all Chrome Web Store languages |
| ⎋ **CLI + API** | Use as command-line tool or import as library |

## 📦 Install

```bash
# As a library (recommended)
npm install webext-i18n

# Or as a global CLI
npm install -g webext-i18n
```

## 🚀 CLI Usage

The CLI provides commands for all common i18n workflows:

### `webext-i18n validate [dir]`

Validate the `_locales` directory structure and check for issues:

```bash
# Validate current directory
webext-i18n validate

# Validate specific extension
webext-i18n validate ./my-extension

# Output:
# ✅ i18n validation passed
#
# Locales: en, es, fr, de, ja
```

Validates:
- ✅ `_locales` directory exists
- ✅ `manifest.json` has `default_locale` set
- ✅ Default locale directory exists
- ⚠️ Missing translation keys per locale
- ⚠️ Extra keys not in default locale
- ⚠️ Empty message values

### `webext-i18n stats [dir]`

Show translation coverage for all locales:

```bash
webext-i18n stats ./my-extension

# Output:
# | Locale | Coverage | Missing |
# |--------|----------|---------|
# | en     | 100%     | 0       |
# | es     | 95%      | 3       |
# | fr     | 88%      | 8       |
# | de     | 82%      | 12      |
```

### `webext-i18n extract [dir]`

Extract all i18n keys used in your source code:

```bash
webext-i18n extract ./src

# Output:
# Found 42 translation key(s):
#   • extension_name
#   • extension_description
#   • settings_title
#   • settings_save
#   ...
```

### `webext-i18n unused [dir]`

Find translation keys that exist in `_locales` but are not used in source code:

```bash
webext-i18n unused ./my-extension

# Output (if unused keys found):
# Found 5 unused key(s):
#   • old_feature_title
#   • deprecated_message
#   • legacy_setting
```

## 📚 Programmatic API

Import the library and use it in your build scripts:

```typescript
import { 
  I18nGenerator, 
  I18nValidator, 
  I18nRuntime, 
  StringExtractor, 
  CoverageStats 
} from 'webext-i18n';
```

### Generate Locale Files

```typescript
// Generate _locales from translation objects
const translations = {
  en: {
    greeting: 'Hello',
    farewell: 'Goodbye',
    items_count: '$1 item(s)'
  },
  es: {
    greeting: 'Hola',
    farewell: 'Adiós',
    items_count: '$1 artículo(s)'
  },
  fr: {
    greeting: 'Bonjour',
    farewell: 'Au revoir',
    items_count: '$1 article(s)'
  }
};

const result = I18nGenerator.generate(translations, './my-extension');
console.log(`Generated ${result.totalKeys} keys in ${result.locales.join(', ')}`);

// Output: Generated 9 keys in en, es, fr
```

### Add Descriptions

```typescript
const descriptions = {
  greeting: 'A friendly greeting',
  farewell: 'A parting message',
  items_count: 'Shown when displaying item count'
};

I18nGenerator.generate(translations, './my-extension', descriptions);
```

### Generate Single Locale

```typescript
// Generate messages.json for one locale
I18nGenerator.generateSingle(
  { hello: 'Hello', world: 'World' },
  './_locales/en/messages.json',
  { hello: 'Greeting message', world: 'The planet' }
);
```

### Merge Translations

```typescript
// Add new keys without overwriting existing translations
const result = I18nGenerator.merge(
  './_locales/en/messages.json',
  { new_key: 'New translation' }
);

console.log(`Added: ${result.added}, Updated: ${result.updated}`);
```

### Validate Locales

```typescript
const result = I18nValidator.validate('./my-extension');

if (result.valid) {
  console.log('✅ All locales are valid!');
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(e => console.log(`  - ${e}`));
}

// Check warnings
result.warnings.forEach(w => console.log(`⚠️ ${w}`));

// Get locale list
console.log(`Found locales: ${result.locales.join(', ')}`);
```

### Coverage Statistics

```typescript
const stats = CoverageStats.getStats('./my-extension');

stats.forEach(stat => {
  console.log(`${stat.locale}: ${stat.coveragePercent}% (${stat.translatedKeys}/${stat.totalKeys})`);
  
  if (stat.missingKeys.length > 0) {
    console.log(`  Missing: ${stat.missingKeys.join(', ')}`);
  }
});
```

### Extract Keys from Source

```typescript
// Extract all i18n keys from TypeScript/JavaScript files
const keys = StringExtractor.extractFromFiles('./src');
console.log(`Found ${keys.length} unique keys:`, keys);

// Find unused translation keys
const unused = StringExtractor.findUnused('./my-extension');
console.log(`Found ${unused.length} unused keys`);
```

### Runtime Helpers

```typescript
// Get a translated message
const greeting = I18nRuntime.t('greeting');

// With substitutions
const message = I18nRuntime.t('items_count', ['5']);

// Pluralization
const label = I18nRuntime.plural(count, 'item', 'items');

// Variable interpolation
const welcome = I18nRuntime.interpolate('welcome_message', { 
  name: 'John', 
  count: 5 
});

// Get current UI locale
const locale = I18nRuntime.getLocale();

// Check RTL
const isRTL = I18nRuntime.isRTL();
```

## ⚙️ Configuration

### manifest.json

Ensure your extension's `manifest.json` includes:

```json
{
  "default_locale": "en"
}
```

### .i18nrc (optional)

Create a `.i18nrc` file in your project root:

```json
{
  "defaultLocale": "en",
  "localesDir": "_locales",
  "sourceExts": [".ts", ".js", ".tsx", ".jsx", ".html"],
  "excludeDirs": ["node_modules", "dist", "build"]
}
```

### package.json

You can also configure via `package.json`:

```json
{
  "webext-i18n": {
    "defaultLocale": "en",
    "localesDir": "_locales"
  }
}
```

## 🌍 Supported Locales

Full support for all 55 Chrome Web Store languages:

| Code | Language | Code | Language |
|------|----------|------|----------|
| `am` | Amharic | `ko` | Korean |
| `ar` | Arabic | `lt` | Lithuanian |
| `bg` | Bulgarian | `lv` | Latvian |
| `bn` | Bengali | `ms` | Malay |
| `ca` | Catalan | `ml` | Malayalam |
| `cs` | Czech | `mr` | Marathi |
| `da` | Danish | `nl` | Dutch |
| `de` | German | `no` | Norwegian |
| `el` | Greek | `pl` | Polish |
| `en` | English | `pt_BR` | Portuguese (Brazil) |
| `en_GB` | English (UK) | `pt_PT` | Portuguese (Portugal) |
| `es` | Spanish | `ro` | Romanian |
| `es_419` | Spanish (Latin America) | `ru` | Russian |
| `et` | Estonian | `sk` | Slovak |
| `fa` | Persian | `sl` | Slovenian |
| `fi` | Finnish | `sv` | Swedish |
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

## 🔗 CI Integration

### GitHub Actions

Add to your workflow:

```yaml
- name: Validate i18n
  run: npx webext-i18n validate

- name: Check translation coverage
  run: npx webext-i18n stats
```

### Pre-commit Hooks

Use with Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "webext-i18n validate && webext-i18n unused"
    }
  }
}
```

## 🔗 Related Projects

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) — Modern Chrome extension starter
- [extension-publisher](https://github.com/theluckystrike/extension-publisher) — Publish extensions to Chrome Web Store
- [@zovo/webext](https://github.com/zovo) — Complete Chrome extension toolkit

## 📄 License

MIT — [Zovo](https://zovo.one)

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
