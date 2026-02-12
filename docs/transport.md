# Транспорт и сериализация

## Два уровня транспорта

### ITransport — point-to-point канал
- `send(messageId, data)`, `onMessage(handler)`, `destroy()`
- Используется VECS (клиент) и как абстракция отдельного соединения внутри HostTransport
- Реализации: `WorkerTransportHost` (Worker-сторона), `WorkerTransportClient` (main thread)

### IHostTransport — multi-client серверный транспорт
- `send(userId, messageId, data)`, `broadcast(messageId, data)`
- `onMessage(handler)` — handler получает `(userId, messageId, data)`
- `onConnect(handler)`, `onDisconnect(handler)` — lifecycle клиентов
- Используется LECS (сервер)

### HostTransport — generic реализация IHostTransport
- Управляет `Map<string, ITransport>` — каждый клиент = отдельный ITransport канал
- `addClient(userId, connection)` — регистрирует канал, подписывается на его onMessage, файрит onConnect
- `removeClient(userId)` — отписывается, файрит onDisconnect, вызывает connection.destroy()
- `broadcast` клонирует буфер для каждого клиента (`data.slice(0)`), т.к. ITransport.send может detach ArrayBuffer
- Не привязан к Worker — работает с любыми ITransport реализациями

## Worker-каналы (dev/singleplayer)
- `WorkerTransportHost` — ITransport на стороне Worker, использует `self.postMessage` с Transferable
- `WorkerTransportClient` — ITransport на стороне main thread, слушает Worker.onmessage
- В `lecs.worker.ts`: создаётся `WorkerTransportHost` (localChannel) + `HostTransport`, затем `addClient('local', localChannel)` ПОСЛЕ createLecs (чтобы подписки на onConnect были зарегистрированы)

## DI-токены
- `HostTransportToken` — используется LECS-системами (l_s_tick_serializeAndSend, l_s_sub_handleClientReady)
- `TransportToken` — используется VECS-системами (v_s_sub_enqueueTransportMessages)

## Формат пакетов

### Delta (MSG_DELTA = 1)
```
[Uint32 frame][Uint32 observerLen][observer bytes][soa bytes]
```
- frame — номер тика, в котором дельта была сериализована
- observer — структурные изменения (entity add/remove, component add/remove)
- soa — данные компонентов (diff mode, только изменившиеся значения)
- Функции: `packDelta(frame, observer, soa)` / `unpackDelta(buffer)` в `frameDelta.ts`

### Snapshot (MSG_SNAPSHOT = 3)
```
[Uint32 frame][snapshot bytes]
```
- frame — номер последнего завершённого тика на момент снапшота
- snapshot — полное состояние всех сетевых сущностей и компонентов
- Функции: `packSnapshot(frame, snapshot)` / `unpackSnapshot(buffer)` в `frameDelta.ts`

## Счётчик кадров
- `SerializeContext.frame` — инкрементируется в `l_s_tick_serializeAndSend` перед сериализацией
- Начальное значение: 0 (до первого тика)
- Используется обоими LECS-системами: tick-система для дельт, handleClientReady для снапшотов

## Late-join flow
1. Клиент подключается → `HostTransport.addClient()` файрит `onConnect`
2. `l_s_sub_handleClientReady` получает onConnect → сериализует snapshot с текущим `ctx.frame`
3. Отправляет `transport.send(userId, MSG_SNAPSHOT, packed)`
4. Следующий тик: frame инкрементируется, дельта отправляется всем через broadcast
5. Новый клиент пропускает дельты с `frame <= snapshotFrame`, остальные клиенты получают полную дельту

### Порядок инициализации в Worker (pre-first-tick edge case)
- `lecs.tick(0)` вызывается ДО `addClient` — первый тик сбрасывает observer, frame = 1
- `addClient` после тика → snapshot at frame 1, observer чист
- Без этого: observer содержит начальные entity-add события, которые дублировали бы снапшот

## Защита от дублей на VECS
- `DeserializeContext.snapshotFrame` — frame последнего применённого снапшота (персистентный, -1 изначально)
- При получении snapshot: `snapshotFrame = unpacked.frame`
- При получении delta: если `frame <= snapshotFrame` — пропустить (данные уже в снапшоте)
- VECS буферизует входящие сообщения в `MessageQueue`, дренит в tick-системе `v_s_tick_applyNetworkMessages`

## Сериализация (bitecs)
- `SerializeContext` (LECS): observerSerialize, soaSerialize(eids), snapshotSerialize
- `DeserializeContext` (VECS): observerDeserialize, soaDeserialize, snapshotDeserialize
- `networkComponents` — проекции n_c_body/n_c_collider без handle (handle — локальный Rapier, не сериализуется)
- `buildRawIdMap` — конвертирует versioned idMap → raw slot idMap для SoA deserializer
- `sendBufferCopy` — bitecs serializers возвращают slice от preallocated 100MB buffer, перед postMessage нужна копия

## Константы сообщений
- `MSG_DELTA = 1` (LECS → VECS)
- `MSG_SNAPSHOT = 3` (LECS → VECS)
- `MSG_USER_INPUT = 11` (VECS → LECS)
