// src/index.ts
import { createPhysicsWorldWithCaveAndPlayer } from "./physics/createPhysicsWorldWithCaveAndPlayer";
import { applyPlayerInput } from "./physics/applyPlayerInput";
import { renderWorld } from "./render/renderWorld";
import { updateCamera } from "./render/updateCamera";
import { getWorldContainer } from "./render/getWorldContainer";
import { initPixiRenderer } from "./render/initPixiRenderer";
import { setLights } from "./render/getLights";

async function main() {
  await initPixiRenderer();

  const { world, playerHandle } = createPhysicsWorldWithCaveAndPlayer();
  const worldContainer = getWorldContainer();

  function loop() {
    applyPlayerInput(world, playerHandle);
    world.step();

    // Свет привязан к игроку
    const playerBody = world.getRigidBody(playerHandle);
    const playerPos = playerBody.translation();

    setLights([
      {
        x: playerPos.x,
        y: playerPos.y - 2,
        radius: 15,
        intensity: 1.0,
      },
    ]);

    updateCamera(worldContainer, world, playerHandle);
    renderWorld(world);

    requestAnimationFrame(loop);
  }

  loop();
}

main().catch(console.error);