<script lang="ts">
	import { Hourglass } from 'lucide-svelte';
	import { Search } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';

	export let username:string;
</script>

<div class="flex w-full flex-row justify-between border-b border-b-gray-600/15 px-8 py-3">
	<div>
		<h1 class="flow-row flex items-center gap-1 text-xl font-semibold">
			<Hourglass size={18} /> TimeLine
		</h1>
	</div>
	<div>
		<form
			method="post"
			class="flex flex-row items-center gap-1 rounded-lg border border-gray-600/20 px-1"
		>
			<Search size={24} />
			<Input placeholder="Search Your TimeLine" class="w-[500px] border-none" />
		</form>
	</div>
	<div class="flex flex-row items-center gap-1">
		<img src="/profilePic.jpg" alt="profile" class="h-[30px] w-[30px] rounded-full" />
		<h1 class="text-sm font-light capitalize">{username.toLowerCase()}</h1>
	</div>
</div>
