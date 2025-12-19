import type { Order } from "../entities/Order";
export interface OrderRepository {
    findById(id: string): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
    save(order: Order): Promise<Order>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=OrderRepository.d.ts.map