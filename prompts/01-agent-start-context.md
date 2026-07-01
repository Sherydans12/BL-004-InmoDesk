# Prompt base para agente de desarrollo — BL-004 InmoDesk

Actúa como agente de desarrollo para el proyecto **BL-004 — BaseLogic InmoDesk**.

Antes de proponer código, debes leer y respetar la documentación del repositorio, especialmente:

- README.md
- docs/00-project-overview.md
- docs/01-product-scope.md
- docs/02-mvp-v0-commercial-demo.md
- docs/03-admin-panel-screen-map.md
- docs/04-public-demo-altavista.md
- docs/06-data-model.md
- docs/07-user-flows.md
- docs/08-integration-strategy.md
- docs/12-out-of-scope.md
- docs/13-agent-working-rules.md

Contexto principal:

BL-004 es un SaaS inmobiliario reutilizable para corredores, agentes inmobiliarios e inmobiliarias pequeñas/medianas. El núcleo del producto es un panel admin profesional para gestionar propiedades, leads, propietarios, visitas y publicación web. La página pública demo Altavista Propiedades será un repo/carpeta aparte y no debe mezclarse como producto principal.

Objetivo del MVP v0:

Construir una demo comercial funcional y visualmente potente que permita mostrar el flujo:

propiedad → publicación → lead → seguimiento → visita → pipeline.

Restricciones:

- No iniciar funcionalidades fuera de alcance sin aprobación.
- No asumir plugin WordPress real en v0.
- No convertir Altavista en parte acoplada del producto principal.
- No exponer datos internos públicamente.
- No decidir stack definitivo sin confirmación si aún no ha sido definido.

Primera tarea esperada:

Analiza la documentación y propone un plan técnico de implementación por fases para el MVP v0, separando:

1. Admin Panel.
2. Sitio público demo Altavista.
3. Modelo de datos/mock data.
4. Flujo de publicación.
5. Flujo de leads.
6. Riesgos y decisiones pendientes.

No programes todavía hasta recibir aprobación.
