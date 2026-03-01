/**
 * Translation Coverage Stats
 */
import * as fs from 'fs';
import * as path from 'path';

export interface LocaleStats {
    locale: string;
    totalKeys: number;
    translatedKeys: number;
    missingKeys: string[];
    coveragePercent: number;
}

export class CoverageStats {
    static getStats(extensionDir: string): LocaleStats[] {
        const localesDir = path.join(extensionDir, '_locales');
        if (!fs.existsSync(localesDir)) return [];

        const locales = fs.readdirSync(localesDir).filter((d) => fs.statSync(path.join(localesDir, d)).isDirectory());
        const manifestPath = path.join(extensionDir, 'manifest.json');
        let defaultLocale = 'en';
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            defaultLocale = manifest.default_locale || 'en';
        }

        // Get default locale keys
        const defaultPath = path.join(localesDir, defaultLocale, 'messages.json');
        if (!fs.existsSync(defaultPath)) return [];
        const defaultMessages = JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
        const defaultKeys = Object.keys(defaultMessages);

        return locales.map((locale) => {
            const messagesPath = path.join(localesDir, locale, 'messages.json');
            if (!fs.existsSync(messagesPath)) {
                return { locale, totalKeys: defaultKeys.length, translatedKeys: 0, missingKeys: defaultKeys, coveragePercent: 0 };
            }
            const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
            const localeKeys = Object.keys(messages);
            const missingKeys = defaultKeys.filter((k) => !localeKeys.includes(k));
            const translatedKeys = defaultKeys.length - missingKeys.length;
            return {
                locale,
                totalKeys: defaultKeys.length,
                translatedKeys,
                missingKeys,
                coveragePercent: defaultKeys.length > 0 ? Math.round((translatedKeys / defaultKeys.length) * 100) : 100,
            };
        }).sort((a, b) => b.coveragePercent - a.coveragePercent);
    }

    static getSummary(extensionDir: string): string {
        const stats = this.getStats(extensionDir);
        const lines = ['# Translation Coverage\n', '| Locale | Coverage | Missing |', '|--------|----------|---------|'];
        stats.forEach((s) => lines.push(`| ${s.locale} | ${s.coveragePercent}% | ${s.missingKeys.length} |`));
        return lines.join('\n');
    }
}
