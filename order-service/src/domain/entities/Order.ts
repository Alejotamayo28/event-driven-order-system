import Entity from "./Entity";
import type { Item } from "./Item";

export enum OrderStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",

	PAYMENT_PENDING = "PAYMENT_PENDING",
	PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
	PAYMENT_FAILED = "PAYMENT_FAILED",

	INVENTORY_CHECKING = "INVENTORY_CHECKING",
	INVENTORY_RESERVED = "INVENTORY_RESERVED",
	INVENTORY_UNAVAILABLE = "INVENTORY_UNAVAILABLE",

	PREPARING = "PREPARING",
	READY_FOR_SHIPPING = "READY_FOR_SHIPPING",

	SHIPPED = "SHIPPED",
	DELIVERED = "DELIVERED",

	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",

	ON_HOLD = "ON_HOLD",
}

export const ORDER_STATE_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	[OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],

	[OrderStatus.PROCESSING]: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],

	[OrderStatus.PAYMENT_PENDING]: [
		OrderStatus.PAYMENT_COMPLETED,
		OrderStatus.PAYMENT_FAILED,
		OrderStatus.CANCELLED,
	],

	[OrderStatus.PAYMENT_COMPLETED]: [
		OrderStatus.INVENTORY_CHECKING,
		OrderStatus.CANCELLED,
	],

	[OrderStatus.PAYMENT_FAILED]: [OrderStatus.CANCELLED],

	[OrderStatus.INVENTORY_CHECKING]: [
		OrderStatus.INVENTORY_RESERVED,
		OrderStatus.INVENTORY_UNAVAILABLE,
	],

	[OrderStatus.INVENTORY_RESERVED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],

	[OrderStatus.INVENTORY_UNAVAILABLE]: [OrderStatus.CANCELLED],

	[OrderStatus.PREPARING]: [OrderStatus.READY_FOR_SHIPPING],

	[OrderStatus.READY_FOR_SHIPPING]: [OrderStatus.SHIPPED],

	[OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],

	[OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],

	[OrderStatus.COMPLETED]: [],
	[OrderStatus.CANCELLED]: [],
	[OrderStatus.ON_HOLD]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
};

export class Order extends Entity {
	static loadOrder(
		id: string,
		customerId: string,
		items: Item[],
		status: OrderStatus
	): Order {
		const order = new Order(customerId, items);
		order.setId(id);
		order.setWasUpdated(false);

		order.status = status;
		order.clearDomainEvents();
		return order;
	}

	private customerId: string;
	private items: Item[];
	private status: OrderStatus;
	private wasUpdated: boolean;
	// Registro
	private statusHistory: Array<{
		status: OrderStatus;
		changedAt: Date;
		reason?: string;
	}> = [];

	constructor(customerId: string, items: Item[]) {
		super();
		this.customerId = customerId;
		this.items = items;
		this.status = OrderStatus.PENDING;
		this.wasUpdated = true;

		this.recordStatusChange(OrderStatus.PENDING, "ORDER_CREATED");

		this.addDomainEvent({
			type: "ORDER_CREATED",
			orderId: this.getId(),
			customerId: this.customerId,
			items: this.items,
			createdAt: new Date(),
		});
	}

	// Cerebro State Machine
	public transitionTo(newStatus: OrderStatus, reason?: string): void {
		const allowedTransitions = ORDER_STATE_TRANSITIONS[this.status];

		if (!allowedTransitions.includes(newStatus)) {
			throw new Error(`CANNOT_TRASITION_FROM_${this.status}_TO_${newStatus}`);
		}

		const previousStatus = this.status;
		this.status = newStatus;
		this.wasUpdated = true;

		this.recordStatusChange(newStatus, reason);
		// Evento cambio general
		this.addDomainEvent({
			type: "ORDER_STATUS_CHANGED",
			orderId: this.getId(),
			oldStatus: previousStatus,
			newStatus: newStatus,
			reason: reason || "SYSTEM_CHANGE",
			changedAt: new Date(),
		});
		// Evento cambio especifico
		this.addSpecificEvents(newStatus, previousStatus, reason);
	}

	// Pusheamos eventos al registro
	private recordStatusChange(status: OrderStatus, reason?: string): void {
		this.statusHistory.push({
			status,
			changedAt: new Date(),
			reason: reason || "SYSTEM_CHANGE",
		});
	}

	private addSpecificEvents(
		newStatus: OrderStatus,
		oldStatus: OrderStatus,
		reason?: string
	): void {
		if (newStatus === OrderStatus.PAYMENT_COMPLETED) {
			this.addDomainEvent({
				type: "PAYMENT_COMPLETED",
				orderId: this.getId(),
				amount: this.calculateTotal(),
				completedAt: new Date(),
			});
		}

		if (newStatus === OrderStatus.INVENTORY_RESERVED) {
			this.addDomainEvent({
				type: "INVENTORY_RESERVED",
				orderId: this.getId(),
				items: this.items,
				reservedAt: new Date(),
			});
		}

		if (newStatus === OrderStatus.SHIPPED) {
			this.addDomainEvent({
				type: "ORDER_SHIPPED",
				orderId: this.getId(),
				shippedAt: new Date(),
			});
		}

		if (newStatus === OrderStatus.CANCELLED) {
			this.addDomainEvent({
				type: "ORDER_CANCELLED",
				orderId: this.getId(),
				oldStatus: oldStatus,
				reason: reason || "Unknown",
				cancelledAt: new Date(),
			});
		}
	}

	private calculateTotal(): number {
		return this.items.reduce(
			(total, item) => total + item.getUnitPrice() * item.getQuantity(),
			0
		);
	}

	// Do i really need this? Grafana maybe
	public getStatusHistory() {
		return [...this.statusHistory];
	}

	public getCustomerId(): string {
		return this.customerId;
	}

	public getItems(): Item[] {
		return this.items;
	}

	public getStatus(): OrderStatus {
		return this.status;
	}

	public getWasUpdated(): boolean {
		return this.wasUpdated;
	}

	public setWasUpdated(wasUpdated: boolean) {
		this.wasUpdated = wasUpdated;
	}
}
