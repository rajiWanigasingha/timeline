import Surreal from 'surrealdb.js';
import type { PageServerLoad } from '../../$types';
import type { Actions } from './$types';
import { todoSchema } from '$lib/validations/createTodo/createTodo';
import { error } from '@sveltejs/kit';

interface todos {
	create_at: string;
	discription: string;
	id: { tb: string; id: string };
	progress: string;
	title: string;
	type: string;
}

interface todoData {
	todos: todos[];
}

interface todosFormatted {
	create_at: string;
	discription: string;
	id: string;
	progress: string;
	title: string;
	type: string;
}

interface relationData {
	id: { td: string; id: string };
	in: { td: string; id: string };
	out: { td: string; id: string };
}

interface res {
	create_at: string;
	discription: string;
	id: { td: string; id: string };
	progress: string;
	title: string;
	type: string;
}

interface data {
	type: string;
	relation: relationData[];
	res: res[];
}

interface update {
	create_at: string;
	discription: string;
	id: { tb: string; id: string };
	progress: string;
	title: string;
	type: string;
}

export const load = (async ({ params }) => {
	const db = new Surreal();

	const connection = await db.connect('http://localhost:8000/rpc', {
		namespace: 'timeline',
		database: 'timeline'
	});

	const res = await db.query(
		`SELECT ->createTodos->todos.* as todos FROM task WHERE id = "${params.todo}"`
	);

	const respose = res[0] as todoData[];

	const forrmatedResopose = todoFormmat(respose[0].todos);

	return {
		todo: forrmatedResopose
	};
}) satisfies PageServerLoad;

function todoFormmat(respose: todos[]) {
	const formmatedRes: todosFormatted[] = [];

	respose.map((val) => {
		formmatedRes.push({
			id: `${val.id.tb}:${val.id.id}`,
			title: val.title,
			discription: val.discription,
			type: val.type,
			progress: val.progress,
			create_at: val.create_at
		});
	});

	return formmatedRes;
}

export const actions: Actions = {
	createTodo: async ({ request, params }) => {
		const data = await request.formData();

		console.log(data);

		if (!data) {
			error(400, 'No data Resvide');
		}

		const dataFormmat = {
			title: data.get('title'),
			discription: data.get('discription'),
			type: data.get('type')
		};

		const vail = todoSchema.safeParse(dataFormmat);

		if (!vail.success) {
			error(400, 'Validation error');
		}

		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const res = await db.query(
			`RETURN fn::createtodos("${dataFormmat.title}","${dataFormmat.discription}","${dataFormmat.type}","","${params.todo}")`
		);

		const respone = res[0] as data;

		if (respone.type !== 'success') {
			error(400, 'Somthing went wrong');
		}

		return {
			data: 'success'
		};
	},

	updateprogress: async ({ request }) => {
		const data = await request.formData();

		const id = data.get('id');
		const update = data.get('update');

		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const res = await db.query(`UPDATE todos SET progress = '${update}' WHERE id = "${id}"`);

		const respone = res[0] as update[];

		if (respone.length === 0) {
			error(400, 'Did not update, Somthing went wrong');
		}

		return {
			type: 'success'
		};
	},

	deleteTodo: async ({ request }) => {
		const data = await request.formData();

		const id = data.get('id');

		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const res = await db.query(`DELETE todos WHERE id = "${id}"`);

		const respone = res[0] as [];

		if (respone.length !== 0) {
			error(400, 'Somthing went wrong');
		}

		return {
			type: 'success'
		};
	}
};
