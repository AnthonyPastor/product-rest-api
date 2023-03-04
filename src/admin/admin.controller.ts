import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Request,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateProductDTO } from '../product/dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Get('/dashboard')
	async getDashboardData() {
		try {
			const response = await this.adminService.getDashboardData();

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get('/orders')
	async getOrders() {
		try {
			const response = await this.adminService.getOrders();

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get('/products')
	async getProducts() {
		try {
			const response = await this.adminService.getProducts();

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Post('/products')
	async createProduct(@Body() createProductDTO: CreateProductDTO) {
		try {
			const response = await this.adminService.createProduct(
				createProductDTO,
			);

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Put('/products')
	async updateProduct(@Body() updateProductDTO: CreateProductDTO) {
		try {
			const response = await this.adminService.updateProduct(
				updateProductDTO,
			);

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Post('/upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		try {
			const response = await this.adminService.uploadFile(file);

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			console.error(error);
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Get('/users')
	async getUsers() {
		try {
			const response = await this.adminService.getUsers();

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}

	@Put('/users')
	async updateUser(@Body() body: { userId: string; role: string }) {
		try {
			const response = await this.adminService.updateUser(
				body.userId,
				body.role,
			);

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	}
}

