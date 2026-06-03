/**
 * Astro Graph Factory
 * Фабрика для создания различных типов астрологических графиков
 */

import { storage } from '../core/storage.js';

class GraphFactory {
  constructor() {
    this.graphs = new Map();
    this.types = new Map();
    this.initTypes();
  }

  /**
   * Инициализирует типы графиков
   */
  initTypes() {
    this.types.set('planet-period', {
      name: 'Движение планет за период',
      icon: '📈',
      description: 'Линейный график перемещения планет'
    });

    this.types.set('aspect-period', {
      name: 'Аспекты за период',
      icon: '⟡',
      description: 'График аспектов планет во времени'
    });

    this.types.set('calendar-event', {
      name: 'События в календаре',
      icon: '📅',
      description: 'Точечный график астрологических событий'
    });

    this.types.set('pie-period', {
      name: 'Круговое движение',
      icon: '♻',
      description: 'Круговая диаграмма движения планет'
    });

    this.types.set('3d-radix', {
      name: '3D Радикс',
      icon: '🌐',
      description: 'Трёхмерная визуализация натальной карты'
    });

    this.types.set('statistics', {
      name: 'Статистика',
      icon: '📊',
      description: 'Аналитические графики и диаграммы'
    });
  }

  /**
   * Создаёт новый график
   * @param {string} typeId - ID типа графика
   * @param {Object} config - Конфигурация
   * @returns {Object}
   */
  create(typeId, config) {
    const type = this.types.get(typeId);
    if (!type) {
      throw new Error(`Неизвестный тип графика: ${typeId}`);
    }

    const graph = {
      id: this.generateId(),
      typeId,
      type: type.name,
      createdAt: new Date().toISOString(),
      config: {
        title: config.title || type.name,
        ...config
      },
      data: [],
      layout: this.getDefaultLayout(typeId),
      state: 'idle'
    };

    this.graphs.set(graph.id, graph);
    return graph;
  }

  /**
   * Получает график по ID
   * @param {string} id - ID графика
   * @returns {Object|null}
   */
  get(id) {
    return this.graphs.get(id) || null;
  }

  /**
   * Обновляет график
   * @param {string} id - ID графика
   * @param {Object} updates - Обновления
   * @returns {Object}
   */
  update(id, updates) {
    const graph = this.get(id);
    if (!graph) {
      throw new Error(`График не найден: ${id}`);
    }

    if (updates.config) {
      graph.config = { ...graph.config, ...updates.config };
    }
    if (updates.data) {
      graph.data = updates.data;
    }
    if (updates.layout) {
      graph.layout = { ...graph.layout, ...updates.layout };
    }
    if (updates.state) {
      graph.state = updates.state;
    }

    graph.updatedAt = new Date().toISOString();
    return graph;
  }

  /**
   * Удаляет график
   * @param {string} id - ID графика
   * @returns {boolean}
   */
  delete(id) {
    return this.graphs.delete(id);
  }

  /**
   * Получает все графики
   * @returns {Object[]}
   */
  getAll() {
    return Array.from(this.graphs.values());
  }

  /**
   * Получает типы графиков
   * @returns {Object[]}
   */
  getTypes() {
    return Array.from(this.types.values());
  }

  /**
   * Получает стандартное расположение для типа
   * @param {string} typeId - ID типа
   * @returns {Object}
   */
  getDefaultLayout(typeId) {
    const defaultLayouts = {
      'planet-period': {
        type: 'scatter',
        height: 600,
        showlegend: true,
        hovermode: 'x unified',
        margin: { t: 20, l: 20 }
      },
      'aspect-period': {
        type: 'scatter',
        height: 600,
        showlegend: false,
        hovermode: 'closest'
      },
      'calendar-event': {
        type: 'table',
        height: 'auto'
      },
      'pie-period': {
        type: 'pie',
        height: 600
      },
      '3d-radix': {
        type: 'webgl',
        height: '100vh'
      },
      'statistics': {
        type: 'bar',
        height: 600,
        showlegend: true
      }
    };

    return defaultLayouts[typeId] || {};
  }

  /**
   * Генерирует уникальный ID
   * @returns {string}
   */
  generateId() {
    return `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Сохраняет график
   * @param {string} id - ID графика
   * @returns {boolean}
   */
  save(id) {
    const graph = this.get(id);
    if (!graph) return false;
    return storage.save(`graph:${id}`, graph);
  }

  /**
   * Загружает график
   * @param {string} id - ID графика
   * @returns {Object|null}
   */
  load(id) {
    const graph = storage.load(`graph:${id}`, null);
    if (graph) {
      this.graphs.set(id, graph);
    }
    return graph;
  }

  /**
   * Экспортирует график в JSON
   * @param {string} id - ID графика
   * @returns {string}
   */
  export(id) {
    const graph = this.get(id);
    if (!graph) return null;
    return JSON.stringify(graph, null, 2);
  }

  /**
   * Импортир��ет график из JSON
   * @param {string} json - JSON строка
   * @returns {Object|null}
   */
  import(json) {
    try {
      const graph = JSON.parse(json);
      if (!graph.id) graph.id = this.generateId();
      this.graphs.set(graph.id, graph);
      return graph;
    } catch (error) {
      console.error('Ошибка импорта графика:', error);
      return null;
    }
  }
}

export const graphFactory = new GraphFactory();
