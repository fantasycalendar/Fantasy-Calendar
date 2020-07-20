#!/usr/bin/env bash
cd /fantasy-calendar/ || exit 1;
php artisan optimize
php artisan route:cache
service nginx start
php-fpm
