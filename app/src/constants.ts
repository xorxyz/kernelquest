export const STORAGE_PREFIX = 'xor-editor:maps:';

export const StandardGlyphs = [
  '🌬️','✨','👼','🐑','🚩','🔒','🔑','🦠','💀','🐲','💍','🛡️','👑',
  '🌊','👦','🧚','💰','⛲','🏘️','📕','🐀','👻','🐍','🕯️','🏹','🐌', 
  '🌱','👨','🧝','🍓','🌲','🏕️','🗺️','🐛','🐺','🕷️','🥾','⚔️','🦌',
  '🔥','👴','🧙','🍵','⛰️','🏰','📜','🦇','👺','👹','🎒','💣','🦉',
  '##', '++', '--', 
  '..', ',,',
  '~~', '~^', '~>', '~v', '~<',
  '──', '│.', 
  '┌─', '┐.', '└─', '┘.',
  '├─', '┤.', '┬─', '┴─', '┼─'
];

export const Styles = `
.. mid-gray
## bg-moon-gray black b--white
++ bg-white black
-- bg-white black
🔒 bg-white black
~~ bg-blue white
~^ bg-blue white
~> bg-blue white
~v bg-blue white
~< bg-blue white
,, b--white green
🕷️ bg-red
 `.trim()
  .split('\n')
  .map(str => str.replace(' ', '\t').split('\t'));
