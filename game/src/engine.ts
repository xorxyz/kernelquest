import { Clock, CLOCK_MS_DELAY, debug, Vector } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Area } from './area';
import { Agent, Dragon, IAgent, King } from './agent';
import { Action, IAction } from './action';

const defaultArea = new Area(0, 0);

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
  agent: IAgent,
  action: IAction
}

/** @category Engine */
export class Engine extends EventEmitter {
  cycle: number = 0;
  world: World;
  heroes: Array<Agent>;
  elapsed: number = 0;
  history: Array<HistoryEvent> = [];
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    super();

    const king = new Agent(new King());

    defaultArea.put(king, new Vector(1, 1));

    const dragon = new Agent(new Dragon());

    defaultArea.put(dragon, new Vector(9, 9));

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World([defaultArea]);
    this.heroes = [king];

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.emit('begin-turn');
    this.cycle++;

    const seconds = Math.trunc((this.cycle * CLOCK_MS_DELAY) / 1000);

    this.world.areas.forEach((area) => {
      area.seconds = seconds;
      area.agents.forEach((agent: Agent) => {
        this.processTurn(area, agent);
        this.applyVelocity(area, agent);
        area.events.emit('update');
      });
    });

    this.emit('end-turn');
  }

  processTurn(area: Area, agent: Agent) {
    const actions: Array<Action> = [];
    let done = false;
    let cost = 0;

    while (!done && cost <= 1) {
      const action = agent.takeTurn(this.cycle);
      if (!action) {
        done = true;
      } else {
        cost += action.cost;
        actions.push(action);
      }
    }

    if (actions.length) {
      debug('actions', actions);

      actions.forEach((action) => {
        /* Keep a history of actions so we can save them later */
        this.history.push({
          tick: this.cycle,
          agent: agent.serialize(),
          action: action.serialize(),
        });

        const result = action.tryPerforming(area, agent);
        if (!result.message) return;
        agent.remember({
          tick: this.cycle,
          message: result.message,
        });
      });
    }

    if (this.cycle % 10 === 0) agent.sp.increase(1);
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
    this.world.areas.forEach((area) => area.events.emit('start'));
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    this.world.areas.forEach((area) => area.events.emit('pause'));
    debug('paused engine.');
  }
}
