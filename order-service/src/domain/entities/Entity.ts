import { v7 as uuid } from "uuid";

abstract class Entity {
	private id: string;
	private domainEvents: any[] = [];

	public constructor() {
		this.id = uuid();
	}

	public getId(): string {
		return this.id;
	}

	public setId(id: string) {
		this.id = id;
	}

	protected addDomainEvent(event: any): void {
		this.domainEvents.push(event);
	}

	public getDomainEvents(): any[] {
		return [...this.domainEvents]; // Recordar, devuelve copia
	}

	public clearDomainEvents(): void {
		this.domainEvents = [];
	}

	public hasPendingEvents(): boolean {
		return this.domainEvents.length > 0;
	}
}

export default Entity;
