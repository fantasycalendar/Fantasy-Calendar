FROM php:7-fpm

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip

RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

RUN apt-get update && \
    apt-get install -y --no-install-recommends git zip

WORKDIR /var/www/html

RUN curl --silent --show-error https://getcomposer.org/installer | php

WORKDIR /fantasy-calendar

COPY . .

RUN chown -R www-data:www-data /fantasy-calendar

RUN chmod -R 775 /fantasy-calendar

USER www-data

ENV APP_NAME FantasyCalendar
ENV DB_CONNECTION mysql
ENV DB_PORT 3306
ENV WEBADDRESS /
