// src/render/getLights.ts
import { LightSource } from "./lighting";

let lights: LightSource[] = [];

export function setLights(newLights: LightSource[]): void {
  lights = newLights;
}

export function getLights(): LightSource[] {
  return lights;
}