# BL-004 — BaseLogic InmoDesk

SaaS principal del proyecto **BL-004 InmoDesk**, un panel inmobiliario reutilizable diseñado para corredores, agentes independientes e inmobiliarias.

## Stack Técnico Seleccionado

La base de la plataforma admin se encuentra en `apps/admin` y cuenta con el siguiente stack:
- **Core**: Next.js 16.2.9 (App Router) y React 19.
- **Estilos**: Tailwind CSS v4 con una paleta de colores personalizada (teal, slate, emerald, amber) y un diseño moderno (glassmorphism, micro-animaciones y bordes suaves).
- **Tipado**: TypeScript.
- **Iconografía**: Lucide React.
- **Base de Datos Mock**: Capa de persistencia local en `apps/admin/src/data/db.json` administrada dinámicamente mediante APIs REST internas basadas en `fs` de Node.js.

## Estructura del Workspace

```txt
BL-004-InmoDesk/
├── README.md
├── TODO_NEXT.md
├── CHANGELOG.md
├── package.json (Configuración de npm workspaces)
└── apps/
    └── admin/
        ├── package.json
        ├── next.config.ts
        ├── tsconfig.json
        ├── public/
        └── src/
            ├── app/          (Rutas y pantallas del panel y API endpoints)
            ├── components/   (Layout y componentes reutilizables)
            ├── data/         (Base de datos mock inicial y persistida)
            ├── services/     (Servicios CRUD de lectura/escritura)
            └── types/        (Modelos TypeScript de datos)
```

## Instrucciones para Levantar el Servidor Local

1. Instalar dependencias en el directorio raíz del proyecto:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   El servidor se ejecutará de forma predeterminada en `http://localhost:3000` (o el siguiente puerto disponible, como `http://localhost:3002`, si el puerto 3000 está en uso).
3. Compilar para producción (análisis de tipado y optimización estática):
   ```bash
   npm run build
   ```

## Credenciales de Acceso Demo

- **Email**: `sofia.valdes@inmodesk.cl`
- **Contraseña**: `inmodesk2026`

## Integración y API Pública

InmoDesk expone una API pública y segura para conectar directamente tu catálogo con sitios web externos. Consulta el [Contrato de la API Pública](file:///c:/Users/nicol/Documents/BL-004-InmoDesk/docs/16-public-api-contract.md) para más detalles sobre los payloads, sanitización y respuestas.

