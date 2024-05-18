import { sql } from "../db.js";

const TokenSchema = sql`
    CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        refreshToken VARCHAR(255) NOT NULL
    )`;

class TokenModel {
    static async createTokenTable() {
        await sql`
        ${TokenSchema}
            `;
    }
}

export default TokenModel;