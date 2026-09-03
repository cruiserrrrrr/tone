import isClient from "../helpers/isClient";
import { buildApiUrl, buildRefreshUrl } from "../config";

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

        const config: any = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        };

        url = buildApiUrl(url);

        try {
            const response = await fetch(url, config);

            if (
                response.status === 401 &&
                !endpoint.includes("/auth/refresh") &&
                !endpoint.includes("/auth/login") &&
                retryWithRefresh
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

        isRefreshing = true;

        try {
            const refreshUrl = buildRefreshUrl();

            const refreshConfig: RequestInit = {
                method: "GET",
                credentials: "include",
            };

            const refreshResponse = await fetch(refreshUrl, refreshConfig);

            if (!refreshResponse.ok) {
                throw new Error(`Failed to refresh token: ${refreshResponse.status}`);
            }

            const data = await refreshResponse.json();

            if (isClient()) {
                window.dispatchEvent(
                    new CustomEvent("admin_token_refreshed", {
                        detail: { user: data.user },
                    }),
                );
            }

            isRefreshing = false;

            const queue = [...refreshQueue];
            refreshQueue = [];

            for (const request of queue) {
                try {
                    const result = await this.request(
                        request.endpoint,
                        request.method,
                        request.body,
                        request.headers,
                        false,
                        request.extendedErrorInfo,
                    );
                    request.resolve(result);
                } catch (error) {
                    request.reject(error);
                }
            }

            return this.request<T>(endpoint, method, body, headers, false, extendedErrorInfo);
        } catch (refreshError) {
            isRefreshing = false;
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
