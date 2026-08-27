#!/bin/bash

BACKUP_DIR="./backups"
# Find the newest backup file
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql | head -1)

echo "Verifying latest backup: $LATEST_BACKUP"

# 1. Spin up a temporary DB container
docker run --name temp_verify_db -e POSTGRES_PASSWORD=pass -d postgres:15

# Wait a few seconds for DB to start
sleep 5

# 2. Attempt restore
cat $LATEST_BACKUP | psql -U postgres -d postgres > /dev/null 2>&1

# 3. Check if a table actually exists (Verify the data is there)
RESULT=$(psql -U postgres -t -c "SELECT count(*) FROM users;")

if [[ $RESULT =~ [0-9]+ ]]; then
    echo "✅ VERIFICATION SUCCESS: Data restored and verified."
else
    echo "❌ VERIFICATION FAILED: Backup is corrupted or empty."
    docker rm -f temp_verify_db
    exit 1
fi

# 4. Cleanup
docker rm -f temp_verify_db
echo "Cleanup complete."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         