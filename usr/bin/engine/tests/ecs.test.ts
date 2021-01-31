import * as joi from 'joi';
import { GameSystem, Component, Entity } from "../lib/ecs";

class EmptySystem extends GameSystem {
  constructor () {
    super('empty', [])
  }
  update () {}
}

class TestComponent extends Component {
  constructor () {
    super('test', {})
  }
}

class TestSystem extends GameSystem {
  constructor () {
    super('test', ['test'])
  }
  update () {}
}

test('system.load: a system\'s component list should include specified components type', () => {
  const component = new TestComponent()
  const entity = new Entity([component])
  const system = new TestSystem()

  expect(system.entities.includes(entity)).toBe(false);
  
  system.load([entity])

  expect(system.entities.includes(entity)).toBe(true);
})

test('system.load: system\'s component list should exclude non-specified component types', () => {
  const component = new TestComponent()
  const entity = new Entity([component])
  const emptySystem = new EmptySystem()

  emptySystem.load([entity])

  console.log(emptySystem.entities)

  expect(emptySystem.entities.includes(entity)).toBe(false);
})
