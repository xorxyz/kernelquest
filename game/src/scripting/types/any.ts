import { HexType } from './hex';
import { Idea } from './idea';
import { NumberType } from './number';
import { Quotation } from './quotation';
import { StringType } from './string';
import { Truth } from './truth';
import { LiteralType } from './type';
import { VariableType } from './variable';
import { Word } from './word';

export const AnyAtom = [
  HexType,
  Idea,
  NumberType,
  Quotation,
  StringType,
  Truth,
  LiteralType,
  VariableType,
  Word,
];
