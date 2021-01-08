import { Entity } from "../../lib/ecs";
import BackstageComponent from "../components/backstage";
import SceneComponent from "../components/scene";
import TransformComponent from "../components/transform";

export default new Entity([
  new BackstageComponent(),
  new SceneComponent(),
  new TransformComponent()
])
