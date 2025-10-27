# Stage 1: Build React app
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json để cài dependencies
COPY frontend/package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code frontend
COPY frontend/ ./

# Copy file .env (nếu có)
COPY .env .env

# Build Vite (React)
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine

# Xóa toàn bộ content mặc định của nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy build output từ stage 1
COPY --from=builder /app/dist ./

# Copy nginx.conf từ stage 1
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
