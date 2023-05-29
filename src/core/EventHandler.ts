import EventPayload from './EventPayload';

export default abstract class EventHandler<
	Event extends EventPayload = EventPayload
> {
	abstract handle(event: Event): void;
}
