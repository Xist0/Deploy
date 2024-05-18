import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();
export const sql = postgres({
    host: 'localhost',
    port: 5433,
    database: 'test',
    username: 'postgres',
    password: '1234'
});