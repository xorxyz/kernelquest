/*
 * Agents can have a job, gain xp and level up.
 */

import { Look, looks } from '../visuals/looks';

export abstract class Job {
  name: string
  level: number
  xp: number
  look: Look
}

export class CherubJob extends Job {
  name: 'cherub'
  look = looks.cherub
}

export class WorkerJob extends Job {
  name: 'worker'
  look = looks.worker
}

export class ScoutJob extends Job {
  name: 'scout'
  look = looks.scout
}

export class HealerJob extends Job {
  name: 'healer'
  look = looks.healer
}

export class WizardJob extends Job {
  name: 'wizard'
  look = looks.wizard
}

export class CritterJob extends Job {}
export class NoviceJob extends Job {}
