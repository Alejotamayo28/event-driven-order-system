import { OrderStatus } from "@domain/entities/Order";
import { BaseEventConsumer } from "./BaseEventConsumer";

export class PaymentEventConsumer extends BaseEventConsumer {
	protected setupEventListeners(): void {
		const paymentQueue = "order_service_payment_queue";

		this.messagingService.subscribe(paymentQueue, async (message) => {
			try {
				if (message.type === "PAYMENT_COMPLETED") {
					await this.orderService.updateOrderStatus(
						message.orderId,
						OrderStatus.PAYMENT_COMPLETED
					);
				} else if (message.type === "PAYMENT_FAILED") {
					await this.orderService.updateOrderStatus(
						message.orderId,
						OrderStatus.PAYMENT_FAILED
					);
				}
			} catch (error) {
				console.error("Error processing payment event:", error);
			}
		});
	}
}
