import { EventBus } from './core/EventBus';

export { LocalEventDriver } from './core/drivers/LocalEventDriver';
export { EventDispatcher } from './core/EventDispatcher';
export { EventPayload } from './core/EventPayload';

export type {
	AsyncEventHandlerCallback,
	EventDispatcherResponse,
	EventDriverInterface,
	EventHandlerCallback,
	EventBusOptions,
	EventHandler,
} from './core/types';

export { EventBus };

/**
 * Event bus library.
 *
 * @link https://github.com/piggly-dev/js-event-bus
 * @license MIT
 * @copyright Piggly Lab 2023
 * @author Caique Araujo <caique@piggly.com.br>
 * @version 1.0.0
 */
export default EventBus;
