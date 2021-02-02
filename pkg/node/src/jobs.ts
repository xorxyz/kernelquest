export abstract class Job {
  name: string
  level: number
  xp: number
}

/* player jobs */
export class FarmerJob extends Job {}
export class FairyJob extends Job {}
export class WizardJob extends Job {}
export class ElfJob extends Job {}
