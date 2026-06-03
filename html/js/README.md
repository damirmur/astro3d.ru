# JavaScript Architecture Refactoring

Новая модульная архитектура фронтенда для `astro3d.ru`

## 📁 Структура проекта

```
html/js/
├── core/                      # Ядро приложения
│   ├── loader.js             # Управление загрузкой скриптов
│   ├── storage.js            # Работа с localStorage
│   ├── config.js             # Глобальная конфигурация
│   └── detector.js           # Определение платформы/устройства
│
├── factory/                   # Фабрики для создания объектов
│   ├── chartFactory.js       # Фабрика астрологических карт
│   └── graphFactory.js       # Фабрика графиков
│
├── loaders/                   # Специфичные загрузчики для страниц
│   ├── scriptSetupRadix2D.js
│   ├── scriptSetupCalendar2D.js
│   └── scriptSetupRadix3D.js
│
├── components/               # Компоненты (Web Components, etc)
├── astro/                    # Астрологические алгоритмы
├── lib/                      # Внешние библиотеки
├── i18n/                     # Локализация
├── fragments/                # HTML-фрагменты
│
└── README.md
```

## 🚀 Использование

### Инициализация страницы

```html
<!-- В радикс2D.html -->
<script type="module" src="/js/loaders/scriptSetupRadix2D.js"></script>
```

### Работа с конфигурацией

```javascript
import { config } from './core/config.js';

// Получить значение
const timezone = config.get('tz');

// Установить значение
config.set('planets', [0, 1, 2]);

// Сбросить конфиг
config.reset();

// Слушать изменения
window.addEventListener('config:changed', (e) => {
  console.log('Конфиг изменился:', e.detail);
});
```

### Работа с хранилищем

```javascript
import { storage } from './core/storage.js';

// Сохранить
storage.save('myKey', { data: 'value' });

// Загрузить
const data = storage.load('myKey');

// Удалить
storage.remove('myKey');

// Проверить
if (storage.has('myKey')) {
  // ...
}
```

### Загрузка скриптов

```javascript
import { scriptLoader } from './core/loader.js';

// Загрузить один скрипт
await scriptLoader.load('/js/lib/script.js');

// Загрузить последовательно
await scriptLoader.loadSequence([
  '/js/lib/script1.js',
  '/js/lib/script2.js'
]);

// Загрузить параллельно
await scriptLoader.loadParallel([
  '/js/lib/script1.js',
  '/js/lib/script2.js'
]);
```

### Фабрика карт

```javascript
import { chartFactory } from './factory/chartFactory.js';

// Создать карту
const chart = chartFactory.create('radix', {
  date: '2026-06-03',
  time: '12:00',
  city: 'Moscow',
  latitude: 55.75,
  longitude: 37.61
});

// Получить карту
const chart = chartFactory.get(chartId);

// Обновить карту
chartFactory.update(chartId, {
  settings: { planets: [0, 1, 2] }
});

// Сохранить карту
chartFactory.save(chartId);

// Загрузить все сохранённые
const allCharts = chartFactory.loadAll();

// Экспортировать
const json = chartFactory.export(chartId);

// Импортировать
const chart = chartFactory.import(json);
```

### Фабрика графиков

```javascript
import { graphFactory } from './factory/graphFactory.js';

// Создать график
const graph = graphFactory.create('planet-period', {
  title: 'Движение планет',
  startDate: '2026-01-01',
  endDate: '2026-12-31'
});

// Обновить данные
graphFactory.update(graphId, {
  data: [...],
  state: 'ready'
});

// Получить все доступные типы
const types = graphFactory.getTypes();
```

### Определение устройства

```javascript
import { detector } from './core/detector.js';

if (detector.isMobile) {
  // Мобильный интерфейс
}

if (detector.supportsWebGL()) {
  // Загружаем 3D
}

const info = detector.getDeviceInfo();
console.log(info);
```

## 📊 Преимущества новой архитектуры

✅ **Модульность** - Код разделён на логические модули  
✅ **Переиспользуемость** - Фабрики для создания карт и графиков  
✅ **Простота тестирования** - Каждый модуль независим  
✅ **Управление зависимостями** - Явная загрузка скриптов  
✅ **Хранилище** - Унифицированный интерфейс  
✅ **Конфигурация** - Централизованное управление  
✅ **ES Modules** - Современный стандарт JS  

## 🔄 Миграция со старой системы

Старые файлы (`astro2D.js`, `components.js`, `start.js`) заменяются на новые модули:

- `start.js` → `core/config.js` + `loaders/scriptSetup*.js`
- `astro2D.js` → `loaders/scriptSetupRadix2D.js`
- `components.js` → `loaders/scriptSetupRadix2D.js`

## 📝 Примеры использования

См. папку `loaders/` для примеров инициализации каждой страницы.
