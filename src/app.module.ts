import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { AppLoggerMiddleware } from './middlewares/AppLogger.middleware';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProductModule,
		MongooseModule.forRoot(process.env.DATABASE_URL),
		UserModule,
		AuthModule,
		OrderModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
