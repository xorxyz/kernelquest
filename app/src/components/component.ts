import EventEmitter from "events";
import { Store } from "../store";

export abstract class Component extends EventEmitter {
  el: HTMLElement

  constructor (el: HTMLElement) {
    super();

    this.el = el;
  }

  abstract render (state: Store)
}
