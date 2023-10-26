import { EventPayload } from '@/core';
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

afterEach(() => {
	EventBus.instance.unsubscribeAll('CLIENT_CREATED_EVENT');
});

describe('EventBus -> Integration Test', () => {
	it('should subscribe/publish an event to local driver -> sync handlers (resolve as true)', async () => {
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

	it('should subscribe/publish an event to local driver -> sync handlers (resolve as false)', async () => {
		const sendToQueue = jest.fn();

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			(e: ClientCreatedEvent): boolean => {
				sendToQueue(e.data);
				return false;
			}
		);

		// Another side of application
		const resolved = await EventBus.instance.publish(
			new ClientCreatedEvent({
				name: 'John Doe',
				email: 'john@gmail.com',
			})
		);

		expect(sendToQueue).toHaveBeenCalledWith({
			name: 'John Doe',
			email: 'john@gmail.com',
		});

		expect(resolved).toStrictEqual([{ status: 'fulfilled', value: false }]);
	});

	it('should subscribe/publish an event to local driver -> sync handlers (reject)', async () => {
		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			(e: ClientCreatedEvent): boolean => {
				throw new Error('Cannot handle this event!');
			}
		);

		// Another side of application
		const resolved = await EventBus.instance.publish(
			new ClientCreatedEvent({
				name: 'John Doe',
				email: 'john@gmail.com',
			})
		);

		expect(resolved).toStrictEqual([
			{
				status: 'rejected',
				reason: new Error('Cannot handle this event!'),
			},
		]);
	});

	it('should subscribe/publish an event to local driver -> sync/async handlers (resolve as true)', async () => {
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
			async (e: ClientCreatedEvent): Promise<boolean> =>
				new Promise(res => {
					setTimeout(() => {
						sendToQueue(e.data);
						res(true);
					}, 200);
				})
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

	it('should subscribe/publish an event to local driver -> async handlers (resolve as false)', async () => {
		const sendToQueue = jest.fn();

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			async (e: ClientCreatedEvent): Promise<boolean> =>
				new Promise(res => {
					setTimeout(() => {
						sendToQueue(e.data);
						res(false);
					}, 200);
				})
		);

		// Another side of application
		const resolved = await EventBus.instance.publish(
			new ClientCreatedEvent({
				name: 'John Doe',
				email: 'john@gmail.com',
			})
		);

		expect(sendToQueue).toHaveBeenCalledWith({
			name: 'John Doe',
			email: 'john@gmail.com',
		});

		expect(resolved).toStrictEqual([{ status: 'fulfilled', value: false }]);
	});

	it('should subscribe/publish an event to local driver -> async handlers (reject)', async () => {
		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			async (e: ClientCreatedEvent): Promise<boolean> =>
				new Promise((res, rej) => {
					setTimeout(() => {
						rej(new Error('Cannot handle this event!'));
					}, 200);
				})
		);

		// Another side of application
		const resolved = await EventBus.instance.publish(
			new ClientCreatedEvent({
				name: 'John Doe',
				email: 'john@gmail.com',
			})
		);

		expect(resolved).toStrictEqual([
			{ status: 'rejected', reason: new Error('Cannot handle this event!') },
		]);
	});

	it('should subscribe/publish an event to local driver -> sync/async handlers (reject sync)', async () => {
		const sendToQueue = jest.fn();

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			(e: ClientCreatedEvent): boolean => {
				throw new Error('Cannot handle this event!');
			}
		);

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			async (e: ClientCreatedEvent): Promise<boolean> =>
				new Promise(res => {
					setTimeout(() => {
						sendToQueue(e.data);
						res(true);
					}, 200);
				})
		);

		// Another side of application
		const resolved = await EventBus.instance.publish(
			new ClientCreatedEvent({
				name: 'John Doe',
				email: 'john@gmail.com',
			})
		);

		expect(sendToQueue).toHaveBeenCalledWith({
			name: 'John Doe',
			email: 'john@gmail.com',
		});

		expect(resolved).toStrictEqual([
			{ status: 'rejected', reason: new Error('Cannot handle this event!') },
			{ status: 'fulfilled', value: true },
		]);
	});

	it('should subscribe/publish an event to local driver -> sync/async handlers (reject async)', async () => {
		const logger = jest.fn();

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			(e: ClientCreatedEvent): boolean => {
				logger(`Client ${e.data.name} (${e.data.email}) created!`);
				return true;
			}
		);

		EventBus.instance.subscribe(
			'CLIENT_CREATED_EVENT',
			async (e: ClientCreatedEvent): Promise<boolean> =>
				new Promise((res, rej) => {
					setTimeout(() => {
						rej(new Error('Cannot handle this event!'));
					}, 200);
				})
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

		expect(resolved).toStrictEqual([
			{ status: 'fulfilled', value: true },
			{ status: 'rejected', reason: new Error('Cannot handle this event!') },
		]);
	});
});
