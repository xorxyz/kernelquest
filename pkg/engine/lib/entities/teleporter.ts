import { Entity } from "../../lib/ecs";
import TeleportComponent from "../components/teleport";
import TransformComponent from "../components/transform";
import VisualComponent from "../components/visual";

export default new Entity([
  new TransformComponent(),
  new VisualComponent(),
  new TeleportComponent()
])
