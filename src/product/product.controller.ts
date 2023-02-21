import {
	Controller,
	Get,
	Post,
	Delete,
	Put,
	HttpCode,
	Body,
	Param,
	NotFoundException,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post()
	@HttpCode(201)
	async create(@Body() createProductDTO: CreateProductDTO) {
		try {
			const createdProduct = await this.productService.createProduct(
				createProductDTO,
			);

			return {
				success: true,
				data: createdProduct,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get()
	async getProducts() {
		try {
			const products = await this.productService.getProducts();

			return {
				success: true,
				data: products,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get('/:productId')
	async getProductById(@Param('productId') productId) {
		try {
			const product = await this.productService.getProduct(productId);

			if (!product) throw new NotFoundException("Product doesn't exist");

			return {
				success: true,
				data: product,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Delete('/:productId')
	async deleteProduct(@Param('productId') productId) {
		try {
			const product = await this.productService.deleteProduct(productId);

			if (!product) throw new NotFoundException("Product doesn't exist");

			return {
				success: true,
				data: product,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Put('/:productId')
	async updateProduct(
		@Param('productId') productId,
		@Body() createProductDTO: CreateProductDTO,
	) {
		try {
			const updatedProduct = await this.productService.updateProduct(
				productId,
				createProductDTO,
			);

			if (!updatedProduct)
				throw new NotFoundException("Product doesn't exist");

			return {
				success: true,
				data: updatedProduct,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}
}
