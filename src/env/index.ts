import {z} from "zod";
import {config} from "dotenv";

config()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
    HOST: z.string().default('localhost')
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('Invalid environment variables', _env.error.format());
    throw new Error(`Invalid environment variables: ${_env.error.format()}`)
}

export const env = _env.data