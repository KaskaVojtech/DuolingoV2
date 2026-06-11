/**
 * One-off script for creating the default admin account from env variables.
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@admin.cz';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin';

  const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER ?? 'app_user',
    password: process.env.POSTGRES_PASSWORD ?? 'change_me',
    database: process.env.POSTGRES_DB ?? 'app_db',
  });

  await ds.initialize();

  const existing = await ds.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if (existing.length > 0) {
    console.log(`Admin ${email} already exists, skipping.`);
    await ds.destroy();
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);
  await ds.query(
    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin')`,
    [email, password_hash],
  );

  console.log(`✅ Admin created: ${email}`);
  await ds.destroy();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
