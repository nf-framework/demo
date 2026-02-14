import path from 'path';
import { web } from '@nfjs/back';
import { api } from '@nfjs/core';
import { registerCustomElementsDir, registerLibDir } from '@nfjs/front-server';
import { listEvents, saveEvents, resetEvents } from './lib/calendar.js';
import { listTableSettings, listTableSpan, listTableDeepGroups, listTableMasters, listTableDetails } from './lib/table-datasets.js';

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
  web.on('POST', '/generated/table/settings', { middleware: ['session', 'auth', 'json'] }, listTableSettings);
  web.on('POST', '/generated/table/span', { middleware: ['session', 'auth', 'json'] }, listTableSpan);
  web.on('POST', '/generated/table/deep-groups', { middleware: ['session', 'auth', 'json'] }, listTableDeepGroups);
  web.on('POST', '/generated/table/master-detail/masters', { middleware: ['session', 'auth', 'json'] }, listTableMasters);
  web.on('POST', '/generated/table/master-detail/details', { middleware: ['session', 'auth', 'json'] }, listTableDetails);
}

export {
  init,
  menu,
  msgs,
  meta
};
