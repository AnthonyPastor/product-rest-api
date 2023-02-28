import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Request,
	UseGuards,
} from '@nestjs/common';

import { CreateOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Post()
	@HttpCode(201)
	async create(@Request() req, @Body() createOrderDTO: CreateOrderDTO) {
		try {
			const createdOrder = await this.orderService.createOrder(
				createOrderDTO,
				req.user.id,
			);

			return {
				success: true,
				data: createdOrder,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get('/:productId')
	async getOrderById(@Param('orderId') orderId) {
		try {
			const order = await this.orderService.getOrderById(orderId);

			return {
				success: true,
				data: order,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get('/:userId')
	async getOrderByUser(@Param('userId') userId) {
		try {
			const orders = await this.orderService.getOrdersByUser(userId);

			return {
				success: true,
				data: orders,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Put('/:orderId')
	async updateProduct(
		@Param('orderId') orderId,
		@Body() createOrderDTO: CreateOrderDTO,
	) {
		try {
			const updatedOrder = await this.orderService.updateOrder(
				orderId,
				createOrderDTO,
			);

			return {
				success: true,
				data: updatedOrder,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}
}

