export abstract class Component {
  abstract render(): string

  $render(): string {
    return this.render();
  }
}
