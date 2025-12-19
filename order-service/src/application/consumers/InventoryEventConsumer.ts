import { OrderStatus } from "@domain/entities/Order";
import { BaseEventConsumer } from "./BaseEventConsumer";

export class InventoryEventConsumer extends BaseEventConsumer {
	protected setupEventListeners(): void {
		const inventoryQueue = "order_service_inventory_queue";

		this.messagingService.subscribe(inventoryQueue, async (message) => {
			try {
				if (message.type === "INVENTORY_RESERVED") {
					await this.orderService.updateOrderStatus(
						message.orderId,
						OrderStatus.INVENTORY_RESERVED
					);
				} else if (message.type === "INVENTORY_UNAVAILABLE") {
					await this.orderService.updateOrderStatus(
						message.orderId,
						OrderStatus.INVENTORY_UNAVAILABLE
					);
				}
			} catch (error) {
				console.error("Error processing inventory event:", error);
			}
		});
	}
}
