import '/d3/dist/d3.js';

const d3 = globalThis?.d3;
if (!d3) throw new Error('D3 не инициализирован. Проверьте registerLibDir(\"d3\").');

export default d3;
