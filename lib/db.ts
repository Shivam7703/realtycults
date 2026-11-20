// PATH: lib/db.ts
import { createPool, type Pool } from 'mysql2/promise';

const g = globalThis as unknown as { _mysqlPool?: Pool };

export const pool: Pool =
  g._mysqlPool ??
  createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4',
  });

if (process.env.NODE_ENV !== 'production') g._mysqlPool = pool;