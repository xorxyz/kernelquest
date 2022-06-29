import EventEmitter from 'events';
import assert from 'assert';

export class FSM {
  transitions: Record<string, Record<string, string>>;
  state: string;
  submachines: Record<string, FSM> = {};
  events: EventEmitter = new EventEmitter();
  submachine: FSM | null = null;

  constructor(initialState, transitions) {
    this.state = initialState;
    this.transitions = transitions;
  }

  emit(eventName: string) {
    const nextState = this.next(eventName);
    assert.ok(nextState, `fsm.emit: invalid transition${this.state}->${eventName}`);

    if (this.submachine && Object.keys(this.transitions).indexOf(nextState) !== -1) {
      this.unregister();
    }

    this.state = nextState;
    FSM.prototype.emit.call(this, nextState);
  }

  event(eventName: string, machine: FSM) {
    this.submachines[eventName] = machine;
  }

  private unregister() {
    if (this.submachine) {
      this.submachine.unregister();
      this.submachine = null;
    }
  }

  private next(eventName: string) {
    if (this.submachine) {
      const nextState = this.submachine.next(eventName);
      if (nextState) {
        return nextState;
      }
    }

    const submachine = this.submachines[eventName];

    if (submachine) {
      this.submachine = submachine;
      return submachine.state;
    }

    if (!Object.prototype.hasOwnProperty.call(this.transitions[this.state], eventName) &&
        Object.prototype.hasOwnProperty.call(this.transitions, '*')) {
      return this.transitions['*'][eventName];
    }

    return this.transitions[this.state][eventName];
  }
}
