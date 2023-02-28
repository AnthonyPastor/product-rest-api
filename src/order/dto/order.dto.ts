import { IOrderItem, ShippingAddress } from '../interfaces/order.interface';

export interface CreateOrderDTO {
	readonly orderItems: IOrderItem[];
	readonly shippingAddress: ShippingAddress;
	readonly numberOfItems: number;
	readonly subTotal: number;
	readonly tax: number;
	readonly total: number;
	readonly isPaid: boolean;
}
