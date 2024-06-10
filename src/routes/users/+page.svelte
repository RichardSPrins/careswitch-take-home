<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { workspaceSchema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(workspaceSchema)
	});
	const { form: formData, enhance } = form;
</script>

<div class="mt-8 px-4 sm:px-6 lg:px-8">
	<div class="flex flex-wrap items-center justify-between space-y-12 p-4">
		<h1 class="text-5xl font-bold">Users</h1>
		<Dialog.Root>
			<Dialog.Trigger
				><Button class="flex items-center gap-2"><Plus size={16} />New User</Button></Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header class="text-xl font-semibold">Add New User</Dialog.Header>
				<Dialog.Description>Add a new user, be sure to include an email address</Dialog.Description>
				<form method="POST" class="flex flex-col gap-4" use:enhance>
					<Form.Field {form} name="name">
						<Form.Control let:attrs
							><Label for="name">Name</Label>
							<Input {...attrs} required type="text" bind:value={$formData.name} />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Label for="email">Email</Label>
							<Input {...attrs} required type="email" bind:value={$formData.email} />
						</Form.Control>
					</Form.Field>
					<Dialog.Footer
						><Dialog.Close
							class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							type="submit">Add User</Dialog.Close
						></Dialog.Footer
					>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Email</Table.Head>
				<Table.Head>Workspaces</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as user (user.id)}
				<Table.Row class="cursor-pointer" on:click={() => goto(`/users/${user.id}`)}>
					<Table.Cell>{user.name}</Table.Cell>
					<Table.Cell>{user.email}</Table.Cell>
					<Table.Cell>{user._count.UserWorkspaceMembership}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
