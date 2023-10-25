import { EventDispatcher, EventPayload, LocalEventDriver } from '@/core';
import EventBus from '@/index';

type CLIENT_CREATED_EVENT_DATA = {
	name: string;
	email: string;
};

class ClientCreatedEvent extends EventPayload<CLIENT_CREATED_EVENT_DATA> {
	constructor(data: CLIENT_CREATED_EVENT_DATA) {
		super('CLIENT_CREATED_EVENT', data);
	}
}

describe('EventBus -> Integration Test', () => {
	it('should subscribe/publish an event to local driver', async () => {
		const logger = jest.fn();
		const sendToQueue = jest.fn();

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			(e: ClientCreatedEvent): boolean => {
				logger(`Client ${e.data.name} (${e.data.email}) created!`);
				return true;
			}
		);

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			(e: ClientCreatedEvent): boolean => {
				sendToQueue(e.data);
				return true;
			}
		);

		// Another side of application
		const resolved = await EventBus.instance.publish(
			new ClientCreatedEvent({
				name: 'John Doe',
				email: 'john@gmail.com',
			})
		);

		expect(logger).toHaveBeenCalledWith(
			'Client John Doe (john@gmail.com) created!'
		);

		expect(sendToQueue).toHaveBeenCalledWith({
			name: 'John Doe',
			email: 'john@gmail.com',
		});

		expect(resolved).toStrictEqual([
			{ status: 'fulfilled', value: true },
			{ status: 'fulfilled', value: true },
		]);
	});
});
