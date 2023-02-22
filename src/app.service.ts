import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';

@Injectable()
export class AppService {
	constructor(
		private userService: UserService,
		private productService: ProductService,
	) {}

	getHello(): string {
		return 'Hello World!';
	}

	async seedDB() {
		this.userService.seedUsers();
		this.productService.seedProducts();
	}
}
