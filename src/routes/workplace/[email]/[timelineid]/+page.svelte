<script lang="ts">
	import NavbarTask from "$lib/components/NavbarTask/NavbarTask.svelte";
    import TimelineTask from "$lib/components/Timelinetask/Timelinetask.svelte"

    export let data;

    const sessionData = data.session as {id:string ,email:string}

    const dataOfTimeline = data.info

    const timeLineId = data.info.id

    $:task = data.task
</script>

<div class="w-full">
    <NavbarTask timeLineInfo={dataOfTimeline} email={sessionData.email}/>
    <TimelineTask task={task} id={timeLineId}/>
</div>