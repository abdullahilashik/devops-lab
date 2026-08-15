FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive


#  Install the pre-requisites for our lab

# RUN apt-get update && apt-get install -y nano nginx php-fpm curl zip unzip git

#  Download the executbles

# CMD ['curl','-fsSL','https://deb.nodesource.com/setup_20.x','|','bash','-']

#  Install nodejs
# RUN apt-get install nodejs -y

#  Globally install pm2
# CMD ['npm','install','pm2','-g']

EXPOSE 80

#  Install composer so that we can work with laravel later
# COPY --FROM=composer:latest /usr/bin/composer /user/bin/composer

CMD ["/bin/bash"]