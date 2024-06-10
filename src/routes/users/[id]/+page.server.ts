import { userSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const { id } = params;
	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			UserWorkspaceMembership: {
				include: { user: true }
			}
		}
	});

	const form = await superValidate(zod(userSchema));

	return { user, form };
};
