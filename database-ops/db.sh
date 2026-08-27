for file in migrations/*.sql; do
  echo "Applying $file..."  
  cat "$file" | psql -U admin -d company_db
done
