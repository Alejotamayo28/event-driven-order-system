"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("@application/services/OrderService");
const tsoa_1 = require("tsoa");
let OrderController = class OrderController extends tsoa_1.Controller {
    constructor() {
        super();
        this.orderService = new OrderService_1.OrderService();
    }
    async getOrderById(id) {
        return this.orderService.getOrderById(id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, tsoa_1.Get)("{id}"),
    (0, tsoa_1.SuccessResponse)("200", "Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
exports.OrderController = OrderController = __decorate([
    (0, tsoa_1.Route)("orders"),
    __metadata("design:paramtypes", [])
], OrderController);
//# sourceMappingURL=OrderController.js.map