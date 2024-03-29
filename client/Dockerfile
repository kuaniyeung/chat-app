# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.14.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Build application
RUN --mount=type=secret,id=VITE_SUPABASE_URL \
    --mount=type=secret,id=VITE_SUPABASE_KEY \
    --mount=type=secret,id=VITE_SERVER_ORIGIN \
    VITE_SUPABASE_URL="$(cat /run/secrets/VITE_SUPABASE_URL)" \
    VITE_SUPABASE_KEY="$(cat /run/secrets/VITE_SUPABASE_KEY)" \
    VITE_SERVER_ORIGIN="$(cat /run/secrets/VITE_SERVER_ORIGIN)" \
    npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Use nginx image for serving the built app
FROM nginx:alpine

# Copy built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/app.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
