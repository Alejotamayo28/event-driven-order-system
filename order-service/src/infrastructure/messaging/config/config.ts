import dotenv from "dotenv";

dotenv.config();

export const rabbitmqConfig = {
	url: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
};
