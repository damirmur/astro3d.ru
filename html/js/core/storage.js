/**
 * LocalStorage Helper Module
 * Унифицированный интерфейс для работы с localStorage
 */

class StorageManager {
  constructor(prefix = 'astro3d') {
    this.prefix = prefix;
  }

  /**
   * Генерирует ключ с префиксом
   * @param {string} key - Ключ
   * @returns {string}
   */
  getKey(key) {
    return `${this.prefix}:${key}`;
  }

  /**
   * Сохраняет данные в localStorage
   * @param {string} key - Ключ
   * @param {*} data - Данные
   * @returns {boolean}
   */
  save(key, data) {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Ошибка сохранения: ${key}`, error);
      return false;
    }
  }

  /**
   * Загружает данные из localStorage
   * @param {string} key - Ключ
   * @param {*} defaultValue - Значение по умолчанию
   * @returns {*}
   */
  load(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(this.getKey(key));
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Ошибка загрузки: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Удаляет данные из localStorage
   * @param {string} key - Ключ
   * @returns {boolean}
   */
  remove(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error(`Ошибка удаления: ${key}`, error);
      return false;
    }
  }

  /**
   * Проверяет наличие ключа
   * @param {string} key - Ключ
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Получает все ключи с префиксом
   * @returns {string[]}
   */
  keys() {
    const prefix = this.getKey('');
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''));
      }
    }
    return keys;
  }

  /**
   * Очищает все данные с префиксом
   */
  clear() {
    this.keys().forEach(key => this.remove(key));
  }
}

export const storage = new StorageManager();
