import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IProduct } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/product.dto';
import { Product } from './schemas/product.schema';
import { IGender } from './enums/gender.enum';
import { initialData } from '../database/seed-data';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<IProduct>,
	) {}

	async getProducts(gender?: string): Promise<IProduct[]> {
		let condition = {};

		if (gender && IGender[gender]) {
			condition = { gender };
		}

		const products = await this.productModel
			.find(condition)
			.select('title images price inStock slug -_id')
			.lean();
		return products;
	}

	async getProduct(productId: string): Promise<IProduct> {
		const product = await this.productModel.findById(productId).lean();

		if (!product) throw new NotFoundException("Product doesn't exist");

		return product;
	}

	async getProductBySlug(slug: string): Promise<IProduct> {
		const product = await this.productModel.findOne({ slug }).lean();

		if (!product) throw new NotFoundException("Product doesn't exist");

		return product;
	}

	async createProduct(createProductDTO: CreateProductDTO): Promise<IProduct> {
		const createdProduct = await this.productModel.create(createProductDTO);

		return createdProduct;
	}

	async deleteProduct(productId: string): Promise<IProduct> {
		const deletedProduct = await this.productModel
			.findByIdAndDelete(productId)
			.lean();

		if (!deletedProduct)
			throw new NotFoundException("Product doesn't exist");

		return deletedProduct;
	}

	async updateProduct(
		productId: string,
		createProductDTO: CreateProductDTO,
	): Promise<IProduct> {
		const updatedProduct = await this.productModel
			.findByIdAndUpdate(productId, createProductDTO, { new: true })
			.lean();

		if (!updatedProduct)
			throw new NotFoundException("Product doesn't exist");

		return updatedProduct;
	}

	async searchProducts(query?: string): Promise<IProduct[]> {
		if (!query) {
			throw new Error('Please provide a query');
		}

		const products = await this.productModel
			.find({
				$text: { $search: query },
			})
			.select('title images price inStock slug -_id')
			.lean();
		return products;
	}

	async seedProducts() {
		await this.productModel.deleteMany();
		await this.productModel.insertMany(initialData.products);
	}
}
