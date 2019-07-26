FROM php:7-fpm

RUN apt-get update -y \
    && apt-get install -y nginx

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip

RUN apt-get update && \
    apt-get install -y --no-install-recommends git zip

WORKDIR /var/www/html

RUN curl --silent --show-error https://getcomposer.org/installer | php

WORKDIR /fantasy-calendar

COPY . .
COPY --chown=www-data:www-data setup/nginx/fantasy-calendar.conf /etc/nginx/conf.d/default.conf
COPY setup/entrypoint.sh /etc/entrypoint.sh

RUN chmod +x /etc/entrypoint.sh

RUN chown -R www-data:www-data /fantasy-calendar

RUN chmod -R 775 /fantasy-calendar

ENV APP_NAME FantasyCalendar
ENV DB_CONNECTION mysql
ENV DB_PORT 3306
ENV WEBADDRESS /

USER www-data

RUN ["/usr/local/bin/php", "/var/www/html/composer.phar", "install", "-d", "/fantasy-calendar/"]

USER root 

EXPOSE 80

ENTRYPOINT ["/etc/entrypoint.sh"]