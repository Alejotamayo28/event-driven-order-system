export interface IOrder {
	id: string;
	customerId: string;
	items: OrderItem[];
	totalAmount: number;
	status: OrderStatus;
	createdAt: Date;
	updatedAt?: Date;
}

export enum OrderStatus {
	PENDING = "PENDING",
	CONFIRMED = "CONFIRMED",
	SHIPPED = "SHIPPED",
	DELIVERED = "DELIVERED",
	CANCELLED = "CANCELLED",
}

export interface OrderItem {
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

export class Order {
	public readonly id: string;
	public readonly customerId: string;
	public readonly items: OrderItem[];
	public totalAmount: number;
	public status: OrderStatus;
	public readonly createdAt: Date;
	public updatedAt?: Date;

	constructor(
		id: string,
		customerId: string,
		items: OrderItem[],
		totalAmount: number,
		status: OrderStatus = OrderStatus.PENDING,
		createdAt: Date = new Date(),
		updatedAt?: Date
	) {
		this.id = id;
		this.customerId = customerId;
		this.items = items;
		this.totalAmount = totalAmount;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;

		this.validate();
	}

	private validate(): void {
		if (!this.id) throw new Error("Order ID is required");
		if (!this.customerId) throw new Error("Customer ID is required");
		if (this.items.length === 0) throw new Error("Order must have at least one item");
		if (this.totalAmount < 0) throw new Error("Total amount cannot be negative");
	}

	public updateStatus(status: OrderStatus): void {
		this.status = status;
		this.updatedAt = new Date();
	}

	public addItem(item: OrderItem): void {
		this.items.push(item);
		this.totalAmount += item.totalPrice;
		this.updatedAt = new Date();
	}
}
