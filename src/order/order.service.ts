import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { HttpService } from '@nestjs/axios';

import { CreateOrderDTO } from './dto/order.dto';
import { IOrder } from './interfaces/order.interface';
import { Order } from './schema/order.schema';
import { IProduct } from '../product/interfaces/product.interface';
import { PaypalOrderStatusResponse } from './interfaces/paypal.interface';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name)
		private readonly orderModel: Model<IOrder>,
		@InjectModel(Product.name)
		private readonly productModel: Model<IProduct>,
		private readonly httpService: HttpService,
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

		const taxRate = Number(process.env.TAX_RATE || 0);
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

	async payOrder(orderId: string, transactionId: string) {
		const paypalBearerToken = await this.getPaypalBearerToken();

		if (!paypalBearerToken)
			return {
				success: false,
				message: "Can't genrate paypal token",
			};

		const { data } =
			await this.httpService.axiosRef.get<PaypalOrderStatusResponse>(
				`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
				{
					headers: {
						Authorization: `Bearer ${paypalBearerToken}`,
					},
				},
			);

		if (data.status !== 'COMPLETED') {
			return {
				success: false,
				message: 'Order not recognized',
			};
		}

		const dbOrder = await this.orderModel.findById(orderId);

		if (!dbOrder) {
			return {
				success: false,
				message: 'Order not found',
			};
		}

		if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
			return {
				success: false,
				message: 'Order amount and Paypal amount are not the same',
			};
		}

		dbOrder.transactionId = transactionId;
		dbOrder.isPaid = true;

		dbOrder.save();

		return {
			success: true,
			data: 'Order paid successfully',
		};
	}

	async getPaypalBearerToken(): Promise<string | null> {
		const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
		const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

		const base64Token = Buffer.from(
			`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
			'utf-8',
		).toString('base64');

		const body = new URLSearchParams('grant_type=client_credentials');

		try {
			const { data } = await this.httpService.axiosRef.post(
				process.env.PAYPAL_OAUTH_URL || '',
				body,
				{
					headers: {
						Authorization: `basic ${base64Token}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			);

			return data.access_token;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async fakePay(orderId: string) {
		const dbOrder = await this.orderModel.findById(orderId);

		if (!dbOrder) {
			return {
				success: false,
				message: 'Order not found',
			};
		}

		dbOrder.transactionId = 'fake pay';
		dbOrder.isPaid = true;

		dbOrder.save();

		return {
			success: true,
			data: 'Order paid successfully',
		};
	}
}

