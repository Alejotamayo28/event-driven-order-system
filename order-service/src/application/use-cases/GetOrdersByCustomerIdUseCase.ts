import type { Order } from "@/domain/entities/Order";
import type { OrderRepository } from "@/domain/repositories/OrderRepository";

export class GetOrdersByCustomerIdUseCase {
	constructor(private readonly orderRepository: OrderRepository) {}
	async execute(id: string): Promise<Order[]> {
		const orders = this.orderRepository.findByCustomerId(id);
		if (!orders) {
			throw new Error("Orders not found by customer id");
		}

		return orders;
	}
}
