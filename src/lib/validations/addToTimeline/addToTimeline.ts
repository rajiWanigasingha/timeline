import { z } from 'zod';

export const timeLineSchema = z
	.object({
		title: z
			.string({ required_error: 'This is requried' })
			.min(1, 'Title is requird')
			.max(30, 'Title is too long make it less than 30 chractors'),
		discription: z
			.string({ required_error: 'This is requried' })
			.min(1, 'Discription is requird')
			.max(60, 'Discription is too long make it less than 60 chractors'),
		date: z.string({ required_error: 'This is requried' }).min(1, 'Title is requird'),
		lables: z.string(),
		type: z.enum(['emegency', 'importent', 'normal'], {
			message: 'Type must be one of: emergency, important, normal'
		})
	})
	.required();

export type TimeLineSchema = typeof timeLineSchema;
