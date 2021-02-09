/*
 * the interpreter runs on a VM
 */
export class Cpu {}
export class Memory {}

export default class VirtualMachine {
  cpu: Cpu
  memory: Memory

  stdin: Array<string>
  stdout: Array<string>
  stderr: Array<string>

  constructor() {
    this.cpu = new Cpu();
    this.memory = new Memory();
    this.stdin = [];
    this.stdout = [];
    this.stderr = [];
  }
}
