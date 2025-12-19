import type { MessagingService } from "@application/ports/MessagingService";
import type { OrderService } from "@application/services/OrderService";
import { OrderStatus } from "@domain/entities/Order";
import { BaseEventConsumer } from "./BaseEventConsumer";

export class ShipmentEventConsumer extends BaseEventConsumer {
	protected setupEventListeners(): void {
		const shipmentQueue = "order_service_shipment_queue";

		this.messagingService.subscribe(shipmentQueue, async (message) => {
			try {
				if (message.type === "SHIPMENT_CREATED") {
					await this.orderService.updateOrderStatus(message.orderId, OrderStatus.SHIPPED);
				} else if (message.type === "SHIPMENT_DELIVERED") {
					await this.orderService.updateOrderStatus(
						message.orderId,
						OrderStatus.DELIVERED
					);
				}
			} catch (error) {
				console.error("Error processing shipment event:", error);
			}
		});
	}
}
