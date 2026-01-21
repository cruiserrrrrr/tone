import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host:
        process.env.NODE_ENV === "dev"
            ? "127.0.0.1"
            : process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT) || 6543,
    username: process.env.DATABASE_USERNAME || "tone",
    password: process.env.DATABASE_PASSWORD || "tone_secret_pwd",
    database: process.env.DATABASE_NAME || "tone_postgres",
    synchronize: false,
    logging: true,
    entities: ["src/**/*.entity.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
