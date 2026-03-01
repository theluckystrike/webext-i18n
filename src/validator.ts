/**
 * i18n Validator
 * Validate _locales directory structure and missing translations
 */

import * as fs from 'fs';
import * as path from 'path';
import { MessagesJson } from './generator';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    locales: string[];
    defaultLocale: string | null;
}

export class I18nValidator {
    /**
     * Validate the _locales directory of an extension
     */
    static validate(extensionDir: string): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        const localesDir = path.join(extensionDir, '_locales');

        if (!fs.existsSync(localesDir)) {
            return { valid: false, errors: ['_locales directory not found'], warnings: [], locales: [], defaultLocale: null };
        }

        // Read manifest for default_locale
        let defaultLocale: string | null = null;
        const manifestPath = path.join(extensionDir, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            defaultLocale = manifest.default_locale || null;
            if (!defaultLocale) errors.push('manifest.json missing default_locale — required when using _locales');
        }

        // Get all locale directories
        const locales = fs.readdirSync(localesDir).filter((d) =>
            fs.statSync(path.join(localesDir, d)).isDirectory()
        );

        if (locales.length === 0) {
            errors.push('No locale directories found in _locales/');
            return { valid: false, errors, warnings, locales, defaultLocale };
        }

        // Check default locale exists
        if (defaultLocale && !locales.includes(defaultLocale)) {
            errors.push(`Default locale "${defaultLocale}" directory not found in _locales/`);
        }

        // Read all messages
        const allMessages: Record<string, MessagesJson> = {};
        for (const locale of locales) {
            const messagesPath = path.join(localesDir, locale, 'messages.json');
            if (!fs.existsSync(messagesPath)) {
                errors.push(`${locale}/messages.json not found`);
                continue;
            }
            try {
                allMessages[locale] = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
            } catch {
                errors.push(`${locale}/messages.json is not valid JSON`);
            }
        }

        // Check for missing keys across locales
        if (defaultLocale && allMessages[defaultLocale]) {
            const defaultKeys = Object.keys(allMessages[defaultLocale]);
            for (const locale of locales) {
                if (locale === defaultLocale || !allMessages[locale]) continue;
                const localeKeys = Object.keys(allMessages[locale]);
                const missing = defaultKeys.filter((k) => !localeKeys.includes(k));
                if (missing.length > 0) {
                    warnings.push(`${locale}: missing ${missing.length} key(s): ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '...' : ''}`);
                }
                const extra = localeKeys.filter((k) => !defaultKeys.includes(k));
                if (extra.length > 0) {
                    warnings.push(`${locale}: has ${extra.length} extra key(s) not in default: ${extra.slice(0, 5).join(', ')}`);
                }
            }
        }

        // Check for empty messages
        for (const [locale, messages] of Object.entries(allMessages)) {
            for (const [key, entry] of Object.entries(messages)) {
                if (!entry.message || entry.message.trim() === '') {
                    warnings.push(`${locale}/${key}: empty message`);
                }
            }
        }

        return { valid: errors.length === 0, errors, warnings, locales, defaultLocale };
    }
}
