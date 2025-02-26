import { neonConfig, Pool } from '@neondatabase/serverless';
import { NeonDatabase, drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool: Pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db: NeonDatabase<Record<string, never>> = drizzle({ client: pool });

export { Package, User, Video, Transaction } from './schema';
