# TODO NEXT — BL-004 InmoDesk

Próximos pasos de desarrollo y refinamiento del SaaS inmobiliario.

## 1. Completado (Demo Comercial MVP v0)
- [x] Confirmar nombre comercial provisional: BaseLogic InmoDesk.
- [x] Confirmar nombre de la demo pública: Altavista Propiedades.
- [x] Crear el proyecto base del panel de administración reutilizable con Next.js y Tailwind CSS v4.
- [x] Diseñar una interfaz interactiva de alta fidelidad con paleta premium y micro-animaciones.
- [x] Implementar el flujo completo: Propiedad ➔ Prospecto (Lead) ➔ Visita en Agenda.
- [x] Integrar endpoints de API REST de simulación y carga de datos en archivo local persistido (`db.json`).
- [x] Dejar listo el widget de inserción frontend e instrucciones para la web pública del cliente.

## 1.5. Completado (Fase 1.5 - Estabilización Técnica y Contrato API)
- [x] **Asociación de Leads por Slug/ID**: Ajustada la API de Leads para resolver slugs de propiedades, validar que existan y estén publicadas antes de registrar.
- [x] **Refactorización del Widget de Integración**: Corregidos estilos inline inválidos (`height` y `padding`), cargando datos dinámicamente y agregando estados de carga, manejo de errores y validaciones seguras de DOM.
- [x] **Seguridad y Sanitización**: Confirmado que endpoints públicos de propiedades y leads filtran completamente campos privados como `internalNotes`, `documentationChecklist`, y datos de propietarios.
- [x] **Estabilización de Types y ESLint**: Corregidas firmas de parámetros dynamic params de Next.js y solucionados todos los warnings de renderizado y tipos.
- [x] **Documentación**: Contrato oficial de API pública redactado en `docs/16-public-api-contract.md`.

## 2. Siguientes Pasos de Producto (Fase B / C / D)
- [ ] **Creación del Repositorio Altavista Propiedades**:
  - Implementar la demo del sitio web público externo (e.g. en Next.js o como plugin WordPress).
  - Conectar el widget HTML o consumir la API pública `/api/public/demo/properties` para renderizar el catálogo vivo.
- [ ] **Migración a Base de Datos de Producción**:
  - Reemplazar la base de datos mock basada en `fs` con PostgreSQL / Prisma.
  - Diseñar esquemas relacionales robustos basados en `src/types/index.ts`.
- [ ] **Autenticación y Multi-inquilino (Multi-tenant)**:
  - Implementar Next-Auth / Auth.js.
  - Separar base de datos y esquemas para soportar múltiples corredoras independientes (inquilinos).
- [ ] **Integración con Portales**:
  - Diseñar la generación de feeds XML estándar (e.g., para TocToc, PortalInmobiliario, etc.) a partir de las propiedades del admin panel.
