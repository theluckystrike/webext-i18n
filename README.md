# webext-i18n

<p>

[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-i18n)](https://www.npmjs.com/package/@theluckystrike/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Last Commit](https://img.shields.io/github/last-commit/theluckystrike/webext-i18n)](https://github.com/theluckystrike/webext-i18n/commits/main)

</p>

> **Internationalization toolkit for Chrome extensions** — generate `_locales/messages.json`, validate translations, extract strings, and get coverage stats.

**webext-i18n** is a CLI + library for managing i18n in Chrome/Edge/Browser extensions. Generate locale files, validate structure, track translation coverage, and find unused keys.

---

## Features

- 📝 **Generate** `_locales/*/messages.json` from simple translation objects
- ✅ **Validate** locale directory structure and detect missing translations
- 📊 **Stats** — translation coverage reports per locale
- 🔍 **Extract** i18n keys from source code (`chrome.i18n.getMessage()`, `__MSG_KEY__`)
- 🧹 **Unused keys** — find translation keys that are no longer used
- 🔄 **Merge** new translations into existing locale files
- 🌐 **Runtime** helpers for pluralization, interpolation, and RTL detection

---

## Installation

```bash
# As a library
npm install @theluckystrike/webext-i18n

# As a global CLI
npm install -g @theluckystrike/webext-i18n
```

---

## CLI Usage

```bash
# Validate _locales directory structure
webext-i18n validate ./my-extension

# Show translation coverage report
webext-i18n stats ./my-extension

# Extract i18n keys from source code
webext-i18n extract ./my-extension/src

# Find unused translation keys
webext-i18n unused ./my-extension
```

---

## Usage Examples

### Generating Locale Files

```typescript
import { I18nGenerator } from '@theluckystrike/webext-i18n';

// Generate _locales for multiple locales
const translations = {
  en: {
    greeting: 'Hello',
    farewell: 'Goodbye',
    items: '$1 item(s)'
  },
  es: {
    greeting: 'Hola',
    farewell: 'Adiós',
    items: '$1 artículo(s)'
  },
  fr: {
    greeting: 'Bonjour',
    farewell: 'Au revoir',
    items: '$1 article(s)'
  }
};

const descriptions = {
  greeting: 'A friendly greeting',
  items: 'Shows number of items with pluralization'
};

const result = I18nGenerator.generate(translations, './my-extension', descriptions);
console.log(`Generated ${result.locales.length} locales with ${result.totalKeys} keys`);
// Output: Generated 3 locales with 9 keys
```

This creates:
```
my-extension/
└── _locales/
    ├── en/
    │   └── messages.json
    ├── es/
    │   └── messages.json
    └── fr/
        └── messages.json
```

### Validating Locales

```typescript
import { I18nValidator } from '@theluckystrike/webext-i18n';

const result = I18nValidator.validate('./my-extension');

if (result.valid) {
  console.log('✅ Validation passed');
  console.log(`Locales: ${result.locales.join(', ')}`);
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(e => console.log(`  - ${e}`));
}

result.warnings.forEach(w => console.log(`⚠️  ${w}`));
```

### Coverage Stats

```typescript
import { CoverageStats } from '@theluckystrike/webext-i18n';

const stats = CoverageStats.getStats('./my-extension');

stats.forEach(s => {
  console.log(`${s.locale}: ${s.coveragePercent}% (${s.translatedKeys}/${s.totalKeys})`);
  if (s.missingKeys.length > 0) {
    console.log(`  Missing: ${s.missingKeys.join(', ')}`);
  }
});

// Or get a markdown table:
console.log(CoverageStats.getSummary('./my-extension'));
```

### Extracting Keys from Source

```typescript
import { StringExtractor } from '@theluckystrike/webext-i18n';

// Extract all i18n keys used in source
const keys = StringExtractor.extractFromFiles('./src');
console.log(keys);
// ['greeting', 'farewell', 'settings_title', ...]

// Find unused keys (defined but not used)
const unused = StringExtractor.findUnused('./my-extension');
console.log(unused);
```

### Runtime Helpers

```typescript
import { I18nRuntime } from '@theluckystrike/webext-i18n';

// Basic translation
const greeting = I18nRuntime.t('greeting');

// Pluralization
const items = I18nRuntime.plural(5, 'item', 'items');
// Returns "5 items" (uses chrome.i18n internally)

// Interpolation
const welcome = I18nRuntime.interpolate('welcome', { name: 'John', age: 30 });
// If 'welcome' is "Welcome, {name}!" → "Welcome, John!"

// Detect RTL
if (I18nRuntime.isRTL()) {
  document.body.dir = 'rtl';
}

// Get current locale
const locale = I18nRuntime.getLocale(); // 'en-US' → 'en'
```

### Merging Translations

```typescript
import { I18nGenerator } from '@theluckystrike/webext-i18n';

// Add new keys without overwriting existing translations
const result = I18nGenerator.merge(
  './my-extension/_locales/en/messages.json',
  { new_key: 'New translation', existing_key: 'Updated translation' }
);

console.log(`Added: ${result.added}, Updated: ${result.updated}`);
```

---

## API Reference

### `I18nGenerator`

| Method | Description |
|--------|-------------|
| `generate(translations, outputDir, descriptions?)` | Generate `_locales/*/messages.json` from translation object |
| `generateSingle(translations, outputPath, descriptions?)` | Generate single locale file |
| `merge(existingPath, newTranslations)` | Merge new translations into existing file |

### `I18nValidator`

| Method | Description |
|--------|-------------|
| `validate(extensionDir)` | Validate `_locales` structure, returns `ValidationResult` |

**ValidationResult:**
```typescript
{
  valid: boolean;
  errors: string[];
  warnings: string[];
  locales: string[];
  defaultLocale: string | null;
}
```

### `CoverageStats`

| Method | Description |
|--------|-------------|
| `getStats(extensionDir)` | Get per-locale translation coverage stats |
| `getSummary(extensionDir)` | Get markdown table of coverage stats |

**LocaleStats:**
```typescript
{
  locale: string;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  coveragePercent: number;
}
```

### `StringExtractor`

| Method | Description |
|--------|-------------|
| `extractFromFiles(dir, extensions?)` | Extract i18n keys from source files |
| `findUnused(extensionDir)` | Find defined keys not used in source |

### `I18nRuntime`

| Method | Description |
|--------|-------------|
| `t(key, substitutions?)` | Get translated message |
| `plural(count, key, pluralKey?)` | Get pluralized translation |
| `interpolate(key, vars)` | Interpolate variables into translation |
| `getLocale()` | Get current UI locale |
| `isRTL()` | Check if current locale is RTL |

---

## Project Structure

```
webext-i18n/
├── src/
│   ├── cli.ts           # CLI entry point
│   ├── generator.ts     # Generate _locales files
│   ├── validator.ts     # Validate locale structure
│   ├── stats.ts         # Translation coverage stats
│   ├── extractor.ts     # Extract keys from source
│   ├── runtime.ts       # Runtime translation helpers
│   └── index.ts         # Main exports
├── __tests__/           # Unit tests
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## Related Projects

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) — Modern Chrome extension starter with TypeScript
- [extension-publisher](https://github.com/theluckystrike/extension-publisher) — CLI for publishing extensions to Chrome Web Store

---

## License

MIT — [Zovo](https://zovo.one)

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
