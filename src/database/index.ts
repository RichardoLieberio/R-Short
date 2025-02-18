import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

export const db: NeonHttpDatabase<Record<string, never>> = drizzle(process.env.DATABASE_URL!);

export { User, Video } from './schema';
