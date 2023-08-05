alias npm='docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app node:20 npm'
alias npx='docker run -it -e AWS_PROFILE=fc -u $(id -u):$(id -g) -v ${PWD}/:/app -v ~/.aws/:/home/node/.aws -w /app node:20 npx'
alias node='docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app node:20'
alias artisan='docker compose exec php php artisan'
alias fc_up='FC_WEB_PORT=9987 FC_BROWSERSYNC_PORT=9980 FC_BROWSERSYNC=true docker compose up'
alias fc_nohot='docker compose up'
alias fc_upd='FC_WEB_PORT=9987 FC_BROWSERSYNC_PORT=9980 FC_BROWSERSYNC=true docker compose up -d'
alias fc_nohotd='docker compose up -d'
alias docker-clean='docker compose down && docker stop $(docker ps -a -q) && docker system prune -a -f && composer install && docker compose build'

function composer() {
    docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/var/task -v ${COMPOSER_HOME:-$HOME/.composer}:/tmp -e COMPOSER_CACHE_DIR=/tmp/composer-cache -w /var/task fc-bref-composer composer $@;

    if [ $? -eq 125 ]; then
        docker compose build composer;
        docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/var/task -v ${COMPOSER_HOME:-$HOME/.composer}:/tmp -e COMPOSER_CACHE_DIR=/tmp/composer-cache -w /var/task fc-bref-composer composer $@;
    fi
}
