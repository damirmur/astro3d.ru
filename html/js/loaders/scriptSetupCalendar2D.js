/**
 * Loader for Calendar 2D Page
 * Управляет загрузкой скриптов для страницы календаря
 */

import { scriptLoader } from '../core/loader.js';
import { config } from '../core/config.js';
import { graphFactory } from '../factory/graphFactory.js';

const SCRIPTS = {
  analytics: [
    '/js/web_statisic/google.js',
    '/js/web_statisic/yandex.js'
  ],
  astro: [
    '/js/astro/astrodate-0.0.10.js',
    '/js/lib/source-0.0.6.js'
  ],
  components: [
    '/js/components/select-checkbox-0.0.3.js'
  ],
  calendar: [
    '/js/full2425.js',
    '/js/full2026.js'
  ],
  export: [
    '/js/lib/html2canvas.min.js'
  ]
};

export async function initCalendar2DPage() {
  try {
    console.log('🚀 Инициализация страницы Calendar 2D...');

    // 1. Загружаем аналитику
    console.log('📊 Загружаем аналитику...');
    await scriptLoader.loadParallel(SCRIPTS.analytics).catch(e => {
      console.warn('⚠️ Ошибка загрузки аналитики:', e);
    });

    // 2. Загружаем астрологические библиотеки
    console.log('⭐ Загружаем астрологические библиотеки...');
    await scriptLoader.loadSequence(SCRIPTS.astro);

    // 3. Загружаем компоненты
    console.log('🧩 Загружаем компоненты...');
    await scriptLoader.loadParallel(SCRIPTS.components);

    // 4. Загружаем данные календаря
    console.log('📅 Загружаем данные календаря...');
    await scriptLoader.loadParallel(SCRIPTS.calendar);

    // 5. Заг��ужаем инструменты экспорта
    console.log('💾 Загружаем инструменты экспорта...');
    await scriptLoader.loadParallel(SCRIPTS.export);

    // 6. Инициализируем конфиг
    console.log('⚙️ Инициализируем конфигурацию...');
    config.save();

    // 7. Инициализируем фабрику графиков
    console.log('📈 Инициализируем фабрику графиков...');
    graphFactory.loadAll();

    console.log('✅ Страница Calendar 2D инициализирована успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    return false;
  }
}

// Инициируем при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendar2DPage);
} else {
  initCalendar2DPage();
}
