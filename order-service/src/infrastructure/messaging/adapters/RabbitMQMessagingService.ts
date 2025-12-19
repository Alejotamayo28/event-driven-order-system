import type { MessagingService } from "@application/ports/MessagingService";
import * as amqp from "amqplib";
import { rabbitmqConfig } from "../config/config";

export class RabbitMQMessagingService implements MessagingService {
	private connection: amqp.Connection | null = null;
	private channel: amqp.Channel | null = null;

	constructor() {
		this.connect();
	}

	public isConnected(): boolean {
		return this.connection !== null && this.channel !== null;
	}

	public getChannel(): amqp.Channel | null {
		return this.channel;
	}

	private async connect() {
		try {
			this.connection = await amqp.connect(rabbitmqConfig.url);
			if (this.connection) {
				this.channel = await this.connection.createChannel();
			}
			console.log("Connected to RabbitMQ");
		} catch (error) {
			console.error("Failed to connect to RabbitMQ", error);
		}
	}

	async publish(exchange: string, routingKey: string, message: any): Promise<void> {
		if (!this.channel) {
			throw new Error("RabbitMQ channel is not available.");
		}
		await this.channel.assertExchange(exchange, "topic", { durable: true });
		this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
	}

	async subscribe(queue: string, handler: (message: any) => void): Promise<void> {
		if (!this.channel) {
			throw new Error("RabbitMQ channel is not available.");
		}
		await this.channel.assertQueue(queue, { durable: true });
		this.channel.consume(queue, (msg) => {
			if (msg) {
				try {
					const content = JSON.parse(msg.content.toString());
					handler(content);
					this.channel?.ack(msg);
				} catch (error) {
					console.error("Error processing message:", error);
					this.channel?.nack(msg, false, false);
				}
			}
		});
	}
}
