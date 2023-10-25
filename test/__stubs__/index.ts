import { EventHandlerCallback } from '@/core/types';
import EventPayload from '@/core/EventPayload';

export type StubEventData = {
	size: number;
};

export type AnotherStubEventData = {
	amount: number;
};

export class StubEventPayload extends EventPayload<StubEventData> {
	constructor(data: StubEventData) {
		super('STUB_EVENT', data);
	}
}

export class AnotherStubEventPayload extends EventPayload<AnotherStubEventData> {
	constructor(data: AnotherStubEventData) {
		super('ANOTHER_STUB_EVENT', data);
	}
}

export const stubEventHandlerCallback: EventHandlerCallback<
	StubEventPayload
> = event => {
	console.log(event);
	return true;
};

export const anotherStubEventHandlerCallback: EventHandlerCallback<
	AnotherStubEventPayload
> = event => {
	console.log(event);
	return true;
};
