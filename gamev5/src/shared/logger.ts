/* eslint-disable no-console */

import { noop } from './util';

process.env['DEBUG_MODE'] = 'true';

const log = console.log.bind(console);

export const debug = process.env['DEBUG_MODE']
  ? (...args: unknown[]): void => { log('[debug]:', ...args); }
  : noop;

export const info = console.info.bind(console);

export const warn = console.warn.bind(console);

export const error = console.error.bind(console);

export const logger = {
  debug,
  info,
  warn,
  error,
};
