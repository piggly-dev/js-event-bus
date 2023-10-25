# Changelog

## 1.0.0 at `2023-05-29`

- First release.

## 1.0.1 at `2023-05-29`

- [Fix] Export `EventPayload` as `EventPayload` instead `Event`.

## 2.0.0 at `2023-10-25`

- Handlers are now regular functions;
- Handlers can be async/await functions or return a Promise;
- Handlers can be a `EventHandlerCallback` or `AsyncEventHandlerCallback` type.
