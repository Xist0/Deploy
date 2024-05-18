import { sql } from "../db.js";

const UserTable = sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        login VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255)  NOT NULL,
        refreshToken VARCHAR(255)
    );`;

class UserModel {
    static async createUserTable() {
        await sql`
            ${UserTable}
        `;
    }
}

export default UserModel;