import { EventDispatcher, LocalEventDriver } from '@/index';

describe('LocalEventDriver', () => {
	it('should set a dispatcher', () => {
		const driver = new LocalEventDriver();
		const dispatcher = new EventDispatcher('STUB_EVENT');

		driver.set('STUB_EVENT', dispatcher);
		expect(driver.get('STUB_EVENT')).toBe(dispatcher);
		expect(driver.has('STUB_EVENT')).toBe(true);
		expect(driver.size()).toBe(1);
	});

	it('should not set a existing dispatcher', () => {
		const driver = new LocalEventDriver();
		const dispatcher = new EventDispatcher('STUB_EVENT');

		driver.set('STUB_EVENT', dispatcher);
		driver.set('STUB_EVENT', dispatcher);
		expect(driver.size()).toBe(1);
	});

	it('should get a dispatcher', () => {
		const driver = new LocalEventDriver();
		const dispatcher = new EventDispatcher('STUB_EVENT');

		driver.set('STUB_EVENT', dispatcher);
		expect(driver.get('STUB_EVENT')).toBe(dispatcher);
	});

	it('should not get a dispatcher when it does not exist', () => {
		const driver = new LocalEventDriver();
		expect(driver.get('STUB_EVENT')).toBe(undefined);
	});

	it('should have a dispatcher', () => {
		const driver = new LocalEventDriver();
		const dispatcher = new EventDispatcher('STUB_EVENT');

		driver.set('STUB_EVENT', dispatcher);
		expect(driver.has('STUB_EVENT')).toBe(true);
	});

	it('should not have a dispatcher', () => {
		const driver = new LocalEventDriver();
		expect(driver.has('STUB_EVENT')).toBe(false);
	});
});
