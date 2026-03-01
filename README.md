# webext-i18n — Chrome Extension Internationalization Toolkit

[![npm](https://img.shields.io/npm/v/webext-i18n.svg)](https://www.npmjs.com/package/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)** — used to localize 18+ extensions into 55 languages

**Generate, validate, and manage `_locales/messages.json` files** for Chrome extensions. CLI + library.

## 📦 Install

```bash
npm install webext-i18n        # library
npm install -g webext-i18n     # CLI
```

## 🚀 CLI Usage

```bash
webext-i18n validate ./my-extension    # Validate _locales structure
webext-i18n stats ./my-extension       # Translation coverage report
webext-i18n extract ./my-extension/src # Extract i18n keys from source
webext-i18n unused ./my-extension      # Find unused translation keys
```

## 📚 Library API

```typescript
import { I18nGenerator, I18nValidator, I18nRuntime, CoverageStats } from 'webext-i18n';

// Generate _locales from translations
I18nGenerator.generate({ en: { greeting: 'Hello' }, es: { greeting: 'Hola' } }, './my-ext');

// Validate _locales directory
const result = I18nValidator.validate('./my-ext');

// Runtime translation with pluralization
const label = I18nRuntime.plural(count, 'item', 'items');

// Coverage stats
const stats = CoverageStats.getStats('./my-ext');
```

## 🔗 Related Projects
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3)
- [extension-publisher](https://github.com/theluckystrike/extension-publisher)

## 📄 License
MIT — [Zovo](https://zovo.one)
