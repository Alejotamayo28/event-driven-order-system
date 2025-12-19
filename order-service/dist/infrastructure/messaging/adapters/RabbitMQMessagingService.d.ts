import type { MessagingService } from "@application/ports/MessagingService";
import * as amqp from "amqplib";
export declare class RabbitMQMessagingService implements MessagingService {
    private connection;
    private channel;
    constructor();
    isConnected(): boolean;
    getChannel(): amqp.Channel | null;
    private connect;
    publish(exchange: string, routingKey: string, message: any): Promise<void>;
    subscribe(queue: string, handler: (message: any) => void): Promise<void>;
}
//# sourceMappingURL=RabbitMQMessagingService.d.ts.map