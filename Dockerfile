FROM node:22.13.0-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV npm_config_loglevel=warn

# Diagnostico basico
RUN node -v && npm -v

# Copiar manifiestos primero para aprovechar cache
COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/

# Durante build necesitamos devDependencies y optionalDependencies.
# Usamos npm install en vez de npm ci porque Tailwind/lightningcss depende
# de paquetes nativos opcionales por plataforma.
RUN npm install --include=dev --include=optional --no-audit --no-fund

# Copiar codigo fuente
COPY . .

# Verificar lightningcss desde el workspace que lo declara indirectamente.
RUN cd apps/admin && node -e "require('lightningcss'); console.log('lightningcss ok')"

# Build de produccion
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]
