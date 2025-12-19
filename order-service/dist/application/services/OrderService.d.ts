import { OrderRepository } from "@domain/repositories/OrderRepository";
import { Order } from "@domain/entities/Order";
export declare class OrderService {
    private messagingService;
    private orderRepository;
    constructor(orderRepository?: OrderRepository);
    getOrderById(id: string): Promise<Order | null>;
    createOrder(input: any): Promise<Order>;
    getOrdersByCustomer(customerId: string): Promise<Order[]>;
    updateOrderStatus(id: string, status: string): Promise<Order | null>;
}
//# sourceMappingURL=OrderService.d.ts.map