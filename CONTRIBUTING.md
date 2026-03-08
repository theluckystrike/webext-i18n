# Contributing to webext-i18n

Thank you for your interest in contributing! This guide will help you get started with development.

## 🚀 Quick Start

```bash
# 1. Fork the repository
# Click the "Fork" button on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/webext-i18n.git
cd webext-i18n

# 3. Install dependencies
npm install
# or
pnpm install

# 4. Create a feature branch
git checkout -b feature/my-awesome-feature

# 5. Make your changes
# ... write code ...

# 6. Run tests
npm test

# 7. Build the project
npm run build

# 8. Push and create a PR
git push origin feature/my-awesome-feature
```

## 📋 Development Workflow

### Prerequisites

- Node.js 18+
- npm or pnpm

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Watch mode for development |
| `npm test` | Run tests |
| `npm run lint` | Lint source files |

### Code Style

- Use TypeScript for all new code
- Follow existing code conventions
- Run `npm run lint` before committing
- Add tests for new functionality

## 🎯 Adding New CLI Commands

New CLI commands are added in `src/cli.ts`. Each command follows this pattern:

```typescript
program.command('command-name')
  .description('Description of what the command does')
  .argument('[dir]', 'Argument description', 'default-value')
  .action((dir: string) => {
    // Your implementation
    console.log('Command executed!');
  });
```

### Example: Adding a `sort` Command

```typescript
// In src/cli.ts, add after other commands:

program.command('sort')
  .description('Sort translation keys alphabetically')
  .argument('[dir]', 'Locale directory', './_locales/en')
  .action((dir: string) => {
    const result = I18nSorter.sort(dir);
    console.log(chalk.green(`Sorted ${result.keys} keys in ${result.file}`));
  });
```

## 🌍 Adding Locale Support

To add support for a new locale:

1. **Update the type definitions** in `src/types.ts` (create if needed)
2. **Add the locale code** to the supported locales list in documentation
3. **Add tests** for the new locale format

### Locale Structure

Chrome extensions expect this structure:

```
_locales/
└── {locale_code}/
    └── messages.json
```

Example (`_locales/en/messages.json`):
```json
{
  "extension_name": {
    "message": "My Extension",
    "description": "The name of the extension"
  },
  "greeting": {
    "message": "Hello, $1!",
    "description": "Greeting message"
  }
}
```

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Environment**: Node.js version, OS
2. **Reproduction steps**: Clear steps to reproduce
3. **Expected vs actual behavior**
4. **Screenshots** if applicable
5. **Minimal reproduction** if possible

## 💬 Getting Help

- Open an [issue](https://github.com/theluckystrike/webext-i18n/issues) for bugs or feature requests
- Check existing issues before creating new ones

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.
