import { Engine } from "../../../game/engine";

// make the engine available to every app component
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $engine: Engine;
  }
}