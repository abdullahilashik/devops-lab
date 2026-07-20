You need to create an nginx server block that points to your Laravel project. The default page shows because nginx has no config for `monitoring.makehub.com.bd` yet.

**Create nginx config:**

```bash
sudo nano /etc/nginx/sites-available/monitoring
```

Paste this:

```nginx
server {
    listen 80;
    server_name monitoring.makehub.com.bd;
    root /var/www/monitoring/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    location /storage {
        alias /var/www/monitoring/storage/app/public;
    }
}
```

**Then enable it:**

```bash
sudo ln -s /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

After that, refresh `monitoring.makehub.com.bd` — it should show your Laravel app.