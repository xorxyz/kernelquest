export class Range {
  min: number
  max: number
}

export abstract class DistributionFunction {
  sample() {}
}

export class Bernoulli extends DistributionFunction {
  sample(): Boolean { return false }
}
