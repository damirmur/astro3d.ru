/**
 * Script Loader Module
 * Управляет загрузкой скриптов с поддержкой зависимостей
 */

class ScriptLoader {
  constructor() {
    this.loaded = new Set();
    this.loading = new Map();
    this.cache = new Map();
  }

  /**
   * Загружает скрипт и возвращает Promise
   * @param {string} src - URL скрипта
   * @param {Object} options - Опции загрузки
   * @returns {Promise<HTMLScriptElement>}
   */
  load(src, options = {}) {
    // Если уже загружен, вернуть кэш
    if (this.loaded.has(src)) {
      return Promise.resolve(this.cache.get(src));
    }

    // Если загружается, вернуть существующий Promise
    if (this.loading.has(src)) {
      return this.loading.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.charset = 'utf-8';

      if (options.type) script.type = options.type;
      if (options.async !== false) script.async = true;
      if (options.defer) script.defer = true;

      script.onload = () => {
        this.loaded.add(src);
        this.cache.set(src, script);
        this.loading.delete(src);
        resolve(script);
      };

      script.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Ошибка загрузки скрипта: ${src}`));
      };

      document.head.appendChild(script);
    });

    this.loading.set(src, promise);
    return promise;
  }

  /**
   * Загружает несколько скриптов последовательно
   * @param {string[]} srcs - Массив URL
   * @returns {Promise<HTMLScriptElement[]>}
   */
  loadSequence(srcs) {
    return srcs.reduce(
      (prev, src) => prev.then(() => this.load(src)),
      Promise.resolve()
    );
  }

  /**
   * Загружает несколько скриптов параллельно
   * @param {string[]} srcs - Массив URL
   * @returns {Promise<HTMLScriptElement[]>}
   */
  loadParallel(srcs) {
    return Promise.all(srcs.map(src => this.load(src)));
  }

  /**
   * Проверяет, загружен ли скрипт
   * @param {string} src - URL скрипта
   * @returns {boolean}
   */
  isLoaded(src) {
    return this.loaded.has(src);
  }

  /**
   * Очищает кэш
   */
  clearCache() {
    this.cache.clear();
    this.loaded.clear();
    this.loading.clear();
  }
}

export const scriptLoader = new ScriptLoader();
