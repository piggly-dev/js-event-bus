import EventHandler from '@/core/EventHandler';
import EventPayload from '@/core/EventPayload';

export type StubEventData = {
	value: number;
};

export class StubEventPayload extends EventPayload<StubEventData> {
	constructor(data: { value: number }) {
		super('STUB_EVENT', data);
	}
}

export class AnotherStubEventPayload extends EventPayload<StubEventData> {
	constructor(data: { value: number }) {
		super('ANOTHER_STUB_EVENT', data);
	}
}

export class StubEventHandler extends EventHandler<StubEventData> {
	public handle(event: StubEventPayload): void {
		console.log(event);
	}
}

export class AnotherStubEventHandler extends EventHandler<StubEventData> {
	public handle(event: EventPayload<StubEventData>): void {
		console.log(event);
	}
}
