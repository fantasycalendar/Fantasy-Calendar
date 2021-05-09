FROM nginxinc/nginx-unprivileged

COPY setup/nginx/fantasy-calendar.dev.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx . /var/task

USER root

RUN chmod 755 /etc/nginx/conf.d/default.conf
