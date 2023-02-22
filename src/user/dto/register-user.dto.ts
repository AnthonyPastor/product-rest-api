export class RegisterUserDTO {
	readonly name: string;
	readonly email: string;
	readonly password?: string;
	readonly role: string;
}
