import EventHandler from './EventHandler';
import EventPayload from './EventPayload';

/**
 * @file Event dispatcher, where you can register handlers to an unique event and dispatch to them.
 * @copyright Piggly Lab 2023
 */
export default class EventDispatcher {
	/**
	 * Handlers.
	 *
	 * @type {EventHandler[]}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly handlers: Array<EventHandler>;

	/**
	 * Event name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly name: string;

	/**
	 * Constructor with event name and empty handlers.
	 *
	 * @param {string} name
	 * @constructor
	 * @public
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(name: string) {
		this.handlers = [];
		this.name = name;
	}

	/**
	 * Dispatch event for handlers, where Event is an event payload object.
	 *
	 * @param {Event} event Event payload object.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public dispatch<Event extends EventPayload>(event: Event): boolean {
		if (event.name !== this.name) {
			return false;
		}

		if (this.handlers.length === 0) {
			return false;
		}

		this.handlers.forEach(handler => handler.handle(event));
		return true;
	}

	/**
	 * Register a new handler to the current event dispatcher.
	 *
	 * @param {EventHandler} handler Event handler object.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public register(handler: EventHandler): boolean {
		if (this.handlers.find(h => h.constructor === handler.constructor)) {
			return false;
		}

		this.handlers.push(handler);
		return true;
	}

	/**
	 * Unregister a handler of the current event dispatcher.
	 *
	 * @param {EventHandler} handler Event handler object.
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unregister(handler: EventHandler): boolean {
		// const index = this.handlers.indexOf(handler);
		const index = this.handlers.findIndex(
			h => h.constructor === handler.constructor
		);

		if (index === -1) {
			return false;
		}

		this.handlers.splice(index, 1);
		return true;
	}

	/**
	 * Unregister all handlers of the current event dispatcher.
	 *
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof EventDispatcher
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unregisterAll(): boolean {
		if (this.handlers.length === 0) {
			return false;
		}

		this.handlers.splice(0, this.handlers.length);
		return true;
	}
}
