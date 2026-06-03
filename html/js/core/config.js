/**
 * Global Configuration Module
 * Централизованное управление конфигурацией приложения
 */

import { storage } from './storage.js';

class Config {
  constructor() {
    this.defaults = {
      planets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
      aspects: [0, 60, 90, 120, 180],
      type: 'horo',
      houses: 'P',
      rotate: '0',
      direction: 'clockwise',
      tz: this.getSystemTimezone(),
      locale: this.getSystemLocale(),
      city: this.getSystemCity(),
      i18n: undefined,
      latitude: undefined,
      longitude: undefined
    };
    this.current = this.load();
  }

  /**
   * Получает системный часовой пояс
   * @returns {string}
   */
  getSystemTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Получает системную локаль
   * @returns {string}
   */
  getSystemLocale() {
    return navigator.languages?.length > 0
      ? navigator.languages[0]
      : navigator.language;
  }

  /**
   * Получает город из часового пояса
   * @returns {string}
   */
  getSystemCity() {
    return this.getSystemTimezone().split('/')[1] || 'UTC';
  }

  /**
   * Загружает конфигурацию из хранилища
   * @returns {Object}
   */
  load() {
    const saved = storage.load('config', null);
    if (!saved) {
      return { ...this.defaults };
    }
    return { ...this.defaults, ...saved };
  }

  /**
   * Сохраняет конфигурацию в хранилище
   */
  save() {
    storage.save('config', this.current);
    window.dispatchEvent(new CustomEvent('config:changed', { detail: this.current }));
  }

  /**
   * Получает значение конфигурации
   * @param {string} key - Ключ
   * @param {*} defaultValue - Значение по умолчанию
   * @returns {*}
   */
  get(key, defaultValue = null) {
    return this.current[key] ?? defaultValue;
  }

  /**
   * Устанавливает значение конфигурации
   * @param {string} key - Ключ
   * @param {*} value - Значение
   */
  set(key, value) {
    this.current[key] = value;
    this.save();
  }

  /**
   * Сбрасывает конфигурацию к значениям по умолчанию
   */
  reset() {
    this.current = { ...this.defaults };
    storage.remove('config');
    window.dispatchEvent(new CustomEvent('config:reset', { detail: this.current }));
  }

  /**
   * Получает всю конфигурацию
   * @returns {Object}
   */
  getAll() {
    return { ...this.current };
  }
}

export const config = new Config();
