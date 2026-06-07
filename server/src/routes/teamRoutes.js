import { Router } from 'express';
import teamController from '../controllers/teamController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { createTeamSchema, updateTeamSchema, listQuerySchema } from '../validators/orgValidator.js';

const router = Router();
router.use(authenticate);

// List all (no pagination — for dropdowns)
router.get('/all', authorize(PERMISSIONS.USER_READ), teamController.listAll);

// By department
router.get('/department/:departmentId', authorize(PERMISSIONS.USER_READ), teamController.getByDepartment);

// CRUD
router.get('/', authorize(PERMISSIONS.USER_READ), validateQuery(listQuerySchema), teamController.list);
router.get('/:id', authorize(PERMISSIONS.USER_READ), teamController.getById);
router.post('/', authorize(PERMISSIONS.TEAM_MANAGE), validate(createTeamSchema), teamController.create);
router.patch('/:id', authorize(PERMISSIONS.TEAM_MANAGE), validate(updateTeamSchema), teamController.update);
router.delete('/:id', authorize(PERMISSIONS.TEAM_MANAGE), teamController.delete);

export default router;
