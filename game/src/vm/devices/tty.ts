export class TTY {
  private buffer: string[] = [];

  read(): string {
    const text = this.buffer[this.buffer.length - 1];
    return text ?? '';
  }

  write(text: string): void {
    this.buffer.push(text);
  }
}
