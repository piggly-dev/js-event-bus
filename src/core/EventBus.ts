import debug from 'debug';

import {
	EventDispatcherResponse,
	EventDriverInterface,
	EventBusOptions,
	EventHandler,
} from './types';
import { LocalEventDriver } from './drivers/LocalEventDriver';
import { EventDispatcher } from './EventDispatcher';
import { EventPayload } from './EventPayload';

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
	 * Ongoing promises.
	 *
	 * @type {Set<Promise<EventDispatcherResponse>>}
	 * @private
	 * @since 3.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _ongoing: Set<Promise<EventDispatcherResponse>>;

	/**
	 * Construct with default driver.
	 *
	 * @constructor
	 * @private
	 * @since 1.0.0
	 * @since 3.0.0 Added promise tracking.
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private constructor() {
		this._drivers = new Map();
		this._ongoing = new Set();
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
	 * Get the number of ongoing promises.
	 *
	 * @returns {number}
	 * @public
	 * @since 3.0.0
	 * @memberof EventBus
	 */
	public get ongoing(): number {
		return this._ongoing.size;
	}

	/**
	 * The cleanup method will:
	 *
	 * - Wait for all pending promises triggered by send method.
	 * - Clear the pool of pending promises.
	 *
	 * Useful for:
	 *
	 * - Flush pool of pending promises.
	 * - Ensure all promises are settled.
	 * - Gracefully shutdown your application.
	 *
	 * @returns {Promise<void>}
	 * @public
	 * @since 3.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async cleanup(): Promise<void> {
		debug('eventbus:cleanup')('cleaning up');
		await Promise.allSettled(this._ongoing);
		this._ongoing = new Set();
		debug('eventbus:cleanup')('cleaned up');
	}

	/**
	 * Publish an event to event bus, where Event is an event payload object.
	 *
	 * @param {Event} event Event payload object.
	 * @param {EventBusOptions} options With driver name.
	 * @returns {Promise<EventDispatcherResponse>}
	 * @public
	 * @since 1.0.0
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async publish<Event extends EventPayload>(
		event: Event,
		options?: EventBusOptions,
	): Promise<EventDispatcherResponse> {
		const driver = this.driver(options);
		const dispatcher = driver.get(event.name);

		if (dispatcher === undefined) {
			return [];
		}

		debug('eventbus:publish')(`published ${event.name}`);
		return dispatcher.dispatch<Event>(event);
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
	 * Send an event to event bus, where Event is an event payload object.
	 * It will not wait for the event to be processed. But:
	 *
	 * - When error callback is set on driver, it will be called when something goes wrong.
	 * - When wait_onclean is true, the event will be added to the pool.
	 *   a) Later, you may use cleanup method to wait for all pending promises on pool.
	 *   b) Will be useful for wait_onclean events that must be processed and waited to finish.
	 *   c) In a graceful shutdown, for example.
	 *
	 * Tip: You may want to use wait_onclean for events that should be completed on a
	 *      graceful shutdown or interruption, for example. It will heavily increase
	 *      memory usage if you have a lot of events to wait.
	 *
	 * @important Be careful when using wait_onclean, it will hold promises on memory till they are settled.
	 * @experimental This feature is experimental and may change in the future.
	 * @param {Event} event Event payload object.
	 * @param {boolean} wait_onclean If true, the event will be sent as wait_onclean.
	 * @param {EventBusOptions} options With driver name.
	 * @returns {void}
	 * @public
	 * @since 1.0.0
	 * @since 3.0.0 Added promise tracking.
	 * @memberof EventBus
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public send<Event extends EventPayload>(
		event: Event,
		wait_onclean: boolean = false,
		options?: EventBusOptions,
	): void {
		const driver = this.driver(options);
		const dispatcher = driver.get(event.name);

		if (dispatcher === undefined) {
			return;
		}

		if (wait_onclean === false) {
			dispatcher
				.dispatch<Event>(event)
				.then(e => {
					e.forEach(r => {
						if (r.status === 'fulfilled') {
							debug('eventbus:publish')(`sent.resolved ${event.name}`);
						} else {
							driver.error(r.reason);
						}
					});
				})
				.catch(driver.error);

			return;
		}

		const promise = dispatcher.dispatch<Event>(event);

		this._ongoing.add(promise);
		debug('eventbus:publish')(`sent ${event.name}; pool: ${this._ongoing.size}`);

		const handleFinally = () => {
			this._ongoing.delete(promise);

			debug('eventbus:publish')(
				`send.removed ${event.name}; pool: ${this._ongoing.size}`,
			);
		};

		promise
			.then(e => {
				e.forEach(r => {
					if (r.status === 'fulfilled') {
						debug('eventbus:publish')(`sent.resolved ${event.name}`);
					} else {
						driver.error(r.reason);
					}
				});
			})
			.catch(driver.error)
			.finally(handleFinally);
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
		options?: EventBusOptions,
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
		options?: EventBusOptions,
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
	 * Get driver instance.
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
