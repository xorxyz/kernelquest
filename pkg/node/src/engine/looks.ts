/* What it looks like */
export abstract class Look {
  emoji: string
  description: string
}

export class MoneyBagLook extends Look {
  emoji = '💰'
  description = 'oooh shiny'
}

export class WizardLook extends Look {
  emoji = '🧙'
  description = 'looks like a wizard'
}

export class SheepLook extends Look {
  emoji = '🐑'
  description = 'meeeeeeh'
}

export class MonsterLook extends Look {
  emoji = '🐛'
  description = 'looks dangerous'
}

export class NpcLook extends Look {
  emoji = '💁'
  description = 'looks like someone you know'
}
