#!/bin/bash
# =============================================================
# Mayang Top Spender — VPS Deployment Script
# Target: Ubuntu 24.04, Nginx 1.24, PHP 8.5, MySQL 8.0
# Domain: loyalty.mayangmodestwear.com
# VPS: 72.62.122.234 (Hostinger)
# =============================================================

set -e

# ===================== KONFIGURASI =====================
DOMAIN="loyalty.mayangmodestwear.com"
APP_DIR="/var/www/mayang-top-spender"
DB_NAME="mayang_top_spender"
DB_USER="mayang_user"
DB_PASS="loyaltym4y4ng2"
REPO_URL="https://github.com/dzakyahnaf/mayang-top-spender.git"
PHP_VERSION="8.5"
PHP_FPM_SOCK="/run/php/php${PHP_VERSION}-fpm.sock"

# ===================== WARNA OUTPUT =====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo_step() { echo -e "\n${GREEN}[STEP $1]${NC} $2"; }
echo_ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
echo_warn() { echo -e "${YELLOW}  ⚠${NC} $1"; }
echo_err()  { echo -e "${RED}  ✗${NC} $1"; }

# ===================== CEK ROOT =====================
if [ "$EUID" -ne 0 ]; then
    echo_err "Jalankan script ini sebagai root: bash deploy-vps.sh"
    exit 1
fi

echo ""
echo "============================================"
echo "  Mayang Top Spender — Deployment"
echo "  Domain: ${DOMAIN}"
echo "============================================"

# ==========================================================
# STEP 1: Install PHP 8.5 Extensions & FPM
# ==========================================================
echo_step "1/10" "Installing PHP ${PHP_VERSION} extensions & FPM..."

apt-get update -qq

apt-get install -y -qq \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-mysql \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-bcmath \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-readline \
    unzip git

systemctl enable php${PHP_VERSION}-fpm
systemctl restart php${PHP_VERSION}-fpm

echo_ok "PHP ${PHP_VERSION}-FPM & extensions installed"

# ==========================================================
# STEP 2: Create MySQL Database & User
# ==========================================================
echo_step "2/10" "Setting up MySQL database..."

mysql -u root -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -u root -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"

echo_ok "Database '${DB_NAME}' & user '${DB_USER}' created"

# ==========================================================
# STEP 3: Clone Repository
# ==========================================================
echo_step "3/10" "Cloning repository..."

if [ -d "$APP_DIR" ]; then
    echo_warn "Directory ${APP_DIR} exists — pulling latest changes..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/main
else
    git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
echo_ok "Repository ready at ${APP_DIR}"

# ==========================================================
# STEP 4: Install PHP Dependencies (Composer)
# ==========================================================
echo_step "4/10" "Installing Composer dependencies..."

cd "$APP_DIR"

COMPOSER_ALLOW_SUPERUSER=1 composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

echo_ok "Composer dependencies installed"

# ==========================================================
# STEP 5: Configure .env
# ==========================================================
echo_step "5/10" "Configuring environment..."

cd "$APP_DIR"
cp .env.example .env

# Generate app key
php artisan key:generate --force --no-interaction

# Patch .env for production
sed -i 's|^APP_NAME=.*|APP_NAME="Mayang Top Spender"|' .env
sed -i 's|^APP_ENV=.*|APP_ENV=production|' .env
sed -i 's|^APP_DEBUG=.*|APP_DEBUG=false|' .env
sed -i "s|^APP_URL=.*|APP_URL=https://${DOMAIN}|" .env

sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" .env
sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" .env
sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" .env

sed -i 's|^SESSION_DRIVER=.*|SESSION_DRIVER=database|' .env
sed -i 's|^CACHE_STORE=.*|CACHE_STORE=file|' .env
sed -i 's|^QUEUE_CONNECTION=.*|QUEUE_CONNECTION=sync|' .env

echo_ok "Environment configured for production"

# ==========================================================
# STEP 6: Set File Permissions
# ==========================================================
echo_step "6/10" "Setting file permissions..."

chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"

echo_ok "Permissions set (owner: www-data)"

# ==========================================================
# STEP 7: Run Migrations & Seed
# ==========================================================
echo_step "7/10" "Running database migrations & seeder..."

cd "$APP_DIR"
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction

echo_ok "Database migrated & seeded"

# ==========================================================
# STEP 8: Build Frontend Assets (Vite + React)
# ==========================================================
echo_step "8/10" "Building frontend assets (npm)..."

cd "$APP_DIR"
npm ci --no-audit --no-fund
npm run build

echo_ok "Frontend assets built (Vite + React)"

# ==========================================================
# STEP 9: Laravel Optimization
# ==========================================================
echo_step "9/10" "Optimizing Laravel for production..."

cd "$APP_DIR"
php artisan storage:link --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions again after all operations
chown -R www-data:www-data "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"

echo_ok "Laravel optimized (config/route/view cached)"

# ==========================================================
# STEP 10: Nginx Virtual Host
# ==========================================================
echo_step "10/10" "Configuring Nginx..."

cat > /etc/nginx/sites-available/${DOMAIN} <<'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name loyalty.mayangmodestwear.com;
    root /var/www/mayang-top-spender/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    index index.php;
    charset utf-8;

    client_max_body_size 10M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Deny access to dotfiles (except .well-known for SSL)
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
NGINX_CONF

# Enable site
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/

# Test & reload
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo_ok "Nginx configured & reloaded"
else
    echo_err "Nginx config test failed! Check /etc/nginx/sites-available/${DOMAIN}"
    exit 1
fi

# ==========================================================
# SELESAI
# ==========================================================
echo ""
echo "============================================"
echo -e "${GREEN}  ✓ DEPLOYMENT BERHASIL!${NC}"
echo "============================================"
echo ""
echo "  URL     : http://${DOMAIN}"
echo "  App Dir : ${APP_DIR}"
echo "  DB      : ${DB_NAME} (user: ${DB_USER})"
echo ""
echo "  Default Login:"
echo "  ┌─────────┬────────────────────┬──────────┐"
echo "  │ Role    │ Email              │ Password │"
echo "  ├─────────┼────────────────────┼──────────┤"
echo "  │ Admin   │ admin@mayang.com   │ password │"
echo "  │ Kasir   │ kasir@mayang.com   │ password │"
echo "  └─────────┴────────────────────┴──────────┘"
echo ""
echo -e "${YELLOW}  LANGKAH TERAKHIR — Pasang SSL (HTTPS):${NC}"
echo ""
echo "  certbot --nginx -d ${DOMAIN}"
echo ""
echo "============================================"
