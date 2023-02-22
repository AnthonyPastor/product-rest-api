import { Injectable, NotFoundException, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './schema/user.schema';
import { IUser } from './interfaces/user.interface';
import { RegisterUserDTO } from './dto/register-user.dto';
import { initialData } from '../database/seed-data';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<IUser>,
	) {}

	async getUsers(): Promise<IUser[]> {
		const users = await this.userModel.find();
		return users;
	}

	async getUserByEmail(email: string): Promise<IUser> {
		const user = await this.userModel.findOne({ email });

		if (!user) throw new NotFoundException("User doen't exist");

		return user;
	}

	async getUserById(id: string): Promise<IUser> {
		const user = await this.userModel.findById(id);
		if (!user) throw new NotFoundException("User doen't exist");

		return user;
	}

	async createUser(createUserDTO: RegisterUserDTO): Promise<IUser> {
		console.log({ createUserDTO });
		const savedPassword = bcrypt.hashSync(createUserDTO.password, 10);

		const user = await this.userModel.create({
			...createUserDTO,
			password: savedPassword,
		});

		return user;
	}

	async seedUsers() {
		await this.userModel.deleteMany();
		await this.userModel.insertMany(initialData.users);
	}
}

