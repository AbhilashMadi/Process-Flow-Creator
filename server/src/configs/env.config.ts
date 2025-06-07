import { z } from 'zod'

// Schema to validate all required environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().positive(),
  HOST: z.string().min(1, "HOST is required"),

  CONSUMERS: z.string().transform(val => val.split(",").map(origin => origin.trim())),
  CLIENT: z.string().url("CLIENT must be a valid URL"),

  DB_URL: z.string().url("DB_URL must be a valid MongoDB connection string"),
  DB_NAME: z.string().min(1, "DB_NAME is required"),

  REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),
  REDIS_TOKEN: z.string().min(1, "REDIS_TOKEN is required"),

  HEALTH_CHECK_TIMEOUT: z.coerce.number({ message: 'HEALTH_CHECK_TIMEOUT is required' }),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1); // Stop the app if env is invalid
}

// Export the validated and transformed env object
export const env = parsed.data;
