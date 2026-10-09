import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import { db } from '@sme-tv/db';

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'SME TV Administrator';
  if (!email || !password || password.length < 14) throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD with at least 14 characters before running admin:seed.');
  const salt = randomBytes(16).toString('hex');
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  const user = await db.user.upsert({ where: { email }, update: { name, passwordHash, role: 'ADMIN', status: 'ACTIVE' }, create: { email, name, passwordHash, role: 'ADMIN' } });
  console.log(`Administrator account prepared for ${user.email}.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Admin setup failed'); process.exitCode = 1; }).finally(() => db.$disconnect());
