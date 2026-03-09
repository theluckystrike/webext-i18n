# Contributing to webext-i18n

Thank you for your interest in contributing! This guide will help you get started.

## 🤝 How to Contribute

### 1. Fork the Repository

Click the "Fork" button on the [GitHub repository](https://github.com/theluckystrike/webext-i18n).

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/webext-i18n.git
cd webext-i18n
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 5. Make Your Changes

- Write your code
- Add tests if applicable
- Update documentation

### 6. Run Tests

```bash
npm test
npm run lint
npm run build
```

### 7. Commit and Push

```bash
git add .
git commit -m "Add: description of your changes"
git push origin feature/your-feature-name
```

### 8. Open a Pull Request

Go to the original repository and open a Pull Request against the `main` branch.

## 🛠 Adding New CLI Commands

The CLI is built with [Commander](https://github.com/tj/commander.js). To add a new command:

1. Open `src/cli.ts`
2. Import your module at the top
3. Add a new command:

```typescript
program.command('your-command')
  .description('Description of what it does')
  .argument('[dir]', 'Argument description', 'default-value')
  .action((dir: string) => {
    // Your implementation
    console.log('Running your command on:', dir);
  });
```

4. Rebuild: `npm run build`

## 🌍 Adding New Locale Support

To add support for a new locale:

1. Update the type definitions in `src/generator.ts` if needed
2. Add the locale code to the README's Supported Locales table
3. Test with the new locale:

```typescript
import { I18nGenerator } from './src/generator';

I18nGenerator.generate({
  your_new_locale: {
    hello: 'Hello in your language'
  }
}, './test-extension');
```

## 📝 Coding Standards

- Use TypeScript
- Follow existing code style
- Add JSDoc comments for public APIs
- Keep functions focused and small

## 📞 Getting Help

- Open an [Issue](https://github.com/theluckystrike/webext-i18n/issues) for bugs or feature requests
- Check existing issues before creating new ones

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
