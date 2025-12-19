import { Order } from '@domain/entities/Order';
import { OrderRepository } from '@domain/repositories/OrderRepository';
export declare class PostgreOrderRepository implements OrderRepository {
    findById(id: string): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
    save(order: Order): Promise<Order>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=PostgreOrderRepository.d.ts.map