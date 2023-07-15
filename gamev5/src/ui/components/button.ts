import { Component } from '../../shared/component';

export abstract class ButtonComponent extends Component {
  abstract body: string;

  render(): string {
    return this.body;
  }

  abstract click(): void
}
