/**
 * String Extractor
 * Extract translatable strings from source files
 */
import * as fs from 'fs';
import * as path from 'path';

export class StringExtractor {
    /**
     * Extract chrome.i18n.getMessage() calls from source files
     */
    static extractFromFiles(dir: string, extensions: string[] = ['.js', '.ts', '.tsx', '.jsx']): string[] {
        const keys = new Set<string>();
        this.walkDir(dir, extensions, (content) => {
            // Match chrome.i18n.getMessage('key') and getMessage("key")
            const patterns = [
                /chrome\.i18n\.getMessage\s*\(\s*['"]([^'"]+)['"]/g,
                /getMessage\s*\(\s*['"]([^'"]+)['"]/g,
                /__MSG_([^_]+)__/g,
            ];
            for (const pattern of patterns) {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    keys.add(match[1]);
                }
            }
        });
        return Array.from(keys).sort();
    }

    /**
     * Find unused translation keys
     */
    static findUnused(extensionDir: string): string[] {
        const messagesPath = path.join(extensionDir, '_locales', 'en', 'messages.json');
        if (!fs.existsSync(messagesPath)) return [];

        const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
        const definedKeys = Object.keys(messages);
        const usedKeys = this.extractFromFiles(path.join(extensionDir, 'src'));

        return definedKeys.filter((k) => !usedKeys.includes(k));
    }

    private static walkDir(dir: string, extensions: string[], callback: (content: string) => void): void {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                this.walkDir(fullPath, extensions, callback);
            } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
                callback(fs.readFileSync(fullPath, 'utf-8'));
            }
        }
    }
}
