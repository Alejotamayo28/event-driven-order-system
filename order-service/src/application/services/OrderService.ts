import type { MessagingService } from "@application/ports/MessagingService";
import { Order, OrderStatus } from "@domain/entities/Order";
import type { OrderRepository } from "@domain/repositories/OrderRepository";
import { PostgreOrderRepository } from "@infrastructure/database/adapters/PostgreOrderRepository";
import { RabbitMQMessagingService } from "@infrastructure/messaging/adapters/RabbitMQMessagingService";
import { v7 as uuidv7 } from "uuid";

export class OrderService {
  private messagingService: MessagingService;
  private orderRepository: OrderRepository;

  constructor() {
    this.messagingService = new RabbitMQMessagingService();
    this.orderRepository = new PostgreOrderRepository();
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  public async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerId(customerId);
  }

  public async createOrder(input: any): Promise<void> {
    /*
     { exchange: "order_events", -> Oficina de correos
       routing_key: "order.created"} -> Buzon
    */
    const newOrder = new Order(uuidv7(), input.customerId, input.items, input.totalAmount, input.status);

    await this.orderRepository.save(newOrder);
    await this.messagingService.publish("order_events", "check_items", { items: {} });
  }

  public async updateOrderStatus(id: string, status: string): Promise<void | null> {
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      return null;
    }
    if (!(status in OrderStatus)) {
      throw new Error(`Invalid OrderStatus: ${status}`);
    }
    existingOrder.updateStatus(status as OrderStatus);
    await this.orderRepository.update(existingOrder);
  }
}
