$TTL 3600

@   IN  SOA ns1.mycompany.com. admin.mycompany.com. (
        2026082401
        3600
        1800
        604800
        3600
)

@       IN  NS      ns1.mycompany.com.
@       IN  NS      ns2.mycompany.com.

ns1     IN  A       127.0.0.1
ns2     IN  A       127.0.0.1

@       IN  A       203.130.0.12
@       IN  AAAA    2001:db8:1234::12

www     IN  CNAME   mycompany.com.

mail    IN  A       201.131.0.11
@       IN  MX      10 mail.mycompany.com.

api     IN  A       203.12.1.1
admin   IN  A       203.12.1.2
staging IN  A       203.12.1.3

@       IN  TXT     "v=example-verification1"
@       IN  CAA     0 issue "letsencrypt.org"