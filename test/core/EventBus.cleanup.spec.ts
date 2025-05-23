import { EventBus, EventPayload } from '@/index';

describe('EventBus: Cleanup and Promise tracking', () => {
	const EVENT_NAME = 'ASYNC_EVENT';

	afterEach(async () => {
		EventBus.instance.unsubscribeAll(EVENT_NAME);
	});

	it('should wait for pending asynchronous handlers in publish before cleaning up', async () => {
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
			EventBus.instance.send(new EventPayload(EVENT_NAME, {}), true);
		};

		// @note will not wait for event bus to be published
		await indirect();

		await EventBus.instance.cleanup();

		expect(EventBus.instance.ongoing).toBe(0);
		expect(asyncHandler).toHaveBeenCalledTimes(1);
	});
});
