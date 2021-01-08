import { Entity } from "../../lib/ecs";
import ActorComponent from "../components/actor";
import InputComponent from "../components/input";
import HealthComponent from '../components/health'
import TransformComponent from "../components/transform";
import VisualComponent from "../components/visual";
import ManaComponent from "../components/mana";
import StaminaComponent from "../components/stamina";

export default new Entity([
  new InputComponent(),
  new ActorComponent(),
  new HealthComponent(),
  new ManaComponent(),
  new StaminaComponent(),
  new TransformComponent(),
  new VisualComponent()
])
