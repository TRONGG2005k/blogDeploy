# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . ./

# Create a .env file with build-time variables
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
RUN echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" >> .env
RUN echo "VITE_GOOGLE_REDIRECT_URI=${VITE_GOOGLE_REDIRECT_URI}" >> .env

# Build React Vite (mặc định ra dist)
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
