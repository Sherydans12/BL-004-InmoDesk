# 08 — Estrategia de integración web

## Principio base

BL-004 no debe imponer un sitio público único.

El sistema debe permitir que las propiedades publicadas desde el panel puedan mostrarse en:

- WordPress.
- Sitios HTML.
- Next.js.
- Otros frameworks.
- Landings a medida.

## Por qué no hacer una landing reutilizable como core

Cada cliente inmobiliario puede necesitar una web muy distinta:

- Diseño personalizado.
- Branding propio.
- Secciones institucionales diferentes.
- Textos comerciales distintos.
- Nivel de autogestión distinto.
- Integración con sitio existente.

Por eso, la landing pública no debe ser el producto central. Debe ser una capa flexible.

## Estrategia por fases

### Fase 1: Simulación / demo

Para MVP v0, puede existir una integración simulada entre admin y sitio público demo.

Objetivo: mostrar el flujo comercial, no resolver todavía todas las complejidades técnicas.

### Fase 2: API pública

Endpoints sugeridos:

```txt
GET /public/{tenantSlug}/properties
GET /public/{tenantSlug}/properties/{propertySlug}
POST /public/{tenantSlug}/leads
```

Uso:

- Sitio público obtiene propiedades publicadas.
- Sitio público obtiene detalle de propiedad.
- Sitio público envía leads.

### Fase 3: Widget embebible

Ejemplo conceptual:

```html
<div id="bl004-properties" data-company="altavista-demo" data-view="grid"></div>
<script src="https://app.bl004.cl/widget.js"></script>
```

Ventajas:

- Fácil de insertar en WordPress.
- Fácil de usar en HTML.
- Sirve para clientes pequeños.
- Reduce costo de integración.

### Fase 4: Plugin WordPress

No incluir en MVP v0.

Más adelante podría incluir:

- Shortcode.
- Bloque Gutenberg.
- Configuración desde WP Admin.
- Cache.
- Filtros configurables.
- Estilos básicos personalizables.

## Integración con WordPress

Como probablemente muchos sitios públicos serán WordPress, la estrategia inicial debe considerar:

- Inserción mediante bloque HTML personalizado.
- Consumo de API desde theme/plugin custom.
- Shortcode futuro.
- Plugin propio futuro si hay tracción comercial.

## Reglas

- El panel debe ser la fuente de verdad para propiedades.
- El sitio público solo debe mostrar propiedades marcadas como publicadas.
- Los datos internos nunca deben exponerse públicamente.
- La dirección exacta debe ser configurable.
- El precio debe poder ocultarse.
- Los leads deben quedar asociados a la propiedad correspondiente.
