import type { EventDispatcher } from '../EventDispatcher';
import type { EventPayload } from '../EventPayload';

export interface EventDriverInterface {
	readonly name: string;
	set(event_name: string, dispatcher: EventDispatcher): void;
	get(event_name: string): EventDispatcher | undefined;
	has(event_name: string): boolean;
	size(): number;
	error(error: Error): void;
}

export type EventBusOptions = {
	driver: string;
};

export type EventDispatcherResponse = Array<PromiseSettledResult<boolean>>;

export type EventHandlerCallback<Event extends EventPayload = EventPayload> = (
	event: Event
) => boolean;

export type AsyncEventHandlerCallback<Event extends EventPayload = EventPayload> = (
	event: Event
) => Promise<boolean>;

export type EventHandler<Event extends EventPayload = EventPayload> =
	| EventHandlerCallback<Event>
	| AsyncEventHandlerCallback<Event>;
