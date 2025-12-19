export interface IOrder {
    id: string;
    customerId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt?: Date;
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export declare class Order {
    readonly id: string;
    readonly customerId: string;
    readonly items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    readonly createdAt: Date;
    updatedAt?: Date;
    constructor(id: string, customerId: string, items: OrderItem[], totalAmount: number, status?: OrderStatus, createdAt?: Date, updatedAt?: Date);
    private validate;
    updateStatus(status: OrderStatus): void;
    addItem(item: OrderItem): void;
}
//# sourceMappingURL=Order.d.ts.map