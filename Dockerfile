# Use the official Ubuntu base image
FROM ubuntu:22.04

# Avoid prompts from apt during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the system and install baseline DevOps utilities
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    curl \
    git \
    unzip \
    wget \
    nginx \
    php-fpm mysql-server php-mysql php-curl php-xml php-gd php-zip php-gd php-mbstring php-bcmath \
    nano \
    software-properties-common \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /var/www

# Keep the container alive and listening
CMD ["bash"]