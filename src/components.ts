import { createRelation, withAutoRemoveSubject } from "bitecs";
import { array, f32 } from "bitecs/serialization";

const WORLD_CAPACITY = 100_000;

const floatContainer = () => new Float32Array(WORLD_CAPACITY);
const enumContainer = () => new Uint8Array(WORLD_CAPACITY);
const idContainer = () => new Uint32Array(WORLD_CAPACITY);

export const R_ChildColliderOf = createRelation(withAutoRemoveSubject);

export const C_Networked = {
  id: idContainer(),
  name: 'C_Networked',
}

export const C_Position = {
  x: floatContainer(),
  y: floatContainer(),
  name: "C_Position",
};

export const C_Rotation = {
  angle: floatContainer(),
  name: "C_Rotation",
};

export const C_Body = {
  handle: idContainer(),
  type: enumContainer(),
  name: "C_Body",
};

export const C_Collider = {
  handle: idContainer(),
  vertices: array(f32),
  name: "C_Collider",
};

