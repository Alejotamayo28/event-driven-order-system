import type { Order } from "@/domain/entities/Order";
import type { OrderRepository } from "@/domain/repositories/OrderRepository";

export class GetOrderByIdUseCase {
	constructor(private readonly orderRepository: OrderRepository) {}
	async execute(id: string): Promise<Order> {
		const order = await this.orderRepository.findById(id);
		if (!order) {
			throw new Error("Order not found");
		}

		return order;
	}
}
