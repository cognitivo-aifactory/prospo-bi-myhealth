# --- Stage 1: Build the React Frontend ---
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Final Production Image ---
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./
# Copy the built frontend (vite outputs to 'build' directory)
COPY --from=build-stage /app/build ./dist 

EXPOSE 3001
CMD ["node", "server.js"]