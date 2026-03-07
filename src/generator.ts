/**
 * i18n Messages Generator
 * Generate _locales/[locale]/messages.json from source translations
    */

import * as fs from 'fs';
import * as path from 'path';

export interface MessageEntry {
    message: string;
    description?: string;
    placeholders?: Record<string, { content: string; example?: string }>;
}

export type MessagesJson = Record<string, MessageEntry>;

export class I18nGenerator {
    /**
     * Generate _locales directory structure from a translations object
     * @param translations - { locale: { key: "translation" } }
     * @param outputDir - Extension root dir (will create _locales/ inside)
     */
    static generate(
        translations: Record<string, Record<string, string>>,
        outputDir: string,
        descriptions?: Record<string, string>
    ): { locales: string[]; totalKeys: number } {
        const locales = Object.keys(translations);
        let totalKeys = 0;

        for (const locale of locales) {
            const localeDir = path.join(outputDir, '_locales', locale);
            fs.mkdirSync(localeDir, { recursive: true });

            const messages: MessagesJson = {};
            const entries = translations[locale];

            for (const [key, message] of Object.entries(entries)) {
                messages[key] = {
                    message,
                    description: descriptions?.[key] || undefined,
                };

                // Auto-detect placeholders ($1, $2, etc.)
                const placeholderMatches = message.match(/\$(\w+)\$/g);
                if (placeholderMatches) {
                    messages[key].placeholders = {};
                    placeholderMatches.forEach((match, i) => {
                        const name = match.replace(/\$/g, '').toLowerCase();
                        messages[key].placeholders![name] = {
                            content: `$${i + 1}`,
                            example: `value${i + 1}`,
                        };
                    });
                }

                totalKeys++;
            }

            fs.writeFileSync(
                path.join(localeDir, 'messages.json'),
                JSON.stringify(messages, null, 2)
            );
        }

        return { locales, totalKeys };
    }

    /**
     * Generate messages.json for a single locale from key-value pairs
     */
    static generateSingle(
        translations: Record<string, string>,
        outputPath: string,
        descriptions?: Record<string, string>
    ): number {
        const messages: MessagesJson = {};

        for (const [key, message] of Object.entries(translations)) {
            messages[key] = { message, description: descriptions?.[key] };
        }

        const dir = path.dirname(outputPath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(messages, null, 2));

        return Object.keys(messages).length;
    }

    /**
     * Merge new translations into existing messages.json
     */
    static merge(existingPath: string, newTranslations: Record<string, string>): { added: number; updated: number } {
        let existing: MessagesJson = {};
        if (fs.existsSync(existingPath)) {
            existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
        }

        let added = 0;
        let updated = 0;

        for (const [key, message] of Object.entries(newTranslations)) {
            if (existing[key]) {
                if (existing[key].message !== message) {
                    existing[key].message = message;
                    updated++;
                }
            } else {
                existing[key] = { message };
                added++;
            }
        }

        fs.writeFileSync(existingPath, JSON.stringify(existing, null, 2));
        return { added, updated };
    }
}
