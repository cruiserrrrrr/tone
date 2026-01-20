import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class UrlReplacementInterceptor implements NestInterceptor {
    private readonly sourceUrl = "s3.regru.cloud";
    private readonly targetUrl = "cdn.unitbox.ai";

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                return this.replaceUrls(data);
            }),
        );
    }

    private replaceUrls(obj: any): any {
        if (obj === null || obj === undefined) {
            return obj;
        }

        // Для примитивных типов
        if (typeof obj !== "object") {
            if (typeof obj === "string" && obj.includes(this.sourceUrl)) {
                return obj.replace(
                    new RegExp(this.sourceUrl, "g"),
                    this.targetUrl,
                );
            }
            return obj;
        }

        // Для специальных объектов (Date, RegExp, etc.) возвращаем как есть
        if (
            obj instanceof Date ||
            obj instanceof RegExp ||
            obj instanceof Error
        ) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.replaceUrls(item));
        }

        // Для обычных объектов
        if (obj.constructor === Object) {
            const result = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = this.replaceUrls(obj[key]);
                }
            }
            return result;
        }

        // Для объектов-экземпляров классов (Entity объекты TypeORM)
        // Создаем копию с сохранением прототипа
        const result = Object.assign(
            Object.create(Object.getPrototypeOf(obj)),
            {},
        );
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = this.replaceUrls(obj[key]);
            }
        }
        return result;
    }
}
