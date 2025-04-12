import crypto from 'crypto';

/**
 * Event payload with data.
 */
export class EventPayload<
	EventData extends Record<string, any> = Record<string, any>
> {
	/**
	 * Event id.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly id: string;

	/**
	 * Event name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly name: string;

	/**
	 * Event data, where EventData may be an object.
	 *
	 * @type {EventData}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly data: EventData;

	/**
	 * Event issued at timestamp.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly issued_at: number;

	/**
	 * Constructor with event name and data.
	 *
	 * @param {string} name
	 * @param {EventData} data
	 * @constructor
	 * @public
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(name: string, data: EventData) {
		this.id = this.generateId();
		this.name = name;
		this.data = data;
		this.issued_at = Date.now();
	}

	/**
	 * Unsafe method to generate event id.
	 * May be overriden in child classes.
	 *
	 * @returns {string}
	 * @public
	 * @since 1.2.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public generateId(): string {
		return crypto.randomUUID();
	}
}
