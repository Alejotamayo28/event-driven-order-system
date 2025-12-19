"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class Order {
    constructor(id, customerId, items, totalAmount, status = OrderStatus.PENDING, createdAt = new Date(), updatedAt) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }
    validate() {
        if (!this.id)
            throw new Error("Order ID is required");
        if (!this.customerId)
            throw new Error("Customer ID is required");
        if (this.items.length === 0)
            throw new Error("Order must have at least one item");
        if (this.totalAmount < 0)
            throw new Error("Total amount cannot be negative");
    }
    updateStatus(status) {
        this.status = status;
        this.updatedAt = new Date();
    }
    addItem(item) {
        this.items.push(item);
        this.totalAmount += item.totalPrice;
        this.updatedAt = new Date();
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map