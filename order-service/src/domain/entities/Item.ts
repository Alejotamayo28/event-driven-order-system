import Entity from "./Entity";

export class Item extends Entity {
	static loadItem(
		id: string,
		productId: string,
		name: string,
		quantity: number,
		unitPrice: number
	): Item {
		const item = new Item(productId, name, quantity, unitPrice);
		item.setId(id);
		item.setWasUpdated(false);

		return item;
	}

	private productId: string;
	private name: string;
	private quantity: number;
	private unitPrice: number;
	private totalPrice: number;
	private wasUpdated: boolean;

	constructor(productId: string, name: string, quantity: number, unitPrice: number) {
		super();
		this.productId = productId;
		this.name = name;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.totalPrice = quantity * unitPrice;
		this.wasUpdated = true;
	}

	public updateQuantity(quantity: number): void {
		if (quantity <= 0) throw new Error("Quantity must be greater than zero");
		this.quantity = quantity;
		this.totalPrice = quantity * this.unitPrice;

		this.setWasUpdated(true);
	}

	public updateUnitPrice(unitPrice: number): void {
		if (unitPrice < 0) throw new Error("Unit price cannot be negative");
		this.unitPrice = unitPrice;
		this.totalPrice = this.quantity * unitPrice;

		this.setWasUpdated(true);
	}

	public getProductId(): string {
		return this.productId;
	}

	public getName(): string {
		return this.name;
	}

	public getQuantity(): number {
		return this.quantity;
	}

	public getUnitPrice(): number {
		return this.unitPrice;
	}

	public getTotalPrice(): number {
		return this.totalPrice;
	}

	public getWasUpdated(): boolean {
		return this.wasUpdated;
	}

	public setWasUpdated(wasUpdated: boolean) {
		this.wasUpdated = wasUpdated;
	}
}
