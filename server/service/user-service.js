import { sql } from "../db.js";
import bcrypt from 'bcryptjs'; // Заменяем импорт на bcryptjs
import TokenService from './token-service.js';
import UserDTO from '../dtlos/user-dto.js';
import ApiError from "../errors/api-error.js";
import BadRequest from '../errors/api-error.js'
import RoleModel from '../models/role-model.js';
export default class UserService {
    static async registration(login, password, role) {
        try {
            const existingUser = await sql`SELECT * FROM users WHERE login = ${login}`;
            if (existingUser.length > 0) {
                throw ApiError.BadRequest(`Пользователь с таким именем ${login} уже существует`);
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const existingRole = await sql`SELECT * FROM roles WHERE name = ${role}`;
            if (existingRole.length === 0) {
                await sql`INSERT INTO roles (name) VALUES (${role})`;
            }
            await sql`INSERT INTO users (login, password, role) VALUES (${login}, ${hashPassword}, ${role})`;
            return { success: true }; // Возвращаем сообщение об успешной регистрации
        } catch (error) {
            throw error;
        }
    }


    static async login(login, password, role) {
        try {
            const userData = await sql`
                SELECT * FROM users WHERE login = ${login}`;
            if (!userData || userData.length === 0) {
                throw ApiError.BadRequest(`Пользователь с именем ${login} не найден`);
            }
            const user = userData[0];
            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError.BadRequest(`Неверный пароль`);
            }
            const userDTO = new UserDTO(user);
            const tokens = TokenService.generateTokens({ ...userDTO });
            await TokenService.saveToken(userDTO.id, tokens.refreshToken);
            return { ...tokens, user: userDTO, role: user.role };
        } catch (error) {
            throw error;
        }
    }
    static async findUserById(id) {
        try {
            const user = await sql`
                SELECT * FROM users WHERE id = ${id}
            `;
            return user[0];
        } catch (error) {
            throw Error('Ошибка при поиске пользователя по id');
        }
    }
    static async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }


    static async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserService.findUserById(userData.id);
        const userDto = new UserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDto });

        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }
    static async getAllUsers() {
        try {
            const users = await sql`SELECT * FROM users`;
            return users;
        } catch (error) {
            throw Error('Ошибка при получении пользователей');
        }
    }
    static async deleteUser(userId) {
        return await sql`DELETE FROM users WHERE id = ${userId}`;
    }
    static async updateUserRole(userId, newRole) {
        return await sql`UPDATE users SET role = ${newRole} WHERE id = ${userId}`;
    }
    static async updateUser1CUserId(userId, user1CUserId) {
        try {
            await sql`UPDATE users SET 1c_user_id = ${user1CUserId} WHERE id = ${userId}`;
            return { success: true };
        } catch (error) {
            console.error(error);
            throw new Error('Ошибка при обновлении 1C_User_ID');
        }
    }
}
