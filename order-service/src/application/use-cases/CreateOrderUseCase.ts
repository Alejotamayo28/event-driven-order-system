import { Order } from "@/domain/entities/Order";
import type { OrderRepository } from "@/domain/repositories/OrderRepository";

export class CreateOrderUseCase {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(input: any): Promise<Order> {
		const order = new Order(input.customerId, input.items);

		await this.orderRepository.save(order);
		return order;
	}
}
