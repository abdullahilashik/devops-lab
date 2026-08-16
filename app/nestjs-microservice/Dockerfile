# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first
COPY package.*.json ./
RUN npm install

# copy rest of the code files and build it
COPY . .
run npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Only copy the production dependencies and the compiled 'dist folder'
COPY --from=build /app/package.*.json ./

RUN npm install --only=production
COPY --from=build /app/dist ./dist