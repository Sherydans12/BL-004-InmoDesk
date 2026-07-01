# 15 — Seguridad y privacidad inicial

## Separación de datos públicos e internos

Una regla fundamental del sistema es separar información interna de información pública.

## Datos internos que no deben exponerse públicamente

- Dirección exacta si el usuario no la autoriza.
- Datos del propietario.
- Comisión.
- Notas internas.
- Condiciones comerciales.
- Documentos.
- Leads.
- Teléfonos/emails internos no configurados como públicos.

## Datos públicos configurables

- Precio.
- Dirección pública o sector.
- Gastos comunes.
- Características.
- Descripción.
- Fotos.
- Nombre/contacto de la corredora.

## Reglas básicas para v1 productiva

- Autenticación real.
- Aislamiento multiempresa.
- Validación de permisos por tenant.
- Sanitización de formularios públicos.
- Protección contra spam en leads.
- Control de archivos subidos.
- Backups.
- Logs de acciones relevantes.

## MVP v0

En la demo v0 pueden existir simulaciones, pero la UI debe reflejar desde el inicio la existencia de datos internos y públicos separados.
