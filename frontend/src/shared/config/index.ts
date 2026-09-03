import isClient from "../helpers/isClient";

/**
 * Базовый URL API без завершающего слеша.
 * В браузере берём NEXT_PUBLIC_REQUEST_URL, на сервере (SSR) — REQUEST_URL:
 * это позволяет ходить в бэкенд по внутреннему адресу docker-сети.
 */
export const getApiBaseUrl = (): string => {
    const baseUrl = isClient() ? process.env.NEXT_PUBLIC_REQUEST_URL : process.env.REQUEST_URL;

    if (!baseUrl) {
        return "";
    }

    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

/** Склеивает базовый URL с эндпоинтом, не допуская двойного слеша. */
export const buildApiUrl = (endpoint: string): string => {
    const baseUrl = getApiBaseUrl();
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return baseUrl ? `${baseUrl}${normalizedEndpoint}` : endpoint;
};

/** URL обновления токена: префикс /api добавляем, только если его нет в базовом URL. */
export const buildRefreshUrl = (): string => {
    const baseUrl = getApiBaseUrl();

    return baseUrl.includes("/api") ? `${baseUrl}/auth/refresh` : `${baseUrl}/api/auth/refresh`;
};
