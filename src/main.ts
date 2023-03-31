import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Product management API')
		.setDescription(
			'API to manage products, searches, payments, users and admin actions',
		)
		.setVersion('1.0')
		.addTag('product-management')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	await app.listen(3001);
}
bootstrap();
