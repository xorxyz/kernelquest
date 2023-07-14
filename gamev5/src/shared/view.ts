import { Component } from './component';

export abstract class View {
  abstract components: Record<string, Component>;

  render(): string {
    const output = Object.values(this.components)
      .map((component): string => component.$render());

    return output.join('');
  }

  onLoad?(): void

  update?(): void
}
