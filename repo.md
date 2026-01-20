# Tone Project

Проект представляет собой монорепозиторий, включающий в себя Backend на NestJS и расширение для браузера, ориентированное на работу с Telegram Web.

## Структура репозитория

- **backend/**: Серверная часть приложения на базе NestJS.
- **content/**: Скрипты расширения для внедрения в веб-страницы.
- **frontend/**: Директория для фронтенд-части (в данный момент пуста).
- **extension/**: Директория для сборки расширения (в данный момент пуста).

## Технологический стек

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (через TypeORM)
- **Email**: MailerModule (Handlebars templates)
- **Scheduling**: @nestjs/schedule
- **Config**: @nestjs/config (использование .env)

### Extension (Content Script)
- **Manifest Version**: 3
- **Target**: `https://web.telegram.org/*`
- **Функциональность**: Внедрение кнопки "T" (Tone) в интерфейс сообщений Telegram Web.

## Основные файлы
- `backend/src/app.module.ts`: Основной модуль сервера с конфигурацией БД и почты.
- `backend/typeOrm.config.ts`: Конфигурация DataSource для TypeORM.
- `content/manifest.json`: Манифест расширения.
- `content/content-tone.js`: Логика инъекции кнопки в Telegram Web.

## Запуск (Backend)
1. Установите зависимости в папке `backend`: `npm install`
2. Настройте `.env` файл.
3. Запустите в режиме разработки: `npm run start:dev`
