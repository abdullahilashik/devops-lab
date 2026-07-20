# Full Production Infrastructure Guide: Laravel (Inertia + React + Vite)

This document serves as the engineering standard for deploying and managing production-grade Laravel applications on Ubuntu 24.04 LTS.

---

## 1. Server Baseline Setup

### OS Update & Core Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip zip software-properties-common ufw fail2ban
```

### PHP 8.4 Installation
Install via Ondřej Surý PPA for the latest stable PHP versions.
```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.4-fpm php8.4-mysql php8.4-xml php8.4-mbstring php8.4-curl php8.4-zip php8.4-bcmath php8.4-intl php8.4-gd php8.4-redis
```

### Composer & Node.js Setup
```bash
# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 2. Multi-Project Architecture

### Folder Structure
To support multiple projects on one server, use the `/var/www/` root with dedicated directories per project.

```text
/var/www/
├── project1/
│   ├── .env
│   ├── storage/
│   └── public/
└── project2/
    ├── .env
    ├── storage/
    └── public/
```

### Scalability Approach
- **Vertical**: Increase EC2 instance size (RAM/CPU).
- **Horizontal**: Move MySQL to AWS RDS and Redis to AWS ElastiCache, allowing multiple web servers to point to the same data layer.

---

## 3. Web Server Configuration

### Nginx (Primary)
Recommended for high-performance static asset handling and reverse proxying.

**Site Configuration:** `/etc/nginx/sites-available/project1`
```nginx
server {
    listen 80;
    server_name project1.com www.project1.com;
    root /var/www/project1/public;

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```
`sudo ln -s /etc/nginx/sites-available/project1 /etc/nginx/sites-enabled/`

### Apache (Alternative)
**VirtualHost Configuration:** `/etc/apache2/sites-available/project1.conf`
```apache
<VirtualHost *:80>
    ServerName project1.com
    DocumentRoot /var/www/project1/public

    <Directory /var/www/project1/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/project1_error.log
    CustomLog ${APACHE_LOG_DIR}/project1_access.log combined
</VirtualHost>
```
`sudo a2ensite project1.conf && sudo a2enmod rewrite && sudo systemctl restart apache2`

---

## 4. Database Management

### MySQL Installation
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### User Strategy
**1. Root Approach (Development only):** Direct access via `sudo mysql`. Not recommended for app connection.
**2. Dedicated User (Production Standard):**
```sql
CREATE DATABASE project1_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'project1_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON project1_db.* TO 'project1_user'@'localhost';
FLUSH PRIVILEGES;
```

**.env Example:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project1_db
DB_USERNAME=project1_user
DB_PASSWORD=SecurePassword123!
```

---

## 5. Laravel Deployment Workflow

### Initialization
```bash
cd /var/www/project1
composer install --no-dev --optimize-autoloader
cp .env.example .env
nano .env
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Permissions
```bash
sudo chown -R www-data:www-data /var/www/project1
sudo chmod -R 775 /var/www/project1/storage /var/www/project1/bootstrap/cache
```

---

## 6. Frontend Build (Vite/React)

### Build Process
```bash
npm install
npm run build
```

### Handling Low RAM (Swap Memory)
If `npm run build` crashes on small EC2 instances (t2.micro/t3.micro), create a swap file:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 7. Queue System

### Redis Installation (Optional)
```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
```
Change `.env`: `QUEUE_CONNECTION=redis`

### Supervisor Configuration
Supervisor ensures the queue worker stays alive.
```bash
sudo apt install -y supervisor
sudo nano /etc/supervisor/conf.d/project1-worker.conf
```
**Configuration:**
```ini
[program:project1-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/project1/artisan queue:work --sleep=3 --tries=3 --timeout=90
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/project1/storage/logs/worker.log
stopwaitsecs=90
```
`sudo supervisorctl reread && sudo supervisorctl update && sudo supervisorctl start project1-worker:*`

---

## 8. Scheduler

### Cron Setup (Recommended)
```bash
crontab -e
```
Add the following line to trigger the Laravel scheduler every minute:
```cron
* * * * * cd /var/www/project1 && php artisan schedule:run >> /dev/null 2>&1
```

---

## 9. SSL & Security

### Certbot SSL
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d project1.com -d www.project1.com
```

### Firewall (UFW)
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 10. Monitoring & Debugging

### Log Locations
- **Nginx**: `/var/log/nginx/error.log`
- **PHP-FPM**: `/var/log/php8.4-fpm.log`
- **Laravel**: `/var/www/project1/storage/logs/laravel.log`

### Troubleshooting Matrix
| Error | Diagnosis | Resolution |
|---|---|---|
| **502 Bad Gateway** | PHP-FPM crashed or socket mismatch | `sudo systemctl status php8.4-fpm` $\rightarrow$ Verify socket path in Nginx config |
| **500 Internal Error** | App crash or permission denied | Check `laravel.log` $\rightarrow$ `chmod -R 775 storage` |
| **Permission Denied** | Files owned by root | `sudo chown -R www-data:www-data /var/www/project1` |
| **MySQL Connection** | Wrong user/db or MySQL stopped | `sudo systemctl status mysql` $\rightarrow$ Check `.env` credentials |

---

## 11. New Project Checklist

Follow these steps for every new project added to the server:

1. [ ] Create directory: `mkdir /var/www/new-project`
2. [ ] Clone repository and install Composer dependencies.
3. [ ] Create MySQL database and dedicated user.
4. [ ] Configure `.env` file.
5. [ ] Run `php artisan key:generate` and `php artisan migrate --force`.
6. [ ] Build frontend: `npm install && npm run build`.
7. [ ] Set ownership: `chown -R www-data:www-data /var/www/new-project`.
8. [ ] Create Nginx config in `sites-available` and symlink to `sites-enabled`.
9. [ ] Run `certbot` for SSL.
10. [ ] Create Supervisor worker config and update.
11. [ ] Add project to crontab.
