import { EventBus } from './core/EventBus';

/**
 * Event bus library.
 *
 * @link https://github.com/piggly-dev/js-event-bus
 * @license MIT
 * @copyright Piggly Lab 2023
 * @author Caique Araujo <caique@piggly.com.br>
 * @version 1.0.0
 */
export { EventPayload, EventDispatcher, LocalEventDriver } from './core';

export type {
	EventDriverInterface,
	EventBusOptions,
	EventDispatcherResponse,
	EventHandlerCallback,
	AsyncEventHandlerCallback,
	EventHandler,
} from './core/types';

export { EventBus };

export default EventBus;
