const isDev = true;

export const debug = (...x) => { if (isDev) { console.log(...x); } };
export const info = console.info.bind(console);
export const warn = console.warn.bind(console);
export const error = console.error.bind(console);
