import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { signUpSchema } from '$lib/validations/signup/signupVail';
import { Surreal } from 'surrealdb.js';
import bcrypt from 'bcrypt';
import createJwtToken from '$lib/validations/jwtsignin/jwtsignin';
import verifyJwt from '$lib/validations/jwtverify/jwtverify';
import { signInSchema } from '$lib/validations/signin/signinVail';

interface RecordId {
	tb: string;
	id: string;
}

interface Userreturn {
	create_at: Date;
	email: string;
	id: RecordId;
	username: string;
}

interface resposeTypes {
	success: boolean;
	error: string | null;
	data: Userreturn[] | null;
}

interface UserSignInReturn {
	create_at: Date;
	email: string;
	id: RecordId;
	username: string;
	password: string;
}

interface resposeSignInType {
	status: boolean;
	error: string | null;
	data: UserSignInReturn[] | null;
}

export const load = (async ({ cookies }) => {
	const jwt = cookies.get('jwt');

	if (jwt) {
		const sessionToken = verifyJwt(jwt) as {
			id: string;
			email: string;
		};

		redirect(307, `/workplace/${sessionToken.email}/timeline`);
	}

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	signup: async (event) => {
		const data = await event.request.formData();

		if (!data) {
			error(400, 'No data has resived');
		}

		const user = {
			username: data.get('username'),
			email: data.get('email'),
			password: data.get('password')
		};

		const userParas = signUpSchema.safeParse(user);

		if (!userParas.success) {
			fail(400, {
				error: 'schema',
				msg: userParas.error.errors
			});
		}

		const username = data.get('username') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const hashPass = await bcrypt.hash(password, 10);

		const respose = await createRecord(username, email, hashPass);

		if (respose.success === false) {
			error(400, respose.error as string);
		} else {
			if (!respose.data) {
				error(400, 'No data has resived, please try later');
			}

			const dataOfRes = {
				id: `${respose.data[0].id.tb}:${respose.data[0].id.id}`,
				email: respose.data[0].email,
				username: respose.data[0].username,
				create_at: respose.data[0].create_at
			};

			const oneMonthFromNow = new Date();

			oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

			const token = createJwtToken(
				{ id: dataOfRes.id, email: dataOfRes.email, username: dataOfRes.username },
				dataOfRes.email
			);

			event.cookies.set('jwt', token, {
				path: '/',
				expires: oneMonthFromNow,
				sameSite: 'strict'
			});

			return {
				signUp: {
					state: 'success',
					data: dataOfRes
				}
			};
		}
	},

	signin: async ({ request, cookies }) => {
		const data = await request.formData();

		if (!data) {
			error(400, 'No Data Resived');
		}

		const email = data.get('email');
		const password = data.get('password');

		const user = {
			email: email,
			password: password
		};

		const userParas = signInSchema.safeParse(user);

		if (!userParas.success) {
			error(400, 'Somthing is wrong ,Cheak your email and password are valid');
		}

		const respose = await checkEmail(email as string);

		console.log(respose);

		if (!respose.status) {
			error(400, respose.error as string);
		}

		if (!respose.data) {
			error(400, 'Internal error, Plase try later');
		}

		const isPassword = await bcrypt.compare(password as string, respose.data[0].password);

		console.log(isPassword);

		if (!isPassword) {
			error(400, 'Wrong password try again');
		}

		const dataOfRes = {
			id: `${respose.data[0].id.tb}:${respose.data[0].id.id}`,
			email: respose.data[0].email,
			username: respose.data[0].username,
			create_at: respose.data[0].create_at
		};

		const oneMonthFromNow = new Date();

		oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

		const token = createJwtToken(
			{ id: dataOfRes.id, email: dataOfRes.email, username: dataOfRes.username },
			dataOfRes.email
		);

		cookies.set('jwt', token, {
			path: '/',
			expires: oneMonthFromNow,
			sameSite: 'strict'
		});

		return {
			signUp: {
				state: 'success',
				data: dataOfRes
			}
		};
	}
};

async function createRecord(username: string, email: string, password: string) {
	const db = new Surreal();

	const connection = await db.connect('http://localhost:8000/rpc', {
		namespace: 'timeline',
		database: 'timeline'
	});

	const record = await db.query(`RETURN fn::createusers("${username}","${email}","${password}")`);

	return record[0] as resposeTypes;
}

async function checkEmail(email: string) {
	const db = new Surreal();

	const connection = await db.connect('http://localhost:8000/rpc', {
		namespace: 'timeline',
		database: 'timeline'
	});

	const res = await db.query(`RETURN fn::findemail("${email}")`);

	return res[0] as resposeSignInType;
}
