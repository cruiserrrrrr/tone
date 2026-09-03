import { DataSource } from "typeorm";
import { getDatabaseConfig } from "./src/config/env";

export default new DataSource({
    type: "postgres",
    ...getDatabaseConfig(),
    entities: ["./src/entities/**/*.ts"],
    migrations: ["./migrations/**/*.ts"],
});
