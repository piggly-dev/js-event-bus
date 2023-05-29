import EventDispatcher from '../EventDispatcher';
import { EventDriverInterface } from '../types';

export default class LocalEventDriver implements EventDriverInterface {
	public readonly name: string = 'local';

	private readonly dispatchers: Map<string, EventDispatcher>;

	constructor() {
		this.dispatchers = new Map();
	}

	public set(event_name: string, dispatcher: EventDispatcher): void {
		this.dispatchers.set(event_name, dispatcher);
	}

	public get(event_name: string): EventDispatcher | undefined {
		return this.dispatchers.get(event_name);
	}

	public has(event_name: string): boolean {
		return this.dispatchers.has(event_name);
	}
}
