# 14 — Separación de repositorio: Altavista Propiedades

## Decisión

El sitio público demo **Altavista Propiedades** será un repositorio/carpeta aparte del repo principal BL-004-InmoDesk.

## Motivo

El panel admin y el sistema SaaS deben ser reutilizables. En cambio, los sitios públicos de clientes pueden variar mucho en diseño, tecnología, estructura y nivel de autogestión.

Por eso:

- BL-004-InmoDesk = producto SaaS principal.
- Altavista Propiedades = demo pública a medida.

## Qué vive en BL-004-InmoDesk

- Panel admin.
- Modelo de datos.
- API/integración.
- Documentación del SaaS.
- Backlog del producto.
- Reglas para agentes.

## Qué vive en Altavista Propiedades

- Home pública.
- Listado público de propiedades.
- Detalle público.
- Formulario de contacto.
- Diseño visual a medida.
- Simulación o consumo de API pública.

## Relación técnica futura

Altavista debería consumir información desde BL-004 mediante:

- API pública.
- Widget.
- Datos mock en fase v0.

## Regla

No acoplar el admin a Altavista. Altavista debe ser un ejemplo de cliente, no la única forma posible de usar BL-004.
