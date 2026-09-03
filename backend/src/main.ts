import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { UrlReplacementInterceptor } from "./interceptors/url-replacement.interceptor";
import { getAppConfig } from "./config/env";

async function bootstrap() {
    const config = getAppConfig();
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(config.apiPrefix);
    app.use(cookieParser());
    app.use(json({ limit: config.bodyLimit }));
    app.use(urlencoded({ limit: config.bodyLimit, extended: true }));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
        new UrlReplacementInterceptor(),
    );

    // Добавляем глобальный фильтр для обработки всех ошибок
    app.useGlobalFilters(new AllExceptionsFilter());

    app.enableCors({
        // Список origin'ов берём из CORS_ORIGINS, пустой список = разрешаем все (dev).
        origin: config.corsOrigins.length > 0 ? config.corsOrigins : true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    });

    await app.listen(config.port);
}

bootstrap();
