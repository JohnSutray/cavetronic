export function rafLoop(deltaMs: number, callback: (deltaTimeMs: number) => boolean) {
  let deltaTime = 0;
  let lastTime = 0;

  return function rafLoopStart(currentTime: number) {
    deltaTime += currentTime - lastTime;
    lastTime = currentTime;

    if (deltaTime > deltaMs) {
      if (!callback(deltaTime)) {
        return;
      }
      deltaTime = 0;
    }


    requestAnimationFrame(rafLoopStart);
  };
}
