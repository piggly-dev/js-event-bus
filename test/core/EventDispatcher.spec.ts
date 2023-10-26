import { EventDispatcher } from '@/core';
import {
	AnotherStubEventPayload,
	StubEventPayload,
	anotherStubEventHandlerCallback,
	stubEventHandlerCallback,
} from '@test/__stubs__';

beforeAll(() => {
	jest.clearAllMocks();
});

afterAll(() => {
	jest.resetAllMocks();
});

describe('EventDispatcher', () => {
	describe('EventHandler as Functions', () => {
		it('should register a handler', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');

			expect(dispatcher.handlers.length).toBe(0);
			expect(dispatcher.name).toBe('STUB_EVENT');

			const handler = stubEventHandlerCallback;

			expect(dispatcher.register(handler)).toBe(true);
			expect(dispatcher.handlers.length).toBe(1);
		});

		it('should not register an existing handler', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			const handler = stubEventHandlerCallback;
			// first registration
			dispatcher.register(handler);

			expect(dispatcher.register(handler)).toBe(false);
			expect(dispatcher.handlers.length).toBe(1);

			expect(dispatcher.register(stubEventHandlerCallback)).toBe(false);
			expect(dispatcher.handlers.length).toBe(1);

			expect(dispatcher.register(stubEventHandlerCallback)).toBe(false);
			expect(dispatcher.register(anotherStubEventHandlerCallback)).toBe(true);
			expect(dispatcher.handlers.length).toBe(2);
		});

		it('should not unregister a handler', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			const handler = stubEventHandlerCallback;

			expect(dispatcher.unregister(handler)).toBe(false);
		});

		it('should unregister a handler', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			const handler = stubEventHandlerCallback;
			dispatcher.register(handler);

			expect(dispatcher.unregister(handler)).toBe(true);
			expect(dispatcher.handlers.length).toBe(0);

			dispatcher.register(handler);
			dispatcher.register(stubEventHandlerCallback);

			expect(dispatcher.unregister(handler)).toBe(true);
			expect(dispatcher.handlers.length).toBe(0);
		});

		it('should not dispatch events for incompatible events', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			expect(
				dispatcher.dispatch(new AnotherStubEventPayload({ amount: 42 }))
			).resolves.toBe(undefined);
		});

		it('should not dispatch events for any handlers', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			expect(
				dispatcher.dispatch(new StubEventPayload({ size: 42 }))
			).resolves.toBe(undefined);
		});

		it('should dispatch events for any handlers', async () => {
			const handleOneFn = jest.fn().mockReturnValue(true);

			const dispatcher = new EventDispatcher('STUB_EVENT');
			const event = new StubEventPayload({ size: 42 });

			dispatcher.register(handleOneFn);
			const response = await dispatcher.dispatch(event);
			expect(response).toStrictEqual([{ status: 'fulfilled', value: true }]);
			expect(handleOneFn).toHaveBeenCalledTimes(1);
			expect(handleOneFn).toHaveBeenCalledWith(event);
		});

		it('should unregister all handlers', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			dispatcher.register(stubEventHandlerCallback);
			dispatcher.register(anotherStubEventHandlerCallback);
			expect(dispatcher.handlers.length).toBe(2);

			expect(dispatcher.unregisterAll()).toBe(true);
			expect(dispatcher.handlers.length).toBe(0);
		});

		it('should unregister all handlers <- return false when empty handlers', () => {
			const dispatcher = new EventDispatcher('STUB_EVENT');
			expect(dispatcher.unregisterAll()).toBe(false);
		});
	});
});
