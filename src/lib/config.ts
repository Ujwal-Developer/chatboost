import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(24).optional(),
  PLATFORM_FEE_BPS: z.coerce.number().int().min(0).max(3000).default(1000)
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  PLATFORM_FEE_BPS: process.env.PLATFORM_FEE_BPS
});
