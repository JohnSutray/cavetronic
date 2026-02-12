import { createWorld, addEntity, addComponent } from 'bitecs'
import { createObserverSerializer, createSoASerializer, f32 } from 'bitecs/serialization'

// --- Компоненты ---
const Position = { x: f32([]), y: f32([]) }
const Rotation = { angle: f32([]) }
const Networked = {}

const components = [Position, Rotation]

// --- Мир ---
const world = createWorld()

// --- Сериализаторы ---
const observerSerialize = createObserverSerializer(world, Networked, components)
const soaSerialize = createSoASerializer(components, { diff: true })

// --- Параметры ---
const ROCK_COUNT = 100
const TICK_RATE = 20
const DURATION_SEC = 5
const TOTAL_TICKS = TICK_RATE * DURATION_SEC

// --- Спавним 100 камушков ---
const eids = []
const velocities = []

for (let i = 0; i < ROCK_COUNT; i++) {
  const eid = addEntity(world)
  addComponent(world, eid, Networked)
  addComponent(world, eid, Position)
  addComponent(world, eid, Rotation)

  Position.x[eid] = Math.random() * 1000
  Position.y[eid] = Math.random() * 1000
  Rotation.angle[eid] = Math.random() * 6.28

  // Случайное направление и скорость
  const speed = 20 + Math.random() * 80
  const dir = Math.random() * Math.PI * 2
  velocities.push({ vx: Math.cos(dir) * speed, vy: Math.sin(dir) * speed, va: (Math.random() - 0.5) * 2 })

  eids.push(eid)
}

// Flush initial state (имитация первого тика после спавна)
const obsInit = observerSerialize()
const soaInit = soaSerialize(eids)

console.log(`Rocks: ${ROCK_COUNT}, tick rate: ${TICK_RATE}Hz, duration: ${DURATION_SEC}s, total ticks: ${TOTAL_TICKS}`)
console.log(`Initial flush: observer=${obsInit.byteLength}B, soa=${soaInit.byteLength}B, total=${obsInit.byteLength + soaInit.byteLength}B`)
console.log('')

// --- Симуляция ---
const dt = 1 / TICK_RATE
let totalObsBytes = 0
let totalSoaBytes = 0
let minTick = Infinity
let maxTick = 0

for (let tick = 0; tick < TOTAL_TICKS; tick++) {
  // Двигаем камушки
  for (let i = 0; i < ROCK_COUNT; i++) {
    const eid = eids[i]
    const v = velocities[i]
    Position.x[eid] += v.vx * dt
    Position.y[eid] += v.vy * dt
    Rotation.angle[eid] += v.va * dt
  }

  const obs = observerSerialize()
  const soa = soaSerialize(eids)
  const total = obs.byteLength + soa.byteLength

  totalObsBytes += obs.byteLength
  totalSoaBytes += soa.byteLength
  if (total < minTick) { minTick = total }
  if (total > maxTick) { maxTick = total }

  // Печатаем каждую секунду
  if ((tick + 1) % TICK_RATE === 0) {
    const sec = (tick + 1) / TICK_RATE
    const secObs = totalObsBytes
    const secSoa = totalSoaBytes
    console.log(`t=${sec}s (tick ${tick + 1}): last tick ${total}B (obs=${obs.byteLength}, soa=${soa.byteLength})`)
  }
}

const totalBytes = totalObsBytes + totalSoaBytes
const avgPerTick = totalBytes / TOTAL_TICKS
const avgPerSec = avgPerTick * TICK_RATE

console.log('')
console.log('========== RESULTS ==========')
console.log(`Total sent:     ${totalBytes} B = ${(totalBytes / 1024).toFixed(1)} KB over ${DURATION_SEC}s`)
console.log(`Avg per tick:   ${avgPerTick.toFixed(0)} B (obs=${(totalObsBytes / TOTAL_TICKS).toFixed(0)}, soa=${(totalSoaBytes / TOTAL_TICKS).toFixed(0)})`)
console.log(`Min/max tick:   ${minTick}B / ${maxTick}B`)
console.log(`Avg per second: ${avgPerSec.toFixed(0)} B = ${(avgPerSec / 1024).toFixed(1)} KB/s`)
console.log('')
console.log('--- Multiplayer ---')
for (const players of [2, 3, 4]) {
  console.log(`  ${players} players: ${(avgPerSec * players / 1024).toFixed(1)} KB/s server outbound`)
}
