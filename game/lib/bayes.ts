export class Range {
  min: number
  max: number
}

export abstract class DistributionFunction {
  sample(): Boolean {
    const random = getRandom(0, 1);
    const nextValue = Boolean(random);

    this.log.push(nextValue);

    return nextValue;
  }
}

export class Bernoulli extends DistributionFunction {
  sample(): Boolean {
    const random = getRandom(0, 1);
    const nextValue = Boolean(random);

    this.log.push(nextValue);

    return nextValue;
  }
}

export class Distribution {
  fn: DistributionFunction

  pick() {

  }
}

function getRandom(from: number, to: number) {
  const min = Math.ceil(from);
  const max = Math.floor(to);

  return Math.floor(Math.random() * (max - min + 1) + min);
}
