import { IGender } from '../enums/gender.enum';
import { ISize } from '../enums/size.enum';
import { IType } from '../enums/type.enum';

export class CreateProductDTO {
	readonly _id: string;
	readonly description: string;
	readonly images: string[];
	readonly inStock: number;
	readonly price: number;
	readonly sizes: ISize[];
	readonly slug: string;
	readonly tags: string[];
	readonly title: string;
	readonly type: IType;
	readonly gender: IGender;
}
