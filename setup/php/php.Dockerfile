FROM bref/extra-redis-php-74 as redisextra
FROM bref/extra-gmp-php-74 as gmpextra
FROM bref/extra-imagick-php-74 as imagickextra
FROM bref/php-74-fpm-dev
COPY --from=redisextra /opt /opt
COPY --from=gmpextra /opt /opt
COPY --from=imagickextra /opt /opt

RUN yum -y install mysql

WORKDIR /var/task

COPY . .

ENV APP_NAME FantasyCalendar
ENV DB_CONNECTION mysql
ENV DB_PORT 3306
ENV WEBADDRESS /
