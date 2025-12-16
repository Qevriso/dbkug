// /assets/js/include.js
document.addEventListener("DOMContentLoaded", () => {
  const loadIncludes = async (root = document) => {
    const includeElements = root.querySelectorAll("[data-include]");

    for (const el of includeElements) {
      const file = el.getAttribute("data-include");
      if (!file) continue;

      try {
        const response = await fetch(file);
        if (!response.ok) {
          el.innerHTML = `<!-- include error: ${file} -->`;
          continue;
        }

        const html = await response.text();
        el.innerHTML = html;
        el.removeAttribute("data-include");

        // рекурсивно загружаем вложенные include
        await loadIncludes(el);

      } catch (e) {
        el.innerHTML = `<!-- include failed: ${file} -->`;
      }
    }
  };

  loadIncludes();
});
