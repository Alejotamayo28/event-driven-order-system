import type { Order, OrderStatus } from "@/domain/entities/Order";
import type { OrderRepository } from "@/domain/repositories/OrderRepository";

export class UpdateOrderStatusUseCase {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(orderId: string, orderStatus: OrderStatus): Promise<Order> {
		const order = await this.orderRepository.findById(orderId);
		if (!order) {
			throw new Error("ORDER_NOT_FOUND");
		}

		order.transitionTo(orderStatus, "MANUAL_STATUS_UPDATE");
		await this.orderRepository.update(order);

		return order;
	}
}
