import { Router } from 'express';
import departmentController from '../controllers/departmentController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { createDepartmentSchema, updateDepartmentSchema, listQuerySchema } from '../validators/orgValidator.js';

const router = Router();
router.use(authenticate);

// Org chart (read access)
router.get('/org-chart', authorize(PERMISSIONS.USER_READ), departmentController.orgChart);

// List all (no pagination — for dropdowns)
router.get('/all', authorize(PERMISSIONS.USER_READ), departmentController.listAll);

// CRUD
router.get('/', authorize(PERMISSIONS.USER_READ), validateQuery(listQuerySchema), departmentController.list);
router.get('/:id', authorize(PERMISSIONS.USER_READ), departmentController.getById);
router.post('/', authorize(PERMISSIONS.DEPARTMENT_MANAGE), validate(createDepartmentSchema), departmentController.create);
router.patch('/:id', authorize(PERMISSIONS.DEPARTMENT_MANAGE), validate(updateDepartmentSchema), departmentController.update);
router.delete('/:id', authorize(PERMISSIONS.DEPARTMENT_MANAGE), departmentController.delete);

export default router;
