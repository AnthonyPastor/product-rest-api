import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		ConfigModule.forRoot(),
		HttpModule,
		UserModule,
		ProductModule,
		AuthModule,
		MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}

