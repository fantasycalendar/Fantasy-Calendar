FROM bref/extra-redis-php-82 AS redisextra
FROM bref/extra-gmp-php-82 AS gmpextra
FROM bref/php-82-fpm-dev
COPY --from=gmpextra /opt /opt
COPY --from=redisextra /opt/bref/extensions/redis.so /opt/bref/extensions/redis.so
COPY --from=redisextra /opt/bref/etc/php/conf.d/ /opt/bref/etc/php/conf.d/
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/task
