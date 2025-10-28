# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
COPY .env .env
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist ./   
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
