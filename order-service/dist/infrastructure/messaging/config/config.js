"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitmqConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.rabbitmqConfig = {
    url: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
};
//# sourceMappingURL=config.js.map