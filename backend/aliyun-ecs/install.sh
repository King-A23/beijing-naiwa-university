#!/bin/bash
# Run as root from the deployed directory after installing Node 24 and Caddy.
set -euo pipefail
cd /opt/naiwa-registry
id naiwa >/dev/null 2>&1 || useradd --system --home /var/lib/naiwa --shell /usr/sbin/nologin naiwa
install -d -m 700 -o naiwa -g naiwa /var/lib/naiwa
if [ ! -f /etc/naiwa-registry.env ]; then
  umask 077
  { printf 'REGISTRY_SIGNING_KEY=%s\n' "$(openssl rand -hex 32)";
    printf 'REGISTRY_ADMIN_KEY=%s\n' "$(openssl rand -hex 32)";
    printf 'REGISTRY_IMPORT_ENABLED=false\n';
  } > /etc/naiwa-registry.env
fi
install -m 644 naiwa-registry.service /etc/systemd/system/naiwa-registry.service
install -m 644 Caddyfile /etc/caddy/Caddyfile
install -m 755 backup.sh /etc/cron.daily/naiwa-backup
caddy validate --config /etc/caddy/Caddyfile
systemctl daemon-reload
systemctl enable --now naiwa-registry
systemctl reload caddy
curl --fail --silent http://127.0.0.1:8787/api/health
