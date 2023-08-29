// import { IAction, SerializableType } from '../../shared/interfaces';

import { Runtime } from '../../scripting/runtime';
import { IAction } from '../../shared/interfaces';

export interface IProgram {
  run(runtime: Runtime): Generator<IAction | null, number>
}

// * run(): Generator<ISysCall, ISysCall, number> {
//   const pid = yield { name: 'fork' };

//   if (pid < 0) {
//     throw new Error('Fork failed.');
//   }

//   if (pid === 0) {
//     // child process
//     const res = yield { name: 'exec', args: ['/bin/sh'] };
//   }

//   // parent process

//   return { sysCall: 'noop' };
// }
// const process = new Process();

// const p = new Program();

// process.load(p);

// const g = p.run();

// const a = g.next(0);

// const a = g.next(0);
