import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nRuntime } from '../runtime';
import { I18nValidator } from '../validator';
import { I18nGenerator } from '../generator';
import * as fs from 'fs';
import * as path from 'path';

vi.mock('fs');
vi.mock('path');

describe('I18nRuntime', () => {
    beforeEach(() => {
        vi.stubGlobal('chrome', {
            i18n: {
                getMessage: vi.fn((key: string) => key === 'existing_key' ? 'Translated' : ''),
                getUILanguage: vi.fn(() => 'en-US')
            }
        });
        vi.stubGlobal('navigator', { language: 'en-US' });
    });

    it('t should return translated message when key exists', () => {
        expect(I18nRuntime.t('existing_key')).toBe('Translated');
    });

    it('t should return key when translation is missing', () => {
        expect(I18nRuntime.t('missing_key')).toBe('missing_key');
    });

    it('plural should handle singular form', () => {
        expect(I18nRuntime.plural(1, 'apple', 'apples')).toBe('apple');
    });

    it('plural should handle plural form', () => {
        expect(I18nRuntime.plural(2, 'apple', 'apples')).toBe('apples');
    });

    it('interpolate should replace variables', () => {
        // Mock t to return a string with placeholders
        vi.spyOn(I18nRuntime, 't').mockReturnValue('Hello {name}!');
        expect(I18nRuntime.interpolate('greet', { name: 'World' })).toBe('Hello World!');
    });

    it('isRTL should identify RTL locales', () => {
        vi.spyOn(I18nRuntime, 'getLocale').mockReturnValue('ar-EG');
        expect(I18nRuntime.isRTL()).toBe(true);
        vi.spyOn(I18nRuntime, 'getLocale').mockReturnValue('en-US');
        expect(I18nRuntime.isRTL()).toBe(false);
    });
});

describe('I18nGenerator', () => {
    it('generateSingle should return correct count', () => {
        vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
        vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
        vi.spyOn(path, 'dirname').mockReturnValue('/some/dir');
        
        const count = I18nGenerator.generateSingle({ k1: 'v1', k2: 'v2' }, '/path/to/messages.json');
        expect(count).toBe(2);
    });

    it('merge should correctly report added and updated keys', () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
            k1: { message: 'old' }
        }));
        vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);

        const result = I18nGenerator.merge('/path', {
            k1: 'new',
            k2: 'added'
        });
        expect(result.updated).toBe(1);
        expect(result.added).toBe(1);
    });
});

describe('I18nValidator', () => {
    it('should fail if _locales directory is missing', () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(false);
        vi.spyOn(path, 'join').mockReturnValue('_locales');
        
        const result = I18nValidator.validate('/fake/dir');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('_locales directory not found');
    });

    it('should report missing default locale from manifest', () => {
        vi.spyOn(fs, 'existsSync').mockImplementation((p: any) => p.toString().endsWith('_locales') || p.toString().endsWith('manifest.json'));
        vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({})); // Empty manifest
        vi.spyOn(fs, 'readdirSync').mockReturnValue([] as any); // No locales
        vi.spyOn(path, 'join').mockImplementation((...args: any[]) => args.join('/'));

        const result = I18nValidator.validate('/fake/dir');
        expect(result.errors).toContain('manifest.json missing default_locale — required when using _locales');
    });

    it('should report missing messages.json', () => {
        vi.spyOn(fs, 'existsSync').mockImplementation((p: any) => p.toString().includes('_locales') || p.toString().includes('manifest.json'));
        vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ default_locale: 'en' }));
        vi.spyOn(fs, 'readdirSync').mockReturnValue(['en'] as any);
        vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
        vi.spyOn(path, 'join').mockImplementation((...args: any[]) => args.join('/'));
        
        // Mock existence of messages.json specifically as false
        vi.spyOn(fs, 'existsSync').mockImplementation((p: any) => {
            if (p.toString().endsWith('messages.json')) return false;
            return true;
        });

        const result = I18nValidator.validate('/fake/dir');
        expect(result.errors).toContain('en/messages.json not found');
    });
});
