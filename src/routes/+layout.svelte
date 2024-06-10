<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="flex h-screen">
	<aside class="flex h-full w-72 flex-col gap-8 border-r p-8">
		<p class="text-xl font-bold">User Management</p>
		<div class="flex flex-col">
			<a class="rounded-md p-2 hover:bg-slate-800" href="/">Home</a>
			<a class="rounded-md p-2 hover:bg-slate-800" href="/users">Users</a>
			<a class="rounded-md p-2 hover:bg-slate-800" href="/workspaces">Workspaces</a>
		</div>
	</aside>
	<div class="h-full grow overflow-y-auto">{@render children()}</div>
</div>
