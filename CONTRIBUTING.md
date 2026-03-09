# Contributing to webext-i18n

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/webext-i18n.git
cd webext-i18n

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes and test
npm test

# Push and create PR
git push origin feature/your-feature
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run dev
```

## 📁 Project Structure

```
webext-i18n/
├── src/
│   ├── cli.ts           # Command-line interface
│   ├── generator.ts     # Generate messages.json files
│   ├── validator.ts    # Validate locale structure
│   ├── extractor.ts    # Extract keys from source
│   ├── stats.ts        # Coverage statistics
│   ├── runtime.ts      # Runtime utilities
│   └── index.ts        # Main exports
├── .github/
│   └── workflows/      # CI configuration
├── package.json
└── tsconfig.json
```

## ➕ Adding New CLI Commands

1. **Create the command logic** in a new file under `src/`:

```typescript
// src/newcommand.ts
export class NewCommand {
  static execute(dir: string): void {
    // Your command logic here
    console.log('Executing new command in:', dir);
  }
}
```

2. **Add the command to CLI** in `src/cli.ts`:

```typescript
import { NewCommand } from './newcommand';

program.command('newcommand')
  .description('Description of what this command does')
  .argument('[dir]', 'Target directory', '.')
  .action((dir: string) => {
    NewCommand.execute(dir);
  });
```

3. **Export from index** in `src/index.ts`:

```typescript
export { NewCommand } from './newcommand';
```

4. **Test your command**:

```bash
npm run build
node dist/cli.js newcommand ./test-dir
```

## 🌍 Adding New Locale Support

The tool supports all Chrome Web Store locales by default. To add support for a new locale:

1. **Update the CLI** if needed (typically not required since locales are read dynamically)
2. **Add tests** for the new locale in `src/__tests__/`
3. **Update documentation** in README.md

## 🧪 Testing

Write tests for new features:

```typescript
// src/__tests__/generator.test.ts
import { I18nGenerator } from '../generator';

describe('I18nGenerator', () => {
  it('should generate messages.json', () => {
    const translations = {
      en: { hello: 'Hello' }
    };
    const result = I18nGenerator.generate(translations, './test-output');
    expect(result.totalKeys).toBe(1);
  });
});
```

Run tests:

```bash
npm test
```

## 📝 Code Style

- Use TypeScript
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Run lint before committing:

```bash
npm run lint
```

## 📤 Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❓ Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
