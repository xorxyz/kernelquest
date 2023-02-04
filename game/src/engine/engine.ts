/* eslint-disable no-var */
import { EventEmitter } from 'events';
import { Story } from 'inkjs/engine/Story';
import {
  Clock, CLOCK_MS_DELAY, debug, Vector,
} from '../shared';
import { VirtualTerminal } from '../ui';
import { World } from './world';
import { Area } from './area';
import { Agent } from './agent';
import {
  actions, fail, IAction, IActionDefinition, IActionResult,
} from './actions';
import { HistoryEvent, SaveGameDict, SaveGameId } from './io';
import { story } from './story';
import { area0, world0 } from './worlds';
import { King } from './agents';
import words from './words';
import joy from '../assets/worlds/area0.kqj';

export type SendFn = (str: string) => void

/** @category Engine */
export interface EngineOptions {
  world?: World
  rate?: number
  send: SendFn
}

/** @category Engine */
export class Engine {
  public world: World;
  public worlds: Set<World> = new Set();
  public hero = new Agent(0, new King(), words);
  public events = new EventEmitter();
  public cycle = 0;
  public elapsed = 0;
  public history: Array<HistoryEvent> = [];
  public future: Array<HistoryEvent> = [];
  public saveGames: SaveGameDict;
  public tty: VirtualTerminal;
  private opts: EngineOptions;
  private initiated = false;
  private saveGameId: SaveGameId;
  readonly clock: Clock;
  story: Story;

  constructor(opts: EngineOptions) {
    const clockRate = opts.rate || CLOCK_MS_DELAY;
    this.opts = opts;
    this.clock = new Clock(2);
    this.story = story;
    this.world = world0;

    this.worlds.add(world0);
    this.world.agents.add(this.hero);

    area0.put(this.hero, new Vector(0, 0));

    this.tty = new VirtualTerminal(this, this.opts.send);

    this.hero.mind.queue.add({
      name: 'exec',
      args: {
        text: joy,
      },
    });

    while (!this.hero.mind.interpreter.isDone() || this.hero.mind.queue.size) {
      this.update();
    }

    this.clock.updateDelay(clockRate);

    this.clock.on('tick', this.updateIfPending.bind(this));

    if (process.env.NODE_ENV === 'production') {
      this.reset();
    } else {
      // this.selectSaveFile(1);
      // this.load();
    }
  }

  async init() {
    const zero = await global.electron.load(0);
    const one = await global.electron.load(1);
    const two = await global.electron.load(2);

    this.saveGames = {
      0: zero,
      1: one,
      2: two,
    };

    this.initiated = true;
  }

  updateIfPending() {
    if (!this.hero.mind.interpreter.isDone() || this.hero.mind.queue.size) {
      console.log('update because pending');
      this.update();
    }
  }

  reset() {
    this.clock.reset();
    this.world = new World(
      (new Array(10))
        .fill(0)
        .flatMap((_, y) => (new Array(16))
          .fill(0)
          .map((__, x) => new Area(x, y))),
    );

    // this.world.creator = this.world.spawn('king', this.world.areas[0]);
    // this.hero = this.world.creator;
    // this.world.activeArea = this.world.areas[0];

    // this.world.create('tree', this.world.worldMap, new Vector(3, 6));
    // this.world.create('tree', this.world.worldMap, new Vector(2, 6));
    // this.world.create('tree', this.world.worldMap, new Vector(3, 7));
    // const zoneNode1 = this.world.create('zone', this.world.worldMap, new Vector(3, 4));
    // this.world.create('route', this.world.worldMap, new Vector(4, 4));
    // this.world.create('route', this.world.worldMap, new Vector(5, 4));
    // this.world.create('route', this.world.worldMap, new Vector(6, 4));
    // const zoneNode2 = this.world.create('route', this.world.worldMap, new Vector(7, 4));
    // this.world.create('route', this.world.worldMap, new Vector(7, 5));
    // this.world.create('route', this.world.worldMap, new Vector(7, 6));
    // this.world.create('route', this.world.worldMap, new Vector(7, 7));
    // const zoneNode3 = this.world.create('zone', this.world.worldMap, new Vector(7, 8));
    // this.world.create('route', this.world.worldMap, new Vector(8, 4));
    // this.world.create('route', this.world.worldMap, new Vector(9, 4));
    // this.world.create('route', this.world.worldMap, new Vector(10, 4));
    // const zoneNode4 = this.world.create('zone', this.world.worldMap, new Vector(11, 4));
    // this.world.create('route', this.world.worldMap, new Vector(8, 8));
    // this.world.create('route', this.world.worldMap, new Vector(9, 8));
    // this.world.create('route', this.world.worldMap, new Vector(10, 8));
    // const zoneNode5 = this.world.create('route', this.world.worldMap, new Vector(11, 8));
    // this.world.create('route', this.world.worldMap, new Vector(11, 8));
    // this.world.create('route', this.world.worldMap, new Vector(11, 9));
    // this.world.create('route', this.world.worldMap, new Vector(11, 10));
    // const zoneNode6 = this.world.create('zone', this.world.worldMap, new Vector(11, 11));

    // this.world.graph.addNode(zoneNode1);
    // this.world.graph.addNode(zoneNode2);
    // this.world.graph.addNode(zoneNode3);
    // this.world.graph.addNode(zoneNode4);
    // this.world.graph.addNode(zoneNode5);
    // this.world.graph.addNode(zoneNode6);

    // this.world.graph.addLine(zoneNode1, zoneNode2);
    // this.world.graph.addLine(zoneNode2, zoneNode3);
    // this.world.graph.addLine(zoneNode2, zoneNode4);
    // this.world.graph.addLine(zoneNode3, zoneNode5);
    // this.world.graph.addLine(zoneNode5, zoneNode6);

    // this.world.activeZone = new Zone();

    // this.world.activeZone.node = zoneNode1;

    // this.world.create('river', this.world.worldMap, new Vector(13, 0));
    // this.world.create('river', this.world.worldMap, new Vector(13, 1));
    // this.world.create('river', this.world.worldMap, new Vector(13, 2));
    // this.world.create('river', this.world.worldMap, new Vector(13, 3));
    // this.world.create('river', this.world.worldMap, new Vector(13, 4));
    // this.world.create('river', this.world.worldMap, new Vector(13, 5));
    // this.world.create('river', this.world.worldMap, new Vector(14, 6));
    // this.world.create('river', this.world.worldMap, new Vector(14, 7));
    // this.world.create('river', this.world.worldMap, new Vector(14, 8));
    // this.world.create('river', this.world.worldMap, new Vector(14, 9));
    // this.world.create('river', this.world.worldMap, new Vector(14, 10));
    // this.world.create('river', this.world.worldMap, new Vector(14, 11));
    // this.world.create('river', this.world.worldMap, new Vector(14, 12));
    // this.world.create('river', this.world.worldMap, new Vector(14, 13));
    // this.world.create('river', this.world.worldMap, new Vector(15, 14));
    // this.world.create('river', this.world.worldMap, new Vector(15, 15));

    // this.world.worldMap.cells[0].erase();
    // this.world.worldMapCursor = this.world.spawn('king', this.world.worldMap, new Vector(3, 4));

    if (this.tty) {
      this.tty.agent = this.hero;
    } else {
      this.tty = new VirtualTerminal(this, this.opts.send);
    }
  }

  selectSaveFile(id: SaveGameId) {
    this.saveGameId = id;
  }

  handleInput(input: string) {
    this.tty.handleInput(input);
  }

  update() {
    this.cycle++;

    this.world.agents.forEach((agent: Agent) => {
      this.processTurn(agent);
      this.applyVelocity(agent);
    });

    this.tty.render();
  }

  undo() {
    const historyEvent = this.history.pop();
    if (!historyEvent) return;

    this.future.push(historyEvent);

    if (historyEvent.failed) return;

    const actionDefinition = actions[historyEvent.action.name];

    const agent = [...this.world.agents.values()].find((a) => a.id === historyEvent.agentId);
    if (!agent) {
      throw new Error(`Undo: Could not find agent ${historyEvent.agentId}`);
    }
    const { area } = agent;

    const context = {
      agent,
      area,
      engine: this,
      world: this.world,
    };

    actionDefinition.undo(context, historyEvent.action.args, historyEvent.state || {});

    this.cycle--;

    agent.see(agent.area);
    this.tty.render();

    console.log('undo', historyEvent);
  }

  redo() {
    const historyEvent = this.future.pop();
    if (!historyEvent) return;

    this.cycle++;

    const actionDefinition = actions[historyEvent.action.name];

    const agent = [...this.world.agents.values()].find((a) => a.id === historyEvent.agentId);
    if (!agent) {
      throw new Error(`Redo: Could not find agent ${historyEvent.agentId}`);
    }
    const { area } = agent;

    const context = {
      agent,
      area,
      engine: this,
      world: this.world,
    };

    actionDefinition.perform(context, historyEvent.action.args);

    this.history.push(historyEvent);

    agent.see(area);
    this.tty.render();

    console.log('redo', historyEvent);
  }

  async save() {
    console.log('saving:', this.history);
    this.pause();

    const oldContents = this.saveGames[this.saveGameId];
    const contents = {
      name: oldContents.name,
      history: this.history,
      world: {
        id: this.world.id,
        zoneId: this.world.activeZone.id,
      },
      stats: {
        level: this.hero.level,
        gold: this.hero.gp.value,
        time: this.cycle,
      },
    };

    this.saveGames[this.saveGameId] = contents;

    await global.electron.save(this.saveGameId, contents);

    this.hero.remember({
      tick: this.hero.mind.tick,
      message: 'Saved.',
    });

    this.start();
  }

  async load() {
    this.pause();
    this.reset();

    const data = await global.electron.load(this.saveGameId);

    // TODO: Ensure agents exist
    // and make this more robust

    debug('Agents:', this.world.agents);

    data.history.forEach((event) => {
      this.cycle = event.tick;
      const agent = [...this.world.agents].find((a) => a.id === event.agentId) as Agent;
      this.tryPerforming(event.action, agent);
    });

    this.hero.name = data.name;
    this.history = data.history;
    this.cycle = data.stats.time;

    this.start();
  }

  authorize(action: IActionDefinition<any>, agent: Agent) {
    if (agent.sp.value - action.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(action.cost);
    return true;
  }

  tryPerforming(action: IAction, agent: Agent): IActionResult {
    // debug('tryPerforming:', agent.id, action.name, area.id);
    const actionDefinition = actions[action.name];

    if (!this.authorize) return fail('Not enough stamina.');

    const context = {
      agent,
      area: agent.area,
      engine: this,
      world: this.world,
    };

    return actionDefinition.perform(context, action.args);
  }

  processTurn(agent: Agent) {
    const action = agent.takeTurn(this.cycle);

    console.log('action', action);

    if (action && action.name !== 'noop') {
      const result = this.tryPerforming(action, agent);

      if (result.message) {
        agent.remember({
          tick: agent.mind.tick,
          message: result.message,
        });
      }

      if (!['save', 'load', 'exit', 'exec'].includes(action.name)) {
        const historyEvent: HistoryEvent = {
          tick: this.cycle,
          agentId: agent.id,
          action,
          state: result.state,
        };

        if (result.status === 'failure') {
          historyEvent.failed = true;
        }

        this.history.push(historyEvent);
        this.future.length = 0;
      }
    } else {
      try {
        agent.mind.think();
      } catch (err) {
        agent.remember({
          tick: agent.mind.tick,
          message: (err as Error).message,
        });
      }
    }

    console.log('done turn', action);
    agent.see(agent.area);

    if (this.cycle % 10 === 0) agent.sp.increase(1);
  }

  applyVelocity(agent: Agent) {
    if (agent.velocity.isZero()) return;

    const next = agent.position.clone().add(agent.velocity);
    const target = agent.area.cellAt(next);

    if (target && !target.isBlocked) {
      const previous = agent.area.cellAt(agent.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.position.add(agent.velocity);
      agent.facing.cell = agent.area.cellAt(agent.isLookingAt);
    }

    agent.velocity.setXY(0, 0);
  }

  start() {
    if (!this.initiated) {
      throw new Error('Engine not initiated. Call \'await engine.init()\' first.');
    }
    this.clock.start();
    this.update();
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    debug('paused engine.');
  }

  createWorld(vector: Vector) {
    const world = new World([]);
    this.worlds.add(world);
    return world;
  }
}
