#!/bin/bash

PHP_VERSION=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')

sed -i "s|^listen = .*|listen = 9000|" /etc/php/$PHP_VERSION/fpm/pool.d/www.conf

service php${PHP_VERSION}-fpm start

tail -f /dev/null