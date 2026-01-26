// /include.js
const loadIncludes = async (root = document) => {
  const includeElements = root.querySelectorAll('[data-include]');

  for (const el of includeElements) {
    const file = el.getAttribute('data-include');
    if (!file) continue;

    try {
      const response = await fetch(file);
      if (!response.ok) {
        el.innerHTML = `<!-- include error: ${file} -->`;
        continue;
      }

      const html = await response.text();
      el.innerHTML = html;
      el.removeAttribute('data-include');

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
