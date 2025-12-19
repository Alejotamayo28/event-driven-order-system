import { OrderService } from "@application/services/OrderService";
import { Controller, Get, Route, SuccessResponse } from "tsoa";

@Route("orders")
export class OrderController extends Controller {
	private orderService: OrderService;

	constructor() {
		super();
		this.orderService = new OrderService();
	}

	@Get("{id}")
	@SuccessResponse("200", "Found")
	public async getOrderById(id: string): Promise<any> {
		return this.orderService.getOrderById(id);
	}
}
