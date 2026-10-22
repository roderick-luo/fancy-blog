import { Pool } from 'pg'
const g = globalThis
export const pool = g.__pgPool || (g.__pgPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 }))
export const q = (text, params) => pool.query(text, params)
