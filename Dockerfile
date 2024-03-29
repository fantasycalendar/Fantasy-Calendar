FROM php:8.1-fpm

COPY . /fantasy-calendar
COPY --chown=www-data:www-data setup/nginx/fantasy-calendar.conf /etc/nginx/conf.d/default.conf
COPY setup/entrypoint.sh /etc/entrypoint.sh

ENV FONTAWESOME_NPM_AUTH_TOKEN ""

WORKDIR /var/www/html

RUN apt-get update -y \
    && apt-get install -y nginx curl gnupg \
    && curl -sL https://deb.nodesource.com/setup_14.x  | bash - \
    && apt-get update && apt-get install -y \
               nodejs \
               libfreetype6-dev \
               libjpeg62-turbo-dev \
               libmcrypt-dev \
               libpng-dev \
               libzip-dev \
               libgmp-dev \
               libmagickwand-dev \
               unzip \
               zip \
               git \
    && apt-get clean \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip gmp bcmath exif \
    && pecl install -o -f redis \
    && pecl install imagick \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis \
    && docker-php-ext-enable imagick \
    && curl --silent --show-error https://getcomposer.org/installer | php \
    && chmod +x /etc/entrypoint.sh \
    && mkdir -p /fantasy-calendar/storage/framework/sessions \
    && mkdir -p /fantasy-calendar/storage/framework/views \
    && mkdir -p /fantasy-calendar/storage/framework/cache \
    && npm install --prefix /fantasy-calendar/ \
    && /usr/local/bin/php /var/www/html/composer.phar install -d /fantasy-calendar/ \
    && /usr/local/bin/php /var/www/html/composer.phar dump-auto -d /fantasy-calendar/ \
    && FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN npm run production --prefix /fantasy-calendar/ \
    && rm -rf /fantasy-calendar/node_modules \
    && chown -R www-data:www-data /fantasy-calendar \
    && chown -R www-data:www-data /var/www/ \
    && chmod -R 775 /fantasy-calendar

WORKDIR /fantasy-calendar

ENV APP_NAME FantasyCalendar
ENV DB_CONNECTION mysql
ENV DB_PORT 3306
ENV WEBADDRESS /

EXPOSE 80

ENTRYPOINT ["/etc/entrypoint.sh"]
