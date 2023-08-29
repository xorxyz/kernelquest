// import { IAction, SerializableType } from '../../shared/interfaces';

// export type ProgramExecution = Generator<unknown, unknown>

export abstract class Program<A, B> {
  abstract run(): Generator<A, B>
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
