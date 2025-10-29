# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Nhận ARG từ docker-compose
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_REDIRECT_URI

COPY package*.json ./
RUN npm install
COPY . ./

# Build React Vite với env vars
RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID} \
    VITE_GOOGLE_REDIRECT_URI=${VITE_GOOGLE_REDIRECT_URI} \
    npm run build

# Stage 2: serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]