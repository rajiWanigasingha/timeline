import { z } from 'zod';

export const signInSchema = z.object({
	email: z
		.string({ required_error: 'This field is required' })
		.min(1, 'This Field Is Required')
		.email('We need a correct email'),
	password: z
		.string({ required_error: 'This field is required' })
		.min(8, 'Must be bgger than 8 charactors and this feild is requird')
}).required();

export type SignInSchema = typeof signInSchema;
