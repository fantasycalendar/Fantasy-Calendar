FROM bref/extra-redis-php-82 AS redisextra
FROM bref/extra-gmp-php-82 AS gmpextra
FROM bref/extra-imagick-php-82 AS imagickextra
FROM bref/php-82-fpm-dev
# Copy GMP first (no conflicts)
COPY --from=gmpextra /opt /opt
# Copy Redis extension selectively (avoid overwriting /opt entirely)
COPY --from=redisextra /opt/bref/extensions/redis.so /opt/bref/extensions/redis.so
COPY --from=redisextra /opt/bref/etc/php/conf.d/ /opt/bref/etc/php/conf.d/
# Skip imagick - the bref/extra-imagick-php-82:latest is compiled against glibc 2.33
# which is incompatible with the Amazon Linux 2 base image (glibc 2.26)

RUN yum -y install mysql

WORKDIR /var/task

COPY . .

ENV APP_NAME FantasyCalendar
ENV DB_CONNECTION mysql
ENV DB_PORT 3306
ENV WEBADDRESS /
