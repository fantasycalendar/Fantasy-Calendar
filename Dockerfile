FROM php:7-fpm

RUN apt-get update -y \
    && apt-get install -y nginx curl gnupg

RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs

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
COPY --chown=www-data:www-data setup/nginx/fantasy-calendar.conf /etc/nginx/conf.d/default.conf
COPY setup/entrypoint.sh /etc/entrypoint.sh

RUN chmod +x /etc/entrypoint.sh

RUN chown -R www-data:www-data /fantasy-calendar
RUN chown -R www-data:www-data /var/www/

RUN chmod -R 775 /fantasy-calendar

ENV APP_NAME FantasyCalendar
ENV DB_CONNECTION mysql
ENV DB_PORT 3306
ENV WEBADDRESS /

USER www-data

RUN mkdir -p /fantasy-calendar/storage/framework/sessions
RUN mkdir -p /fantasy-calendar/storage/framework/views
RUN mkdir -p /fantasy-calendar/storage/framework/cache

RUN npm install

RUN npm run production

RUN ["/usr/local/bin/php", "/var/www/html/composer.phar", "install", "-d", "/fantasy-calendar/"]

USER root

EXPOSE 80

ENTRYPOINT ["/etc/entrypoint.sh"]
