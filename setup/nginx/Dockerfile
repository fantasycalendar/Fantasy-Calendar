FROM nginxinc/nginx-unprivileged

COPY  fantasy-calendar.conf /etc/nginx/conf.d/default.conf

USER root

RUN chmod 755 /etc/nginx/conf.d/default.conf