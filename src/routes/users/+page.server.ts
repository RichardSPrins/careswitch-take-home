import { userSchema } from '$lib/schemas/index.js';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const users = await prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			_count: {
				select: {
					UserWorkspaceMembership: true
				}
			}
		}
	});
	const form = await superValidate(zod(userSchema));

	return { users, form };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;

		const form = await superValidate(data, zod(userSchema));

		if (!form.valid) {
			return fail(400, form);
		}

		await prisma.user.create({ data: { name, email } });

		return message(form, 'Workspace created!');
	}
};
