import { EventDispatcher } from './EventDispatcher';
import { EventPayload } from './EventPayload';
import { LocalEventDriver } from './drivers/LocalEventDriver';
import {
	EventBusOptions,
	EventDispatcherResponse,
	EventDriverInterface,
	EventHandler,
} from './types';

/**
 * @file Event bus to subscribe, unsubscribe and publish events.
 * @copyright Piggly Lab 2023
 */
export class EventBus {
	/**
	 * Singleton instance.
	 *
	 * @type {EventBus}
	 * @private
	 * @static
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static _instance: EventBus;

	/**
	 * Event driver mapping.
	 *
	 * @type {Map<string, EventDriverInterface>}
	 * @private
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _drivers: Map<string, EventDriverInterface>;

	/**
	 * Construct with default driver.
	 *
	 * @constructor
	 * @private
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private constructor() {
		this._drivers = new Map();
		this.register(new LocalEventDriver());
	}

	/**
	 * Get event bus instance.
	 *
	 * @returns {EventBus}
	 * @public
	 * @static
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static get instance(): EventBus {
		if (EventBus._instance === undefined) {
			EventBus._instance = new EventBus();
		}

		return EventBus._instance;
	}

	/**
	 * Register a new driver for event bus.
	 *
	 * @param {EventDriverInterface} driver Event driver object.
	 * @returns {void}
	 * @public
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public register(driver: EventDriverInterface): void {
		this._drivers.set(driver.name, driver);
	}

	/**
	 * Publish an event to event bus, where Event is an event payload object.
	 *
	 * @param {Event} event Event payload object.
	 * @param {EventBusOptions} options With driver name.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async publish<Event extends EventPayload>(
		event: Event,
		options?: EventBusOptions
	): Promise<EventDispatcherResponse> {
		const driver = this.driver(options);
		const dispatcher = driver.get(event.name);

		if (dispatcher === undefined) {
			return undefined;
		}

		return dispatcher.dispatch<Event>(event);
	}

	/**
	 * Subscribe handler to an event.
	 *
	 * @param {string} event_name
	 * @param {EventHandler} handler Event handler object.
	 * @param {EventBusOptions} options With driver name.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public subscribe<Event extends EventPayload>(
		event_name: string,
		handler: EventHandler<Event>,
		options?: EventBusOptions
	): boolean {
		const driver = this.driver(options);
		let dispatcher = driver.get(event_name);

		if (dispatcher === undefined) {
			dispatcher = new EventDispatcher(event_name);
			driver.set(event_name, dispatcher);
		}

		return dispatcher.register(handler);
	}

	/**
	 * Unsubscribe handler from an event.
	 *
	 * @param {string} event_name
	 * @param {EventHandler} handler Event handler object.
	 * @param {EventBusOptions} options With driver name.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unsubscribe<Event extends EventPayload>(
		event_name: string,
		handler: EventHandler<Event>,
		options?: EventBusOptions
	): boolean {
		const driver = this.driver(options);
		const dispatcher = driver.get(event_name);

		if (dispatcher === undefined) {
			return false;
		}

		return dispatcher.unregister(handler);
	}

	/**
	 * Unsubscribe all handlers from an event.
	 *
	 * @param {string} event_name
	 * @param {EventBusOptions} options With driver name.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unsubscribeAll(event_name: string, options?: EventBusOptions): boolean {
		const driver = this.driver(options);
		const dispatcher = driver.get(event_name);

		if (dispatcher === undefined) {
			return false;
		}

		return dispatcher.unregisterAll();
	}

	/**
	 *
	 * @param {EventBusOptions} options
	 * @returns {EventDriverInterface}
	 * @throws {Error} When driver is not found.
	 * @protected
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected driver(options?: EventBusOptions): EventDriverInterface {
		if (options === undefined || options.driver === undefined) {
			return this._drivers.get('local') as EventDriverInterface;
		}

		const driver = this._drivers.get(options.driver);

		if (driver === undefined) {
			throw new Error(`EventBus driver ${options.driver} not found.`);
		}

		return driver;
	}
}
