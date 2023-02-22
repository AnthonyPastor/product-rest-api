import { Controller, Get, UseGuards, Request } from '@nestjs/common';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth-guard';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@UseGuards(JwtAuthGuard)
	@Get('seed')
	seed() {
		try {
			this.appService.seedDB();
			return { success: true };
		} catch (error) {
			return { success: false, message: error.message };
		}
	}
}
