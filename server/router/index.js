import { Router } from 'express';
import { UserController } from '../autch-express/controllers/user-controllers.js';
import { body } from 'express-validator';

const router = Router();

import authMiddlewares from '../middlewares/auth-middlewares.js';

router.post('/registration',
    body('login').isLength({ min: 3, max: 32 }),
    body('password').isLength({ min: 3, max: 32 }),
    UserController.registration
);
router.post('/login', UserController.login);
router.get('/users', UserController.getUsers);
router.delete('/users/:id', UserController.deleteUser);
router.put('/users/:id', UserController.updateUserRole);
router.post('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddlewares, UserController.getUsers);

export { router };
