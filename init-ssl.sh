#!/bin/bash
# =============================================================
# Script khởi tạo SSL + Deploy AI Blog
# Chạy trên VPS - KHÔNG dùng docker-compose
# =============================================================

set -e

DOMAIN="khongpc.id.vn"
EMAIL="kpcuongz@gmail.com"  # ← ĐỔI EMAIL CỦA BẠN VÀO ĐÂY

echo "============================================="
echo "  🚀 Deploy AI Blog - $DOMAIN"
echo "============================================="

# -----------------------------------------------
# Bước 1: Cài đặt Nginx & Certbot (nếu chưa có)
# -----------------------------------------------
echo "[1/6] Cài đặt Nginx & Certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# -----------------------------------------------
# Bước 2: Build Docker images
# -----------------------------------------------
echo "[2/6] Build Docker images..."

echo "  → Building server..."
cd server
docker build -t ai-blog-server .
cd ..

echo "  → Building client..."
cd client
docker build -t ai-blog-client .
cd ..

# -----------------------------------------------
# Bước 3: Chạy Docker containers
# -----------------------------------------------
echo "[3/6] Khởi động Docker containers..."

# Dừng containers cũ (nếu có)
docker stop blog-server blog-client 2>/dev/null || true
docker rm blog-server blog-client 2>/dev/null || true

# Chạy server
docker run -d \
    -p 3000:3000 \
    --env-file ./server/.env \
    -v $(pwd)/server/uploads:/app/uploads \
    --restart unless-stopped \
    --name blog-server \
    ai-blog-server

# Chạy client
docker run -d \
    -p 5173:80 \
    --restart unless-stopped \
    --name blog-client \
    ai-blog-client

echo "  ✅ Containers đang chạy"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# -----------------------------------------------
# Bước 4: Cấu hình Nginx (không SSL trước)
# -----------------------------------------------
echo "[4/6] Cấu hình Nginx..."

# Tạo thư mục certbot
sudo mkdir -p /var/www/certbot

# Copy config không SSL
sudo cp nginx/nginx-no-ssl.conf /etc/nginx/sites-available/khongpc.id.vn

# Tạo symlink
sudo ln -sf /etc/nginx/sites-available/khongpc.id.vn /etc/nginx/sites-enabled/

# Xóa default config nếu có
sudo rm -f /etc/nginx/sites-enabled/default

# Test & reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "  ✅ Nginx đã chạy (HTTP)"

# -----------------------------------------------
# Bước 5: Lấy SSL Certificate
# -----------------------------------------------
echo "[5/6] Yêu cầu SSL certificate..."

sudo certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# -----------------------------------------------
# Bước 6: Áp dụng Nginx config đầy đủ (có SSL)
# -----------------------------------------------
echo "[6/6] Áp dụng config SSL đầy đủ..."

sudo cp nginx/nginx.conf /etc/nginx/sites-available/khongpc.id.vn
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "============================================="
echo "  ✅ Deploy thành công!"
echo "  🌐 https://$DOMAIN"
echo "============================================="
echo ""
echo "📋 Các lệnh hữu ích:"
echo "  docker ps                         → Xem containers"
echo "  docker logs -f blog-server        → Log backend"
echo "  docker logs -f blog-client        → Log frontend"
echo "  sudo nginx -t                     → Test Nginx config"
echo "  sudo systemctl reload nginx       → Reload Nginx"
echo "  sudo certbot renew --dry-run      → Test renew SSL"
