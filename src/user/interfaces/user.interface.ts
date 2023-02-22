export interface IUser {
	_id: string;
	name: string;
	email: string;
	password?: string;
	role: IRole;

	createdAt?: string;
	updatedAt?: string;
}

export enum IRole {
	admin = 'admin',
	client = 'client',
	super_user = 'super_user',
	SEO = 'SEO',
}
