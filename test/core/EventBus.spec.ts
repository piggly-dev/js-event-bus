import { EventDispatcher, LocalEventDriver } from '@/core';
import EventBus from '@/index';
import {
	CustomEventDriver,
	StubEventPayload,
	stubEventHandlerCallback,
} from '@test/__stubs__';

describe('EventBus', () => {
	it('should have a singleton instance', () => {
		expect(EventBus.instance).toBeInstanceOf(EventBus);
	});

	it('should subscribe to a existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = stubEventHandlerCallback;

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
		const handler = stubEventHandlerCallback;
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
		const handler = stubEventHandlerCallback;

		const getFn = jest.fn().mockReturnValue(undefined);
		jest.spyOn(LocalEventDriver.prototype, 'get').mockImplementation(getFn);

		expect(EventBus.instance.unsubscribe('STUB_EVENT', handler)).toBe(false);
		expect(getFn).toHaveBeenCalledWith('STUB_EVENT');
	});

	it('should unsubscribe of an existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const handler = stubEventHandlerCallback;

		const unregisterFn = jest.fn().mockReturnValue(true);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockReturnValue(dispatcher);

		jest
			.spyOn(EventDispatcher.prototype, 'unregister')
			.mockImplementation(unregisterFn);

		expect(EventBus.instance.unsubscribe('STUB_EVENT', handler)).toBe(true);
		expect(unregisterFn).toHaveBeenCalledWith(handler);
	});

	it('should not unsubscribe all of a non existing event', () => {
		const getFn = jest.fn().mockReturnValue(undefined);
		jest.spyOn(LocalEventDriver.prototype, 'get').mockImplementation(getFn);

		expect(EventBus.instance.unsubscribeAll('STUB_EVENT')).toBe(false);
		expect(getFn).toHaveBeenCalledWith('STUB_EVENT');
	});

	it('should unsubscribe all of an existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const unregisterFn = jest.fn().mockReturnValue(true);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockReturnValue(dispatcher);

		jest
			.spyOn(EventDispatcher.prototype, 'unregisterAll')
			.mockImplementation(unregisterFn);

		expect(EventBus.instance.unsubscribeAll('STUB_EVENT')).toBe(true);
	});

	it('should not publish to a non existing event', () => {
		const payload = new StubEventPayload({ size: 42 });

		const getFn = jest.fn().mockReturnValue(undefined);
		jest.spyOn(LocalEventDriver.prototype, 'get').mockImplementation(getFn);

		expect(EventBus.instance.publish(payload)).resolves.toBe(undefined);
		expect(getFn).toHaveBeenCalledWith('STUB_EVENT');
	});

	it('should publish to an existing event', () => {
		const dispatcher = new EventDispatcher('STUB_EVENT');
		const payload = new StubEventPayload({ size: 42 });

		const dispatchFn = jest.fn().mockResolvedValue([true]);

		jest.spyOn(LocalEventDriver.prototype, 'get').mockReturnValue(dispatcher);
		jest
			.spyOn(EventDispatcher.prototype, 'dispatch')
			.mockImplementation(dispatchFn);

		expect(EventBus.instance.publish(payload)).resolves.toStrictEqual([true]);
		expect(dispatchFn).toHaveBeenCalledWith(payload);
	});

	it('should throw an error for non existing driver', () => {
		expect(() => {
			EventBus.instance.unsubscribeAll('ANY_EVENT', { driver: 'unknown' });
		}).toThrow('EventBus driver unknown not found.');
	});

	it('should handle an existing driver', () => {
		EventBus.instance.register(new CustomEventDriver());

		// Return false because there is nothing to unsubscribe
		expect(
			EventBus.instance.unsubscribeAll('ANY_EVENT', { driver: 'custom' })
		).toBe(false);
	});
});
