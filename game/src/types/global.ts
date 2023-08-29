declare global {
  // Allows `map.has()` to work as a type guard
  // from https://stackoverflow.com/a/73467859
  interface Map<K, V> {
    has<P extends K>(key: P): this is { get(k: P): V } & this
    // funny thing: `& this` is the final piece of the puzzle
  }
}

export default {};
