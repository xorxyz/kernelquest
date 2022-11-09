import { Clock, CLOCK_MS_DELAY, debug } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Area } from './area';
import { Agent } from './agent';
import { King, Wizard } from '../lib/agents';
import words from '../lib/words';
import { CreateAction } from '../lib/actions';

const unsavedActionTypes = [
  'move-cursor',
  'move-cursor-to',
  'switch-mode',
];

/** @category Engine */
export interface EngineOptions {
  world?: World
  rate?: number
}

/** @category Engine */
export interface IWaitCallback {
  tick: number
  fn: Function
}

export interface HistoryEvent {
  tick: number,
  agent: number,
  area: [number, number],
  action: string
}

/** @category Engine */
export class Engine {
  events = new EventEmitter();
  cycle: number = 0;
  master: Agent;
  world: World;
  elapsed: number = 0;
  history: Array<HistoryEvent> = [];
  counter = 0;
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    this.world = opts?.world || new World([]);
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.clock.on('tick', this.update.bind(this));

    this.master = new Agent(this.counter++, new King(), words);

    const area = new Area(0, 0);

    this.world.areas.push(area);

    this.world.agents.add(this.master);

    this.world.hero = this.master;

    area.agents.add(this.master);

    // this.master.schedule(new CreateAction('wizard'));

    // this.processTurn(area, this.master);
  }

  update() {
    this.events.emit('begin-turn');
    this.cycle++;

    const seconds = Math.trunc((this.cycle * CLOCK_MS_DELAY) / 1000);

    this.world.areas.forEach((area) => {
      area.seconds = seconds;
      area.agents.forEach((agent: Agent) => {
        this.processTurn(area, agent);
        this.applyVelocity(area, agent);
      });
    });

    this.events.emit('end-turn');
  }

  async save() {
    console.log('saving:', this.history);
    this.pause();
    await global.electron.save(0, {
      history: this.history,
    });
    this.start();
    this.world.hero.remember({
      tick: this.world.hero.mind.tick,
      message: 'Saved.',
    });
  }

  async load() {
    this.pause();

    const { history } = await global.electron.load(0);

    this.clock.reset();

    console.log(history);

    history.forEach((action) => {
    });

    this.start();
  }

  processTurn(area: Area, agent: Agent) {
    const action = agent.takeTurn(this.cycle, area);

    if (action) {
      action.tryPerforming(area, agent);

      /* Keep a history of actions so we can store them */
      if (!unsavedActionTypes.includes(action.name)) {
        this.history.push({
          tick: this.cycle,
          area: [area.position.x, area.position.y],
          agent: agent.id,
          action: action.name,
        });
      }

      if (action.name === 'save') {
        this.save();
      }

      if (action.name === 'load') {
        this.load();
      }
    }

    if (this.cycle % 10 === 0) agent.sp.increase(1);
    this.events.emit('update', this.cycle);
  }

  applyVelocity(area: Area, agent: Agent) {
    if (agent.velocity.isZero()) return;

    const next = agent.position.clone().add(agent.velocity);
    const target = area.cellAt(next);

    if (target && !target.isBlocked) {
      const previous = area.cellAt(agent.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.position.add(agent.velocity);
      agent.facing.cell = area.cellAt(agent.isLookingAt);
    }

    agent.velocity.setXY(0, 0);
  }

  start() {
    this.clock.start();
    this.events.emit('start', this.cycle);
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    this.events.emit('pause', this.cycle);
    debug('paused engine.');
  }
}
