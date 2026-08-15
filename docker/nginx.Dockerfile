FROM nginx:latest

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Nginx needs these directories to be writable by the non-root user
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx

# Change Nginx to listen on 8080 instead of 80
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

USER nginx