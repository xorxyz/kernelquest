const isProd = false;

export const debug = (...x) => { if (isProd) { console.debug(x); } };
export const info = console.info.bind(console);
export const warn = console.warn.bind(console);
export const error = console.error.bind(console);
