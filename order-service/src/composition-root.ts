import { OrderService } from "@application/services/OrderService";
import { CreateOrderUseCase } from "@application/use-cases/CreateOrderUseCase";
import { GetOrderByIdUseCase } from "@application/use-cases/GetOrderByIdUseCase";
import { GetOrdersByCustomerIdUseCase } from "@application/use-cases/GetOrdersByCustomerIdUseCase";
import { UpdateOrderStatusUseCase } from "@application/use-cases/UpdateOrderStatusUseCase";
import { PostgreOrderRepository } from "@infrastructure/database/adapters/PostgreOrderRepository";
import { RabbitMQMessagingService } from "@infrastructure/messaging/adapters/RabbitMQMessagingService";
import { RabbitMQDomainEventDispatcher } from "@infrastructure/messaging/adapters/rabbitMQDomainEventDispatcher";

export class CompositionRoot {
	static configure(): OrderService {
		const orderRepository = new PostgreOrderRepository();
		const messagingService = new RabbitMQMessagingService();

		const domainEventDispatcher = new RabbitMQDomainEventDispatcher(messagingService);
		const createOrderUseCase = new CreateOrderUseCase(orderRepository);
		const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
		const getOrdersByCustomerIdUseCase = new GetOrdersByCustomerIdUseCase(
			orderRepository
		);
		const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);

		return new OrderService(
			createOrderUseCase,
			getOrderByIdUseCase,
			getOrdersByCustomerIdUseCase,
			updateOrderStatusUseCase,
			domainEventDispatcher
		);
	}
}
