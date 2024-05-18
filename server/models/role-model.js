import { sql } from "../db.js";

const RoleTable = sql`
    CREATE TABLE IF NOT EXISTS Roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );`;

class RoleModel {
    static async createRoleTable() {
        await sql`
            ${RoleTable}
        `;
    }
}

export default RoleModel;