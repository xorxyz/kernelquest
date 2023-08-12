// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => { };

export const isAlphaNumeric = (str: string): RegExpMatchArray | null => str.match(/^[a-zA-Z0-9]*$/);

export const isAlpha = (str: string): RegExpMatchArray | null => str.match(/^[a-zA-Z]*$/);

export const isDigit = (str: string): RegExpMatchArray | null => str.match(/^[0-9]*$/);

export const isCapital = (str: string): RegExpMatchArray | null => str.match(/^[A-Z]*$/);

export const isSpecialCharacter = (str: string): RegExpMatchArray | null => str.match(/^[ !"/$%?&*()_+-=^<>;`,.^:']*$/);
