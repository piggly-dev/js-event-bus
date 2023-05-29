import EventHandler from '@/core/EventHandler';
import EventPayload from '@/core/EventPayload';

export class StubEventPayload extends EventPayload<{
	value: number;
}> {
	constructor(data: { value: number }) {
		super('STUB', data);
	}
}

export class StubEventHandler extends EventHandler<StubEventPayload> {
	public handle(event: StubEventPayload): void {
		console.log(event);
	}
}
