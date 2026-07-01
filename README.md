# BL-004 — BaseLogic InmoDesk

Repositorio documental inicial para el proyecto **BL-004**, producto SaaS inmobiliario reutilizable orientado a corredores, agentes inmobiliarios e inmobiliarias pequeñas/medianas.

> Estado actual: definición de producto, alcance funcional y contexto para desarrollo futuro. No iniciar programación sin revisar `docs/00-project-overview.md`, `docs/02-mvp-v0-commercial-demo.md`, `docs/03-admin-panel-screen-map.md` y `prompts/01-agent-start-context.md`.

## Concepto del producto

**BaseLogic InmoDesk** será un sistema SaaS para administrar propiedades, leads, propietarios, visitas y publicación web desde un panel profesional, con integración flexible hacia sitios públicos personalizados, especialmente WordPress.

El producto reutilizable principal será el **panel de administración inmobiliario** y su **API/capa de integración**, no una landing pública rígida.

## Separación de repositorios

Este repositorio corresponde al producto principal:

- Panel admin reutilizable.
- Modelo funcional.
- API/capa de integración.
- Documentación del SaaS.
- Backlog del producto.

El sitio público demo **Altavista Propiedades** será otro repositorio/carpeta independiente.

## Estructura documental

```txt
BL-004-InmoDesk/
├── README.md
├── TODO_NEXT.md
├── CHANGELOG.md
├── project-decisions.json
├── docs/
├── backlog/
├── prompts/
├── specs/
└── assets-placeholder/
```

## Documentos clave

- `docs/00-project-overview.md`: visión general del proyecto.
- `docs/01-product-scope.md`: alcance funcional.
- `docs/02-mvp-v0-commercial-demo.md`: definición de MVP v0 demo comercial.
- `docs/03-admin-panel-screen-map.md`: mapa de pantallas del admin.
- `docs/04-public-demo-altavista.md`: alcance del sitio público demo separado.
- `docs/06-data-model.md`: entidades principales.
- `docs/08-integration-strategy.md`: estrategia de integración con sitios públicos y WordPress.
- `prompts/01-agent-start-context.md`: prompt base para agentes de desarrollo.

## Repositorio Git informado

Repositorio del proyecto principal:

```txt
https://github.com/Sherydans12/BL-004-InmoDesk
```

## Nota importante

Este paquete es una base documental inicial. Todavía no define stack definitivo, arquitectura técnica final, diseño visual final ni implementación de código.
