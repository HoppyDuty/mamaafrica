# --- Stage 1: build frontend assets ---
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: PHP runtime ---
FROM php:8.4-cli-bookworm AS app

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        unzip \
        git \
    && docker-php-ext-install pdo_pgsql pgsql pcntl bcmath zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Install PHP deps first for better layer caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --no-progress

# App source
COPY . .
COPY --from=node-builder /app/public/build ./public/build

RUN composer dump-autoload --optimize --no-dev \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
