# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
COPY .env .env
RUN npm run build

# Stage 2: Serve build output (copy thêm default.conf)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy build
COPY --from=builder /app/dist ./

# ✅ Copy nginx config
COPY frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
