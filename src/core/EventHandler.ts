import EventPayload from './EventPayload';

/**
 * @file Abstraction of event handler, where you can handle an event.
 * @copyright Piggly Lab 2023
 */
export default abstract class EventHandler<EventData = Record<string, any>> {
	/**
	 * Handle the event, where Event is an event payload object.
	 *
	 * @param {EventPayload<EventData>} event Event paylaod object.
	 * @returns {void}
	 * @public
	 * @abstract
	 * @since 1.0.0
	 * @memberof EventHandler
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract handle(event: EventPayload<EventData>): void;
}
