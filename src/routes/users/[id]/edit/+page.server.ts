import { userSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const { id } = params;
	const user = await prisma.user.findUnique({
		where: { id }
	});

	const form = await superValidate(user, zod(userSchema));

	return { user, form };
};

export const actions = {
	default: async ({ request, params }) => {
		const { id } = params;

		const formData = await request.formData();

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const form = await superValidate(formData, zod(userSchema));

		if (!form.valid) {
			return fail(400, form);
		}

		await prisma.user.update({ data: { name, email }, where: { id } });

		console.log('updated User!');
		message(form, 'User updated successfully');
		return redirect(302, `/users/${id}`);
	}
};
