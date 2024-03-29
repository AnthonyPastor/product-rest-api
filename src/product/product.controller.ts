import {
	Controller,
	Get,
	Post,
	Delete,
	Put,
	HttpCode,
	Body,
	Param,
	Query,
	UseGuards,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post()
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
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
	async getProducts(@Query() query) {
		try {
			const products = await this.productService.getProducts(
				query.gender,
			);

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

	@Get('/id/:productId')
	async getProductById(@Param('productId') productId) {
		try {
			const product = await this.productService.getProduct(productId);

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
	@UseGuards(JwtAuthGuard)
	async deleteProduct(@Param('productId') productId) {
		try {
			const product = await this.productService.deleteProduct(productId);

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
	@UseGuards(JwtAuthGuard)
	async updateProduct(
		@Param('productId') productId,
		@Body() createProductDTO: CreateProductDTO,
	) {
		try {
			const updatedProduct = await this.productService.updateProduct(
				productId,
				createProductDTO,
			);

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

	@Get('/slug/:slug')
	async getProductBySlug(@Param('slug') slug) {
		try {
			const product = await this.productService.getProductBySlug(slug);

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

	@Get('search/:q')
	async searchProducts(@Param('q') query) {
		try {
			const products = await this.productService.searchProducts(query);

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
}
