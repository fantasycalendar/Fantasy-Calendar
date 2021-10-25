alias npm='docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app node npm'
alias artisan='docker-compose exec php php artisan'
alias fc_up='FC_WEB_PORT=9987 FC_BROWSERSYNC_PORT=9980 FC_BROWSERSYNC=true docker-compose up'
alias fc_nohot='docker-compose up'
alias fc_upd='FC_WEB_PORT=9987 FC_BROWSERSYNC_PORT=9980 FC_BROWSERSYNC=true docker-compose up -d'
alias fc_nohotd='docker-compose up -d'
alias docker-clean='docker-compose down && docker stop $(docker ps -a -q) && docker system prune -a -f && composer install && docker-compose build'

function composer() {
    docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app fc-bref-composer composer $@;

    if [ $? -eq 125 ]; then
        docker-compose build composer;
        docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app fc-bref-composer composer $@;
    fi
}
