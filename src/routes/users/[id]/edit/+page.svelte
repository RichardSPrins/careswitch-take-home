<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userSchema } from '$lib/schemas';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(userSchema)
	});
	const { form: formData, enhance } = form;
</script>

<div class="mt-8 space-y-12 px-4 sm:px-6 lg:px-8">
	<div class="flex flex-wrap items-center justify-between space-y-12">
		<h1 class="text-5xl font-bold">Edit User Profile</h1>
	</div>
	<form method="POST" class="flex max-w-xl flex-col gap-4" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control let:attrs
				><Label for="name">Name</Label>
				<Input {...attrs} required type="text" bind:value={$formData.name} />
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs
				><Label for="name">Name</Label>
				<Input {...attrs} required type="text" bind:value={$formData.email} />
			</Form.Control>
		</Form.Field>
		<Button type="submit" class="w-fit">Save User</Button>
	</form>
</div>
