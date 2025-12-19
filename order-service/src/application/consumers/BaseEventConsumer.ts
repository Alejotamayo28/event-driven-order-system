import type { MessagingService } from "@application/ports/MessagingService";
import type { OrderService } from "@application/services/OrderService";

export abstract class BaseEventConsumer {
	protected orderService: OrderService;

	constructor(
		protected messagingService: MessagingService,
		orderService: OrderService
	) {
		this.orderService = orderService;
		this.setupEventListeners();
	}

	protected abstract setupEventListeners(): void;
}
