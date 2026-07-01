# 00 — Visión general del proyecto

## Proyecto

- Código interno: **BL-004**.
- Nombre comercial provisional: **BaseLogic InmoDesk**.
- Categoría: SaaS inmobiliario reutilizable.
- Mercado objetivo: corredores, agentes inmobiliarios, corredoras pequeñas/medianas e inmobiliarias en etapa posterior.
- Estado: definición funcional y documental inicial.

## Problema que resuelve

Muchos corredores y pequeñas inmobiliarias gestionan propiedades, interesados, visitas y publicaciones usando herramientas dispersas: WhatsApp, Excel, Google Drive, formularios sueltos, portales externos y sitios web poco conectados.

Esto genera problemas:

- Propiedades desordenadas o duplicadas.
- Leads perdidos o sin seguimiento.
- Falta de trazabilidad comercial.
- Web pública desactualizada.
- Dificultad para mostrar profesionalismo ante propietarios y compradores.
- Dependencia de desarrollos web puntuales sin panel operativo real.

## Solución propuesta

BL-004 será un sistema que centraliza la operación inmobiliaria en un panel profesional:

- Administración de propiedades.
- Publicación web controlada desde el panel.
- Captura y gestión de leads.
- Pipeline comercial simple.
- Agenda de visitas.
- Gestión de propietarios.
- Configuración pública de la corredora/inmobiliaria.
- API/widget para integrar propiedades en sitios públicos personalizados.

## Decisión estratégica principal

El producto reutilizable no será una landing pública fija. El producto reutilizable será:

1. Panel de administración inmobiliario.
2. API/capa de integración.
3. Modelo de datos y lógica comercial.
4. Flujo de publicación y captación de leads.

Los sitios públicos de clientes podrán variar mucho en diseño y tecnología. Pueden ser WordPress, HTML, Next.js u otro framework. Por eso el sistema debe estar preparado para integrarse, no para imponer una web única.

## Demo comercial

Para reuniones y validación comercial se construirá una demo pública llamada **Altavista Propiedades**, conectada conceptualmente al panel admin.

Altavista será una muestra de cómo podría verse una web inmobiliaria a medida conectada a BL-004.

## Resultado esperado del MVP v0

Una demo navegable y convincente donde se pueda mostrar en vivo:

1. Crear/editar propiedad desde el admin.
2. Publicarla.
3. Verla aparecer en la web pública demo.
4. Captar un lead desde el formulario público.
5. Gestionar ese lead en el admin.
6. Agendar una visita.
7. Mover el lead por pipeline comercial.
