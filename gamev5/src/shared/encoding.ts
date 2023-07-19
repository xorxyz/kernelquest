export function toHex(str: string): string {
  let hex;
  let i;
  let result = '';

  for (i = 0; i < str.length; i += 1) {
    hex = str.charCodeAt(i).toString(16);
    result += (`000${hex}`).slice(-4);
  }

  return result;
}
