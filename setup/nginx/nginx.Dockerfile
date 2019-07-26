FROM nginxinc/nginx-unprivileged

COPY setup/nginx/fantasy-calendar.dev.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx . /fantasy-calendar

USER root

RUN chmod 755 /etc/nginx/conf.d/default.conf