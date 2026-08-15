FROM node:20

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create a non-root user for the app
RUN useradd -m devopsuser
USER devopsuser
WORKDIR /app