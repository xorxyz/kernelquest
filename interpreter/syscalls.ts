import { Operator } from './operators';

export class SystemCall extends Operator {}

export const read = new SystemCall(['read'], [], () => {});

const syscalls = {};

[
  read,
].forEach((syscall) => {
  syscall.aliases.forEach((alias) => {
    syscalls[alias] = syscall;
  });
});

export default syscalls;
