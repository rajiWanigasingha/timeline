import { z } from 'zod';

export const signUpSchema = z.object({
	username: z
		.string({ required_error: 'This field is requird' })
		.min(1, 'This Field Is Required')
		.max(30, 'Must be less than 30 chractors'),
	email: z
		.string({ required_error: 'This field is required' })
		.min(1, 'This Field Is Required')
		.email('We need a correct email'),
	password: z
		.string({ required_error: 'This field is required' })
		.min(8, 'Must be bgger than 8 charactors and this feild is requird')
}).required();

export type SignUpSchema = typeof signUpSchema;
