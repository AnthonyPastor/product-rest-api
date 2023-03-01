import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [OrderModule, ProductModule, UserModule, ConfigModule.forRoot()],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}

