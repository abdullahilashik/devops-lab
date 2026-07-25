# # STAGE 1: Build
# FROM node:22-alpine AS build
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .

# # This creates the folder /app/generated (because of your custom schema config)
# RUN npx prisma generate

# RUN npm run build

# # STAGE 2: Production
# FROM node:22-alpine
# WORKDIR /app

# COPY --from=build /app/package*.json ./
# RUN npm ci --only=production

# COPY --from=build /app/generated ./generated 

# COPY --from=build /app/dist ./dist

# CMD ["node", "dist/main"]


# Stage 1: Get the stable node version of 22
FROM node:22-alpine as build
# Set the working directory
WORKDIR /app

# Copy the package files for better caching
COPY package*.json .
# Run the clean install
RUN npm ci
# Copy everything ele
COPY . .
# Build the prisma because our system needs it
RUN npx prisma generate
# Run the build
RUN npm run build

# - This end the stage 1 - 

# Stage 2: Production get the node 22 version
FROM node:22-alpine
# Set the working directory
WORKDIR /app

# Copy the packages here too
COPY package*.json .
# Run the clean install only in prouction
RUN npm ci --only=production

# Copy the builds
COPY --from=build /app/generated ./generated
COPY --from=build /app/dist ./dist

# run the app
CMD ['node','dist/main']
