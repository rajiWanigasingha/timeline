<script lang="ts">
	import DateStore from '$lib/Store/GetDataStore/GetDataStore';
	import AddEvents from '$lib/components/AddEvents/AddEvents.svelte';
	import Calendar from '$lib/components/Calendar/Calendar.svelte';
	import Navbar from '$lib/components/NavbarTimeLine/Navbar.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	import getRandomColor600 from '$lib/getRandomColor/getRandomColor';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import Swal from 'sweetalert2';

	export let data: PageData;

	const revaildateFun = async function reavildate() {
		console.log(data.timeline);
	};

	const sessionData = data.session as { id: string; email: string; username: string };

	$: timelineData = data.timeline;

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

	const month = [
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

	let ValuesOfDates: { year: number; month: number; day: number }[];
	DateStore.subscribe((val) => {
		ValuesOfDates = val;
	});

	function desideColor(type: string) {
		if (type === 'importent') {
			return 'shadow-[0px_5px_2px_rgba(202,_138,_4,_1)]';
		} else if (type === 'emegency') {
			return 'shadow-[0px_5px_2px_rgba(220,_38,_38,_1)]';
		} else {
			return 'shadow-[0px_5px_2px_rgba(37,_99,_235,_1)]';
		}
	}

	$: deleteOptions = {
		user: '',
		timeline: ''
	};

	function changeDeleteOptions(user: string, timeline: string) {
		deleteOptions.user = user;
		deleteOptions.timeline = timeline;
	}

	const formSubmitDelete: SubmitFunction = async ({ formData, cancel }) => {
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
			if (deleteOptions.user === '' || deleteOptions.timeline === '') {
				close();
				toast.error('Somthing went wrong please try later.');
			}

			formData.append('userId', deleteOptions.user);
			formData.append('timeline', deleteOptions.timeline);
		} else {
			cancel();
		}

		return async ({ result, update }) => {
			if (result.type === 'success') {
				update();
				toast.success('Record deleted successfully');
			}

			if (result.type === 'error') {
				toast.error(result.error);
			}
		};
	};
</script>

<div class="w-full">
	<Toaster richColors position="top-right" />
	<Navbar username={sessionData.username} />
	<div class="flex w-full flex-row justify-between px-16 py-3 pt-5">
		<div class="flex w-3/12 flex-col gap-2">
			<Label class="font-semibold">Select Your Date To Add TimeLine</Label>
			<Calendar />
			<div>
				<AddEvents userId={sessionData.id} revaildate={revaildateFun} />
			</div>
		</div>
		<div class="flex w-7/12 flex-col gap-5">
			{#each timelineData as data}
				<Card class={`border-none bg-[#181a1b] ${desideColor(data.type)}`}>
					<CardHeader class="flex flex-row items-center justify-between">
						<div class="flex flex-row items-center gap-2">
							<CardTitle class="text-lg capitalize">{data.title}</CardTitle>
							<CardDescription>{data.date}</CardDescription>
						</div>
						<div class="flow-row flex gap-2">
							<form method="post" action="?/delete" use:enhance={formSubmitDelete}>
								<Button
									type="submit"
									on:click={() => changeDeleteOptions(sessionData.id, data.id)}
									class="flex items-center bg-red-600 hover:bg-red-700"
									><Trash2 class="h-[16px] w-[16px]" /></Button
								>
							</form>
						</div>
					</CardHeader>
					<CardContent class="flex flex-row items-center justify-between">
						<div>
							<div>
								<p class="font-medium text-muted-foreground">{data.discription}</p>
							</div>
							<div class="flex flex-row gap-2">
								{#each data.lables as lable}
									<Badge class={`${getRandomColor600()}`}>{lable}</Badge>
								{/each}
							</div>
						</div>
						<div class="flex flex-row gap-2">
							<Button class="flex items-center bg-green-600 font-semibold hover:bg-green-700"
								>Edit</Button
							>
							<Button
								class="flex items-center bg-blue-600 font-semibold hover:bg-blue-700"
								href={`/workplace/${sessionData.email}/${data.id}`}>See TimeLine</Button
							>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</div>
