import { EventDispatcher } from '@/core';
import {
	AnotherStubEventHandler,
	AnotherStubEventPayload,
	StubEventHandler,
	StubEventPayload,
} from '@test/__stubs__';

beforeAll(() => {
	jest.clearAllMocks();
});

afterAll(() => {
	jest.resetAllMocks();
});

describe('EventDispatcher', () => {
	it('should register a handler', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');

		expect(dispatcher.handlers.length).toBe(0);
		expect(dispatcher.name).toBe('STUB_EVENT');

		const handler = new StubEventHandler();

		expect(dispatcher.register(handler)).toBe(true);
		expect(dispatcher.handlers.length).toBe(1);
	});

	it('should not register an existing handler', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = new StubEventHandler();
		dispatcher.register(handler);

		expect(dispatcher.register(handler)).toBe(false);
		expect(dispatcher.handlers.length).toBe(1);

		expect(dispatcher.register(new StubEventHandler())).toBe(false);
		expect(dispatcher.handlers.length).toBe(1);

		expect(dispatcher.register(new StubEventHandler())).toBe(false);
		expect(dispatcher.register(new AnotherStubEventHandler())).toBe(true);
		expect(dispatcher.handlers.length).toBe(2);
	});

	it('should not unregister a handler', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = new StubEventHandler();

		expect(dispatcher.unregister(handler)).toBe(false);
	});

	it('should unregister a handler', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = new StubEventHandler();
		dispatcher.register(handler);

		expect(dispatcher.unregister(handler)).toBe(true);
		expect(dispatcher.handlers.length).toBe(0);

		dispatcher.register(handler);
		dispatcher.register(new StubEventHandler());

		expect(dispatcher.unregister(handler)).toBe(true);
		expect(dispatcher.handlers.length).toBe(0);
	});

	it('should not dispatch events for incompatible events', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		expect(dispatcher.dispatch(new AnotherStubEventPayload({ value: 42 }))).toBe(
			false
		);
	});

	it('should not dispatch events for any handlers', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		expect(dispatcher.dispatch(new StubEventPayload({ value: 42 }))).toBe(false);
	});

	it('should dispatch events for any handlers', () => {
		const handleFn = jest.fn();
		jest.spyOn(StubEventHandler.prototype, 'handle').mockImplementation(handleFn);

		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = new StubEventHandler();
		const event = new StubEventPayload({ value: 42 });

		dispatcher.register(handler);
		expect(dispatcher.dispatch(event)).toBe(true);
		expect(handleFn).toHaveBeenCalledTimes(1);
		expect(handleFn).toHaveBeenCalledWith(event);
	});
});
