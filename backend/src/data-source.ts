import { DataSource } from "typeorm";
import { getDatabaseConfig } from "./config/env";

export const AppDataSource = new DataSource({
    type: "postgres",
    ...getDatabaseConfig(),
    synchronize: false,
    logging: true,
    entities: ["src/**/*.entity.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
