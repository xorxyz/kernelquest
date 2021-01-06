import * as joi from 'joi';
import { GameSystem, Component, Entity } from "../lib/ecs";

class TestComponent extends Component {
  constructor () {
    super('test', {})
  }
}

class TestSystem extends GameSystem {
  constructor () {
    super('test', ['test'])
  }
}

test('systems load the right components', () => {
  const component = new TestComponent()
  const entity = new Entity([component])
  const system = new TestSystem()
  
  system.load([entity])

  expect(system.entities.includes(entity)).toBe(true);
})