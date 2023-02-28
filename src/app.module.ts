import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProductModule,
		MongooseModule.forRoot(process.env.DATABASE_URL),
		UserModule,
		AuthModule,
		OrderModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
