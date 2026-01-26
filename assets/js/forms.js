function initPhoneMasks(context = document) {
  context.querySelectorAll('input[data-phone]').forEach(input => {
    if (input.dataset.maskInitialized) return;
    input.dataset.maskInitialized = 'true';

    input.addEventListener('focus', () => {
      if (!input.value) input.value = '+7 ';
    });

    input.addEventListener('blur', () => {
      if (input.value === '+7 ') input.value = '';
    });

    input.addEventListener('input', () => {
      let digits = input.value.replace(/\D/g, '');

      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (!digits.startsWith('7')) digits = '7' + digits;

      let result = '+7';
      if (digits.length > 1) result += ' (' + digits.slice(1, 4);
      if (digits.length >= 5) result += ') ' + digits.slice(4, 7);
      if (digits.length >= 8) result += '-' + digits.slice(7, 9);
      if (digits.length >= 10) result += '-' + digits.slice(9, 11);

      input.value = result;
    });
  });
}

/* 1️⃣ Инициализация после загрузки */
document.addEventListener('DOMContentLoaded', () => {
  initPhoneMasks();

  /* 2️⃣ Следим за динамическими include */
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          initPhoneMasks(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
