// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => { };

export const isAlphaNumeric = (str: string): boolean => !!str.match(/^[a-zA-Z0-9]*$/);

export const isAlpha = (str: string): boolean => !!str.match(/^[a-zA-Z]*$/);

export const isLegalIdentifier = (str: string): boolean => !!str.match(/^[a-zA-Z-_]*$/);

export const isDigit = (str: string): boolean => !!str.match(/^[0-9]*$/);

export const isCapital = (str: string): boolean => !!str.match(/^[A-Z]*$/);

export const isSpecialCharacter = (str: string): boolean => !!str.match(/^[ [\]!"/$%?&*()_+-=^<>;`,.^:']*$/);
