import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		ProductModule,
		MongooseModule.forRoot('mongodb://localhost:27017/products-nest'),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
