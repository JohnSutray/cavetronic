/** setTimeout-based fixed-step loop for Worker context (replaces RAF) */
export function workerLoop(stepMs: number, callback: (deltaTimeMs: number) => boolean) {
  let lastTime = performance.now();
  let accumulator = 0;

  function loop() {
    const now = performance.now();
    accumulator += now - lastTime;
    lastTime = now;

    if (accumulator >= stepMs) {
      if (!callback(accumulator)) {
        return;
      }

      accumulator = 0;
    }

    setTimeout(loop, Math.max(0, stepMs - accumulator));
  }

  setTimeout(loop, stepMs);
}
