import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool: Pool = new Pool({ connectionString: process.env.DATABASE_URI });
export const db: NeonDatabase<Record<string, never>> = drizzle({ client: pool });

export { Package, User, Video, Transaction } from './schema';
