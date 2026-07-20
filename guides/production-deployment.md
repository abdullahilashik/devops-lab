# Production Deployment Guide: Laravel (Inertia + React + Vite)

## 1. Server Preparation
Update system packages and install essential tools.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip zip nginx mysql-server php-fpm php-mysql php-xml php-mbstring php-curl php-zip php-bcmath php-intl php-gd
```

## 2. Database Setup
Create the database and a dedicated user.
```bash
sudo mysql
```
Inside MySQL shell:
```sql
CREATE DATABASE marketplace;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. PHP & Composer Setup
Install Composer globally.
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## 4. Node.js Setup (Vite)
Install Node.js and NPM.
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 5. Project Setup
Clone the project and configure the environment.
```bash
# Clone into /var/www/
sudo mkdir -p /var/www/marketplace
sudo chown $USER:$USER /var/www/marketplace
cd /var/www/marketplace
git clone <your-repo-url> .

# Environment configuration
cp .env.example .env
nano .env
```
**Update `.env` placeholders:**
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=http://your-domain.com`
- `DB_DATABASE=marketplace`
- `DB_USERNAME=marketplace_user`
- `DB_PASSWORD=your_strong_password`

**Install dependencies and initialize:**
```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
```

**Build Frontend (Vite):**
```bash
npm install
npm run build
```

## 6. Nginx Configuration
Create a server block for the application.
```bash
sudo nano /etc/nginx/sites-available/marketplace
```
Paste the following configuration:
```nginx
server {
    listen 80;
    server_name localhost;

    root /var/www/marketplace/public;
    index index.php;

    charset utf-8;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
        expires max;
        log_not_found off;
    }
}
```
**Enable site and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Permissions
Assign ownership to the web server user (`www-data`).
```bash
sudo chown -R www-data:www-data /var/www/marketplace
sudo chmod -R 775 /var/www/marketplace/storage
sudo chmod -R 775 /var/www/marketplace/bootstrap/cache
```

_Extra_
PHP-FPM restart were necessary

```bash
sudo systemctl restart php8.3-fpm
```

## 8. Queue & Scheduler
### Manual Queue Start
To start the queue worker (use `nohup` or `screen` for minimal setup):
```bash
nohup php /var/www/marketplace/artisan queue:work --sleep=3 --tries=3 --timeout=90 > /var/www/marketplace/storage/logs/queue.log 2>&1 &
```

### Cron Scheduler
Add the Laravel scheduler to the system crontab.
```bash
crontab -e
```
Add this line to the end of the file:
```cron
* * * * * cd /var/www/marketplace && php artisan schedule:run >> /dev/null 2>&1
```

## 9. Basic Troubleshooting
| Issue | Cause | Fix |
|---|---|---|
| **502 Bad Gateway** | PHP-FPM is not running or socket path is wrong | `sudo systemctl status php8.3-fpm` $\rightarrow$ Check path in Nginx config |
| **500 Internal Error** | `.env` missing, wrong permissions, or syntax error | Check `storage/logs/laravel.log` $\rightarrow$ Run `chmod -R 775 storage` |
| **403 Forbidden** | Incorrect Nginx root or file permissions | Verify `root` in Nginx $\rightarrow$ `sudo chown -R www-data:www-data` |
| **Vite assets 404** | Manifest not found or build skipped | Run `npm install && npm run build` |
| **DB Connection Refused** | Wrong DB credentials in `.env` | Verify `DB_USERNAME` and `DB_PASSWORD` |
