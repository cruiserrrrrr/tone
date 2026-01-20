import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger("AllExceptionsFilter");

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = "Внутренняя ошибка сервера";

        if (exception instanceof HttpException) {
            const errorResponse = exception.getResponse();
            message =
                (typeof errorResponse === "object" && "message" in errorResponse
                    ? errorResponse["message"]
                    : exception.message) + "";
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        this.logger.error(
            `${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : "Unknown error",
        );

        response.status(status).json({
            statusCode: status,
            message: message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
