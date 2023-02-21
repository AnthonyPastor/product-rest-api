import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IProduct } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<IProduct>,
	) {}

	async getProducts(): Promise<IProduct[]> {
		const products = await this.productModel.find();
		return products;
	}

	async getProduct(productId: string): Promise<Product> {
		const product = await this.productModel.findById(productId);
		return product;
	}

	async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
		const createdProduct = await this.productModel.create(createProductDTO);

		return createdProduct;
	}

	async deleteProduct(productId: string): Promise<Product> {
		const deletedProduct = await this.productModel.findByIdAndDelete(
			productId,
		);

		return deletedProduct;
	}

	async updateProduct(
		productId: string,
		createProductDTO: CreateProductDTO,
	): Promise<Product> {
		const updatedProduct = await this.productModel.findByIdAndUpdate(
			productId,
			createProductDTO,
			{ new: true },
		);

		return updatedProduct;
	}
}
