import { DataSource } from "typeorm";

export default new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || "tone",
    password: process.env.DATABASE_PASSWORD || "tone_secret_pwd",
    database: process.env.DATABASE_NAME || "tone-postgres",
    entities: ["./src/entities/**/*.ts"],
    migrations: ["./migrations/**/*.ts"],
});
