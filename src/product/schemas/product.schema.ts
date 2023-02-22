import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGender } from '../enums/gender.enum';
import { ISize } from '../enums/size.enum';
import { IType } from '../enums/type.enum';

@Schema({ timestamps: true })
export class Product {
	@Prop({ required: true, default: '' })
	title: string;

	@Prop({ required: true, unique: true })
	slug: string;

	@Prop({ required: true, default: '' })
	description: string;

	@Prop()
	images: string[];

	@Prop({ required: true, default: 0 })
	inStock: number;

	@Prop({ required: true, default: 0 })
	price: number;

	@Prop({ type: [{ type: String, enum: ISize }], default: [ISize.XS] })
	sizes: ISize[];

	@Prop()
	tags: string[];

	@Prop({
		type: String,
		enum: IType,
		default: IType.shirts,
	})
	type: IType;

	@Prop({
		type: String,
		enum: IGender,
		default: IGender.men,
	})
	gender: IGender;

	@Prop({ default: Date.now })
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product).index({
	title: 'text',
	tags: 'text',
});
