import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

// Подключение к базе данных PostgreSQL
export const sql = postgres({
    host: 'localhost',
    port: 5432,
    database: 'test',
    username: 'postgres',
    password: 'Qwerty123$'
});