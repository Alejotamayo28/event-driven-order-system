import type { Order, OrderStatus } from "@domain/entities/Order";
import type { DomainEventDispatcher } from "../events/DomainEventDispatcher";
import type { CreateOrderUseCase } from "../use-cases/CreateOrderUseCase";
import type { GetOrderByIdUseCase } from "../use-cases/GetOrderByIdUseCase";
import type { GetOrdersByCustomerIdUseCase } from "../use-cases/GetOrdersByCustomerIdUseCase";
import type { UpdateOrderStatusUseCase } from "../use-cases/UpdateOrderStatusUseCase";

export class OrderService {
	constructor(
		private readonly createOrderUseCase: CreateOrderUseCase,
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly getOrdersByCustomerIdUseCase: GetOrdersByCustomerIdUseCase,
		private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
		private readonly domainEventDispatcher: DomainEventDispatcher
	) {}

	public async getOrderById(id: string): Promise<Order> {
		return this.getOrderByIdUseCase.execute(id);
	}

	public async getOrdersByCustomer(customerId: string): Promise<Order[]> {
		return this.getOrdersByCustomerIdUseCase.execute(customerId);
	}

	public async createOrder(input: any): Promise<void> {
		const order = await this.createOrderUseCase.execute(input);

		await this.domainEventDispatcher.dispatch(order.getDomainEvents());
		order.clearDomainEvents();
	}

	public async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
		const order = await this.updateOrderStatusUseCase.execute(id, status);

		await this.domainEventDispatcher.dispatch(order.getDomainEvents());
		order.clearDomainEvents();
	}
}
