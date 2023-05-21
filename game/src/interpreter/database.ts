import { debug } from "../shared";
import { Variable, recursiveMap, matchTerms, Quotation } from "./literals";
import { Predicate } from "./operators";
import { Factor, Term } from "./types";

export class Assertion {
  readonly term: Term
  readonly predicate: Predicate
  readonly arguments: Term
  readonly values: Array<any>

  constructor (term: Term) {
    this.term = term;
    const predicate = term.at(-1);

    debug('assertion', predicate)

    if (!(predicate instanceof Predicate)) {
      throw new Error('assertion: Could not instantiate, missing a predicate.');
    }
    this.predicate = predicate;
    this.arguments = term.slice(0, -1);
  }

  matches (query: Query) {
    debug('assertion.matches?', this.arguments, query.arguments);
    return matchTerms(this.arguments, query.arguments);
  }
}

export class Query {
  readonly term: Term
  readonly predicate: Predicate
  readonly arguments: Term
  readonly variables: Variable[] = [];
  private unnamedVariableCount = 0;

  constructor (term: Term) {
    this.term = term;

    const predicate = term.at(-1);

    if (!(predicate instanceof Predicate)) {
      throw new Error('query: Could not instantiate, missing a predicate.');
    }

    this.predicate = predicate;
    this.arguments = recursiveMap(term.slice(0, -1), (factor) => {
      // Name unnamed variables by their order of appearance
      if (factor instanceof Variable) {
        if (!factor.name) {
          factor.name = `__${this.unnamedVariableCount}`;
          this.unnamedVariableCount++;
        }
        this.variables.push(factor);
      }
      return factor;
    })
  }

  apply (frame: Frame) {
    const appliedTerm = recursiveMap(this.term, factor => this.bind(factor, frame))

    return new Query(appliedTerm);
  }

  private bind(factor: Factor, frame: Frame) {
    if (!(factor instanceof Variable)) return factor;

    const data = frame.bindings.get(factor.name);
    if (data) return data;

    return factor;
  }
}

export class Frame {
  readonly variables: Array<string> = [];
  readonly bindings: Map<string, Factor> = new Map();

  bind (data: Factor, name: string): boolean {
    if (name && this.bindings.has(name)) {
      debug(`frame has binding '${name}'`);
      return this.bindings.get(name)?.value === data.value;
    };
    this.bindings.set(name, data);
    this.variables.push(name);
    return true;
  }

  clone () {
    const copy = new Frame();

    this.bindings.forEach((data, name) => {
      copy.bind(data, name);
    });

    return copy;
  }
}

export class Database {
  readonly predicates: Map<string, Predicate> = new Map();
  readonly assertions: Array<Assertion> = [];
  readonly assertionsByPredicate: Map<string, Array<Assertion>> = new Map();
  readonly builtins = {
    and: new Predicate('and', ['quotation']),
    or: new Predicate('or', ['quotation']),
    not: new Predicate('not', ['quotation']),
  }

  addPredicate (predicate: Predicate): boolean {
    debug('addPredicate:', predicate);
    if (this.predicates.has(predicate.name)) {
      return false;
    }

    this.predicates.set(predicate.name, predicate);
    this.assertionsByPredicate.set(predicate.name, []);

    return true;
  }
  
  assert (term: Term) {
    const assertion = new Assertion(term);

    debug('assert', assertion);

    if (!this.predicates.has(assertion.predicate.name)) {
      throw new Error(`assert: predicate "${assertion.predicate.lexeme}" is not in the database.`);
    }

    this.assertionsByPredicate.get(assertion.predicate.lexeme)?.push(assertion);
    this.assertions.push(assertion);
  }

  search (term: Term): Array<Assertion> {
    const query = new Query(term);

    return this.evaluateQuery(query).map(frame => new Assertion(query.apply(frame).term));
  }

  and (terms: Array<Term>): Assertion[][] {
    if (terms.length < 2) throw new Error(`and: Expected at least two queries, got ${terms.length}`);

    const queries = [...terms.map(term => new Query(term))].reverse();

    let frames = this.evaluateQuery(queries[0]);

    queries.slice(1).forEach((query) => {
      const nextFrames = frames.flatMap(frame => {
        return this.evaluateQuery(query, frame);
      });

      frames = nextFrames;
    })

    return frames.map(frame => queries.map(query => 
      new Assertion(query.apply(frame).term)).reverse());
  }

  or (terms: Array<Term>): Assertion[][] {
    if (terms.length < 2) throw new Error(`or: Expected at least two queries, got ${terms.length}`);

    const queries = [...terms.map(term => new Query(term))].reverse();

    const frames = queries.flatMap((query) => {
      return this.evaluateQuery(query);
    });

    return frames.map(frame => queries.map(query => 
      new Assertion(query.apply(frame).term)).reverse());
  }

  not (terms: Array<Term>): Assertion[][] {
    return [[]]
  }

  evaluateQuery (query: Query, frame = new Frame()): Array<Frame> {
    if (!this.predicates.has(query.predicate.lexeme)) {
      throw new Error(`evaluateQuery: predicate "${query.predicate}" is not in the database.`);
    }

    const indexedAssertions = this.assertionsByPredicate.get(query.predicate.lexeme) || [];

    return indexedAssertions
      .map(assertion => this.match(query, assertion, frame))
      .filter((value): value is Frame => !!value)
  }

  match (query: Query, assertion: Assertion, frame: Frame): Frame | false {
    const extendedFrame = frame.clone();
    const matches = !query.variables.length
      ? assertion.matches(query)
      : query.arguments.every((arg, index) => 
          this.recursiveMatch(arg, assertion.arguments[index], extendedFrame));

    return matches ? extendedFrame : false;
  }

  recursiveMatch(pattern: Factor, data: Factor, frame: Frame): boolean {
    debug('recursiveMatch', pattern, data, frame);
    if (pattern instanceof Variable) {
      return frame.bind(data, pattern.name);
    }

    if (pattern instanceof Quotation && data instanceof Quotation) {
      return pattern.value.every((innerFactor, index) => {
        return this.recursiveMatch(innerFactor, data.value[index], frame);
      })
    }

    return pattern.value === data.value;
  }
}
