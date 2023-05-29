export default class EventPayload<EventData = Record<string, any>> {
	public readonly id: string;

	public readonly name: string;

	public readonly data: EventData;

	public readonly issued_at: number;

	constructor(name: string, data: EventData) {
		this.id = Math.random().toString(36).substr(2, 9);
		this.name = name;
		this.data = data;
		this.issued_at = Date.now();
	}

	public generateId(): string {
		return (
			(Date.now() * Math.random()).toString() + Math.random().toString(36)
		);
	}
}
