import path from 'path';
import { web } from '@nfjs/back';
import { api } from '@nfjs/core';
import { registerCustomElementsDir, registerLibDir } from '@nfjs/front-server';
import { listEvents, saveEvents, resetEvents } from './lib/calendar.js';

const meta = {
  require: {
    after: ['@nfjs/back', '@nfjs/front-pl']
  }
};

const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, '$1');

const menu = await api.loadJSON(`${__dirname}/menu.json`);
const msgs = await api.loadJSON(`${__dirname}/msgs.json`);

async function init() {
  // Отдаем весь каталог компонентов как статическую либу, чтобы работали
  // абсолютные browser-import пути вида /generated/components/... .
  registerLibDir('generated/components');

  // Регистрируем все js-файлы components (включая вложенные view/helper) для загрузки из браузера
  // и карту /load-custom-element/:component для pl-pro-calendar.
  await registerCustomElementsDir('generated/components', null, { recursive: true });

  web.on('POST', '/generated/calendar/events', { middleware: ['session', 'auth', 'json'] }, listEvents);
  web.on('POST', '/generated/calendar/save', { middleware: ['session', 'auth', 'json'] }, saveEvents);
  web.on('POST', '/generated/calendar/reset', { middleware: ['session', 'auth', 'json'] }, resetEvents);
}

export {
  init,
  menu,
  msgs,
  meta
};
