# Event Bus Library

![Typescript](https://img.shields.io/badge/language-typescript-blue?style=for-the-badge) ![NPM](https://img.shields.io/npm/v/piggly/event-bus?style=for-the-badge) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=for-the-badge)](LICENSE)

An ESM/CommonJS library following Oriented-Object Programming pattern to manager an Event Bus.

## Features

- Publish, subscribe and unsubscribe to events;
- Change default event driver;
- Singleton & Oriented-Object Programming patterns;
- Better code organization.

This library was a requirement for some internal projects on our company. But it may work with another projects designed following Oriented-Object Programming pattern.

![Class Diagram for Event Bus Library](./docs/uml-class-diagram.png)

## Installation

This library is ready for ES module or CommonJs module. You must add it by using [Node.Js](https://nodejs.org/):

```bash
npm i --save @piggly/event-bus
```

## Usage

First you must import `EventBus` singleton. This is the main entry point for event bus management.

### Registering Drivers

By default, `EventBus` will start with `LocalEventDriver` loaded and get/set dispatcher to it. But you can create your own event driver implementing `EventDriverInterface` with your custom dispatcher extending `EventDispatcher`.

By default, the `publish()`, `subscribe()`, `unsubscrive()` and `unsubscriveAll()` methods will you the `LocalEventDriver`. But, you can change this behavior saying what driver must be loaded. E.g: `publish(event, { driver: 'another' })`. The `another` driver must be registered.

```ts
import EventBus from '@piggly/event-bus';

// Register a new driver
EventBus.instance.register(new AnotherEventDriver());

// Will subscribe on local driver
EventBus.instance.subscribe('EVENT_NAME', new SomeEventHandler());

// Will subscribe on another driver
EventBus.instance.subscribe('EVENT_NAME', new SomeEventHandler(), { driver: 'another' });
```

### Operations

```ts
import EventBus from '@piggly/event-bus';

// You can subscribe handlers to events
EventBus.instance.subscribe('EVENT_NAME', new SomeEventHandler());

// If needed you can unsubscribe, handler must be the same class that was subscribed
EventBus.instance.unsubscrive('EVENT_NAME', new SomeEventHandler());

// When event is ready, just publish it and event bus does what is need
EventBus.instance.publish(new EventPayload('EVENT_NAME', {}));
```

### Handlers & Payloads

You must create classes for handlers, it allows dispatcher avoid to add the same constructor classes into handler array of an event:

```ts
import { EventHandler, EventPayload } from '@piggly/event-bus';

// !! USE EVENTPAYLOAD
// Event data
export type StubEventData = {
	value: number;
};

// Event handler
export class StubEventHandler extends EventHandler<StubEventData> {
	public handle(event: EventPayload<StubEventData>): void {
		console.log(event);
	}
}

// !! USE CUSTOMEVENTPAYLOAD
export class StubEventPayload extends EventPayload<StubEventData> {
	constructor(data: { value: number }) {
		super('STUB_EVENT', data);
	}
}

// Event handler
export class StubEventHandler extends EventHandler<StubEventData> {
	public handle(event: StubEventPayload): void {
		console.log(event);
	}
}
```

## Changelog

See the [CHANGELOG](CHANGELOG.md) file for information about all code changes.

## Testing the code

This library uses the **Jest**. We carry out tests of all the main features of this application.

```bash
npm run test:once
```

## Contributions

See the [CONTRIBUTING](CONTRIBUTING.md) file for information before submitting your contribution.

## Credits

- [Caique Araujo](https://github.com/caiquearaujo)
- [All contributors](../../contributors)

## License

MIT License (MIT). See [LICENSE](LICENSE).