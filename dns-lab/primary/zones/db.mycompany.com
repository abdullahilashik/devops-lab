$TTL 300

@   IN  SOA ns1.mycompany.com. admin.mycompany.com. (
        2026082601 ; serial
        3600       ; refresh
        1800       ; retry
        604800     ; expire
        300        ; negative caching
    )

; --------------------------------------------------
; Authoritative nameservers
; --------------------------------------------------

    IN  NS  ns1.mycompany.com.
    IN  NS  ns2.mycompany.com.


; --------------------------------------------------
; Nameserver addresses
; --------------------------------------------------

ns1 IN  A 172.20.0.10
ns2 IN  A 172.20.0.11


; --------------------------------------------------
; Website
; --------------------------------------------------

@       IN  A       203.130.0.12
www     IN  CNAME   mycompany.com.


; --------------------------------------------------
; Applications
; --------------------------------------------------

api     IN  A       203.12.1.1
admin   IN  A       203.12.1.2
staging IN  A       203.12.1.3


; --------------------------------------------------
; Mail
; --------------------------------------------------

mail    IN  A       201.131.0.11
@       IN  MX      10 mail.mycompany.com.

; This is a key-signing key, keyid 10875, for mycompany.com.
; Created: 20260826064449 (Wed Aug 26 12:44:49 2026)
; Publish: 20260826064449 (Wed Aug 26 12:44:49 2026)
; Activate: 20260826064449 (Wed Aug 26 12:44:49 2026)
mycompany.com. IN DNSKEY 257 3 13 RSNmBh6eV8wVZmEF/wa/FYrIObsjtqnxBHuY7ozBbG7ZHm1QFGHfnoD+ 8chMdedV/R1FGi+0dTZJsRLBPShFzA==
; This is a zone-signing key, keyid 11407, for mycompany.com.
; Created: 20260826064356 (Wed Aug 26 12:43:56 2026)
; Publish: 20260826064356 (Wed Aug 26 12:43:56 2026)
; Activate: 20260826064356 (Wed Aug 26 12:43:56 2026)
mycompany.com. IN DNSKEY 256 3 13 w+vbVckUPIV+rn1EYzUQwQlg1gfB+99vqjzoH14Tph9j3iEvwspoar9K rW4ED2M+P9ENpMxZH+OZar+3N3mtwg==
