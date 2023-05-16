import { debug } from "../shared";
import { LiteralType, Quotation, Variable } from "./literals"
import { Factor, Term } from "./types"

export class Database {
  readonly predicates: Record<string, Array<LiteralType>> = {}
  readonly facts: Array<Term> = []

  search(quotation: Quotation): Quotation {
    const query = new DatabaseQuery(this.predicates, quotation);
    const facts = this.facts
      .filter(term => term.slice(-1)[0].lexeme === query.predicate.lexeme)
      .filter(term => this.recursiveMatch(query, term))
  
    const results = new Quotation(facts.map(fact => new Quotation(fact)));

    return results;
  }

  and(quotations: Quotation) {
    const queries = this.createQueryList(quotations);

    return new Quotation();
  }

  createQueryList(quotations: Quotation): Array<DatabaseQuery> {
    if (quotations.value.length < 2) {
      const actual = quotations.value.length;
      throw new Error(`and: Expected quotation that contains at least 2 queries, got ${actual}.`);
    }

    if (!quotations.value.every(term => term instanceof Quotation)) {
      const actual = quotations.value.map(f => f.type).join(', ');
      throw new Error(`and: Expected quotation (query) list, got: ${actual}.`);
    }

    let queries: Array<DatabaseQuery>

    try {
      queries = quotations.value.map(term => new DatabaseQuery(this.predicates, term as Quotation))
    } catch (err) {
      throw new Error(`and: Failed to parse queries. ${(err as Error).message}`)
    }

    return queries;
  }

  recursiveMatch(query: DatabaseQuery, term: Term) {
    return query.args.every((arg, index) => {
      if (arg instanceof Quotation) {
        const innerTerm = arg.value; 

        return this.recursiveMatch(query, innerTerm);
      }

      const matches = term[index].value === arg.value
      return arg instanceof Variable || matches;
    })
  }
}

export class DatabaseQuery {
  readonly predicate: Factor
  readonly args: Array<Factor>
  readonly types: Array<LiteralType>
  readonly variables: Set<Variable> = new Set()

  constructor (predicates: Record<string, Array<LiteralType>>, quotation: Quotation) {
    this.predicate = quotation.value[quotation.value.length - 1];

    if (!this.predicate) {
      throw new Error('query: Quotation is missing a predicate.');
    }

    this.types = predicates[this.predicate.lexeme];
    this.args = quotation.value.slice(0, -1);

    this.args.forEach(arg => {
      if (arg instanceof Variable) {
        this.variables.add(arg);
      }
    });
    
    if (!this.argumentsMatch()) {
      const expected = this.types.map(t => t.value).join(',');
      const actual = this.args.map(a => a.type).join(',');
      throw new Error(
        `query: Provided arguments don't match predicate "${this.predicate.lexeme}". ` +
        `Expected '${expected}', got '${actual}'.`
      )
    }
  }

  argumentsMatch () {
    // check that query matches predicate signature
    const argumentsMatch = this.args.every((arg, index) => {
      return (
        arg.type === 'variable' || 
        this.types[index].value === arg.type ||
        // handles case where vector gets parsed as a quotation because it contains a variable
        (this.types[index].value === 'vector' && 
         arg.type === 'quotation' && 
         (arg.value as Array<Factor>)?.some(f => f.type === 'variable')
        )
      )
    })

    return argumentsMatch;
  }
}
