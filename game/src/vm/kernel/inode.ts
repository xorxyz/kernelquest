// 0: --- No permissions
// 1: --x Execute only
// 2: -w- Write only
// 3: -wx Write and execute
// 4: r-- Read only
// 5: r-x Read and execute
// 6: rw- Read and write
// 7: rwx Read, write, and execute

export class INode {
  readonly id: number;

  protected permissions = { owner: 6, group: 6, others: 6 };

  private _name = '';

  private owner: { userId: number, groupId: number };

  constructor(id: number, name: string, userId: number, groupId: number) {
    this.id = id;
    this.rename(name);
    this.owner = { userId, groupId };
  }

  get name(): string {
    return this._name;
  }

  rename(name: string): void {
    this._name = name;
  }
}
