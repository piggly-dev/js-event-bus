import { EventPayload } from '@/core/EventPayload';
import * as crypto from 'crypto';

jest.mock('crypto');

describe('EventPayload', () => {
	it('should have all attributes as expected', () => {
		jest.spyOn(Date, 'now').mockReturnValue(1685329292785);

		jest
			.spyOn(crypto, 'randomUUID')
			.mockReturnValue('65d83807-3dfc-4e6e-8c0f-8446e825ae34');

		const event = new EventPayload<{
			value: number;
		}>('STUB', { value: 42 });

		expect(event.id).toBe('65d83807-3dfc-4e6e-8c0f-8446e825ae34');
		expect(event.name).toBe('STUB');
		expect(event.data).toStrictEqual({ value: 42 });
		expect(event.issued_at).toBe(1685329292785);
	});
});
