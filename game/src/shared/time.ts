import { MS_PER_GAME_CYCLE } from './constants';

export const msInTicks = (ms: number): number => ms / MS_PER_GAME_CYCLE;
