/**
 * i18n Runtime Helpers
 * Runtime translation function with pluralization and interpolation
 */

export class I18nRuntime {
    /** Get translated message (wrapper around chrome.i18n.getMessage with fallback) */
    static t(key: string, substitutions?: string | string[]): string {
        if (typeof chrome !== 'undefined' && chrome.i18n) {
            const result = chrome.i18n.getMessage(key, substitutions);
            return result || key;
        }
        return key;
    }

    /** Pluralize based on count */
    static plural(count: number, key: string, pluralKey?: string): string {
        const actualKey = count === 1 ? key : (pluralKey || `${key}_plural`);
        return this.t(actualKey, [count.toString()]);
    }

    /** Interpolate variables into a translated string */
    static interpolate(key: string, vars: Record<string, string | number>): string {
        let message = this.t(key);
        for (const [name, value] of Object.entries(vars)) {
            message = message.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value));
        }
        return message;
    }

    /** Get current UI locale */
    static getLocale(): string {
        if (typeof chrome !== 'undefined' && chrome.i18n) {
            return chrome.i18n.getUILanguage();
        }
        return navigator?.language || 'en';
    }

    /** Check if running in RTL locale */
    static isRTL(): boolean {
        const rtlLocales = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi'];
        const locale = this.getLocale().split('-')[0];
        return rtlLocales.includes(locale);
    }
}
