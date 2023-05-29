import EventPayload from '@/core/EventPayload';

describe('EventPayload', () => {
	it('should have all attributes as expected', () => {
		jest.spyOn(Date, 'now').mockReturnValue(1685329292785);
		jest.spyOn(Math, 'random').mockReturnValue(0.25354748623267054);

		const event = new EventPayload<{
			value: number;
		}>('STUB', { value: 42 });

		expect(event.id).toBe('427311005659.921140.94liexd9jti');
		expect(event.name).toBe('STUB');
		expect(event.data).toStrictEqual({ value: 42 });
		expect(event.issued_at).toBe(1685329292785);
	});
});
