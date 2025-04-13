import type { EventDispatcher } from '../EventDispatcher';
import type { EventPayload } from '../EventPayload';

export type AsyncEventHandlerCallback<Event extends EventPayload = EventPayload> = (
	event: Event,
) => Promise<boolean>;

export type EventBusOptions = {
	driver: string;
};

export type EventDispatcherResponse = Array<PromiseSettledResult<boolean>>;

export interface EventDriverInterface {
	set(event_name: string, dispatcher: EventDispatcher): void;
	get(event_name: string): EventDispatcher | undefined;
	has(event_name: string): boolean;
	error(error: Error): void;
	readonly name: string;
	size(): number;
}

export type EventHandler<Event extends EventPayload = EventPayload> =
	| AsyncEventHandlerCallback<Event>
	| EventHandlerCallback<Event>;

export type EventHandlerCallback<Event extends EventPayload = EventPayload> = (
	event: Event,
) => boolean;
