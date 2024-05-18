import { validationResult } from 'express-validator'
import ApiError from '../../errors/api-error.js';
import UserService from '../../service/user-service.js';
import TokenService from '../../service/token-service.js'

class UserController {
    static async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка авторизации', errors.array()));
            }
            const { login, password, role } = req.body;
            const userData = await UserService.registration(login, password, role); // Передайте роль в метод регистрации
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    static async login(req, res, next) {
        try {
            const { login, password, role } = req.body;
            const userData = await UserService.login(login, password, role);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpsOnly: true });
            // Заменяем использование req.user.roleName на userData.role
            return res.json({ ...userData, role: userData.role }); 
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw new Error('Refresh token not found in cookies');
            }
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = req.user ? { role: req.user.role } : {}; // Добавляем роль в userData
            const updatedUserData = await UserService.refresh(refreshToken, userData);
            res.cookie('refreshToken', updatedUserData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpsOnly: true });
            return res.json(updatedUserData);
        } catch (e) {
            next(e);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

export { UserController };
