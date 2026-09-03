import * as dotenv from "dotenv";

// Загружаем .env один раз, чтобы конфиг работал одинаково
// и под Nest, и под TypeORM CLI (ts-node без ConfigModule).
dotenv.config();

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `Не задана обязательная переменная окружения ${name}. Пример значений — в backend/.env.example`,
        );
    }
    return value;
};

const stringEnv = (name: string, fallback: string): string =>
    process.env[name] || fallback;

const intEnv = (name: string, fallback: number): number => {
    const raw = process.env[name];
    if (!raw) {
        return fallback;
    }
    const parsed = parseInt(raw, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const floatEnv = (name: string, fallback: number): number => {
    const raw = process.env[name];
    if (!raw) {
        return fallback;
    }
    const parsed = parseFloat(raw);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const boolEnv = (name: string, fallback: boolean): boolean => {
    const raw = process.env[name];
    if (raw === undefined || raw === "") {
        return fallback;
    }
    return raw === "true";
};

const listEnv = (name: string): string[] =>
    (process.env[name] || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

export const getAppConfig = () => ({
    port: intEnv("PORT", 3001),
    apiPrefix: stringEnv("API_PREFIX", "api"),
    bodyLimit: stringEnv("BODY_LIMIT", "10mb"),
    // Пустой список = разрешаем любой origin (режим локальной разработки).
    corsOrigins: listEnv("CORS_ORIGINS"),
    isProduction: process.env.NODE_ENV === "production",
});

export const getDatabaseConfig = () => ({
    host: requireEnv("DATABASE_HOST"),
    port: intEnv("DATABASE_PORT", 5432),
    username: requireEnv("DATABASE_USERNAME"),
    password: requireEnv("DATABASE_PASSWORD"),
    database: requireEnv("DATABASE_NAME"),
});

// TTL храним в секундах: этого формата хватает и jwt.sign, и cookie maxAge.
export const getAuthConfig = () => ({
    jwtSecret: requireEnv("JWT_SECRET"),
    accessTokenTtlSeconds: intEnv("ACCESS_TOKEN_TTL_SECONDS", 24 * 60 * 60),
    refreshTokenTtlSeconds: intEnv(
        "REFRESH_TOKEN_TTL_SECONDS",
        7 * 24 * 60 * 60,
    ),
});

export const getMailConfig = () => ({
    host: stringEnv("SMTP_HOST", ""),
    port: intEnv("SMTP_PORT", 1025),
    secure: boolEnv("SMTP_SECURE", false),
    user: stringEnv("SMTP_USER", ""),
    pass: stringEnv("SMTP_PASS", ""),
    from: stringEnv("FROM_EMAIL", ""),
    rejectUnauthorized: boolEnv("SMTP_REJECT_UNAUTHORIZED", false),
});

// Ключи внешних сервисов не обязательны для старта приложения:
// без них падает только соответствующая ручка, а не весь бэкенд.
export const getAiConfig = () => ({
    apiKey: stringEnv("YANDEX_AI_API_TEST_KEY", ""),
    folderId: stringEnv("YANDEX_CLOUD_FOLDER_KEY", ""),
    baseUrl: stringEnv(
        "YANDEX_AI_BASE_URL",
        "https://rest-assistant.api.cloud.yandex.net/v1",
    ),
    model: stringEnv("YANDEX_AI_MODEL", "yandexgpt/latest"),
    // Не задан — используется дефолтный промпт из ai.service.ts.
    systemPrompt: process.env.AI_SYSTEM_PROMPT,
    temperature: floatEnv("AI_TEMPERATURE", 0.3),
    maxOutputTokens: intEnv("AI_MAX_OUTPUT_TOKENS", 500),
});

export const getCryptoCloudConfig = () => ({
    apiKey: stringEnv("CRYPTO_CLOUD_API_KEY", ""),
    shopId: stringEnv("CRYPTO_CLOUD_SHOP_ID", ""),
    invoiceUrl: stringEnv(
        "CRYPTO_CLOUD_INVOICE_URL",
        "https://api.cryptocloud.plus/v2/invoice/create",
    ),
});

// Подмена домена в ответах API. Если хотя бы одна переменная не задана,
// интерцептор ничего не делает.
export const getUrlReplacementConfig = () => ({
    sourceUrl: stringEnv("URL_REPLACEMENT_SOURCE", ""),
    targetUrl: stringEnv("URL_REPLACEMENT_TARGET", ""),
});
