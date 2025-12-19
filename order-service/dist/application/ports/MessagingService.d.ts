export interface MessagingService {
    publish(exchange: string, routingKey: string, message: any): Promise<void>;
    subscribe(queue: string, handler: (message: any) => void): void;
}
//# sourceMappingURL=MessagingService.d.ts.map