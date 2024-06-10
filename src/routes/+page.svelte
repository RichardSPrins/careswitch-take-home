<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Form from '$lib/components/ui/form';
	import { Plus } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userSchema, workspaceSchema } from '$lib/schemas';
	import { goto } from '$app/navigation';
	let { data } = $props();
	$effect(() => {
		console.log(data);
	});

	const userForm = superForm(data.userForm, {
		validators: zodClient(userSchema)
	});
	const { form: userFormData, enhance: userEnhance } = userForm;

	const workspaceForm = superForm(data.workspaceForm, {
		validators: zodClient(workspaceSchema)
	});
	const { form: workspaceFormData, enhance: workspaceEnhance } = workspaceForm;
</script>

<div class="mt-8 px-4 sm:px-6 lg:px-8">
	<div class="space-y-12 p-4">
		<h1 class="text-5xl font-bold">Welcome Back!</h1>
		<div class="flex flex-wrap items-center justify-between">
			<h2 class="text-3xl font-bold">Recent Users</h2>
			<Dialog.Root>
				<Dialog.Trigger
					><Button class="flex items-center gap-2"><Plus size={16} />New User</Button
					></Dialog.Trigger
				>
				<Dialog.Content>
					<Dialog.Header class="text-xl font-semibold">Add New User</Dialog.Header>
					<Dialog.Description>
						Add a new user, be sure to include an email address
					</Dialog.Description>
					<form method="POST" class="flex flex-col gap-4" use:userEnhance action="?/newUser">
						<Form.Field form={userForm} name="name">
							<Form.Control let:attrs
								><Label for="name">Name</Label>
								<Input {...attrs} required type="text" bind:value={$userFormData.name} />
							</Form.Control>
						</Form.Field>
						<Form.Field form={userForm} name="email">
							<Form.Control let:attrs>
								<Label for="email">Email</Label>
								<Input {...attrs} required type="email" bind:value={$userFormData.email} />
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
		<div class="flex flex-wrap items-center justify-between">
			<h2 class="text-3xl font-bold">Recent Workspaces</h2>
			<Dialog.Root>
				<Dialog.Trigger
					><Button class="flex items-center gap-2"><Plus size={16} />New Workspace</Button
					></Dialog.Trigger
				>
				<Dialog.Content>
					<Dialog.Header class="text-xl font-semibold">Add New Workspace</Dialog.Header>
					<Dialog.Description>Please enter the name for your new workspace</Dialog.Description>
					<form
						method="POST"
						class="flex flex-col gap-4"
						use:workspaceEnhance
						action="?/newWorkspace"
					>
						<Form.Field form={workspaceForm} name="name">
							<Form.Control let:attrs
								><Label for="name">Name</Label>
								<Input {...attrs} required type="text" bind:value={$workspaceFormData.name} />
							</Form.Control>
						</Form.Field>
						<Dialog.Footer
							><Dialog.Close
								class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
								type="submit">Add Workspace</Dialog.Close
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
					<Table.Head>Users</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.workspaces as workspace (workspace.id)}
					<Table.Row class="cursor-pointer" on:click={() => goto(`/workspaces/${workspace.id}`)}>
						<Table.Cell>{workspace.name}</Table.Cell>
						<Table.Cell>{workspace._count.UserWorkspaceMembership}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<!-- <div>
			Your assignment is to use all the libraries and tools already set up in this project to build
			a simple user management interface. You can use the table above as a starting point, but you
			are encouraged to start from scratch, as long as you follow the requirements below:

			<ul class="mt-4 list-disc space-y-2 pl-4">
				<li>
					<span class="font-semibold">CRUD</span> - You should be able to create, read, update, and delete
					models specified in the schema below, ideally across different routes and pages designed for
					listing, viewing, and updating.
				</li>
				<li>
					<span class="font-semibold">Forms</span> - You should use Shadcn
					<a
						class="underline underline-offset-2"
						target="_blank"
						href="https://shadcn-svelte.com/docs/components/form">Form</a
					>
					components alongside
					<a class="underline underline-offset-2" target="_blank" href="https://superforms.rocks/"
						>Superforms</a
					> to implement your forms and validation. You are generally encouraged to use as many Shadcn
					components as you see fit to build out the interface.
				</li>
				<li>
					<span class="font-semibold">Schema</span> - You are expected to modify the Prisma schema
					and add your own migrations to support the following domain models (you can use the
					<code class="text-sm">`npm run migrate`</code> command to apply your changes):
					<ul class="mt-2 list-disc space-y-2 pl-4">
						<li>
							<span class="font-medium">User</span> - Represents users in the system. A simple starting
							schema is provided for you, but you should expand it as needed.
						</li>
						<li>
							<span class="font-medium">Workspace</span> - Represents a workspace that groups users together.
							A user can belong to multiple workspaces. This is a lot like Slack.
						</li>
					</ul>
				</li>
				<li>
					<span class="font-semibold">Styling</span> - You should use a combination of Shadcn and Tailwind
					CSS to style your components. Put some thought into the design, layout, and navigation of your
					pages.
				</li>
			</ul>
		</div> -->
	</div>
</div>
