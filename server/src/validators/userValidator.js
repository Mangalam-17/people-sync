import { z } from 'zod';
import { ROLES } from '../config/constants.js';

export const updateRoleSchema = z.object({
  role: z.enum(Object.values(ROLES), {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});

export const listUsersQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 20)),
  search: z.string().optional(),
  role: z.enum([...Object.values(ROLES), '']).optional(),
});
