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
import { AiModule } from "./modules/ai.module";
import { ChatSettingsModule } from "./modules/chat-settings.module";
import { PlansModule } from "./modules/plans.module";
import { CryptoCloudModule } from "./modules/crypto-cloud.module";
import { getDatabaseConfig, getMailConfig } from "./config/env";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        AuthModule,
        UsersModule,
        AiModule,
        ChatSettingsModule,
        PlansModule,
        CryptoCloudModule,
        MailerModule.forRoot({
            transport: {
                host: getMailConfig().host,
                port: getMailConfig().port,
                secure: getMailConfig().secure,
                auth: {
                    user: getMailConfig().user,
                    pass: getMailConfig().pass,
                },
                tls: {
                    rejectUnauthorized: getMailConfig().rejectUnauthorized,
                },
            },
            defaults: {
                from: getMailConfig().from,
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
            ...getDatabaseConfig(),
            autoLoadEntities: true,
            synchronize: false,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
