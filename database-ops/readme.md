> Create 100,000 Fake users

```bash
docker exec -it db_primary psql -U admin -d company_db -c "CREATE TABLE logs (id SERIAL PRIMARY KEY, log_date DATE, message TEXT); INSERT INTO logs (log_date, message) SELECT current_date - (random() * 365)::int, md5(random()::text) FROM generate_series(1, 100000);"
```

> 