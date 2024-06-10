import { addUserSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const { id } = params;
	const users = await prisma.user.findMany();
	const workspace = await prisma.workspace.findUnique({
		where: { id },
		include: {
			UserWorkspaceMembership: {
				include: { user: true }
			}
		}
	});

	const form = await superValidate(zod(addUserSchema));

	return { workspace, users, form };
};

export const actions = {
	default: async ({ request, params }) => {
		const { id } = params;

		const formData = await request.formData();
		const form = await superValidate(formData, zod(addUserSchema));
		const userId = formData.get('userId') as string;

		if (!form.valid) {
			return fail(400, form);
		}

		await prisma.userWorkspaceMembership.create({ data: { userId, workspaceId: id } });

		console.log('added new user!');
		return message(form, 'User added successfully');
	}
};
