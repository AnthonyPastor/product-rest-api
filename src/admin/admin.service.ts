import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

import { Product } from '../product/schemas/product.schema';
import { IProduct } from '../product/interfaces/product.interface';
import { Order } from '../order/schema/order.schema';
import { IOrder } from '../order/interfaces/order.interface';
import { User } from '../user/schema/user.schema';
import { IUser } from '../user/interfaces/user.interface';
import { DashboardData } from './interfaces/admin.interface';
import { CreateProductDTO } from '../product/dto/product.dto';
import { Request } from 'express';

cloudinary.config(process.env.CLOUDINARY_URL || '');

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<IProduct>,

		@InjectModel(Order.name)
		private readonly orderModel: Model<IOrder>,

		@InjectModel(User.name)
		private readonly userModel: Model<IUser>,
	) {}

	async getDashboardData(): Promise<DashboardData> {
		const [
			numberOfOrder,
			paidOrders,
			notPaidOrders,
			numberOfClients,
			numberOfProducts,
			productsWithNoInventory,
			productsWithLowInventory,
		] = await Promise.all([
			this.orderModel.countDocuments(),
			this.orderModel.countDocuments({ isPaid: true }),
			this.orderModel.countDocuments({ isPaid: false }),
			this.userModel.countDocuments({ role: 'client' }),
			this.productModel.countDocuments(),
			this.productModel.countDocuments({
				inStock: 0,
			}),
			this.productModel.countDocuments({
				inStock: { $lte: 10 },
			}),
		]);

		return {
			numberOfOrder,
			paidOrders,
			notPaidOrders,
			numberOfClients,
			numberOfProducts,
			productsWithNoInventory,
			productsWithLowInventory,
		};
	}

	async getOrders(): Promise<IOrder[]> {
		return await this.orderModel
			.find()
			.sort({ createdAt: 'desc' })
			.populate('user', 'name email')
			.lean();
	}

	async getUsers(): Promise<IUser[]> {
		return await this.userModel.find().select('-password').lean();
	}

	async updateUser(userId: string, newRole: string): Promise<IUser> {
		if (!isValidObjectId(userId)) throw new Error('Invalid user ID');

		const validRoles = ['admin', 'super-user', 'SEO', 'client'];

		if (!validRoles.includes(newRole)) {
			throw new Error('Invalid role');
		}

		const user = await this.userModel.findByIdAndUpdate(
			userId,
			{
				role: newRole,
			},
			{ new: true },
		);
		if (!user) throw new NotFoundException('User not found');

		return user;
	}

	async getProducts(): Promise<IProduct[]> {
		const products = await this.productModel
			.find()
			.sort({ title: 'asc' })
			.lean();

		const updatedProducts = products.map((product) => {
			return {
				...product,
				images: product.images.map((image) => {
					return image.includes('http')
						? image
						: `${process.env.HOST_NAME}products/${image}`;
				}),
			};
		});

		return updatedProducts;
	}

	async createProduct(createProductDTO: CreateProductDTO): Promise<IProduct> {
		if (createProductDTO.images.length < 2) {
			throw new Error('Products must have at least 2 images');
		}

		const productInDB = await this.productModel.findOne({
			slug: createProductDTO.slug,
		});

		if (productInDB) {
			throw new Error('Product already exists');
		}

		const product = await this.productModel.create(createProductDTO);

		return product;
	}

	async updateProduct(createProductDTO: CreateProductDTO): Promise<IProduct> {
		if (!isValidObjectId(createProductDTO._id)) {
			throw new Error('Invalid product ID');
		}

		if (createProductDTO.images.length < 2) {
			throw new Error('Products must have at least 2 images');
		}

		const product = await this.productModel.findById(createProductDTO._id);

		if (!product) {
			throw new NotFoundException('Product not found');
		}

		product.images.forEach(async (img) => {
			if (createProductDTO.images.includes(img)) {
				//Borrar de cloudinary
				const [fileId, extension] = img
					.substring(img.lastIndexOf('/') + 1)
					.split('.');
				await cloudinary.uploader.destroy(fileId);
			}
		});

		await product.update(createProductDTO);

		return product;
	}

	async saveFile(file: formidable.File): Promise<string> {
		const { secure_url } = await cloudinary.uploader.upload(file.filepath);
		return secure_url;
	}

	async parseFiles(req: Request): Promise<string> {
		return new Promise((resolve, reject) => {
			const form = new formidable.IncomingForm();

			form.parse(req, async (err, fields, files) => {
				if (err) return reject(err);

				const filePath = await this.saveFile(
					files.file as formidable.File,
				);

				resolve(filePath);
			});
		});
	}

	async uploadFile(req: Request): Promise<string> {
		const imageUrl = await this.parseFiles(req);

		return imageUrl;
	}
}

