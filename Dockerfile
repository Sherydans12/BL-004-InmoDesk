FROM node:22.13.0-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copiar manifiestos primero para aprovechar cache
COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/

# Instalar dependencias del monorepo
RUN npm ci

# Copiar codigo fuente
COPY . .

# Build de produccion
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]
