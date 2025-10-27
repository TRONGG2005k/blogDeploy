# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json và package-lock.json
COPY frontend/package*.json ./

RUN npm install

# Copy toàn bộ code frontend
COPY frontend/ ./

# Copy file .env chung
COPY .env .env

# Build Vite
RUN npm run build

# Stage 2: Serve với nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy build output từ stage 1
COPY --from=builder /app/dist ./

# Copy nginx.conf từ stage 1 (đã có trong /app)
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

