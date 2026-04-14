// Vercel serverless entry — wraps the Express app
import 'dotenv/config';
import { connectDB } from '../server/src/config/db';
import app from '../server/src/app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Connect at module load time; Vercel caches module state between warm invocations
connectDB().catch(console.error);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
