# Contributing to webext-i18n

Thank you for your interest in contributing to webext-i18n! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 8+ (recommended) or npm

### Quick Start

```bash
# Fork the repository
git fork https://github.com/theluckystrike/webext-i18n.git

# Clone your fork
git clone https://github.com/YOUR_USERNAME/webext-i18n.git
cd webext-i18n

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
webext-i18n/
├── src/
│   ├── cli.ts          # Command-line interface
│   ├── generator.ts    # Locale file generation
│   ├── validator.ts    # Locale validation
│   ├── extractor.ts     # Key extraction from source
│   ├── stats.ts        # Coverage statistics
│   ├── runtime.ts      # Runtime translation helpers
│   └── index.ts        # Public API exports
├── .github/
│   └── workflows/      # CI configuration
├── package.json
└── tsconfig.json
```

## Adding New CLI Commands

New CLI commands should be added to `src/cli.ts`:

```typescript
program.command('my-command')
  .description('Description of what it does')
  .argument('[dir]', 'Argument description', 'default-value')
  .action((dir: string) => {
    // Your implementation
    console.log('Command executed');
  });
```

### Example: Adding a `sort` command

```typescript
// In src/cli.ts, add:
import * as fs from 'fs';
import * as path from 'path';

program.command('sort')
  .description('Sort translation keys alphabetically')
  .argument('[dir]', 'Extension directory', '.')
  .action((dir: string) => {
    const localesDir = path.join(dir, '_locales');
    if (!fs.existsSync(localesDir)) {
      console.log(chalk.red('_locales directory not found'));
      return;
    }
    
    const locales = fs.readdirSync(localesDir)
      .filter(d => fs.statSync(path.join(localesDir, d)).isDirectory());
    
    for (const locale of locales) {
      const messagesPath = path.join(localesDir, locale, 'messages.json');
      if (fs.existsSync(messagesPath)) {
        const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
        const sorted: Record<string, any> = {};
        Object.keys(messages).sort().forEach(key => {
          sorted[key] = messages[key];
        });
        fs.writeFileSync(messagesPath, JSON.stringify(sorted, null, 2));
      }
    }
    console.log(chalk.green(`Sorted keys in ${locales.length} locale(s)`));
  });
```

## Adding New Locales

To add support for a new locale:

1. **Test the locale** with your extension:
   ```bash
   mkdir -p _locales/NEW_LOCALE
   echo '{}' > _locales/NEW_LOCALE/messages.json
   ```

2. **Update README.md** with the new locale in the Supported Locales table

3. **Add tests** in `src/__tests__/`

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test --testPathPattern=validator
```

## Code Style

- Use **TypeScript** for all new code
- Follow existing code conventions
- Add JSDoc comments for public APIs
- Run `pnpm lint` before committing

## Submitting Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m 'feat: add new command X'
   ```

3. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```

4. Open a Pull Request

## Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

## Publishing

Maintainers can publish to npm:

```bash
# Bump version
pnpm version patch  # or minor, major

# Publish to npm
pnpm publish
```

---

Questions? Open an issue at https://github.com/theluckystrike/webext-i18n/issues
