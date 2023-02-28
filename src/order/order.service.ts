import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';

import { CreateOrderDTO } from './dto/order.dto';
import { IOrder } from './interfaces/order.interface';
import { Order } from './schema/order.schema';
import { IProduct } from '../product/interfaces/product.interface';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name)
		private readonly orderModel: Model<IOrder>,
		@InjectModel(Product.name)
		private readonly productModel: Model<IProduct>,
	) {}

	async getOrderById(id: string): Promise<IOrder> {
		if (!isValidObjectId(id)) {
			return null;
		}

		const order = await this.orderModel.findById(id).lean();

		if (!order) {
			throw new NotFoundException('Order not found');
		}

		return order;
	}

	async getOrdersByUser(userId: string): Promise<IOrder[]> {
		if (!isValidObjectId(userId)) {
			return null;
		}

		const orders = await this.orderModel.find({ user: userId }).lean();

		return orders;
	}

	async createOrder(
		createOrderDTO: CreateOrderDTO,
		userId: string,
	): Promise<IOrder> {
		const { orderItems, total } = createOrderDTO;

		const productsIds = orderItems.map((product) => product._id);
		const dbProducts = await this.productModel.find({
			_id: { $in: productsIds },
		});

		const subTotal = orderItems.reduce((prev, current) => {
			const currentPrice = dbProducts.find(
				(prod) => prod.id === current._id,
			)?.price;
			if (!currentPrice) {
				throw new NotFoundException(
					'Verify cart again, product not found',
				);
			}

			return currentPrice * current.quantity + prev;
		}, 0);

		// const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
		const taxRate = 15; // TODO: this should be on a env file
		const backendTotal = subTotal * (taxRate + 1);

		if (total !== backendTotal) {
			throw new Error("Calculated total doesn't match the amount");
		}

		const newOrder: IOrder = {
			...createOrderDTO,
			isPaid: false,
			user: userId,
			total: Math.round(total * 100) / 100, // Deliting decimals
		};

		const createdOrder = await this.orderModel.create(newOrder);

		return createdOrder;
	}

	async updateOrder(
		orderId: string,
		createOrderDTO: CreateOrderDTO,
	): Promise<IOrder> {
		const updatedOrder = await this.orderModel
			.findByIdAndUpdate(orderId, createOrderDTO, { new: true })
			.lean();

		if (!updatedOrder) throw new NotFoundException('Order not found');

		return updatedOrder;
	}
}

