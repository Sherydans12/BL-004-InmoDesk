# Changelog — BL-004 InmoDesk

## 0.1.1 — Estabilización Técnica y Contrato API (Fase 1.5)

- **Asociación Dinámica de Leads**: Modificado el endpoint POST `/api/public/demo/leads` para resolver propiedades por `propertySlug` o `propertyId`. Añadidas validaciones de existencia y de estado publicado (`isPublished === true`).
- **Simulador de Formulario**: Actualizado el formulario simulado en `/integration` para enviar el slug de la propiedad y mostrar el título dinámico en el alert de éxito.
- **Refactorización del Widget**: Corregidos estilos de la integración JS en `/settings` (de `h: 180px` a `height: 180px` y `p: 15px` a `padding: 15px`). Rediseñado el script de integración para cargar dinámicamente propiedades desde `/api/public/demo/properties`, controlar estados de carga/error, evitar romper ante contenedores inexistentes y evitar dependencias de terceros.
- **Sanitización de Respuestas Públicas**: Verificado que los endpoints de propiedades públicas y leads limpien en su totalidad la información de notas internas, dueños (`ownerId`), checklist de documentos internos, etc.
- **Documentación de API**: Redactado el contrato de integración en `docs/16-public-api-contract.md`.
- **Estabilización de Compilación**: Resueltos warnings de renderizado asíncrono en React effects y tipados en Next.js. El proyecto compila y lintéa con cero errores.

## 0.1.0 — Demo Comercial y Panel Admin Inicial (MVP v0)

- **Estructura del Proyecto**: Inicialización del monorepo `npm workspaces` con la app `admin` basada en Next.js 16 (App Router), Tailwind CSS v4, TypeScript y Lucide React.
- **Base de Datos Persistida Mock**: Creación de un servicio CRUD local (`services/db.ts`) con persistencia en JSON (`src/data/db.json`).
- **Endpoints REST**: Implementación de rutas de API para administración (`/api/admin/*`) e integración pública (`/api/public/demo/*`).
- **Interfaces Navegables**:
  - Pantalla de inicio de sesión (`/login`).
  - Dashboard con métricas de propiedades, leads nuevos, visitas y estimaciones de comisiones en UF.
  - CRUD de Propiedades con checklist documental legal interno.
  - Pipeline comercial estilo Kanban interactivo para la gestión de prospectos.
  - Agenda para registrar, cambiar estados (`programada`, `realizada`, `cancelada`) y calendarizar visitas.
  - Base de datos de propietarios y configuraciones del sitio.
  - Widget de código HTML/JS autogenerado para incrustar el catálogo vivo en portales externos.

## 0.0.1 — Paquete documental inicial

- Se define oficialmente el proyecto como BL-004.
- Se propone nombre comercial provisional: BaseLogic InmoDesk.
- Se define producto como SaaS inmobiliario reutilizable.
- Se separa el producto principal del sitio público demo Altavista Propiedades.
- Se define MVP v0 como demo comercial funcional.
- Se documentan módulos, pantallas, flujos, entidades, integraciones y roadmap.
