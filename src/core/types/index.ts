import EventDispatcher from '../EventDispatcher';

export interface EventDriverInterface {
	readonly name: string;
	set(event_name: string, dispatcher: EventDispatcher): void;
	get(event_name: string): EventDispatcher | undefined;
	has(event_name: string): boolean;
}
