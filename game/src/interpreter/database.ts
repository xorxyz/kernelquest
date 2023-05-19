import { debug } from "../shared";
import { Variable, recursiveMap, matchTerms } from "./literals";
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
  private variableCount = 0;

  constructor (term: Term) {
    this.term = term;

    console.log('TERM', term.toString())

    const predicate = term.at(-1);

    if (!(predicate instanceof Predicate)) {
      throw new Error('query: Could not instantiate, missing a predicate.');
    }

    this.predicate = predicate;
    this.arguments = recursiveMap(term.slice(0, -1), (factor) => {
      // Name unnamed variables by their order of appearance
      if (factor instanceof Variable && !factor.name) {
        factor.name = `__${this.variableCount}`;
        this.variableCount++;
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
    debug('search:', term);
    const query = new Query(term);

    debug('search:', query)

    if (!this.predicates.has(query.predicate.lexeme)) {
      throw new Error(`search: predicate "${query.predicate}" is not in the database.`);
    }

    const indexedAssertions = this.assertionsByPredicate.get(query.predicate.lexeme) || [];

    if (!query.arguments.some(arg => arg instanceof Variable)) {
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
      const data = assertion.arguments[index];
      if (arg instanceof Variable) {
        const name = arg.name ? arg.name : `$${index}`;
        return nextFrame.bind(data, name);
      }
      return arg.value === data.value;
    });

    return matches ? nextFrame : false;
  }
}









// import { debug } from "../shared";
// import { LiteralType, Quotation, Variable } from "./literals"
// import { assertionor, Literal, Term } from "./types"

// // [% [1 %y] position] ?
// // [&1 [0 0] position] [&2 [1 1] position] [&3 [1 2] position]
// // { variables: [], bindings: { [1, 0]:  }  }
// // results: [[&2 [1 1] position] [&3 [1 2] position]]
// export class PatternMatcher {
//   match(query: DatabaseQuery, term: Term, frame: Frame): DatabaseQuery | false {
//     if (!frame.variables.length) {
//       frame.
//       return next;
//     }

//     frame.variables.forEach((variable, index) => {
      
//       const assertionor = term[index];
//     })

//     return false;
//   }
// }

// export class Frame {
//   variables: Array<string> = [];
//   bindings: Record<string, Array<assertionor>> = {};

//   static from (frame: Frame) {
//     const next = new Frame();
//     next.variables = [...frame.variables];
//     Object.entries(frame.bindings).forEach(([key, value]) => {
//       next.bindings[key] = [...value];
//     })
//     return next;
//   }

//   match (variable: Variable) {
//     return this.variables.some(name => name === variable.name);
//   }
// }

// // [% [1 %y] position] ?
// // [&2 [1 1] position] 
// // [a [b=1 c]]
// // { variables: ['a' 'b' 'c'], bindings: { b: 1 }, assertions: [ [&2 [1 1] position]  ]  }
// // { variables: [], bindings: { b: 2 }, assertions: [ [&3 [1 2] position]  ]  }
// function checkassertion (query: DatabaseQuery, assertion: Term, frame: Frame) {
//   query.variables.forEach((variable) => {

//   })
// }

// export class Database {
//   readonly predicates: Record<string, Array<LiteralType>> = {}
//   readonly assertions: Array<Term> = []
//   readonly assertionsByPredicate: Map<string, Array<Term>>

//   private patternMatcher: PatternMatcher = new PatternMatcher();

//   query(quotation: Quotation): DatabaseQuery {
//     const query = new DatabaseQuery(this.predicates, quotation);
//     return query;
//   }

//   search(query: DatabaseQuery): Quotation[] {
//     const frame = new Frame();

//     const assertions = this
//       .findassertionsForPredicate(query.predicate.lexeme)
//       .map(term => this.recursiveMatch(query, term, new Frame()))
//       .filter((x): x is DatabaseQuery => !!x)
//       .map(x => x.quotation);

//     return assertions;
//   }

//   recursiveMatch(query: DatabaseQuery, term: Term, frame: Frame): DatabaseQuery | false {
//     return query.args.every((arg, index) => {
//       if (arg instanceof Quotation) {
//         const innerTerm = arg.value; 

//         return this.recursiveMatch(query, innerTerm, frame);
//       }

//       const matches = term[index].value === arg.value
//       return arg instanceof Variable || matches;
//     })
//   }

//   and(quotations: Quotation) {
//     const queries = this.createQueryList(quotations);
//     const first = queries[0];

//     // find results for first query, then for each result,
//     // create an intermediate query,
//     // binding matching variables, 
//     // find results for that query, then for each result,
//     // continue until all queries have been tested

//     return new Quotation();
//   }

//   private findassertionsForPredicate(lexeme: string) {
//     return this.assertionsByPredicate.get(lexeme) || []
//   }

//   private createQueryList(quotations: Quotation): Array<DatabaseQuery> {
//     if (quotations.value.length < 2) {
//       const actual = quotations.value.length;
//       throw new Error(`and: Expected quotation that contains at least 2 queries, got ${actual}.`);
//     }

//     if (!quotations.value.every(term => term instanceof Quotation)) {
//       const actual = quotations.value.map(f => f.type).join(', ');
//       throw new Error(`and: Expected quotation (query) list, got: ${actual}.`);
//     }

//     let queries: Array<DatabaseQuery>

//     try {
//       queries = quotations.value.map(term => new DatabaseQuery(this.predicates, term as Quotation))
//     } catch (err) {
//       throw new Error(`and: Failed to parse queries. ${(err as Error).message}`)
//     }

//     return queries;
//   }
// }

// export class Query {
//   readonly quotation: Quotation
//   readonly predicate: assertionor
//   readonly args: Array<assertionor>
//   readonly types: Array<LiteralType>
//   readonly variables: Set<Variable> = new Set()

//   constructor (predicates: Record<string, Array<LiteralType>>, quotation: Quotation) {
//     this.quotation = quotation;
//     this.predicate = quotation.value[quotation.value.length - 1];

//     if (!this.predicate) {
//       throw new Error('query: Quotation is missing a predicate.');
//     }

//     this.types = predicates[this.predicate.lexeme];
//     this.args = quotation.value.slice(0, -1);

//     this.args.forEach(arg => {
//       if (arg instanceof Variable) {
//         this.variables.add(arg);
//       }
//     });
    
//     if (!this.argumentsMatch()) {
//       const expected = this.types.map(t => t.value).join(',');
//       const actual = this.args.map(a => a.type).join(',');
//       throw new Error(
//         `query: Provided arguments don't match predicate "${this.predicate.lexeme}". ` +
//         `Expected '${expected}', got '${actual}'.`
//       )
//     }
//   }

//   argumentsMatch () {
//     // check that query matches predicate signature
//     const argumentsMatch = this.args.every((arg, index) => {
//       return (
//         arg.type === 'variable' || 
//         this.types[index].value === arg.type ||
//         // handles case where vector gets parsed as a quotation because it contains a variable
//         (this.types[index].value === 'vector' && 
//          arg.type === 'quotation' && 
//          (arg.value as Array<assertionor>)?.some(f => f.type === 'variable')
//         )
//       )
//     })

//     return argumentsMatch;
//   }
// }
