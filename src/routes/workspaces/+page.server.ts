import { workspaceSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const workspaces = await prisma.workspace.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			_count: {
				select: {
					UserWorkspaceMembership: true
				}
			}
		}
	});
	const form = await superValidate(zod(workspaceSchema));

	return { workspaces, form };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const form = await superValidate(data, zod(workspaceSchema));

		if (!form.valid) {
			return fail(400, form);
		}

		await prisma.workspace.create({ data: { name } });

		return message(form, 'Workspace created!');
	}
};
