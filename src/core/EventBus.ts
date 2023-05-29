import EventDispatcher from './EventDispatcher';
import EventHandler from './EventHandler';
import EventPayload from './EventPayload';
import LocalEventDriver from './drivers/LocalEventDriver';
import { EventDriverInterface } from './types';

export default class EventBus {
	private static _instance: EventBus;

	private _driver: EventDriverInterface;

	private constructor() {
		this._driver = new LocalEventDriver();
	}

	public static get instance(): EventBus {
		if (EventBus._instance === undefined) {
			EventBus._instance = new EventBus();
		}

		return EventBus._instance;
	}

	register(driver: EventDriverInterface): void {
		this._driver = driver;
	}

	publish<Event extends EventPayload>(event: Event): boolean {
		const dispatcher = this._driver.get(event.name);

		if (dispatcher === undefined) {
			return false;
		}

		return dispatcher.dispatch(event);
	}

	subscribe(event_name: string, handler: EventHandler): boolean {
		let dispatcher = this._driver.get(event_name);

		if (dispatcher === undefined) {
			dispatcher = new EventDispatcher(event_name);
			this._driver.set(event_name, dispatcher);
		}

		return dispatcher.register(handler);
	}

	unsubscribe(event_name: string, handler: EventHandler): boolean {
		const dispatcher = this._driver.get(event_name);

		if (dispatcher === undefined) {
			return false;
		}

		return dispatcher.unregister(handler);
	}
}
