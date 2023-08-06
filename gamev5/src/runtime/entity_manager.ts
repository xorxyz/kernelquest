import { Body } from './body';
import { Soul } from './soul';
import { Spirit } from './spirit';

export class EntityManager {
  private idCounter = 0;

  private bodies = new Set<Body>();

  private souls = new Set<Soul>();

  private spirits = new Set<Spirit>();

  private creator = Being;
}
