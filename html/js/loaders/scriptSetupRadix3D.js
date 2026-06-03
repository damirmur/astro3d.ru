/**
 * Loader for Radix 3D Page
 * Управляет загрузкой скриптов для страницы 3D радикс-карты
 */

import { scriptLoader } from '../core/loader.js';
import { config } from '../core/config.js';
import { detector } from '../core/detector.js';
import { chartFactory } from '../factory/chartFactory.js';

const SCRIPTS = {
  analytics: [
    '/js/web_statisic/google.js',
    '/js/web_statisic/yandex.js'
  ],
  astro: [
    '/js/astro/astrodate-0.0.10.js',
    '/js/astro/chart2D.js'
  ],
  components: [
    '/js/components/select-checkbox-0.0.3.js'
  ],
  gui: [
    'https://cdn.jsdelivr.net/npm/lil-gui@0.19'
  ]
};

export async function initRadix3DPage() {
  try {
    console.log('🚀 Инициализация страницы Radix 3D...');

    // Проверяем поддержку WebGL
    if (!detector.supportsWebGL()) {
      console.error('❌ WebGL не поддерживается на этом устройстве');
      alert('Ваше устройство не поддерживает WebGL. 3D визуализация недоступна.');
      return false;
    }

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

    // 4. Загружаем GUI
    console.log('🎛️ Загружаем интерфейс управления...');
    await scriptLoader.loadSequence(SCRIPTS.gui);

    // 5. Инициализируем конфиг
    console.log('⚙️ Инициализируем конфигурацию...');
    config.save();

    // 6. Инициализируем фабрику карт
    console.log('🎨 Инициализируем фабрику карт...');
    chartFactory.loadAll();

    // 7. Загружаем 3D сцену
    console.log('🌐 Загружаем 3D сцену...');
    const sceneScript = document.createElement('script');
    sceneScript.type = 'module';
    sceneScript.src = '/js/3d/scene.js';
    document.head.appendChild(sceneScript);

    console.log('✅ Страница Radix 3D инициализирована успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    return false;
  }
}

// Инициируем при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRadix3DPage);
} else {
  initRadix3DPage();
}
