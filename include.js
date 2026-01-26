// /include.js
// Защита от повторного выполнения
if (window.__includesLoaded) {
  console.warn('include.js: уже загружен, пропускаем повторную инициализацию');
} else {
  window.__includesLoaded = true;

  const loadIncludes = async (root = document) => {
    const includeElements = root.querySelectorAll('[data-include]');

    for (const el of includeElements) {
      const file = el.getAttribute('data-include');
      if (!file) continue;

      // Помечаем элемент как обрабатываемый, чтобы избежать повторной загрузки
      if (el.hasAttribute('data-include-loading')) continue;
      el.setAttribute('data-include-loading', 'true');

      try {
        const response = await fetch(file);
        if (!response.ok) {
          el.innerHTML = `<!-- include error: ${file} -->`;
          el.removeAttribute('data-include');
          el.removeAttribute('data-include-loading');
          continue;
        }

        const html = await response.text();
        el.innerHTML = html;
        el.removeAttribute('data-include');
        el.removeAttribute('data-include-loading');

        // Если Alpine уже запущен, инициализируем добавленное дерево,
        // иначе Alpine подхватит разметку при старте.
        try {
          if (window.Alpine && typeof window.Alpine.initTree === 'function') {
            window.Alpine.initTree(el);
          }
        } catch {
          // ignore
        }

        // рекурсивно загружаем вложенные include
        await loadIncludes(el);
      } catch {
        el.innerHTML = `<!-- include failed: ${file} -->`;
        el.removeAttribute('data-include');
        el.removeAttribute('data-include-loading');
      }
    }
  };

  // Скрипт подключается внизу страницы, поэтому можно стартовать сразу.
  // Если подключат в <head>, подстрахуемся DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadIncludes());
  } else {
    loadIncludes();
  }
}
