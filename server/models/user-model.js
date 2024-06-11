import { sql } from "../db.js";

const UserTable = sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        login VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        refreshToken VARCHAR(255),
        "1C_User_ID" VARCHAR(255)
    );
`;

class UserModel {
    static async createUserTable() {
        await sql`${UserTable}`;
    }

    static async updateUser1CUserId(userId, user1CUserId) {
        await sql`
            UPDATE users
            SET "1C_User_ID" = ${user1CUserId}
            WHERE id = ${userId}
        `;
    }
}

export default UserModel;
