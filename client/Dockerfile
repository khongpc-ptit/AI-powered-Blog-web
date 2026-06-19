# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files để tận dụng Docker layer cache
COPY package.json package-lock.json ./

# Cài đặt tất cả dependencies
RUN npm ci

# Copy source code và cấu hình
COPY . .

# Build Vite application -> tạo ra folder dist/
RUN npm run build

# ---- Stage 2: Production ----
FROM nginx:alpine AS production

# Copy cấu hình nginx tùy chỉnh (hỗ trợ React Router SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output từ stage 1 vào thư mục phục vụ tĩnh của nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 cho Nginx
EXPOSE 80

# Chạy Nginx ở foreground
CMD ["nginx", "-g", "daemon off;"]
