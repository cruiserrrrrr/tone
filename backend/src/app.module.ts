import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { AuthModule } from "./modules/auth.module";
import { UsersModule } from "./modules/users.module";


@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        AuthModule,
        UsersModule,
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            defaults: {
                from: process.env.FROM_EMAIL,
            },
            template: {
                dir: join(__dirname, "templates"),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host:
                process.env.NODE_ENV == "dev"
                    ? "127.0.0.1"
                    : process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT) || 6543,
            username: process.env.DATABASE_USERNAME || "tone",
            password: process.env.DATABASE_PASSWORD || "tone_secret_pwd",
            database: process.env.DATABASE_NAME || "tone_postgres",
            autoLoadEntities: true,
            synchronize: false,
        }),

    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
