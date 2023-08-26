import { INode } from './inode';

export class Directory extends INode {
  protected override permissions = { owner: 7, group: 7, others: 7 };

  private children: INode[] = [];

  addChild(child: INode): void {
    this.children.push(child);
  }

  removeChild(child: INode): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  get(name: string): INode | null {
    return this.children.find((child) => child.name === name) ?? null;
  }
}
