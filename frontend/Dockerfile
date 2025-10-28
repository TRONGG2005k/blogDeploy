# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json và install dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . ./

# Build React
RUN npm run build

# Stage 2: Serve build output with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy build React từ builder
COPY --from=builder /app/dist ./

# Nginx config fallback cho React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
