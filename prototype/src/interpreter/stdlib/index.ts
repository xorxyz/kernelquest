import combinators from './combinators';
import literals from './literals';
import operators from './operators';

const stdlib = {
  ...literals,
  ...operators,
  ...combinators
};

export default stdlib;