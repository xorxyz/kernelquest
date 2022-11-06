import { Clock, CLOCK_MS_DELAY, debug } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Area } from './area';
import { Agent } from './agent';
import { Action } from './action';

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
  world: World;
  heroes: Array<Agent>;
  elapsed: number = 0;
  history: Array<HistoryEvent> = [];
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    this.world = opts?.world || new World([]);
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.clock.on('tick', this.update.bind(this));
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
        // area.events.emit('update');
      });
    });

    this.events.emit('end-turn');
  }

  load(actions: Array<HistoryEvent>) {
    // actions.forEach((action) => {
    //   const agent = [...this.world.agents.values()].find((a) => a.id === action.agent);
    //   const position = new Vector(action.area[0], action.area[1]);
    //   const area = this.world.areas.find((a) => a.position.equals(position));

    //   if (!agent || !area) {
    //     console.error('missing agent and/or area:', agent, area)
    //     return;
    //   }

    //   this.cycle = action.tick;

    //   const virtualAgent = new Proxy(agent, {
    //     apply(target, thisArg, args) {

    //     },
    //   });

    //   // if take turn
    //   // return this action instead

    // this.processTurn(area, agent, [action]);
    // });
    // const level = levels.find((l) => l.id === id);
    // if (level) {
    //   const area = new Area(0, 0);
    //   const king = new Agent(new King());
    //   const dragon = new Agent(new Dragon());

    //   area.put(king, new Vector(1, 1));
    //   area.put(dragon, new Vector(9, 9));

    //   this.world = new World([area]);
    //   this.heroes = [king];
    // }
  }

  processTurn(area: Area, agent: Agent, actions: Array<Action> = []) {
    let done = false;
    let cost = 0;

    if (!actions.length) {
      while (!done && cost <= 1) {
        const senses = new Proxy(area, {});
        const action = agent.takeTurn(this.cycle, senses);
        if (!action) {
          done = true;
        } else {
          cost += action.cost;
          actions.push(action);
        }
      }
    }

    if (actions.length) {
      debug('actions', actions);

      actions.forEach((action) => {
        const result = action.tryPerforming(area, agent);
        if (!result.message) return;

        /* Keep a history of actions so we can store them */
        this.history.push({
          tick: this.cycle,
          area: [area.position.x, area.position.y],
          agent: agent.id,
          action: action.name,
        });
      });
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
