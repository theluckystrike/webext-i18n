#!/usr/bin/env node
import { Command } from 'commander';
import { I18nValidator } from './validator';
import { CoverageStats } from './stats';
import { StringExtractor } from './extractor';
import chalk from 'chalk';

const program = new Command();
program.name('webext-i18n').description('Internationalization toolkit for Chrome extensions').version('0.1.0');

program.command('validate').description('Validate _locales directory').argument('[dir]', 'Extension directory', '.')
    .action((dir: string) => {
        const result = I18nValidator.validate(dir);
        if (result.valid) { console.log(chalk.green('✅ i18n validation passed')); }
        else { console.log(chalk.red('❌ Validation failed')); result.errors.forEach((e) => console.log(chalk.red(`  ✗ ${e}`))); }
        if (result.warnings.length) { console.log(chalk.yellow('\nWarnings:')); result.warnings.forEach((w) => console.log(chalk.yellow(`  ⚠ ${w}`))); }
        console.log(`\nLocales: ${result.locales.join(', ')}`);
    });

program.command('stats').description('Show translation coverage').argument('[dir]', 'Extension directory', '.')
    .action((dir: string) => { console.log(CoverageStats.getSummary(dir)); });

program.command('extract').description('Extract i18n keys from source').argument('[dir]', 'Source directory', './src')
    .action((dir: string) => {
        const keys = StringExtractor.extractFromFiles(dir);
        console.log(chalk.blue(`Found ${keys.length} translation key(s):\n`));
        keys.forEach((k) => console.log(`  • ${k}`));
    });

program.command('unused').description('Find unused translation keys').argument('[dir]', 'Extension directory', '.')
    .action((dir: string) => {
        const unused = StringExtractor.findUnused(dir);
        if (unused.length === 0) { console.log(chalk.green('✅ No unused keys')); }
        else { console.log(chalk.yellow(`Found ${unused.length} unused key(s):`)); unused.forEach((k) => console.log(`  • ${k}`)); }
    });

program.parse();
