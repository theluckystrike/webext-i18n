# Contributing to webext-i18n

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/webext-i18n.git
cd webext-i18n

# 3. Install dependencies
npm install

# 4. Create a feature branch
git checkout -b feature/your-feature

# 5. Make your changes and test
npm run build
npm test

# 6. Push and create a PR
git push origin feature/your-feature
```

## 📋 Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Build

```bash
npm run build    # Compile TypeScript
npm run dev     # Watch mode
```

### Test

```bash
npm test        # Run all tests
npm run lint    # Lint code
```

## 🏗️ Adding New CLI Commands

New CLI commands should be added to `src/cli.ts`. Follow this pattern:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program.command('your-command')
  .description('Description of what the command does')
  .argument('[dir]', 'Argument description', 'default-value')
  .option('-o, --option <value>', 'Option description')
  .action((dir: string, options: any) => {
    // Your implementation
    console.log(chalk.green('✅ Success message'));
  });
```

### Example: Adding a `sort` command

```typescript
program.command('sort')
  .description('Sort keys in messages.json alphabetically')
  .argument('[dir]', 'Extension directory', '.')
  .action((dir: string) => {
    const keys = I18nValidator.getKeys(dir);
    const sorted = keys.sort();
    // Write sorted keys back to file
    console.log(chalk.blue(`Sorted ${sorted.length} keys`));
  });
```

## 🌍 Adding New Locale Support

### Option 1: Update the Validator

If you need to add validation for a new locale structure:

1. Edit `src/validator.ts`
2. Add the locale code to the supported list
3. Add any locale-specific validation rules

### Option 2: Custom Locale Configuration

Users can specify custom locales in their `.i18nrc`:

```json
{
  "locales": ["en", "es", "custom_locale"]
}
```

## 🎯 Adding New Features

### API Changes

If you're adding new functionality to the library:

1. Add exports to `src/index.ts`
2. Document in README.md
3. Add TypeScript types
4. Add unit tests

### Example: Adding a new utility

```typescript
// src/newfeature.ts

export interface NewFeatureOptions {
  option1?: string;
  option2?: number;
}

export function newFeature(options: NewFeatureOptions): Result {
  // Implementation
  return { success: true };
}
```

## 📝 Coding Standards

- Use TypeScript with strict mode
- Follow existing code style
- Add JSDoc comments for public APIs
- Include error handling with meaningful messages

## 🧪 Testing

```bash
# Run tests
npm test

# Run specific test file
npm test -- validator.test.ts

# Watch mode
npm test -- --watch
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { YourModule } from '../yourmodule';

describe('YourModule', () => {
  it('should do something', () => {
    expect(YourModule.doSomething()).toBe('expected');
  });
});
```

## 📤 Submitting Changes

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### PR Guidelines

- Describe what the PR does
- Link any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## 💬 Getting Help

- [Open an issue](https://github.com/theluckystrike/webext-i18n/issues)
- [Join discussions](https://github.com/theluckystrike/webext-i18n/discussions)

---

Built by [Zovo](https://zovo.one) — Part of [@zovo/webext](https://github.com/zovo/webext)
