# Stage 1 - build
FROM node:20-alpine AS build
WORKDIR /app

# COPY package fiels first
COPY package*.json ./
RUN npm run ci

# COPY rest of the code and build it
COPY . .
RUN npm run build

# Stage 2 - Production
FROM node:20-alpine
WORKDIR /app

# Only copy production dependencies and build folders
COPY --from=build app/package*.json ./
RUN npm run install --only=production
COPY --from=build app/dist ./dist


# RUN THE APP
CMD ['node','dist/main.js']