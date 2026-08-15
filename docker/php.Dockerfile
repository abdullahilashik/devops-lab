FROM php:8.3-fpm

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Run as non-root (PHP images already have a www-data user)
USER www-data