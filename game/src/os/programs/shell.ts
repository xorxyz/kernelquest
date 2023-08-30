import { Runtime } from '../../scripting/runtime';
import { logger } from '../../shared/logger';
import { IProgram, ProgramExecution } from '../kernel/program';
import { read, open, O_RDONLY } from '../libraries/stdlib';

export const shell: IProgram = {
  * execute(runtime: Runtime, memory: string): ProgramExecution {
    const tty: number = yield open('/dev/tty', O_RDONLY);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      try {
        const offset = 0;
        const length = yield read(tty, 0);

        if (length === -1) throw new Error('Failed to read from stdin.');

        const code = memory.slice(offset, length);
        const exec = runtime.execute(code);

        for (let result = exec.next(); !result.done; result = exec.next()) {
          yield result.value;
        }
      } catch (err) {
        logger.debug('Shell crashed:', (err as Error).message);
        return 1;
      }
    }
  },
};
