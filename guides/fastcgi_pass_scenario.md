Mental model of every possible scenario depending on where the php-fpm is or how installed and how nginx pass the requests to php-fpm. Demonstrates mental model and code example for the configuration.

---

# Scenario 1: Traditional Server (Most Common)

Both Nginx and PHP-FPM are installed on the **same Linux server**.

```
Internet
     │
     ▼
+----------------------+
| Ubuntu Server        |
|                      |
|  Nginx               |
|      │               |
|      ▼               |
| Unix Socket          |
|      │               |
|      ▼               |
| PHP-FPM              |
+----------------------+
```

### PHP-FPM

```ini
listen = /run/php/php8.3-fpm.sock
```

### Nginx

```nginx
fastcgi_pass unix:/run/php/php8.3-fpm.sock;
```

✅ Fastest

✅ Most common on Ubuntu/Debian

---

# Scenario 2: Same Server Using TCP

Everything is still on one machine.

```
Nginx
   │
127.0.0.1:9000
   │
PHP-FPM
```

### PHP-FPM

```ini
listen = 127.0.0.1:9000
```

### Nginx

```nginx
fastcgi_pass 127.0.0.1:9000;
```

Advantages

* easier to debug
* useful when socket permissions become annoying

Disadvantage

* slightly slower than socket

---

# Scenario 3: Docker (Official PHP Image)

```
Browser
     │
     ▼
Nginx Container
     │
 app:9000
     │
     ▼
PHP Container
```

### PHP image

Already configured

```ini
listen = 9000
```

### Nginx

```nginx
fastcgi_pass app:9000;
```

Nothing else required.

This is probably the most common Docker setup.

---

# Scenario 4: Docker (Ubuntu Image)

Exactly what you built.

```
Browser
     │
     ▼
Nginx
     │
ubuntu:9000
     │
     ▼
Ubuntu Container
     │
PHP-FPM
```

Default

```ini
listen=/run/php/php8.3-fpm.sock
```

Needs to become

```ini
listen=9000
```

Nginx

```nginx
fastcgi_pass ubuntu:9000;
```

---

# Scenario 5: Nginx and PHP on Different Servers

```
Server A

Nginx

↓

Server B

PHP-FPM
```

Server B

```ini
listen = 0.0.0.0:9000
```

Server A

```nginx
fastcgi_pass 192.168.1.15:9000;
```

Usually protected with firewall rules.

---

# Scenario 6: Load Balanced PHP

One Nginx

Many PHP servers

```
                PHP1
              /
Browser → Nginx
              \
               PHP2
```

Nginx

```nginx
upstream php_backend {

    server php1:9000;
    server php2:9000;
    server php3:9000;
}

location ~ \.php$ {

    fastcgi_pass php_backend;
}
```

Now Nginx distributes requests.

---

# Scenario 7: Kubernetes

```
Ingress

↓

Nginx Pod

↓

PHP Service

↓

Many PHP Pods
```

Nginx

```nginx
fastcgi_pass php-service:9000;
```

Kubernetes Service automatically balances requests.

---

# Scenario 8: Apache + PHP-FPM

Apache can also use PHP-FPM.

```
Apache

↓

PHP-FPM
```

Instead of

```
Nginx

↓

PHP-FPM
```

---

# Scenario 9: Apache mod_php

Old style.

```
Apache

↓

PHP Module
```

No PHP-FPM.

PHP lives inside Apache itself.

Simple

But inefficient.

Mostly legacy now.

---

# Scenario 10: CGI (Historical)

```
Nginx

↓

php-cgi

↓

Exit
```

Every request launches a PHP process.

Extremely slow.

Rarely used today.

---

# Scenario 11: PHP Built-in Server

```
php -S localhost:8000
```

```
Browser

↓

PHP
```

No Nginx.

No PHP-FPM.

Good for development only.

---

# Communication methods

| Method                | Used When        | Example                    |
| --------------------- | ---------------- | -------------------------- |
| Unix Socket           | Same machine     | `/run/php/php8.3-fpm.sock` |
| TCP localhost         | Same machine     | `127.0.0.1:9000`           |
| TCP private network   | Docker           | `app:9000`                 |
| TCP LAN               | Multiple servers | `192.168.1.20:9000`        |
| TCP Service Discovery | Kubernetes       | `php-service:9000`         |

---

# How PHP-FPM "listens"

`listen` can be one of three forms:

```ini
listen = /run/php/php8.3-fpm.sock
```

Unix socket.

---

```ini
listen = 127.0.0.1:9000
```

Only the local machine can connect.

---

```ini
listen = 0.0.0.0:9000
```

Any machine that can reach the server may connect (subject to firewall/network rules).

---

# How Nginx "talks"

These are equivalent depending on where PHP-FPM is:

```nginx
fastcgi_pass unix:/run/php/php8.3-fpm.sock;
```

↓

```nginx
fastcgi_pass 127.0.0.1:9000;
```

↓

```nginx
fastcgi_pass app:9000;
```

↓

```nginx
fastcgi_pass php-server.example.com:9000;
```

The only thing that changes is **where PHP-FPM is located**.

---

# The one diagram I recommend remembering

```
                Browser
                   │
          HTTP / HTTPS
                   │
                   ▼
               Nginx
                   │
             FastCGI Protocol
                   │
        Socket or TCP (9000)
                   │
                   ▼
              PHP-FPM
                   │
           Executes PHP code
                   │
                   ▼
          HTML / JSON Output
                   │
                   ▼
                Nginx
                   │
                   ▼
                Browser
```