alias composer='docker run -it -v ${PWD}/:/app composer'
alias npm='docker run -it -v ${PWD}/:/app -w /app node npm'
alias artisan='docker run -it -v ${PWD}/:/fantasy-calendar -w /fantasy-calendar fc-php php artisan'
