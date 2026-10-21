'use strict';

const directions = {
  content: {
    number: '01', title: 'Контент и SMM',
    description: 'Истории о бизнесе и людях — в форматах, которые подходят бренду и его аудитории.',
    items: ['Контент-стратегия и редакционный подход', 'Тексты, визуальные истории и видео', 'Коммуникация в социальных сетях']
  },
  pr: {
    number: '02', title: 'PR и коммуникации',
    description: 'Диалог между бизнесом, медиа и людьми. От ясного сообщения до целостной коммуникации бренда.',
    items: ['Коммуникационная стратегия', 'Темы и форматы для медиа', 'Публичный образ бренда']
  },
  collaboration: {
    number: '03', title: 'Коллаборации',
    description: 'Общие идеи на пересечении брендов, людей и сообществ.',
    items: ['Партнёрские концепции', 'Совместные медийные форматы', 'Специальные проекты']
  },
  strategy: {
    number: '04', title: 'Стратегические проекты',
    description: 'Системный взгляд на коммуникации: от задачи бизнеса до единой идеи и плана её воплощения.',
    items: ['Исследование контекста и аудитории', 'Позиционирование и ключевые сообщения', 'Концепция и дорожная карта проекта']
  }
};

const dialog = document.querySelector('#service-dialog');
let lastTrigger;

document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    const direction = directions[button.dataset.service];
    document.querySelector('#dialog-number').textContent = direction.number;
    document.querySelector('#dialog-title').textContent = direction.title;
    document.querySelector('#dialog-description').textContent = direction.description;
    document.querySelector('#dialog-items').replaceChildren(...direction.items.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    lastTrigger = button;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('.dialog-close, .dialog-back').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  lastTrigger?.focus({ preventScroll: true });
});
