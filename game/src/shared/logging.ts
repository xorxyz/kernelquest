/* eslint-disable no-console */

const log = console.log.bind(console);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const debug = true ? (...args) => {
  log('[debug]:', ...args);
}: noop;

export const info = console.info.bind(console);

export const warn = console.warn.bind(console);

export const error = console.error.bind(console);
