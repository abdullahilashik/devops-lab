# STAGE 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# This creates the folder /app/generated (because of your custom schema config)
RUN npx prisma generate

RUN npm run build

# STAGE 2: Production
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --only=production

# REMOVED: The line trying to copy /app/node_modules/.prisma (it doesn't exist!)

# KEEP THIS: This copies your custom generated client
COPY --from=build /app/generated ./generated 

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]