import { web } from '@nfjs/back';
import path from 'path';
import { api } from "@nfjs/core";
import { list, get, create, update, remove, save, contactsList } from "./lib/employees.js";


const meta = {
    require: {
        after: '@nfjs/back'
    }
};

const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, "$1");

const menu = await api.loadJSON(`${__dirname}/menu.json`);
const msgs = await api.loadJSON(`${__dirname}/msgs.json`);


async function init() {
    web.on('POST', '/employee/list', { middleware: ['session', 'auth', 'json'] }, list);
    web.on('POST', '/employee/get', { middleware: ['session', 'auth', 'json'] }, get);
    web.on('POST', '/employee/create', { middleware: ['session', 'auth', 'json'] }, create);
    web.on('POST', '/employee/update', { middleware: ['session', 'auth', 'json'] }, update);
    web.on('POST', '/employee/delete', { middleware: ['session', 'auth', 'json'] }, remove);
    web.on('POST', '/employee/save', { middleware: ['session', 'auth', 'json'] }, save);
    web.on('POST', '/employee/contactsList', { middleware: ['session', 'auth', 'json'] }, contactsList);
}

export {
    init,
    menu,
    msgs,
    meta
};
