# Changelog

## 1.0.0 at `2023-05-29`

- First release.

## 1.0.1 at `2023-05-29`

- [Fix] Export `EventPayload` as `EventPayload` instead `Event`.

## 2.0.0 at `2023-10-26`

- Handlers are now regular functions;
- Handlers can be async/await functions or return a Promise;
- Handlers can be a `EventHandlerCallback` or `AsyncEventHandlerCallback` type.

## 2.1.0 at `2024-06-01`

- Export as ESM module named.

## 2.1.1/2.1.2 at `2024-06-01`

- [Fix] ESM/CommonJS/Types compatibility.

## 3.0.0 at `2025-04-12`

- Implemented tracking of active event dispatches through `EventBus._ongoing` property;
- Enhanced constructor with promise tracking capabilities;
- Improved monitoring of asynchronous operations;
- Introduced structured error handling in `LocalEventDriver`;
- Added `_onError` callback property for better error propagation on drivers;
- Improved error management and debugging capabilities;
- Updated core `EventBus` class with improved event handling.
