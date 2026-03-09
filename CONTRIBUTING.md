# Contributing to webext-i18n

Thank you for your interest in contributing to webext-i18n! This document provides guidelines and instructions for contributing to this project.

## How to Fork and Clone

1. **Fork the repository**: Click the "Fork" button on the GitHub page to create your own copy of the repository.

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-i18n.git
   cd webext-i18n
   ```

3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/theluckystrike/webext-i18n.git
   ```

4. **Keep your fork synced**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

## Code Style Guidelines

- Use consistent indentation (2 or 4 spaces)
- Write meaningful commit messages
- Add comments for complex logic
- Follow existing code patterns in the project
- Ensure all tests pass before submitting

## How to Submit PRs

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**: Implement your feature or fix the bug.

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**: Go to the original repository and click "New Pull Request". Fill in the template and submit.

## Issue Reporting Guidelines

When reporting issues, please include:

- **Clear title**: Describe the problem concisely
- **Steps to reproduce**: Numbered list of steps
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment details**: OS, browser, version, etc.
- **Screenshots**: If applicable

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
