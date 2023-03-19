import {
	Controller,
	Post,
	Body,
	UseGuards,
	Request,
	Get,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDTO } from '../user/dto/register-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/register')
	async register(@Body() registerUserDTO: RegisterUserDTO) {
		const user = await this.authService.registerUser(registerUserDTO);
		return user;
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@Post('/validate-token')
	async validateToken(@Body() body) {
		return this.authService.validarToken(body.token);
	}
}
