FROM bref/extra-redis-php-80 as redisextra
FROM bref/extra-gmp-php-80 as gmpextra
FROM bref/extra-imagick-php-80 as imagickextra
FROM bref/php-80-fpm-dev
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
