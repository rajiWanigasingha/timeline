import Surreal from 'surrealdb.js';
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import verifyJwt from '$lib/validations/jwtverify/jwtverify';
import { timeLineSchema } from '$lib/validations/addToTimeline/addToTimeline';

interface resType {
	create_at: string;
	date: string;
	discription: string;
	id: { tb: string; id: string };
	lables: string[];
	title: string;
	type: string;
}

interface formmatResType {
	create_at: string;
	date: string;
	discription: string;
	id: string;
	lables: string[];
	title: string;
	type: string;
}

interface Respose {
	out: resType;
}

export const load = (async ({ cookies }) => {
	const jwt = cookies.get('jwt');

	if (!jwt) {
		redirect(308, '/signin');
	}

	const sessionToken = verifyJwt(jwt) as { id: string; email: string };

	if (!sessionToken) {
		redirect(308, '/signin');
	}

	const db = new Surreal();

	const connection = await db.connect('http://localhost:8000/rpc', {
		namespace: 'timeline',
		database: 'timeline'
	});

	const data = await getTimeLine(sessionToken.id, db);

	const formmatDataOfRes = formmatData(data);

	return {
		timeline: formmatDataOfRes
	};
}) satisfies PageServerLoad;

async function getTimeLine(id: string, db: Surreal) {
	const res = await db.query(`SELECT out.* FROM createTimeline WHERE in = "${id}";`);

	return res[0] as Respose[];
}

function formmatData(data: Respose[]) {
	const formmatRes: formmatResType[] = [];

	data.map((values) => {
		formmatRes.push({
			id: `${values.out.id.tb}:${values.out.id.id}`,
			title: values.out.title,
			discription: values.out.discription,
			date: values.out.date,
			lables: values.out.lables,
			type: values.out.type,
			create_at: values.out.create_at
		});
	});

	return formmatRes;
}

export const actions: Actions = {
	createTimeline: async ({ request }) => {
		const data = await request.formData();

		if (!data) {
			error(400, 'No data resvide, Plase try again');
		}

		const userId = data.get('userId') as string;

		if (!userId) {
			error(400, 'No userId Resived');
		}

		const dataObj = {
			title: data.get('title') as string,
			discription: data.get('discription') as string,
			date: data.get('date') as string,
			lables: data.get('lables') as string,
			type: data.get('type') as string
		};

		const vaild = timeLineSchema.safeParse(dataObj);

		if (!vaild.success) {
			error(400, 'Vaildation Error, Plase check your inputs');
		}

		const lables = makeArrayOfLables(dataObj.lables);

		console.log(lables);

		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const respose = await createTimeline(
			db,
			dataObj.title,
			dataObj.discription,
			dataObj.date,
			lables,
			dataObj.type,
			userId
		);

		return {
			status: true,
			data: JSON.stringify(respose)
		};
	},

	delete: async ({ request }) => {
		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const data = await request.formData();

		if (!data) {
			error(400, 'Somthing went wrong.');
		}

		const respose = await deleteTimeLine(
			db,
			data.get('userId') as string,
			data.get('timeline') as string
		);

		if (respose.type !== 'success') {
			error(400, 'Could not delete.');
		}

		return {
			msg: 'Delete is successful'
		};
	}
};

function makeArrayOfLables(lables: string) {
	const dataLables: string[] = [];

	lables.split(',').map((values) => {
		dataLables.push(`"${values}"`);
	});

	return dataLables;
}

async function createTimeline(
	db: Surreal,
	title: string,
	discription: string,
	date: string,
	lables: string[],
	type: string,
	userId: string
) {
	const res = await db.query(
		`RETURN fn::createnewtimeline("${title}" ,"${discription}" ,"${date}",[${lables}],"${type}","${userId}");`
	);

	return res[0];
}

async function deleteTimeLine(db: Surreal, userId: string, timeline: string) {
	const res = await db.query(`RETURN fn::deletetimeline("${timeline}" ,${userId})`);

	return res[0] as { type: 'success' };
}
