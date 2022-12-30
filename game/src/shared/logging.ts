/* eslint-disable no-console */

const log = console.log.bind(console);

export const debug = (...args) => {
  log('[debug]:', ...args);
};

export const info = console.info.bind(console);

export const warn = console.warn.bind(console);

export const error = console.error.bind(console);
