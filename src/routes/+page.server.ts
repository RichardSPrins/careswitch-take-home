import { userSchema, workspaceSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const users = await prisma.user.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
		include: {
			_count: {
				select: {
					UserWorkspaceMembership: true
				}
			}
		}
	});
	const workspaces = await prisma.workspace.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
		include: {
			_count: {
				select: {
					UserWorkspaceMembership: true
				}
			}
		}
	});

	const userForm = await superValidate(zod(userSchema));
	const workspaceForm = await superValidate(zod(workspaceSchema));

	return { users, workspaces, userForm, workspaceForm };
};

export const actions = {
	newUser: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;

		const form = await superValidate(data, zod(workspaceSchema));

		if (!form.valid) {
			return fail(400, form);
		}

		await prisma.user.create({ data: { name, email } });

		return message(form, 'User created!');
	},
	newWorkspace: async ({ request }) => {
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
