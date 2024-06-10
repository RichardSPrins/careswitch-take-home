import { workspaceSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const { id } = params;
	const workspace = await prisma.workspace.findUnique({
		where: { id },
		include: {
			UserWorkspaceMembership: true
		}
	});

	const form = await superValidate(workspace, zod(workspaceSchema));

	return { workspace, form };
};

export const actions = {
	default: async ({ request, params }) => {
		const { id } = params;

		const formData = await request.formData();

		const name = formData.get('name') as string;
		const form = await superValidate(formData, zod(workspaceSchema));

		if (!form.valid) {
			return fail(400, form);
		}

		await prisma.workspace.update({ data: { name }, where: { id } });

		console.log('updated workspace!');
		message(form, 'WOrkspace updated successfully');
		return redirect(302, `/workspaces/${id}`);
	}
};
