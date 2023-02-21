import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {
	@Prop({ required: true })
	name: string;

	@Prop()
	description: string;

	@Prop()
	imageURL: string;

	@Prop()
	price: number;

	@Prop({ default: Date.now })
	createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
