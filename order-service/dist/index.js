"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RabbitMQMessagingService_1 = require("@infrastructure/messaging/adapters/RabbitMQMessagingService");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, routes_1.RegisterRoutes)(app);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const messagingService = new RabbitMQMessagingService_1.RabbitMQMessagingService();
const setupConsumer = async () => {
    if (messagingService.isConnected()) {
        const exchange = "order_events";
        const queue = "order_events_queue";
        const routingKey = "order.created";
        const channel = messagingService.getChannel();
        if (channel) {
            await channel.assertExchange(exchange, "topic", { durable: true });
            await channel.assertQueue(queue, { durable: true });
            await channel.bindQueue(queue, exchange, routingKey);
            await messagingService.subscribe(queue, (message) => {
                console.log(`Received message from queue ${queue}:`, message);
            });
        }
    }
    else {
        console.log("Retrying RabbitMQ connection in 5 seconds...");
        setTimeout(setupConsumer, 5000);
    }
};
setupConsumer();
//# sourceMappingURL=index.js.map