<div align="center">

# webext-i18n

Internationalization toolkit for Chrome extensions. Generate, validate, and manage `_locales/messages.json` files. CLI + library.

[![npm version](https://img.shields.io/npm/v/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![npm downloads](https://img.shields.io/npm/dm/webext-i18n)](https://www.npmjs.com/package/webext-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/webext-i18n)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **CLI tool** -- `webext-i18n generate`, `validate`, `extract`, and `stats` commands
- **Generate locales** -- create `_locales/*/messages.json` from a source file
- **Validate** -- check translations for missing keys, mismatched placeholders, and format errors
- **Extract strings** -- pull translatable strings from source code
- **Coverage stats** -- see translation completion per locale
- **Runtime helpers** -- typed `getMessage()` wrapper for use in extension code
- **All 55 Chrome locales** -- supports every locale Chrome accepts

## Installation

```bash
npm install webext-i18n
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add webext-i18n
# or
yarn add webext-i18n
```

</details>

## Quick Start

### CLI

```bash
npx webext-i18n generate --source messages.json --locales en,es,fr,de,ja
npx webext-i18n validate --locales-dir _locales
npx webext-i18n stats --locales-dir _locales
```

### Library

```typescript
import { getMessage } from "webext-i18n";

const greeting = getMessage("hello_world");
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `generate` | Generate `_locales/*/messages.json` for specified locales |
| `validate` | Validate translations for completeness and correctness |
| `extract` | Extract translatable strings from source code |
| `stats` | Show translation coverage per locale |

## Library API

| Function | Description |
|----------|-------------|
| `getMessage(key, substitutions?)` | Typed wrapper for `chrome.i18n.getMessage` |



## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
