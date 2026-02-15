import path from 'path';
import { api } from '@nfjs/core';
import { registerCustomElementsDir, registerLibDir } from '@nfjs/front-server';

const meta = {
  require: {
    after: ['@nfjs/back', '@nfjs/front-pl']
  }
};

const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, '$1');

const menu = await api.loadJSON(`${__dirname}/menu.json`);
const msgs = await api.loadJSON(`${__dirname}/msgs.json`);

async function init() {
  registerLibDir('portal/components');
  registerLibDir('portal/forms');
  await registerCustomElementsDir('portal/components', null, { recursive: true });
}

export {
  init,
  menu,
  msgs,
  meta
};
