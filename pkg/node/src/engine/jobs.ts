/*
 * Actors can have a job, gain xp and level up.
 */

export abstract class Job {
  name: string
  level: number
  xp: number
}

export class FarmerJob extends Job {
  name: 'farmer'
}

export class FairyJob extends Job {
  name: 'fairy'
}

export class WizardJob extends Job {
  name: 'wizard'
}

export class ElfJob extends Job {
  name: 'elf'
}
