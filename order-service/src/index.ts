import { RabbitMQMessagingService } from "@infrastructure/messaging/adapters/RabbitMQMessagingService";
import cors from "cors";
import express from "express";
import { RegisterRoutes } from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());

RegisterRoutes(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const messagingService = new RabbitMQMessagingService();

const setupConsumer = async () => {
  if (messagingService.isConnected()) {
    const exchange = "order_events"; // Oficina de pedidos
    const queue = "order_events_queue"; //Mi buzon
    const routingKey = "order.created"; // Tipo de cartas que quiero recibir

    const channel = messagingService.getChannel();
    if (channel) {
      await channel.assertExchange(exchange, "topic", { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);

      await messagingService.subscribe(queue, (message) => {
        console.log(`Received message from queue ${queue}:`, message);
      });
    }
  } else {
    console.log("Retrying RabbitMQ connection in 5 seconds...");
    setTimeout(setupConsumer, 5000);
  }
};

setupConsumer();
