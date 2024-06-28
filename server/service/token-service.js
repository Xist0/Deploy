import jwt from 'jsonwebtoken';
import { sql } from "../db.js";
import TokenModel from "../models/token-model.js";

class TokenService {
    static generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '36h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    static validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            throw new Error('Invalid access token');
        }
    }

    static validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                console.log('Refresh token expired, handle accordingly');
            } else {
                throw new Error('Invalid refresh token');
            }
        }
    }


    static async saveToken(userId, refreshToken) {
        try {
            await TokenModel;

            const existingToken = await sql`
                SELECT * FROM tokens WHERE user_id = ${userId}`;
            if (existingToken.length > 0) {
                await sql`
                    UPDATE tokens SET refreshToken = ${refreshToken} WHERE user_id = ${userId}`;
            } else {
                await sql`
                    INSERT INTO tokens (user_id, refreshToken) VALUES (${userId}, ${refreshToken})`;
            }
        } catch (error) {
            throw new Error('Error saving token');
        }
    }

    static async removeToken(refreshToken) {
        try {
            console.log('Trying to remove token:', refreshToken);
            await sql`
                DELETE FROM tokens WHERE refreshToken = ${refreshToken}
            `;
            return true; // Возвращаем true, если удаление прошло успешно
        } catch (error) {
            console.error('Error removing token:', error);
            throw new Error('Error removing token');
        }
    }

    static async findToken(refreshToken) {
        try {
            const tokenData = await sql` 
                SELECT * FROM tokens WHERE refreshToken = ${refreshToken}
            `;
            return tokenData;
        } catch (error) {
            throw new Error('Error finding token');
        }
    }
}

export default TokenService;
