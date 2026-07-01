# COOLIFY_DEPLOY.md — BL-004 InmoDesk

Guía de despliegue en Coolify para el SaaS principal **BaseLogic InmoDesk**.

---

## Dominio recomendado

```
https://inmodesk-demo.baselogic.cl
```

---

## Build Pack

**Dockerfile** (recomendado).

Configurar en Coolify:

```txt
Build Pack: Dockerfile
Dockerfile Path: ./Dockerfile
Port: 3000
```

No usar Nixpacks para este proyecto. Next.js 16 requiere una version de Node mas nueva que Node 18, `NIXPACKS_NODE_VERSION=22` puede resolver a Node 22.11.0 y algunas dependencias requieren `^22.13.0`, y `NIXPACKS_NODE_VERSION=24` puede fallar si Nixpacks no encuentra `nodejs_24`.

Si existe la variable `NIXPACKS_NODE_VERSION` en Coolify, eliminarla.

---

## Comandos

| Paso    | Comando           |
|---------|-------------------|
| Install | `npm install`     |
| Build   | `npm run build`   |
| Start   | `npm run start`   |

> Estos comandos se ejecutan desde la **raíz del monorepo**. Los scripts de `package.json` raíz delegan automáticamente al workspace `apps/admin`.

El Dockerfile usa `node:22.13.0-bookworm-slim`, ejecuta `npm ci`, compila con `npm run build` y arranca con `npm run start`.

---

## Puerto expuesto

```
3000
```

Next.js sirve en el puerto `3000` por defecto en producción (`next start`).

---

## Variables de Entorno

Configura las siguientes variables en el panel de variables de Coolify:

| Variable                  | Valor                        | Descripción                                              |
|---------------------------|------------------------------|----------------------------------------------------------|
| `NODE_ENV`                | `production`                 | Activa optimizaciones de Next.js para producción         |
| `INMODESK_DB_FILE_PATH`   | `/app/storage/db.json`       | Ruta al archivo de base mock en el volumen persistente   |

---

## Volumen Persistente

> ⚠️ **Crítico**: Sin este volumen, la base de datos mock se reinicia en cada redeploy.

En el panel de Coolify, configurar un volumen persistente:

```
Tipo:       Volume
Host path:  (gestionado por Coolify / nombre del volumen)
Mount path: /app/storage
```

Esto garantiza que `db.json` sobreviva rebuilds, reinicios y redeploys.

---

## Verificación post-deploy

### 1. Healthcheck del servicio

```bash
curl https://inmodesk-demo.baselogic.cl/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "service": "BL-004 InmoDesk",
  "timestamp": "2026-07-01T..."
}
```

### 2. Catálogo público de propiedades

```bash
curl https://inmodesk-demo.baselogic.cl/api/public/demo/properties
```

Debe retornar array JSON con propiedades publicadas y sanitizadas (sin campos internos).

### 3. Panel de administración

Navegar a: `https://inmodesk-demo.baselogic.cl/login`

Credenciales demo:
- Email: `sofia.valdes@inmodesk.cl`
- Contraseña: `inmodesk2026`

---

## Checklist post-deploy

- [ ] `GET /api/health` responde `200 OK` con `{ "status": "ok" }`
- [ ] `GET /api/public/demo/properties` retorna propiedades publicadas
- [ ] Panel admin accesible en `/login`
- [ ] Crear una propiedad de prueba y verificar que persiste tras reiniciar el contenedor
- [ ] Verificar que los logs del contenedor muestran: `[InmoDesk DB] Base mock inicializada en: /app/storage/db.json`
- [ ] CORS configurado con `Access-Control-Allow-Origin: *` (demo); restringir a `https://altavista-demo.baselogic.cl` en producción real

---

## Conexión con Altavista Propiedades

El sitio público **Altavista Propiedades** (`https://altavista-demo.baselogic.cl`) consume la API pública de InmoDesk.

La variable de entorno en el repo de Altavista debe apuntar a:

```env
NEXT_PUBLIC_INMODESK_API_URL=https://inmodesk-demo.baselogic.cl
```

Los endpoints públicos consumidos son:
- `GET /api/public/demo/properties` — catálogo completo
- `GET /api/public/demo/properties/[slug]` — detalle de propiedad
- `POST /api/public/demo/leads` — captura de prospectos
- `POST /api/public/demo/contact` — formulario de contacto general
- `POST /api/public/demo/owner-capture` — captación de propietarios

---

## CORS — Nota de Seguridad

Los endpoints públicos actualmente responden con `Access-Control-Allow-Origin: *` para facilitar la demo.

**Para producción real**, restringir el origen en cada route handler a:

```
Access-Control-Allow-Origin: https://altavista-demo.baselogic.cl
```

---

## Notas de Arquitectura

- **Base de datos**: Mock basada en `fs` (JSON). Para escalar, migrar a PostgreSQL + Prisma.
- **Autenticación**: Simulada con credenciales hardcodeadas. Para producción, implementar Next-Auth.
- **Multi-tenant**: No implementado aún. Hoja de ruta en `TODO_NEXT.md`.
