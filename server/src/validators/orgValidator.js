import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(100).trim(),
  code: z.string().max(20).trim().toUpperCase().optional().nullable(),
  description: z.string().max(500).trim().optional().nullable(),
  headId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID').optional().nullable(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  code: z.string().max(20).trim().toUpperCase().optional().nullable(),
  description: z.string().max(500).trim().optional().nullable(),
  headId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100).trim(),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID'),
  description: z.string().max(500).trim().optional().nullable(),
  leadId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID').optional(),
  description: z.string().max(500).trim().optional().nullable(),
  leadId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const createDesignationSchema = z.object({
  title: z.string().min(1, 'Designation title is required').max(100).trim(),
  level: z.number().int().min(0).max(20).optional().default(0),
  description: z.string().max(500).trim().optional().nullable(),
});

export const updateDesignationSchema = z.object({
  title: z.string().min(1).max(100).trim().optional(),
  level: z.number().int().min(0).max(20).optional(),
  description: z.string().max(500).trim().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 50)),
  search: z.string().optional(),
  isActive: z.string().optional().transform((v) => {
    if (v === 'true') return true;
    if (v === 'false') return false;
    return undefined;
  }),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  parentId: z.string().optional().transform((v) => v === 'null' ? null : v),
});
