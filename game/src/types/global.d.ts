/* eslint-disable vars-on-top */

import { ExitFn, LoadFn, SaveFn } from '../engine/io';

/* eslint-disable no-var */
declare global {
  var electron: {
    exit: ExitFn
    save: SaveFn
    load: LoadFn
  };
}

declare module '*.ink' {
  const value: string;
  export default value;
}

declare module '*.joy' {
  const value: string;
  export default value;
}
