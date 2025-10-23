import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5544,
  database: 'car_marketplace',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export default pool;
