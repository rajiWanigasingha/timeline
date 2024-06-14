import Surreal from 'surrealdb.js';
import type { Actions, PageServerLoad } from './$types';
import { createTaskSchema } from '$lib/validations/createTask/createTask';
import { error } from '@sveltejs/kit';

interface types {
	date: string;
	discription: string;
	lables: string[];
	title: string;
	type: string;
}

interface typesFormmat {
	id: string;
	date: string;
	discription: string;
	lables: string[];
	title: string;
	type: string;
}

interface dataTaskType {
	create_at: string;
	from: string;
	id: { tb: string; id: string };
	title: string;
	to: string;
	type: string;
}

interface task {
	tasks: dataTaskType[];
}

interface dataTaskTypeFormmated {
	create_at: string;
	from: string;
	id: string;
	title: string;
	to: string;
	type: string;
}

interface taskFormmated {
	tasks: dataTaskTypeFormmated[];
}

export const load = (async ({ params }) => {
	const id = params.timelineid;

	const db = new Surreal();

	const connection = await db.connect('http://localhost:8000/rpc', {
		namespace: 'timeline',
		database: 'timeline'
	});

	const res = await db.query(
		`SELECT title,discription,date,lables,type,id FROM timeline WHERE id = "${id}"`
	);

	const taskRes = await db.query(`SELECT ->createTask->task.* as tasks FROM '${id}'`);

	const taskData = taskRes[0] as task[];

	const frommatedTask = taskFormmatedFun(taskData);

	const data = res[0] as types[];

	const dataFormmat: typesFormmat = {
		id: id,
		title: data[0].title,
		discription: data[0].discription,
		date: data[0].date,
		lables: data[0].lables,
		type: data[0].type
	};

	console.log(frommatedTask);

	return {
		info: dataFormmat,
		task: frommatedTask
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createTask: async ({ request }) => {
		const data = await request.formData();

		const id = data.get('timeline');

		const form = data.get('from') as string;
		const to = data.get('to') as string;
		const type = data.get('type');

		const dataObj = {
			title: data.get('title'),
			form: form.replace(':', '.'),
			to: to.replace(':', '.'),
			type: type
		};

		const vaild = createTaskSchema.safeParse(dataObj);

		if (!vaild.success) {
			error(400, 'Vaildation faild, Plase check your inputs');
		}

		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const res = await db.query(
			`RETURN fn::createtask("${dataObj.title}" ,"${dataObj.form}" ,"${dataObj.to}" ,"${id}" ,"${type}")`
		);

		const resObj = res[0] as { info: string };

		if (!res) {
			error(400, 'Somthing went wrong');
		}

		if (resObj.info !== 'success') {
			error(400, 'Somthing went wrong');
		}

		return {
			info: resObj.info
		};
	},

	deleteTask: async ({ request }) => {
		const data = await request.formData();

		const db = new Surreal();

		const connection = await db.connect('http://localhost:8000/rpc', {
			namespace: 'timeline',
			database: 'timeline'
		});

		const res = await db.query(
			`DELETE task WHERE id = "${data.get("task")}"`
		);

		if(!res){
			error(400 ,"Internel error")
		}

		const respose = res[0] as []

		if(respose.length !== 0){
			error(400 ,"Could not delete, Somthing went wrong plase try again")
		}

		return{
			success:"true"
		}
	}
};

function taskFormmatedFun(task: task[]) {
	const taskFormmated: taskFormmated[] = [{ tasks: [] }];

	task[0].tasks.map((val) => {
		taskFormmated[0].tasks.push({
			id: `${val.id.tb}:${val.id.id}`,
			title: val.title,
			from: val.from,
			to: val.to,
			create_at: val.create_at,
			type: val.type
		});
	});

	return taskFormmated;
}
