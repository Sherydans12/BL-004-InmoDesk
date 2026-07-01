# Changelog — BL-004 InmoDesk

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
