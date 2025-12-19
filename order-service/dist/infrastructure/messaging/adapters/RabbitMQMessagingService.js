"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQMessagingService = void 0;
const amqp = __importStar(require("amqplib"));
const config_1 = require("../config/config");
class RabbitMQMessagingService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.connect();
    }
    isConnected() {
        return this.connection !== null && this.channel !== null;
    }
    getChannel() {
        return this.channel;
    }
    async connect() {
        try {
            this.connection = await amqp.connect(config_1.rabbitmqConfig.url);
            if (this.connection) {
                this.channel = await this.connection.createChannel();
            }
            console.log("Connected to RabbitMQ");
        }
        catch (error) {
            console.error("Failed to connect to RabbitMQ", error);
        }
    }
    async publish(exchange, routingKey, message) {
        if (!this.channel) {
            throw new Error("RabbitMQ channel is not available.");
        }
        await this.channel.assertExchange(exchange, "topic", { durable: true });
        this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    }
    async subscribe(queue, handler) {
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
                }
                catch (error) {
                    console.error("Error processing message:", error);
                    this.channel?.nack(msg, false, false);
                }
            }
        });
    }
}
exports.RabbitMQMessagingService = RabbitMQMessagingService;
//# sourceMappingURL=RabbitMQMessagingService.js.map