import { Router } from 'express';
import designationController from '../controllers/designationController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { createDesignationSchema, updateDesignationSchema, listQuerySchema } from '../validators/orgValidator.js';

const router = Router();
router.use(authenticate);

// List all (no pagination — for dropdowns)
router.get('/all', authorize(PERMISSIONS.USER_READ), designationController.listAll);

// CRUD
router.get('/', authorize(PERMISSIONS.USER_READ), validateQuery(listQuerySchema), designationController.list);
router.get('/:id', authorize(PERMISSIONS.USER_READ), designationController.getById);
router.post('/', authorize(PERMISSIONS.DESIGNATION_MANAGE), validate(createDesignationSchema), designationController.create);
router.patch('/:id', authorize(PERMISSIONS.DESIGNATION_MANAGE), validate(updateDesignationSchema), designationController.update);
router.delete('/:id', authorize(PERMISSIONS.DESIGNATION_MANAGE), designationController.delete);

export default router;
