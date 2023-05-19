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

  answer (frame: Frame): Assertion {
    debug('Answering query with frame:', frame, this);

    const extendedTerm = recursiveMap(this.term, factor => this.bind(factor, frame))

    return new Assertion(extendedTerm);
  }

  private bind(factor: Factor, frame: Frame) {
    if (!(factor instanceof Variable)) return factor;

    const data = frame.bindings.get(factor.name);
    if (data) return data;

    throw new Error([
      `Frame could not be mapped to query:`,
      `binding does not exist for variable '${factor.name}'.`
    ].join(' '))
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

    if (!this.predicates.has(query.predicate.lexeme)) {
      throw new Error(`search: predicate "${query.predicate}" is not in the database.`);
    }

    const indexedAssertions = this.assertionsByPredicate.get(query.predicate.lexeme) || [];

    if (!query.variables.length) {
      debug('search: No variable, searching for direct match...', indexedAssertions);
      return indexedAssertions.filter(assertion => assertion.matches(query));
    }

    return indexedAssertions
      .map(assertion => this.match(query, assertion, new Frame()))
      .filter((value): value is Frame => !!value)
      .map(frame => query.answer(frame));
  }

  // [%who [%x 4] position]                                             (who is at column 4)
  // [0:who [1:x 2]]                                                    (variables)
  // [[alice [0 4] position] [bob [2 4] position] [eve [9 9] position]] (assertions)
  // { who: alice, x: 0 } { who: bob, x: 2 }                            (frame matches)
  // { who: eve, x: 9 }                         
  match (query: Query, assertion: Assertion, frame: Frame): Frame | false {
    const nextFrame = frame.clone();
    const matches = query.arguments.every((arg, index) => {
      return this.recursiveMatch(arg, assertion.arguments[index], nextFrame);
    });

    return matches ? nextFrame : false;
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
