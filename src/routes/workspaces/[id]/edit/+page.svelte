<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { workspaceSchema } from '$lib/schemas';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(workspaceSchema)
	});
	const { form: formData, enhance } = form;
</script>

<div class="mt-8 space-y-12 px-4 sm:px-6 lg:px-8">
	<div class="flex flex-wrap items-center justify-between space-y-12">
		<h1 class="text-5xl font-bold">Edit Workspace</h1>
	</div>
	<form method="POST" class="flex max-w-xl flex-col gap-4" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control let:attrs
				><Label for="name">Name</Label>
				<Input {...attrs} required type="text" bind:value={$formData.name} />
			</Form.Control>
		</Form.Field>
		<Button type="submit" class="w-fit">Save Workspace</Button>
	</form>
</div>
