import { EventBus, EventPayload } from '@/index';

describe('EventBus: Cleanup and Promise tracking', () => {
	const EVENT_NAME = 'ASYNC_EVENT';

	afterEach(async () => {
		EventBus.instance.unsubscribeAll(EVENT_NAME);
	});

	it('should wait for pending asynchronous handlers in publish before cleaning up', async () => {
		const queue: Array<number> = [];

		const asyncHandler = jest.fn().mockImplementation(
			(event: EventPayload) =>
				new Promise<boolean>(resolve => {
					setTimeout(() => {
						resolve(true);
					}, 1000);
				})
		);

		EventBus.instance.subscribe(EVENT_NAME, asyncHandler);

		const indirect = async () => {
			EventBus.instance
				.publish(new EventPayload(EVENT_NAME, {}))
				.then(() => {
					queue.push(2);
				})
				.catch(() => {
					queue.push(3);
				});

			queue.push(1);
		};

		// @note will not wait for event bus to be published
		await indirect();
		queue.push(4);

		await EventBus.instance.cleanup();
		queue.push(5);

		expect(queue).toStrictEqual([1, 4, 2, 5]);
		expect(asyncHandler).toHaveBeenCalledTimes(1);
	});
});
