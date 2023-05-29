import EventHandler from '@/core/EventHandler';
import EventPayload from '@/core/EventPayload';

export class StubEventPayload extends EventPayload<{
	value: number;
}> {
	constructor(data: { value: number }) {
		super('STUB_EVENT', data);
	}
}

export class AnotherStubEventPayload extends EventPayload<{
	value: number;
}> {
	constructor(data: { value: number }) {
		super('ANOTHER_STUB_EVENT', data);
	}
}

export class StubEventHandler extends EventHandler<StubEventPayload> {
	public handle(event: StubEventPayload): void {
		console.log(event);
	}
}

export class AnotherStubEventHandler extends EventHandler<AnotherStubEventPayload> {
	public handle(event: AnotherStubEventPayload): void {
		console.log(event);
	}
}
