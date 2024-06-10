import { z } from 'zod';

export const userSchema = z.object({
	name: z.string(),
	email: z.string()
});

export type UserSchema = typeof userSchema;

export const workspaceSchema = z.object({
	name: z.string()
});

export type WorkspaceSchema = typeof workspaceSchema;

export const addUserSchema = z.object({ userId: z.string() });

export type AddUserSchema = typeof addUserSchema;
