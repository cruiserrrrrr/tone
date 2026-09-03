# Tone Project

Проект представляет собой монорепозиторий, включающий в себя Backend на NestJS, веб-фронтенд, админку и расширение для браузера, ориентированное на работу с Telegram Web.

## Структура репозитория

- **backend/**: Серверная часть приложения на базе NestJS.
- **frontend/**: Клиентское веб-приложение (Next.js, Pages Router).
- **admin/**: Админ-панель (Next.js, Pages Router).
- **content/**: Скрипты расширения для внедрения в веб-страницы.
- **extension/**: Директория для сборки расширения (в данный момент пуста).

## Технологический стек

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (через TypeORM)
- **Email**: MailerModule (Handlebars templates)
- **Scheduling**: @nestjs/schedule
- **Config**: `.env` + централизованный модуль `backend/src/config/env.ts`

### Extension (Content Script)
- **Manifest Version**: 3
- **Target**: `https://web.telegram.org/*`
- **Функциональность**: Внедрение кнопки "T" (Tone) в интерфейс сообщений Telegram Web.

## Конфигурация

Никакие значения окружения и ключи в репозитории не хранятся. В каждом сервисе лежит `.env.example` со списком переменных и безопасными дефолтами — его нужно скопировать в `.env` и заполнить:

```bash
cp .env.example .env                  # docker-compose: БД, pgAdmin, Mailpit
cp backend/.env.example backend/.env  # БД, JWT, SMTP, ключи AI и оплаты
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
cp content/config.example.js content/config.js  # адрес API для расширения
```

Все `.env` и `content/config.js` перечислены в `.gitignore`.

Обязательные для старта бэкенда переменные — `DATABASE_*` и `JWT_SECRET`: без них приложение падает на старте с явным сообщением. Ключи внешних сервисов (Yandex Cloud AI, CryptoCloud) опциональны: без них бэкенд поднимется, а недоступной будет только соответствующая ручка.

Единственное место, где адрес бэкенда приходится держать в двух файлах, — расширение: `content/config.js` задаёт `API_URL`, а `content/manifest.json` — `host_permissions`. Манифест не умеет читать конфиг, поэтому при смене адреса поправь оба файла.

## Основные файлы
- `backend/src/config/env.ts`: единая точка чтения переменных окружения.
- `backend/src/app.module.ts`: основной модуль сервера с конфигурацией БД и почты.
- `backend/typeOrm.config.ts`, `backend/src/data-source.ts`: конфигурация DataSource для TypeORM.
- `content/manifest.json`: манифест расширения.
- `content/content-tone.js`: логика инъекции кнопки в Telegram Web.

## Запуск
1. Поднимите инфраструктуру: `docker compose up -d` (PostgreSQL, pgAdmin, Mailpit).
2. Установите зависимости и заполните `.env` в нужном сервисе.
3. Backend: `npm install && npm run typeorm:run-migrations && npm run start:dev`
4. Frontend / admin: `npm install && npm run dev`
5. Расширение: загрузите папку `content/` через `chrome://extensions` → «Загрузить распакованное».
