import { EventBus, EventDispatcher, LocalEventDriver } from '@/core';
import { StubEventHandler, StubEventPayload } from '@test/__stubs__';

describe('EventBus', () => {
	it('should have a singleton instance', () => {
		expect(EventBus.instance).toBeInstanceOf(EventBus);
	});

	it('should subscribe to a existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = new StubEventHandler();

		const getFn = jest.fn().mockReturnValue(dispatcher);
		const registerFn = jest.fn().mockReturnValue(true);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockImplementation(getFn);

		jest
			.spyOn(EventDispatcher.prototype, 'register')
			.mockImplementation(registerFn);

		expect(EventBus.instance.subscribe('STUB_EVENT', handler)).toBe(true);
		expect(getFn).toHaveBeenCalledWith('STUB_EVENT');
		expect(registerFn).toHaveBeenCalledWith(handler);
	});

	it('should subscribe to an non existing event', () => {
		const handler = new StubEventHandler();
		const registerFn = jest.fn().mockReturnValue(true);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockReturnValue(undefined);
		jest.spyOn(LocalEventDriver.prototype, 'set').mockImplementation(jest.fn());

		jest
			.spyOn(EventDispatcher.prototype, 'register')
			.mockImplementation(registerFn);

		expect(EventBus.instance.subscribe('STUB_EVENT', handler)).toBe(true);
		expect(registerFn).toHaveBeenCalledWith(handler);
	});

	it('should not unsubscribe of a non existing event', () => {
		const handler = new StubEventHandler();

		const getFn = jest.fn().mockReturnValue(undefined);
		jest.spyOn(LocalEventDriver.prototype, 'get').mockImplementation(getFn);

		expect(EventBus.instance.unsubscribe('STUB_EVENT', handler)).toBe(false);
		expect(getFn).toHaveBeenCalledWith('STUB_EVENT');
	});

	it('should unsubscribe of an existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = new StubEventHandler();

		const unregisterFn = jest.fn().mockReturnValue(true);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockReturnValue(dispatcher);

		jest
			.spyOn(EventDispatcher.prototype, 'unregister')
			.mockImplementation(unregisterFn);

		expect(EventBus.instance.unsubscribe('STUB_EVENT', handler)).toBe(true);
		expect(unregisterFn).toHaveBeenCalledWith(handler);
	});

	it('should not publish to a non existing event', () => {
		const payload = new StubEventPayload({ value: 42 });

		const getFn = jest.fn().mockReturnValue(undefined);
		jest.spyOn(LocalEventDriver.prototype, 'get').mockImplementation(getFn);

		expect(EventBus.instance.publish(payload)).toBe(false);
		expect(getFn).toHaveBeenCalledWith('STUB_EVENT');
	});

	it('should publish to an existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const payload = new StubEventPayload({ value: 42 });

		const dispatchFn = jest.fn().mockReturnValue(true);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockReturnValue(dispatcher);
		jest
			.spyOn(EventDispatcher.prototype, 'dispatch')
			.mockImplementation(dispatchFn);

		expect(EventBus.instance.publish(payload)).toBe(true);
		expect(dispatchFn).toHaveBeenCalledWith(payload);
	});
});
