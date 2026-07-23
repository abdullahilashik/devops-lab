# STAGE 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first
COPY package*.json ./

# CORRECT: No "run" here. 'ci' is a built-in command.
RUN npm ci

# COPY rest of the code and build it
COPY . .

# CORRECT: "build" is a custom script in package.json, so we use "run"
RUN npm run build

# STAGE 2: Production
FROM node:22-alpine
WORKDIR /app

# Only copy production dependencies and the compiled 'dist' folder
COPY --from=build /app/package*.json ./

# CORRECT: No "run" here.
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

# Exec form to prevent OS signal issues
CMD ["node", "dist/main"]