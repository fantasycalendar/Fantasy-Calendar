alias composer='docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app composer:2.0.7'
alias npm='docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app node npm'
alias artisan='docker-compose exec fantasy-calendar-php php artisan'
