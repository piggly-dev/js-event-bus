import EventHandler from './EventHandler';
import EventPayload from './EventPayload';

export default class EventDispatcher {
	public readonly handlers: Array<EventHandler>;

	public readonly name: string;

	constructor(name: string) {
		this.handlers = [];
		this.name = name;
	}

	public dispatch<Event extends EventPayload>(event: Event): boolean {
		if (event.name !== this.name) {
			throw new Error(
				`Event ${event.name} is incompatible with dispatcher ${this.name}`
			);
		}

		if (this.handlers.length === 0) {
			return false;
		}

		this.handlers.forEach(handler => handler.handle(event));
		return true;
	}

	public register(handler: EventHandler): boolean {
		if (this.handlers.find(h => h.constructor === handler.constructor)) {
			return false;
		}

		this.handlers.push(handler);
		return true;
	}

	public unregister(handler: EventHandler): boolean {
		const index = this.handlers.indexOf(handler);

		if (index === -1) {
			return false;
		}

		this.handlers.splice(index, 1);
		return true;
	}
}
