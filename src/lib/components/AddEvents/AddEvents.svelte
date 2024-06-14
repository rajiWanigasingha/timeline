<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Plus } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import DialogFooter from '../ui/dialog/dialog-footer.svelte';
	import { Input } from '../ui/input';
	import DateStore from '$lib/Store/GetDataStore/GetDataStore';
	import Label from '../ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import {  z } from 'zod';
	import { timeLineSchema } from '$lib/validations/addToTimeline/addToTimeline';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

	export let userId: string;
	export let revaildate: () => Promise<void>;

	function getDayOfWeek(dateString: string) {
		const date = new Date(dateString);
		const daysOfWeek = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		return daysOfWeek[date.getDay()];
	}

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let dates: { year: number; month: number; day: number }[] = [];
	let formattedDate: string = '';

	DateStore.subscribe((val) => {
		dates = val;
		if (dates.length > 0) {
			const { year, month, day } = dates[0]; // Assuming you want the first date
			formattedDate = `${months[month - 1]}, ${getDayOfWeek(`${year}-${month}-${day}`)} ${day} ,${year}`;
		}
	});

	let DialogOpen = false;

	$: selectValue = '';

	$: buttonSub = false;

	$: errorObj = {
		title: {
			type: false,
			msg: ''
		},
		discrption: {
			type: false,
			msg: ''
		},
		date: {
			type: false,
			msg: ''
		},
		lables: {
			type: false,
			msg: ''
		},
		type: {
			type: false,
			msg: ''
		}
	};

	function resetValidateErrors() {
		const errors = Object.keys(errorObj);

		errors.forEach((val) => {
			// @ts-ignore
			errorObj[val].type = false;
			// @ts-ignore
			errorObj[val].msg = '';
		});
	}

	const submitFunctionCreateTimeline: SubmitFunction = ({ formData, cancel }) => {
		formData.append('date', formattedDate);
		formData.append('type', selectValue);
		formData.append('userId', userId);

		buttonSub = true;

		const data = {
			title: formData.get('title'),
			discription: formData.get('discription'),
			date: formData.get('date'),
			lables: formData.get('lables'),
			type: formData.get('type')
		};

		try {
			timeLineSchema.parse(data);
		} catch (err) {
			cancel();

			buttonSub = false;

			resetValidateErrors();

			console.log(errorObj);
			if (err instanceof z.ZodError) {
				err.issues.map((val) => {
					const errorPath = val.path[0];

					if (errorPath === 'title') {
						errorObj.title.type = true;
						errorObj.title.msg = val.message;
					} else if (errorPath === 'discription') {
						errorObj.discrption.type = true;
						errorObj.discrption.msg = val.message;
					} else if (errorPath === 'date') {
						errorObj.date.type = true;
						errorObj.date.msg = val.message;
					} else if (errorPath === 'lables') {
						errorObj.lables.type = true;
						errorObj.lables.msg = val.message;
					} else if (errorPath === 'type') {
						errorObj.type.type = true;
						errorObj.type.msg = val.message;
					}
				});
			}
		}

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				buttonSub = false;
				await update();
				selectValue = '';
				DialogOpen = false;
				toast.success('Record has been successfully created');
				revaildate()
			}

			if (result.type === 'error') {
				buttonSub = false;
				toast.error(result.error.message);
			}
		};
	};
</script>

<Dialog.Root bind:open={DialogOpen}>
	<Dialog.Trigger class="w-full">
		<Toaster position="top-right" richColors />
		<Button class="flex w-full flex-row gap-2 bg-purple-600 font-semibold hover:bg-purple-700"
			><Plus size={16} /> Add To TimeLine</Button
		></Dialog.Trigger
	>
	<Dialog.Content class="h-[500px] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>Create Your Work Time Line</Dialog.Title>
			<Dialog.Description>This will create new time line for day you chooes</Dialog.Description>
		</Dialog.Header>
		<div>
			<form
				method="post"
				use:enhance={submitFunctionCreateTimeline}
				action="?/createTimeline"
				class="flex flex-col gap-2"
			>
				<div>
					<Label class="font-semibold">Title</Label>
					<Input name="title" placeholder="Office metting" />
					{#if errorObj.title.type}
						<p class="text-sm font-semibold text-red-600">{errorObj.title.msg}</p>
					{:else}
						<p class="text-sm font-light">Title of the timeline</p>
					{/if}
				</div>
				<div>
					<Label class="font-semibold">Discription</Label>
					<Input name="discription" placeholder="Office metting for dicuess pricing" />
					{#if errorObj.discrption.type}
						<p class="text-sm font-semibold text-red-600">{errorObj.discrption.msg}</p>
					{:else}
						<p class="text-sm font-light">Discription of the timeline</p>
					{/if}
				</div>
				<div>
					<Label class="font-semibold">Date</Label>
					<Input
						name="date"
						placeholder="June, Monday 6 ,2024"
						bind:value={formattedDate}
						disabled
					/>
					{#if errorObj.date.type}
						<p class="text-sm font-semibold text-red-600">{errorObj.date.msg}</p>
					{:else}
						<p class="text-sm font-light">Date of the timeline</p>
					{/if}
				</div>
				<div>
					<Label class="font-semibold">Lables</Label>
					<Input name="lables" placeholder="metting,pricing" />
					{#if errorObj.lables.type}
						<p class="text-sm font-semibold text-red-600">{errorObj.lables.msg}</p>
					{:else}
						<p class="text-sm font-light">Lables of the timeline</p>
					{/if}
				</div>
				<div>
					<Label class="font-semibold">Type</Label>
					<Select.Root name="type" onSelectedChange={(v) => (selectValue = String(v?.value))}>
						<Select.Trigger class="w-full">
							<Select.Value placeholder="Theme" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="emegency" class="my-[2px] bg-red-600">Emegency</Select.Item>
							<Select.Item value="importent" class="my-[2px] bg-yellow-600">Importent</Select.Item>
							<Select.Item value="normal" class="my-[2px] bg-blue-600">Normal</Select.Item>
						</Select.Content>
					</Select.Root>
					{#if errorObj.type.type}
						<p class="text-sm font-semibold text-red-600">{errorObj.type.msg}</p>
					{:else}
						<p class="text-sm font-light">type of the timeline</p>
					{/if}
				</div>
				<div class="pt-3">
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
						<Button type="submit" class="w-full bg-green-600 font-semibold hover:bg-green-700"
							>Create New TimeLine</Button
						>
					{/if}
				</div>
			</form>
		</div>
		<DialogFooter>
			<Button on:click={() => (DialogOpen = false)}>Close</Button>
		</DialogFooter>
	</Dialog.Content>
</Dialog.Root>
