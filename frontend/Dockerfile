# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json và package-lock.json
COPY frontend/package*.json ./
RUN npm install

# Copy toàn bộ source frontend
COPY frontend/ ./

# Copy file .env vào
COPY .env .env

# Build React
RUN npm run build

# Stage 2: Serve build output với Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy build output từ stage builder
COPY --from=builder /app/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
