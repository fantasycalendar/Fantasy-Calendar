FROM bref/extra-redis-php-80 as redisextra
FROM bref/extra-gmp-php-80 as gmpextra
FROM bref/extra-imagick-php-80 as imagickextra
FROM bref/php-80-fpm-dev
COPY --from=redisextra /opt /opt
COPY --from=gmpextra /opt /opt
COPY --from=imagickextra /opt /opt
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/task
