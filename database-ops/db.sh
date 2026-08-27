for file in migrations/*.sql; do
  echo "Applying $file..."
  sleep(1)
  cat "$file" | psql -U admin -d company_db
done
