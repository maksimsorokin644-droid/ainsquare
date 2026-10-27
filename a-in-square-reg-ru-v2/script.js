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

const motionButton = document.querySelector('.motion-button');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const tilt = document.querySelector('.art-tilt');
let pointerFrame = 0;
let pointerPosition;

function setMotion(enabled) {
  const active = enabled && !reducedMotion.matches;
  document.documentElement.dataset.motion = active ? 'on' : 'off';
  motionButton.setAttribute('aria-pressed', String(active));
  motionButton.textContent = active ? 'Движение: вкл.' : 'Движение: выкл.';
  if (!active) {
    tilt.style.setProperty('--rx', '0deg');
    tilt.style.setProperty('--ry', '0deg');
  }
}

setMotion(!reducedMotion.matches);
motionButton.addEventListener('click', () => setMotion(document.documentElement.dataset.motion !== 'on'));
reducedMotion.addEventListener('change', () => setMotion(!reducedMotion.matches));

hero.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || document.documentElement.dataset.motion !== 'on') return;
  pointerPosition = { x: event.clientX, y: event.clientY };
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    if (!pointerPosition || document.documentElement.dataset.motion !== 'on') return;
    const bounds = hero.getBoundingClientRect();
    const x = Math.max(-.5, Math.min(.5, (pointerPosition.x - bounds.left) / bounds.width - .5));
    const y = Math.max(-.5, Math.min(.5, (pointerPosition.y - bounds.top) / bounds.height - .5));
    tilt.style.setProperty('--ry', `${x * 9}deg`);
    tilt.style.setProperty('--rx', `${-y * 7}deg`);
  });
});
hero.addEventListener('pointerleave', () => {
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  pointerPosition = undefined;
  tilt.style.setProperty('--ry', '0deg');
  tilt.style.setProperty('--rx', '0deg');
});
