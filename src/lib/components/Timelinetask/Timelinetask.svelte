<script lang="ts">
	import { browser } from '$app/environment';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Button from '../ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import Swal from 'sweetalert2';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

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

	export let id: string;

	export let task: taskFormmated[];

	$: tasks = task[0].tasks;

	console.log(task[0]);

	const time = [
		'1 A.M',
		'2 A.M',
		'3 A.M',
		'4 A.M',
		'5 A.M',
		'6 A.M',
		'7 A.M',
		'8 A.M',
		'9 A.M',
		'10 A.M',
		'11 A.M',
		'12 A.M',
		'1 P.M',
		'2 P.M',
		'3 P.M',
		'4 P.M',
		'5 P.M',
		'6 P.M',
		'7 P.M',
		'8 P.M',
		'9 P.M',
		'10 P.M',
		'11 P.M',
		'12 P.M'
	];

	if (browser) {
		document
			.querySelector(`#selection-19`)
			?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	}

	function color(index: number) {
		if (new Date().getHours() === index + 1) {
			return 'bg-gray-600';
		} else {
			return 'bg-gray-900';
		}
	}

	function desideColor(type: string) {
		if (type === 'importent') {
			return 'border-yellow-600';
		} else if (type === 'emegency') {
			return 'border-red-600';
		} else {
			return 'border-blue-600';
		}
	}
</script>

<div class="flex w-full flex-col items-center py-5">
	<Toaster richColors position="top-right" />
	<ScrollArea class="h-auto w-[96%] p-4" orientation="both">
		<div class="h-full w-full">
			<div class="make_grids h-[50px] w-full">
				{#each time as hour, index}
					<div
						class={`cols flex h-[30px] items-center justify-center rounded-lg ${color(index)}`}
						id={`selection-${index + 1}`}
					>
						<samp>{hour}</samp>
					</div>
				{/each}
			</div>
			{#each tasks as task}
				<div class="make_grids girdStyle h-auto w-full py-2">
					<div
						style={`grid-column: ${task.from.split('.')[0]}/span ${Number(Number(task.to) - Number(task.from) + 1).toFixed(0)};`}
						class={`h-auto rounded-sm border border-l-4 ${desideColor(task.type)} bg-gray-800`}
					>
						<div class="p-3">
							<h1 class="overflow-scroll text-nowrap font-bold tracking-tight">{task.title}</h1>
							<h1 class="text-xs text-muted-foreground">{task.from} - {task.to}</h1>
							<div class="flex w-full flex-row justify-end gap-3 overflow-scroll py-1">
								<form
									action="?/deleteTask"
									method="post"
									use:enhance={async ({ formData, cancel }) => {
										const res = await Swal.fire({
											icon: 'warning',
											title: 'Are you sure!',
											text: "This can't be undo",
											showCancelButton: true,
											confirmButtonText: 'Yes, delete it!',
											confirmButtonColor: 'red',
											cancelButtonText: 'No, cancel!',
											cancelButtonColor: 'blue',
											reverseButtons: true
										});

										if (res.isConfirmed) {
											if (id === '' || task.id === '') {
												close();
												toast.error('Somthing went wrong please try later.');
											}
											formData.append('timeline', id);
											formData.append('task', task.id);
										} else {
											cancel();
										}

										return async ({ result, update }) => {
											if (result.type === 'success') {
												update();

												toast.success('Delete is successful');
											}

											if (result.type === 'error') {
												toast.error(result.error.message);
											}
										};
									}}
								>
									<Button class="bg-red-600 hover:bg-red-700" type="submit">Remove Task</Button>
								</form>
								<Button class="bg-green-600 hover:bg-green-700" href={`./${id}/ToDos/${task.id}`}
									>ToDos</Button
								>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</ScrollArea>
</div>

<style>
	.make_grids {
		display: grid;
		grid-template-columns: repeat(24, 160px);
		gap: 12px;
	}

	.girdStyle {
		background-size: 172px auto;
		background-image: linear-gradient(to right, grey 1px, transparent 1px),
			linear-gradient(to bottom, grey 1px, transparent 1px);
	}
</style>
