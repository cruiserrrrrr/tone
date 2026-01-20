import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { UrlReplacementInterceptor } from "./interceptors/url-replacement.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api");
    app.use(cookieParser());
    app.use(json({limit: "10mb"}));
    app.use(urlencoded({limit: "10mb", extended: true}));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
        new UrlReplacementInterceptor(),
    );

    // Добавляем глобальный фильтр для обработки всех ошибок
    app.useGlobalFilters(new AllExceptionsFilter());

    if (process.env.NODE_ENV == "dev")
        app.enableCors({
            origin: "http://localhost:3000",
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        });

    await app.listen(3001);
}

bootstrap();
