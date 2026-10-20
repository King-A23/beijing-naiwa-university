#!/bin/sh
set -eu
umask 077
install -d -m 700 -o naiwa -g naiwa /var/lib/naiwa/backups
backup_path="/var/lib/naiwa/backups/students-$(date -u +%Y%m%dT%H%M%SZ).sqlite"
sqlite3 /var/lib/naiwa/students.sqlite ".backup '$backup_path'"
chown naiwa:naiwa "$backup_path"
find /var/lib/naiwa/backups -name 'students-*.sqlite' -mtime +14 -delete
