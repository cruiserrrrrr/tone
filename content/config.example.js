// Скопируй этот файл в config.js и подставь свои значения.
// config.js не коммитится (см. .gitignore в корне репозитория).
//
// Важно: адрес бэкенда дублируется в manifest.json -> host_permissions.
// Если меняешь API_URL, поправь host_permissions вручную — манифест не умеет читать конфиг.
self.TONE_CONFIG = {
    API_URL: "http://localhost:3001/api",
};
