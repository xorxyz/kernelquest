import Engine from '../src/engine';

const engine = new Engine({}, []);

engine.start();

test('sanity', () => {
  expect(true).toBe(true);
  engine.pause();
});
