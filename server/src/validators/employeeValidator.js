import { z } from 'zod';
import { ROLES } from '../config/constants.js';

export const onboardEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().email('Invalid email address').transform((v) => v.toLowerCase().trim()),
  role: z.enum(Object.values(ROLES)).default(ROLES.EMPLOYEE),
  
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional(),
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Team ID').optional(),
  designationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Designation ID').optional(),
  
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).default('FULL_TIME'),
  joiningDate: z.string().datetime({ message: 'Invalid joining date' }),
});

export const updateEmployeeSchema = z.object({
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID').optional(),
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID').optional(),
  designationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID').optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED']).optional(),
});

export const listEmployeesQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 20)),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  status: z.string().optional(),
});
