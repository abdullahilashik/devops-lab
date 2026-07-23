# STAGE 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# --- NEW STEP START ---
# Generate the Prisma Client
# This reads your schema.prisma and creates the 'generated/prisma/client' folder
RUN npx prisma generate
# --- NEW STEP END ---

# Now that the client is generated, the build will succeed
RUN npm run build

# STAGE 2: Production
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --only=production

# We MUST also copy the generated prisma client to the production stage
# because the production stage starts from a fresh image
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
# If you have a custom output folder like 'generated/', copy that too:
COPY --from=build /app/generated ./generated 

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]