/**
 * Loader for Radix 2D Page
 * Управляет загрузкой скриптов для страницы радикс-карты
 */

import { scriptLoader } from '../core/loader.js';
import { config } from '../core/config.js';
import { chartFactory } from '../factory/chartFactory.js';

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
  plotly: [
    'https://cdn.plot.ly/plotly-2.27.1.min.js',
    'https://cdn.plot.ly/plotly-locale-ru-latest.js'
  ]
};

export async function initRadix2DPage() {
  try {
    console.log('🚀 Инициализация страницы Radix 2D...');

    // 1. Загружаем аналитику параллельно
    console.log('📊 Загружаем аналитику...');
    await scriptLoader.loadParallel(SCRIPTS.analytics).catch(e => {
      console.warn('⚠️ Ошибка загрузки аналитики:', e);
    });

    // 2. Загружаем астрологические библиотеки последовательно
    console.log('⭐ Загружаем астрологические библиотеки...');
    await scriptLoader.loadSequence(SCRIPTS.astro);

    // 3. Загружаем компоненты
    console.log('🧩 Загружаем компоненты...');
    await scriptLoader.loadParallel(SCRIPTS.components);

    // 4. Загружаем Plotly
    console.log('📈 Загружаем Plotly...');
    await scriptLoader.loadSequence(SCRIPTS.plotly);

    // 5. Инициализируем конфиг
    console.log('⚙️ Инициализируем конфигурацию...');
    config.save();

    // 6. Инициализируем фабрику карт
    console.log('🎨 Инициализируем фабрику карт...');
    chartFactory.loadAll();

    // 7. Устанавливаем Plotly локаль если нужно
    if (config.get('locale').slice(0, 2) === 'ru' && window.Plotly) {
      window.Plotly.setPlotConfig({ locale: 'ru-RU' });
    }

    console.log('✅ Страница Radix 2D инициализирована успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    return false;
  }
}

// Инициируем при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRadix2DPage);
} else {
  initRadix2DPage();
}
