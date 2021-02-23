import { Room } from './rooms';

export abstract class Zone {
  name: String
  size: number = 8
  readonly rooms: Array<Room>

  abstract $update(): void

  update() {
    this.$update();
  }
}

export class Town extends Zone {
  $update() {

  }
}

export class Forest extends Zone {
  $update() {

  }
}

export class Mountain extends Zone {
  $update() {

  }
}

export class Tower extends Zone {
  $update() {

  }
}
