# Name the node stage "builder"
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /app

# Copy our node module specification
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .env.production .env.production

# install node modules and build assets
RUN yarn install --production

# Copy all files from current directory to working dir in image
# Except the one defined in '.dockerignore'
COPY . .

# Create production build of React App
RUN yarn build

# Choose NGINX as our base Docker image
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf *

# Copy static assets from builder stage
COPY --from=builder /app/build .
COPY --from=builder /app/.env.production .env

# Entry point when Docker container has started
ENTRYPOINT ["nginx", "-g", "daemon off;"]