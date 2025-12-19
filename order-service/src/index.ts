import { EventConsumerRegistry } from "@application/consumers/EventConsumerRegistry";
import { RabbitMQMessagingService } from "@infrastructure/messaging/adapters/RabbitMQMessagingService";
import cors from "cors";
import express from "express";
import { CompositionRoot } from "./composition-root";
import { RegisterRoutes } from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());

RegisterRoutes(app);

app.use(
	(err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.error(err.stack);
		res.status(500).json({ message: "Something went wrong!" });
	}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const messagingService = new RabbitMQMessagingService();
const orderService = CompositionRoot.configure();
const eventConsumerRegistry = new EventConsumerRegistry(messagingService, orderService);

eventConsumerRegistry.initializeAllConsumers();

const setupOrderEventPublisher = async () => {
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
				console.log(`Received order message from queue ${queue}:`, message);
			});
		}
	} else {
		console.log("Retrying RabbitMQ connection in 5 seconds...");
		setTimeout(setupOrderEventPublisher, 5000);
	}
};

setupOrderEventPublisher();
