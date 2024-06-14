import z from 'zod';

export const createTaskSchema = z.object({
	title: z.string().min(1, 'This field is reqired').max(30, 'Must be smaller than 30 charactors'),
	type: z.enum(['emegency', 'importent', 'normal'], {
		message: 'Type must be one of: emergency, important, normal'
	})
});

export type CreateTaskSchema = typeof createTaskSchema;
