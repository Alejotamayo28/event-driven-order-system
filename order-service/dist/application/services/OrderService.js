"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const RabbitMQMessagingService_1 = require("@infrastructure/messaging/adapters/RabbitMQMessagingService");
const PostgreOrderRepository_1 = require("@infrastructure/database/adapters/PostgreOrderRepository");
const Order_1 = require("@domain/entities/Order");
const uuid_1 = require("uuid");
class OrderService {
    constructor(orderRepository) {
        this.messagingService = new RabbitMQMessagingService_1.RabbitMQMessagingService();
        this.orderRepository = orderRepository || new PostgreOrderRepository_1.PostgreOrderRepository();
    }
    async getOrderById(id) {
        return this.orderRepository.findById(id);
    }
    async createOrder(input) {
        const newOrder = new Order_1.Order((0, uuid_1.v4)(), input.customerId, input.items, input.totalAmount, input.status);
        const savedOrder = await this.orderRepository.save(newOrder);
        await this.messagingService.publish("order_events", "order.created", savedOrder);
        return savedOrder;
    }
    async getOrdersByCustomer(customerId) {
        return this.orderRepository.findByCustomerId(customerId);
    }
    async updateOrderStatus(id, status) {
        const existingOrder = await this.orderRepository.findById(id);
        if (!existingOrder) {
            return null;
        }
        if (!(status in Order_1.OrderStatus)) {
            throw new Error(`Invalid OrderStatus: ${status}`);
        }
        existingOrder.updateStatus(status);
        return this.orderRepository.update(existingOrder);
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map