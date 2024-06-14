<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import Label from '../ui/label/label.svelte';
	import Input from '../ui/input/input.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { todoSchema } from '$lib/validations/createTodo/createTodo';
	import { z } from 'zod';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

	let openDialog = false;

	$: selectedVal = '';

	$: buttonSub = false;

	const errorObj = {
		title: {
			type: false,
			msg: ''
		},
		discription: {
			type: false,
			msg: ''
		},
		type: {
			type: false,
			msg: ''
		}
	};

	function ResetErrorObj() {
		errorObj.title.type = false;
		errorObj.title.msg = '';
		errorObj.discription.type = false;
		errorObj.discription.msg = '';
		errorObj.type.type = false;
		errorObj.type.msg = '';
	}

	const submitFunctionTodo: SubmitFunction = ({ formData, cancel }) => {
		const data = {
			title: formData.get('title'),
			discription: formData.get('discription'),
			type: selectedVal
		};

		formData.append('type', selectedVal);

		buttonSub = true;

		try {
			todoSchema.parse(data);
		} catch (err) {
			buttonSub = false;

			cancel();

			ResetErrorObj();

			if (err instanceof z.ZodError) {
				err.issues.map((val) => {
					if (val.path[0] === 'title') {
						errorObj.title.type = true;
						errorObj.title.msg = val.message;
					} else if (val.path[0] === 'discription') {
						errorObj.discription.type = true;
						errorObj.discription.msg = val.message;
					} else if (val.path[0] === 'type') {
						errorObj.type.type = true;
						errorObj.type.msg = val.message;
					}
				});
			}
		}

		return async ({ result, update }) => {
			if (result.type === 'success') {
				openDialog = false;
				buttonSub = false;
				toast.success('Todo added successfully');
				update();
			}

			if (result.type === 'error') {
				toast.error(result.error);
			}
		};
	};
</script>

<div class="flex w-full flex-row justify-between border-b border-b-gray-600/25 p-3 px-8">
	<Toaster richColors position="top-right" />
	<div>
		<h1 class="text-xl font-semibold tracking-tight text-muted-foreground">ToDos</h1>
	</div>
	<div class="flex flex-row items-center gap-5">
		<Button class="flex flex-row gap-2 bg-blue-600 font-semibold hover:bg-blue-700" on:click={() => history.back()}
			>Go To TimeLine</Button
		>
		<Dialog.Root bind:open={openDialog}>
			<Dialog.Trigger>
				<Button class="flex flex-row gap-2 bg-green-600 font-semibold hover:bg-green-700"
					><Plus size={16} /> Add ToDos</Button
				>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Create A Task</Dialog.Title>
				</Dialog.Header>
				<div>
					<form
						method="post"
						class="flex flex-col gap-5"
						action="?/createTodo"
						use:enhance={submitFunctionTodo}
					>
						<div>
							<Label class="font-semibold">ToDo Title</Label>
							<Input type="text" placeholder="Metting of company" name="title" />
							{#if errorObj.title.type}
								<p class="text-sm font-semibold text-red-600">{errorObj.title.msg}</p>
							{:else}
								<p class="text-sm font-light">Enter your todo title</p>
							{/if}
						</div>
						<div>
							<Label class="font-semibold">ToDo Discription</Label>
							<Textarea placeholder="Metting of company" name="discription" />
							{#if errorObj.discription.type}
								<p class="text-sm font-semibold text-red-600">{errorObj.discription.msg}</p>
							{:else}
								<p class="text-sm font-light">Enter your todo discription</p>
							{/if}
						</div>
						<div>
							<Label class="font-semibold">Type</Label>
							<Select.Root
								name="type"
								onSelectedChange={(val) => (selectedVal = String(val?.value))}
							>
								<Select.Trigger class="w-full">
									<Select.Value placeholder="Theme" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="emegency" class="my-[2px] bg-red-600">Emegency</Select.Item>
									<Select.Item value="importent" class="my-[2px] bg-yellow-600"
										>Importent</Select.Item
									>
									<Select.Item value="normal" class="my-[2px] bg-blue-600">Normal</Select.Item>
								</Select.Content>
							</Select.Root>
							{#if errorObj.type.type}
								<p class="text-sm font-semibold text-red-600">{errorObj.type.msg}</p>
							{:else}
								<p class="text-sm font-light">type of the timeline</p>
							{/if}
						</div>
						<div>
							{#if buttonSub}
								<Button type="submit" class="w-full bg-green-600 hover:bg-green-700">
									<div role="status">
										<svg
											aria-hidden="true"
											class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
										<span class="sr-only">Loading...</span>
									</div>
								</Button>
							{:else}
								<Button type="submit" class="w-full bg-green-600 hover:bg-green-700"
									>Create New ToDo</Button
								>
							{/if}
						</div>
					</form>
				</div>
				<Dialog.Footer>
					<Button on:click={() => (openDialog = false)}>Close</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
