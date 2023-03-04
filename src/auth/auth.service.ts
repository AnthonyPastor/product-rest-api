import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { IUser } from '../user/interfaces/user.interface';
import { RegisterUserDTO } from '../user/dto/register-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, pass: string): Promise<IUser> {
		const user = await this.usersService.getUserByEmail(email);

		if (!bcrypt.compareSync(pass, user.password)) {
			throw new UnauthorizedException('Credentials are not correct');
		}

		const {
			_id,
			email: userEmail,
			name,
			role,
			createdAt,
			updatedAt,
		} = user;

		return {
			_id,
			name,
			email: userEmail,
			role,
			createdAt,
			updatedAt,
		};
	}

	async login(user: IUser) {
		const payload = {
			email: user.email,
			password: user.password,
			id: user._id,
		};
		return {
			user,
			token: this.jwtService.sign(payload),
		};
	}

	async registerUser(registerUserDTO: RegisterUserDTO): Promise<IUser> {
		const user = await this.usersService.createUser(registerUserDTO);

		return user;
	}

	async validarToken(token: string): Promise<{ user: IUser; token: string }> {
		await this.jwtService.verify(token, {
			secret: process.env.TOKEN_SECRET,
		});
		const data = await this.jwtService.decode(token);

		if (typeof data !== 'string') {
			const user = await this.usersService.getUserById(data.id || '');

			return { user, token };
		}
	}
}

