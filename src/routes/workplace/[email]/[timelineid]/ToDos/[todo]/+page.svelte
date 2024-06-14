<script lang="ts">
	import NavbarToDos from '$lib/components/NavbarToDos/NavbarToDos.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	export let data;

	$: todo = data.todo;

	function desideColor(type: string) {
		if (type === 'importent') {
			return 'border-yellow-600';
		} else if (type === 'emegency') {
			return 'border-red-600';
		} else {
			return 'border-blue-600';
		}
	}

	function desideColorBg(type: string) {
		if (type === 'importent') {
			return 'bg-yellow-600';
		} else if (type === 'emegency') {
			return 'bg-red-600';
		} else {
			return 'bg-blue-600';
		}
	}
</script>

<div class="w-full">
	<NavbarToDos />
	<div class="grid w-full grid-cols-12 gap-3 px-16 py-5">
		<div class="col-span-4 col-start-1">
			<div class="flex items-center justify-center rounded-md bg-gray-800 p-2 shadow-lg">
				<h1 class="text-lg font-semibold tracking-tight">To Do</h1>
			</div>
		</div>
		<div class="col-span-4 col-start-5">
			<div class="flex items-center justify-center rounded-md bg-gray-800 p-2 shadow-lg">
				<h1 class="text-lg font-semibold tracking-tight">In Progress</h1>
			</div>
		</div>
		<div class="col-span-4 col-start-9">
			<div class="flex items-center justify-center rounded-md bg-gray-800 p-2 shadow-lg">
				<h1 class="text-lg font-semibold tracking-tight">Done</h1>
			</div>
		</div>
	</div>
	<div class="grid w-full grid-cols-12 gap-3 px-16">
		<div class="col-span-4 col-start-1 rounded-lg bg-slate-900/20">
			{#each todo as todo}
				{#if todo.progress === 'todo'}
					<Card class={`m-3 border-l-4 ${desideColor(todo.type)}`}>
						<CardHeader>
							<CardTitle>{todo.title}</CardTitle>
							<CardDescription>{todo.discription}</CardDescription>
						</CardHeader>
						<CardContent class="flex flex-row items-center justify-between">
							<Badge class={`${desideColorBg(todo.type)} capitalize`}>{todo.type}</Badge>
							<div class="flex flex-row items-center justify-center gap-3">
								<form
									action="?/deleteTodo"
									method="post"
									use:enhance={({ formData }) => {
										formData.append('id', todo.id);

										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Todo has been removed');

												update();
											}

											if (result.type === 'error') {
												toast.error(result.error.message);
											}
										};
									}}
								>
									<Button type="submit" class="bg-red-600 font-semibold hover:bg-red-700"
										>Delete</Button
									>
								</form>
								
								<form
									action="?/updateprogress"
									method="post"
									use:enhance={({ formData }) => {
										const id = todo.id;

										formData.append('id', id);
										formData.append('update', 'in');

										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Todo is in progress');

												update();
											}

											if (result.type === 'error') {
												toast.error(result.error.message);
											}
										};
									}}
								>
									<Button type="submit" class="bg-green-600 font-semibold hover:bg-green-700"
										>Next</Button
									>
								</form>
							</div>
						</CardContent>
					</Card>
				{/if}
			{/each}
		</div>

		<div class="col-span-4 col-start-5 rounded-lg bg-slate-900/20">
			{#each todo as todo}
				{#if todo.progress === 'in'}
					<Card class={`m-3 border-l-4 ${desideColor(todo.type)}`}>
						<CardHeader>
							<CardTitle>{todo.title}</CardTitle>
							<CardDescription>{todo.discription}</CardDescription>
						</CardHeader>
						<CardContent class="flex flex-row items-center justify-between">
							<Badge class={`${desideColorBg(todo.type)} capitalize`}>{todo.type}</Badge>
							<div class="flex flex-row items-center justify-center gap-3">
								<form
									action="?/deleteTodo"
									method="post"
									use:enhance={({ formData }) => {
										formData.append('id', todo.id);

										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Todo has been removed');

												update();
											}

											if (result.type === 'error') {
												toast.error(result.error.message);
											}
										};
									}}
								>
									<Button type="submit" class="bg-red-600 font-semibold hover:bg-red-700"
										>Delete</Button
									>
								</form>

								<form
									action="?/updateprogress"
									method="post"
									use:enhance={({ formData }) => {
										const id = todo.id;

										formData.append('id', id);
										formData.append('update', 'done');

										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Todo is done work');

												update();
											}

											if (result.type === 'error') {
												toast.error(result.error.message);
											}
										};
									}}
								>
									<Button type="submit" class="bg-blue-600 font-semibold hover:bg-blue-700"
										>Done</Button
									>
								</form>
							</div>
						</CardContent>
					</Card>
				{/if}
			{/each}
		</div>

		<div class="col-span-4 col-start-9 rounded-lg bg-slate-900/20">
			{#each todo as todo}
				{#if todo.progress === 'done'}
					<Card class={`m-3 border-l-4 ${desideColor(todo.type)}`}>
						<CardHeader>
							<CardTitle>{todo.title}</CardTitle>
							<CardDescription>{todo.discription}</CardDescription>
						</CardHeader>
						<CardContent class="flex flex-row items-center justify-between">
							<Badge class={`${desideColorBg(todo.type)} capitalize`}>{todo.type}</Badge>
							<form
								action="?/deleteTodo"
								method="post"
								use:enhance={({ formData }) => {
									formData.append('id', todo.id);

									return async ({ result, update }) => {
										if (result.type === 'success') {
											toast.success('Todo has been removed');

											update();
										}

										if (result.type === 'error') {
											toast.error(result.error.message);
										}
									};
								}}
							>
								<Button type="submit" class="bg-orange-600 font-semibold hover:bg-orange-700"
									>End</Button
								>
							</form>
						</CardContent>
					</Card>
				{/if}
			{/each}
		</div>
	</div>
</div>
