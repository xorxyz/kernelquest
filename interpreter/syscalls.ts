import { Operator } from './operators';

export class SystemCall extends Operator {}

export const read = new SystemCall(['read'], [], () => {});
export const write = new SystemCall(['write'], [], () => {});

const syscalls = {};

[read, write].forEach((syscall) => {
  syscall.aliases.forEach((alias) => {
    syscalls[alias] = syscall;
  });
});

export default syscalls;
