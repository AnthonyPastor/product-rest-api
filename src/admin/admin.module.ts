import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Order, OrderSchema } from '../order/schema/order.schema';
import { User, UserSchema } from '../user/schema/user.schema';

@Module({
	imports: [
		OrderModule,
		ProductModule,
		UserModule,
		ConfigModule.forRoot(),
		MongooseModule.forFeature([
			{ name: Product.name, schema: ProductSchema },
			{ name: Order.name, schema: OrderSchema },
			{ name: User.name, schema: UserSchema },
		]),
	],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}

