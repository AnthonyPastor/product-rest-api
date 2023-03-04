import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class Order {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	user: User;

	@Prop(
		raw([
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				title: { type: String, required: true },
				size: { type: String, required: true },
				quantity: { type: Number, required: true },
				slug: { type: String, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
			},
		]),
	)
	orderItems: Record<string, any>;

	@Prop(
		raw({
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			address: { type: String, required: true },
			address2: { type: String },
			zip: { type: String, required: true },
			city: { type: String, required: true },
			country: { type: String, required: true },
			phone: { type: String, required: true },
		}),
	)
	shippingAddress: Record<string, any>;

	@Prop({ required: true })
	numberOfItems: number;

	@Prop({ required: true })
	subTotal: number;

	@Prop({ required: true })
	tax: number;

	@Prop({ required: true })
	total: number;

	@Prop()
	isPaid: boolean;

	@Prop()
	transactionId: string;

	@Prop({ default: Date.now })
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
