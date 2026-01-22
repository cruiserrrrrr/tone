import isClient from "../helpers/isClient";

// Флаг для отслеживания процесса обновления токена
let isRefreshing = false;
// Очередь запросов, ожидающих обновления токена
let refreshQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
    endpoint: string;
    method: string;
    body?: unknown;
    headers: HeadersInit;
    extendedErrorInfo: boolean;
}> = [];

abstract class ServiceBase {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected static async request<T>(
        endpoint: string,
        method: string,
        body?: unknown,
        headers: HeadersInit = {},
        retryWithRefresh = true,
        extendedErrorInfo = false,
    ): Promise<T> {
        let url = `${endpoint}`;

        const crmHeaders =
            isClient() && window.location.href.includes("crm") ? { "X-Crm": "true" } : {};

        const config: any = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
                ...crmHeaders,
            },
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        };

        const baseUrl = isClient() ? process.env.NEXT_PUBLIC_REQUEST_URL : process.env.REQUEST_URL;

        if (baseUrl) {
            // Убеждаемся, что между baseUrl и url нет двойного слеша или отсутствующего слеша
            const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
            const normalizedEndpoint = url.startsWith("/") ? url : `/${url}`;
            url = `${normalizedBaseUrl}${normalizedEndpoint}`;
        }

        try {
            const response = await fetch(url, config);

            // Обрабатываем заголовок Set-Cookie при выполнении на сервере
            if (!isClient()) {
                const setCookieHeader = response.headers.get("set-cookie");
                if (setCookieHeader) {
                    // Логируем для отладки
                    console.log("Received Set-Cookie header:", setCookieHeader);

                    // В серверном окружении Next.js заголовки Set-Cookie обрабатываются автоматически
                    // Но мы можем обновить заголовки для последующих запросов, если это необходимо
                }
            }

            // Если получили 401 и это не запрос на обновление токена и разрешено повторять с обновлением
            if (
                (response.status === 401 &&
                    !endpoint.includes("/auth/refresh") &&
                    !endpoint.includes("/auth/profile") &&
                    !endpoint.includes("/auth/login") &&
                    retryWithRefresh) ||
                (endpoint.includes("/collections/") && response.status === 403 && method === "POST")
            ) {
                return this.handleUnauthorized<T>(
                    endpoint,
                    method,
                    body,
                    headers,
                    extendedErrorInfo,
                );
            }

            if (!response.ok) {
                if (extendedErrorInfo) {
                    const errorData = await response.json().catch(() => ({}));
                    const error = {
                        status: response.status,
                        statusText: response.statusText,
                        data: errorData,
                        ...errorData,
                    };
                    throw error;
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            if (response.status === 204) {
                return {} as T;
            }

            const text = await response.text();
            return text ? JSON.parse(text) : ({} as T);
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    private static async handleUnauthorized<T>(
        endpoint: string,
        method: string,
        body?: unknown,
        headers: HeadersInit = {},
        extendedErrorInfo = false,
    ): Promise<T> {
        let cookieHeader: string | undefined;

        if (headers instanceof Headers) {
            cookieHeader = headers.get("Cookie") || headers.get("cookie") || "";
        } else if (headers && typeof headers === "object") {
            const headersObj = headers as Record<string, string>;
            cookieHeader = headersObj["Cookie"] || headersObj["cookie"];
        }

        // Если процесс обновления токена уже идет, добавляем запрос в очередь
        if (isRefreshing) {
            return new Promise<T>((resolve, reject) => {
                refreshQueue.push({
                    resolve,
                    reject,
                    endpoint,
                    method,
                    body,
                    headers,
                    extendedErrorInfo,
                });
            });
        }

        // Начинаем процесс обновления токена
        isRefreshing = true;
        const baseUrl = isClient() ? process.env.NEXT_PUBLIC_REQUEST_URL : process.env.REQUEST_URL;
        const normalizedBaseUrl = baseUrl?.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

        try {
            // Вызываем refresh для обновления токена напрямую
            const refreshUrl = normalizedBaseUrl?.includes("/api")
                ? `${normalizedBaseUrl}/auth/refresh`
                : `${normalizedBaseUrl}/api/auth/refresh`;
            const refreshConfig: RequestInit = {
                method: "GET",
                credentials: "include",
            };

            // Если есть cookie заголовок, добавляем его в запрос
            if (cookieHeader && !isClient()) {
                refreshConfig.headers = {
                    Cookie: cookieHeader,
                };
            }

            const refreshResponse = await fetch(refreshUrl, refreshConfig);

            if (!refreshResponse.ok) {
                throw new Error(`Failed to refresh token: ${refreshResponse.status}`);
            }

            const data = await refreshResponse.json();

            if (isClient()) {
                window.postMessage(
                    {
                        type: "SEND_TOKEN",
                        user: data.user,
                    },
                    "*",
                );
            }

            // Проверяем наличие заголовка Set-Cookie в ответе
            const setCookieHeader = refreshResponse.headers.get("set-cookie");
            if (setCookieHeader && !isClient()) {
                console.log("Received Set-Cookie in handleUnauthorized:", setCookieHeader);

                // Обрабатываем заголовок Set-Cookie для серверного рендеринга
                // Для Next.js на сервере нам нужно обновить cookies в контексте запроса
                // Это будет использоваться для последующих запросов

                // Разбираем заголовок Set-Cookie на отдельные куки
                // Обратите внимание, что формат Set-Cookie может быть сложным
                // и требует более тщательной обработки
                const cookieParts = setCookieHeader.split(",");
                const parsedCookies: { name: string; value: string }[] = [];

                // Обрабатываем каждую часть заголовка Set-Cookie
                for (const part of cookieParts) {
                    // Получаем основную часть куки (до первого ;)
                    const mainPart = part.split(";")[0].trim();
                    // Разделяем на имя и значение
                    const equalIndex = mainPart.indexOf("=");
                    if (equalIndex > 0) {
                        const name = mainPart.substring(0, equalIndex).trim();
                        const value = mainPart.substring(equalIndex + 1).trim();
                        parsedCookies.push({ name, value });
                    }
                }

                // Обновляем заголовок Cookie для последующих запросов
                if (parsedCookies.length > 0) {
                    const newCookieHeader = parsedCookies
                        .map((cookie) => `${cookie.name}=${cookie.value}`)
                        .join("; ");

                    console.log("New Cookie header for subsequent requests:", newCookieHeader);

                    // Обновляем заголовки для текущего запроса и запросов в очереди
                    headers = {
                        ...headers,
                        Cookie: newCookieHeader,
                    };

                    // Обновляем заголовки для запросов в очереди
                    refreshQueue.forEach((request) => {
                        request.headers = {
                            ...request.headers,
                            Cookie: newCookieHeader,
                        };
                    });
                }
            }

            // Обновление токена успешно, обрабатываем очередь запросов
            isRefreshing = false;

            // Выполняем все запросы из очереди
            const queue = [...refreshQueue];
            refreshQueue = [];

            for (const request of queue) {
                try {
                    const result = await this.request(
                        request.endpoint,
                        request.method,
                        request.body,
                        request.headers,
                        false, // Не пытаемся обновить токен снова
                        request.extendedErrorInfo,
                    );
                    request.resolve(result);
                } catch (error) {
                    request.reject(error);
                }
            }

            // Повторяем исходный запрос с обновленным токеном
            return this.request<T>(endpoint, method, body, headers, false, extendedErrorInfo);
        } catch (refreshError) {
            // Если не удалось обновить токен, очищаем очередь и выбрасываем ошибку
            isRefreshing = false;

            // Отклоняем все запросы в очереди
            refreshQueue.forEach((request) => {
                request.reject(refreshError);
            });
            refreshQueue = [];

            throw refreshError;
        }
    }

    protected static get<T>(
        endpoint: string,
        headers?: HeadersInit,
        retryWithRefresh = true,
        extendedErrorInfo = false,
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            "GET",
            undefined,
            headers,
            retryWithRefresh,
            extendedErrorInfo,
        );
    }

    protected static post<T>(
        endpoint: string,
        body: unknown,
        headers?: HeadersInit,
        retryWithRefresh = true,
        extendedErrorInfo = false,
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            "POST",
            body,
            headers,
            retryWithRefresh,
            extendedErrorInfo,
        );
    }

    protected static put<T>(
        endpoint: string,
        body: unknown,
        headers?: HeadersInit,
        retryWithRefresh = true,
        extendedErrorInfo = false,
    ): Promise<T> {
        return this.request<T>(endpoint, "PUT", body, headers, retryWithRefresh, extendedErrorInfo);
    }

    protected static patch<T>(
        endpoint: string,
        body: unknown,
        headers?: HeadersInit,
        retryWithRefresh = true,
        extendedErrorInfo = false,
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            "PATCH",
            body,
            headers,
            retryWithRefresh,
            extendedErrorInfo,
        );
    }

    protected static delete<T>(
        endpoint: string,
        body: unknown,
        headers?: HeadersInit,
        retryWithRefresh = true,
        extendedErrorInfo = false,
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            "DELETE",
            body,
            headers,
            retryWithRefresh,
            extendedErrorInfo,
        );
    }
}

export default ServiceBase;
