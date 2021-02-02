import { Player } from './actors';
import { Cell } from './places';
import { soundBuffer } from './sound';
import { GameLog, prompt } from './ui';

const buf = new Array(8).fill(0);

const logs = new GameLog();
const player = new Player();
const ctx = {
  room: {
    name: 'King\'s Valley',
    layout: buf.map((_, y) => buf.map((__, x) => new Cell(x, y))),
  },
  time: '🌓 2nd 1/2, 2038',
};

export const template = `^xor4:${player.name} @ ${ctx.room.name} T ${ctx.time} 
${soundBuffer}

  ${ctx.room.layout[0]}  ${player.look.emoji}
  ${ctx.room.layout[1]}  name ${player.name}
  ${ctx.room.layout[2]}  jobs ${player.job.name}
  ${ctx.room.layout[3]}  
  ${ctx.room.layout[4]}
  ${ctx.room.layout[5]}  wield ${player.wield}
  ${ctx.room.layout[6]}  wear ${player.wear}
  ${ctx.room.layout[7]}  hold ${player.hold}

${logs.buffer[0]}
${logs.buffer[1]}
${logs.buffer[2]}  L ${player.job.level}
${logs.buffer[3]}  X ${player.job.xp}%
${logs.buffer[4]}  H ${player.health.value}%
${logs.buffer[5]}  S ${player.stamina.value}%
${logs.buffer[6]}  M ${player.mana.value}%
${logs.buffer[7]}  $ ${player.wealth.value}
${prompt}
`;
