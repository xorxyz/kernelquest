/* eslint-disable vars-on-top */

import { ExitFn, LoadFn, SaveFn } from './io';

/* eslint-disable no-var */
declare global {
  var electron: {
    exit: ExitFn
    save: SaveFn
    load: LoadFn
  };
}

export {};
