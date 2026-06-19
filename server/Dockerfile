# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Cài đặt dependencies cần thiết cho bcrypt (native addon)
RUN apk add --no-cache python3 make g++

# Copy package files trước để tận dụng Docker layer cache
COPY package.json package-lock.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies để build TypeScript)
RUN npm ci

# Copy source code và config
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript -> JavaScript
RUN npm run build

# ---- Stage 2: Production ----
FROM node:22-alpine AS production

WORKDIR /app

# Cài đặt dependencies cần thiết cho bcrypt ở runtime
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Chỉ cài đặt production dependencies
RUN npm ci --omit=dev && \
    # Xóa build tools sau khi cài xong bcrypt để giảm image size
    apk del python3 make g++ && \
    npm cache clean --force

# Copy build output từ stage 1
COPY --from=builder /app/dist ./dist

# Tạo thư mục uploads cho static files
RUN mkdir -p uploads

# Expose port mặc định
EXPOSE 3000

# Chạy server
# Lưu ý: biến môi trường được truyền qua docker run --env-file hoặc docker-compose
CMD ["node", "dist/index.js"]
