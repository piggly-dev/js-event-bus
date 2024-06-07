import { EventDriverInterface, EventHandlerCallback } from '@/core/types';
import { EventPayload } from '@/core/EventPayload';
import { EventDispatcher } from '@/index';

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
export class CustomEventDriver implements EventDriverInterface {
	public readonly name: string = 'custom';

	private readonly dispatchers: Map<string, EventDispatcher>;

	constructor() {
		this.dispatchers = new Map();
	}

	public set(event_name: string, dispatcher: EventDispatcher): void {
		if (this.has(event_name)) {
			return;
		}

		this.dispatchers.set(event_name, dispatcher);
	}

	public get(event_name: string): EventDispatcher | undefined {
		return this.dispatchers.get(event_name);
	}

	public has(event_name: string): boolean {
		return this.dispatchers.has(event_name);
	}

	public size(): number {
		return this.dispatchers.size;
	}
}
