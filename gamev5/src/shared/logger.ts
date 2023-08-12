/* eslint-disable no-console */

export const debug = console.debug.bind(console);

export const info = console.info.bind(console);

export const warn = console.warn.bind(console);

export const error = console.error.bind(console);

export const logger = {
  debug,
  info,
  warn,
  error,
};
