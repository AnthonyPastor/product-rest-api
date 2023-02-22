import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRole } from '../interfaces/user.interface';

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({
		type: String,
		enum: IRole,
		default: IRole.admin,
		required: true,
	})
	role: IRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
