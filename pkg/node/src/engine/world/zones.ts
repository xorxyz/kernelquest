import { Room } from './rooms';

export abstract class Zone {
  name: String
  size: number = 8
  readonly rooms: Array<Room>
}

export class Demo extends Zone {
}

export class Town extends Zone {
}

export class Forest extends Zone {
}

export class Desert extends Zone {
}

export class Mountain extends Zone {
}

export class Tower extends Zone {
}
