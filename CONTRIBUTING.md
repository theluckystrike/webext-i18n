# Contributing to webext-i18n

Thank you for your interest in contributing to webext-i18n! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](https://github.com/theluckystrike/.github/blob/main/CODE_OF_CONDUCT.md). Please report unacceptable behavior to hello@zovo.one.

## How to Contribute

### Reporting Bugs

1. **Search existing issues** — Someone may have already reported the issue.
2. **Create a new issue** — Use the bug report template.
3. **Include**:
   - Clear title and description
   - Steps to reproduce
   - Expected vs. actual behavior
   - Node.js version, OS, and extension type

### Suggesting Features

1. **Check the roadmap** — Features may already be planned.
2. **Open a discussion** — Use GitHub Discussions for feature ideas.
3. **Provide context**:
   - What problem does this solve?
   - What's your use case?
   - Any implementation ideas?

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make your changes** — Follow the coding standards
4. **Add tests** — If adding new functionality
5. **Run the test suite**: `npm test`
6. **Commit with clear messages**: [Conventional commits](https://www.conventionalcommits.org/) are preferred
7. **Push and open a PR**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/webext-i18n.git
cd webext-i18n

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run in development mode (watch)
npm run dev
```

## Coding Standards

- **TypeScript** — Use strict mode, proper typing
- **ESLint** — Follow the configured linting rules
- **Formatting** — Prettier is configured (run `npx prettier --write`)
- **Commits** — Use clear, descriptive commit messages

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(cli): add diff command for comparing locales

Add new diff command to show differences between locale files
- Shows missing keys in each locale
- Highlights extra keys not in default locale

Closes #123
```

## Project Structure

```
webext-i18n/
├── src/
│   ├── cli.ts          # CLI entry point
│   ├── generator.ts    # Generate messages.json
│   ├── validator.ts   # Validate locale structure
│   ├── extractor.ts   # Extract keys from source
│   ├── stats.ts       # Coverage statistics
│   ├── runtime.ts     # Runtime helpers
│   └── index.ts       # Public exports
├── dist/               # Compiled output
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## Testing

Run tests with vitest:

```bash
npm test
```

Add tests to `src/__tests__/`:

```typescript
import { describe, it, expect } from 'vitest';
import { I18nGenerator } from '../generator';

describe('I18nGenerator', () => {
  it('should generate locale files', () => {
    const translations = { en: { hello: 'Hello' } };
    const result = I18nGenerator.generate(translations, './test-output');
    expect(result.locales).toContain('en');
  });
});
```

## Documentation

- **README.md** — Main documentation (features, CLI, API)
- **CHANGELOG.md** — Release notes (keep updated)
- **JSDoc comments** — For public API methods

## Release Process

1. Update `CHANGELOG.md` with version and date
2. Update version in `package.json`
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin main --tags`
5. GitHub Actions will publish to npm

## Questions?

- Open a [GitHub Discussion](https://github.com/theluckystrike/webext-i18n/discussions)
- Email: hello@zovo.one

---

## Recognition

Contributors will be acknowledged in the README and release notes.

Thank you for making webext-i18n better! 🎉
