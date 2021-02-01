/* actor capabilities */

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

/* what something looks like */
export class Emoji {
  bytes: string
}

/* chance of crashing */
export class Health {
  current: number
}

/* chance of failing a throw */
export class Stamina {
  current: number
}

/* compute credits */
export class Mana {
  current: number
}

/* buy things */
export class Gold {
  current: number
}
