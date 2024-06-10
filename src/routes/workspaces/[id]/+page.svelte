<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Form from '$lib/components/ui/form';
	import { Edit, Plus } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { addUserSchema } from '$lib/schemas';
	import { Select, SelectTrigger, SelectItem, SelectContent } from '$lib/components/ui/select';
	import { goto } from '$app/navigation';

	const { data } = $props();
	const { workspace, users } = data;

	const workspaceUserIds = $derived(
		workspace?.UserWorkspaceMembership.map((member) => member.userId)
	);
	const usersNotInWorkspace = $derived(
		users.filter((user) => !workspaceUserIds?.includes(user.id))
	);

	const form = superForm(data.form, {
		validators: zodClient(addUserSchema)
	});
	const { form: formData, enhance } = form;
</script>

<div class="mt-8 space-y-12 px-4 sm:px-6 lg:px-8">
	<div class="flex flex-wrap items-center gap-4">
		<h1 class="text-5xl font-bold">{workspace?.name}</h1>
		<Button href={`${workspace?.id}/edit`}><Edit /></Button>
	</div>
	<div class="flex flex-wrap items-center justify-between">
		<h2 class="text-3xl font-bold">Workspace Users</h2>
		<Dialog.Root>
			<Dialog.Trigger
				><Button class="flex items-center gap-2"><Plus size={16} />Add User</Button></Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header class="text-xl font-semibold">Add User to {workspace?.name}</Dialog.Header>
				<form method="POST" class="flex flex-col gap-4" use:enhance>
					<Form.Field {form} name="userId">
						<Form.Control let:attrs
							><Label for="name">Users</Label>
							<Select
								{...attrs}
								onSelectedChange={(v) => {
                v && ($formData.userId = v.value as string);
              }}
							>
								<SelectTrigger>Select User</SelectTrigger>
								<SelectContent>
									{#each usersNotInWorkspace as user (user.id)}
										<SelectItem label={user.name} value={user.id}>{user.name}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
							<input hidden bind:value={$formData.userId} name={attrs.name} />
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
			</Table.Row>
		</Table.Header>
		{#if workspace?.UserWorkspaceMembership}
			<Table.Body>
				{#each workspace?.UserWorkspaceMembership as membership}
					<Table.Row class="cursor-pointer" on:click={() => goto(`/users/${membership.user.id}`)}>
						<Table.Cell>{membership.user.name}</Table.Cell>
						<Table.Cell>{membership.user.email}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		{/if}
	</Table.Root>
</div>
