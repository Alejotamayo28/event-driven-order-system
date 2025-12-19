import type { DomainEventDispatcher } from "@/application/events/DomainEventDispatcher";
import type { MessagingService } from "@/application/ports/MessagingService";

export class RabbitMQDomainEventDispatcher implements DomainEventDispatcher {
	constructor(private readonly messagingService: MessagingService) {}

	async dispatch(events: any[]): Promise<void> {
		for (const event of events) {
			const mapping = this.mapEvent(event);
			if (!mapping) {
				throw new Error(`NO_MAPPING_FOR_EVENT_TYPE_${event.type}`);
			}

			await this.messagingService.publish(mapping.exchange, mapping.routingKey, event);
		}
	}

	private mapEvent(event: any): {
		exchange: string;
		routingKey: string;
	} | null {
		const eventMappings: Record<string, { exchange: string; routingKey: string }> = {
			ORDER_CREATED: {
				exchange: "order_events",
				routingKey: "order.created",
			},
			ORDER_STATUS_CHANGED: {
				exchange: "order_events",
				routingKey: "order.status.changed",
			},
			PAYMENT_COMPLETED: {
				exchange: "payment_events",
				routingKey: "payment.completed",
			},
			INVENTORY_RESERVED: {
				exchange: "inventory_events",
				routingKey: "inventory.reserved",
			},
			ORDER_SHIPPED: {
				exchange: "order_events",
				routingKey: "order.shipped",
			},
			ORDER_CANCELLED: {
				exchange: "order_events",
				routingKey: "order.cancelled",
			},
		};

		return eventMappings[event.type] ?? null;
	}
}
