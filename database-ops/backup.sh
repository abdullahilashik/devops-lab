#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
DB_CONTAINER="db_primary"
DB_USER="admin"
DB_NAME="company_db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_$TIMESTAMP.sql"

echo "Starting backup of $DB_NAME..."

# 1. Create the backup
pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/$FILENAME

# 2. Verify the file exists and isn't empty
if [ -s "$BACKUP_DIR/$FILENAME" ]; then
    echo "Backup successful: $FILENAME"
else
    echo "Backup FAILED!"
    exit 1
fi

# 3. Delete backups older than 7 days
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete
echo "Old backups cleaned up."