import { EventDispatcher } from '../EventDispatcher';
import { EventDriverInterface } from '../types';

/**
 * @file Local event driver using map for dispatchers.
 * @copyright Piggly Lab 2023
 */
export class LocalEventDriver implements EventDriverInterface {
	/**
	 * Driver name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly name: string = 'local';

	/**
	 * Dispatchers, where key is event name and value is dispatcher.
	 *
	 * @type {Map<string, EventDispatcher>}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private readonly dispatchers: Map<string, EventDispatcher>;

	/**
	 * Constructor with empty dispatchers.
	 *
	 * @constructor
	 * @public
	 * @since 1.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor() {
		this.dispatchers = new Map();
	}

	/**
	 * Set dispatcher for event name.
	 *
	 * @param {string} event_name
	 * @param {EventDispatcher} dispatcher Event dispatcher object.
	 * @returns {void}
	 * @public
	 * @since 1.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public set(event_name: string, dispatcher: EventDispatcher): void {
		if (this.has(event_name)) {
			return;
		}

		this.dispatchers.set(event_name, dispatcher);
	}

	/**
	 * Get dispatcher for event name.
	 *
	 * @param {string} event_name
	 * @returns {EventDispatcher | undefined}
	 * @public
	 * @since 1.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(event_name: string): EventDispatcher | undefined {
		return this.dispatchers.get(event_name);
	}

	/**
	 * Check if dispatcher for event name exists.
	 *
	 * @param {string} event_name
	 * @returns {boolean}
	 * @public
	 * @since 1.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(event_name: string): boolean {
		return this.dispatchers.has(event_name);
	}

	/**
	 * Get dispatchers size.
	 *
	 * @returns {number}
	 * @public
	 * @since 2.0.0
	 * @memberof LocalEventDriver
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public size(): number {
		return this.dispatchers.size;
	}
}
