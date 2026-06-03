/**
 * Astro Chart Factory
 * Фабрика для создания и управления астрологическими картами
 */

import { storage } from '../core/storage.js';
import { config } from '../core/config.js';

class ChartFactory {
  constructor() {
    this.charts = new Map();
    this.templates = new Map();
    this.initTemplates();
  }

  /**
   * Инициализирует доступные шаблоны карт
   */
  initTemplates() {
    this.templates.set('radix', {
      type: 'horo',
      name: 'Натальная карта',
      icon: '♈',
      description: 'Классическая натальная карта на момент рождения'
    });

    this.templates.set('transit', {
      type: 'transit',
      name: 'Транзиты',
      icon: '♊',
      description: 'Карта транзитов на текущий момент'
    });

    this.templates.set('synastry', {
      type: 'synastry',
      name: 'Синастрия',
      icon: '♥',
      description: 'Сравнительная карта двух людей'
    });

    this.templates.set('solar', {
      type: 'solar',
      name: 'Солнечный возврат',
      icon: '☉',
      description: 'Карта на день рождения в текущем году'
    });

    this.templates.set('lunar', {
      type: 'lunar',
      name: 'Лунный возврат',
      icon: '☽',
      description: 'Карта на момент возврата Луны'
    });

    this.templates.set('cosmogram', {
      type: 'cosmo',
      name: 'Космограмма',
      icon: '✦',
      description: 'Асцендент и куспиды не рассчитываются'
    });
  }

  /**
   * Создаёт новую карту
   * @param {string} templateId - ID шаблона
   * @param {Object} data - Входные данные
   * @returns {Object}
   */
  create(templateId, data) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Неизвестный шаблон карты: ${templateId}`);
    }

    const chart = {
      id: this.generateId(),
      templateId,
      type: template.type,
      name: template.name,
      createdAt: new Date().toISOString(),
      input: {
        date: data.date || new Date().toISOString(),
        time: data.time || '12:00',
        city: data.city || config.get('city'),
        latitude: data.latitude || config.get('latitude'),
        longitude: data.longitude || config.get('longitude'),
        timezone: data.timezone || config.get('tz'),
        ...data.input
      },
      settings: {
        planets: data.planets || config.get('planets'),
        aspects: data.aspects || config.get('aspects'),
        houses: data.houses || config.get('houses'),
        ...data.settings
      },
      output: null,
      metadata: {
        template,
        ...data.metadata
      }
    };

    this.charts.set(chart.id, chart);
    return chart;
  }

  /**
   * Получает карту по ID
   * @param {string} id - ID карты
   * @returns {Object|null}
   */
  get(id) {
    return this.charts.get(id) || null;
  }

  /**
   * Обновляет карту
   * @param {string} id - ID карты
   * @param {Object} updates - Обновления
   * @returns {Object}
   */
  update(id, updates) {
    const chart = this.get(id);
    if (!chart) {
      throw new Error(`Карта не найдена: ${id}`);
    }

    if (updates.input) {
      chart.input = { ...chart.input, ...updates.input };
    }
    if (updates.settings) {
      chart.settings = { ...chart.settings, ...updates.settings };
    }
    if (updates.output) {
      chart.output = updates.output;
    }

    chart.updatedAt = new Date().toISOString();
    return chart;
  }

  /**
   * Удаляет карту
   * @param {string} id - ID карты
   * @returns {boolean}
   */
  delete(id) {
    return this.charts.delete(id);
  }

  /**
   * Получает все карты
   * @returns {Object[]}
   */
  getAll() {
    return Array.from(this.charts.values());
  }

  /**
   * Фильтрует карты по шаблону
   * @param {string} templateId - ID шаблона
   * @returns {Object[]}
   */
  getByTemplate(templateId) {
    return this.getAll().filter(chart => chart.templateId === templateId);
  }

  /**
   * Генерирует уникальный ID
   * @returns {string}
   */
  generateId() {
    return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Сохраняет карту в хранилище
   * @param {string} id - ID карты
   * @returns {boolean}
   */
  save(id) {
    const chart = this.get(id);
    if (!chart) return false;
    return storage.save(`chart:${id}`, chart);
  }

  /**
   * Загружает карту из хранилища
   * @param {string} id - ID карты
   * @returns {Object|null}
   */
  load(id) {
    const chart = storage.load(`chart:${id}`, null);
    if (chart) {
      this.charts.set(id, chart);
    }
    return chart;
  }

  /**
   * Загружает все сохранённые карты
   * @returns {Object[]}
   */
  loadAll() {
    const keys = storage.keys();
    const charts = [];
    keys.forEach(key => {
      if (key.startsWith('chart:')) {
        const id = key.replace('chart:', '');
        const chart = this.load(id);
        if (chart) charts.push(chart);
      }
    });
    return charts;
  }

  /**
   * Получает шаблон
   * @param {string} templateId - ID шаблона
   * @returns {Object|null}
   */
  getTemplate(templateId) {
    return this.templates.get(templateId) || null;
  }

  /**
   * Получает все шаблоны
   * @returns {Object[]}
   */
  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  /**
   * Экспортирует карту в JSON
   * @param {string} id - ID карты
   * @returns {string}
   */
  export(id) {
    const chart = this.get(id);
    if (!chart) return null;
    return JSON.stringify(chart, null, 2);
  }

  /**
   * Импортирует карту из JSON
   * @param {string} json - JSON строка
   * @returns {Object|null}
   */
  import(json) {
    try {
      const chart = JSON.parse(json);
      if (!chart.id) chart.id = this.generateId();
      this.charts.set(chart.id, chart);
      return chart;
    } catch (error) {
      console.error('Ошибка импорта карты:', error);
      return null;
    }
  }
}

export const chartFactory = new ChartFactory();
