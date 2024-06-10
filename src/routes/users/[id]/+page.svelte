<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Edit } from 'lucide-svelte';

	const { data } = $props();
	const { user } = data;
</script>

<div class="mt-8 space-y-12 px-4 sm:px-6 lg:px-8">
	<div class="flex items-center gap-4">
		<h1 class="text-5xl font-bold">User Profile</h1>
		<Button href={`${user?.id}/edit`}><Edit /></Button>
	</div>
	<div class="flex flex-col gap-4">
		<h2 class="text-3xl font-semibold">{user?.name}</h2>
		<p>{user?.email}</p>
	</div>
</div>
