# 03 — Mapa de pantallas del Admin Panel

## Concepto visual

El panel debe sentirse como una oficina inmobiliaria digital premium:

- Limpio.
- Luminoso.
- Profesional.
- Comercial.
- Fácil de usar.
- No técnico.
- No sobrecargado.

## Layout base

- Sidebar lateral.
- Header superior.
- Búsqueda global.
- Usuario/agente activo.
- Acceso rápido a sitio público.
- Notificaciones o alertas simples.

## Navegación principal

1. Dashboard.
2. Propiedades.
3. Leads.
4. Pipeline.
5. Agenda.
6. Propietarios.
7. Configuración pública.

## Pantalla: Login

Debe ser simple y elegante.

Elementos:

- Logo del producto.
- Campo email.
- Campo contraseña.
- Botón ingresar.
- Texto de demo si aplica.

## Pantalla: Dashboard

Métricas principales:

- Propiedades activas.
- Propiedades publicadas.
- Leads nuevos.
- Visitas esta semana.
- Leads pendientes.
- Propiedades reservadas.
- Comisión potencial estimada.

Bloques recomendados:

- Acciones rápidas.
- Últimos leads.
- Visitas próximas.
- Propiedades destacadas.
- Alertas: propiedades sin movimiento, leads sin contacto.

## Pantalla: Propiedades

Vista principal tipo tabla/cards.

Columnas recomendadas:

- Foto.
- Título.
- Operación.
- Tipo.
- Comuna.
- Precio.
- Estado.
- Publicada.
- Leads.
- Agente.
- Acciones.

Filtros:

- Venta/arriendo.
- Tipo.
- Estado.
- Comuna.
- Precio.
- Publicada.
- Destacada.

Acciones:

- Nueva propiedad.
- Ver detalle.
- Editar.
- Publicar/ocultar.
- Destacar.
- Ver en sitio público.
- Duplicar.
- Archivar.

## Pantalla: Crear/editar propiedad

Formulario dividido en secciones:

1. Información general.
2. Ubicación.
3. Características.
4. Descripción comercial.
5. Galería.
6. Datos internos.
7. Publicación.

El formulario debe evitar verse eterno. Usar tabs, acordeones o secciones claras.

## Pantalla: Detalle de propiedad

Debe mostrar:

- Foto principal grande.
- Estado.
- Precio.
- Operación.
- Datos clave.
- Botón ver publicación.
- Botón editar.
- Botón agendar visita.
- Botón registrar lead.
- Leads asociados.
- Visitas asociadas.
- Propietario.
- Notas internas.
- Checklist documental.

## Pantalla: Leads

Listado de interesados.

Columnas:

- Nombre.
- Propiedad.
- Canal.
- Estado.
- Agente.
- Fecha de ingreso.
- Próxima acción.

Acciones:

- Ver lead.
- Cambiar estado.
- Agendar visita.
- Contactar por WhatsApp.
- Asignar agente.

## Pantalla: Pipeline

Vista Kanban.

Columnas:

1. Nuevo.
2. Contactado.
3. Visita agendada.
4. Visitó.
5. En negociación.
6. Cerrado.
7. Perdido.

Cada tarjeta:

- Nombre del lead.
- Propiedad.
- Teléfono.
- Agente.
- Próxima acción.

## Pantalla: Agenda

Vista inicial puede ser listado.

Campos:

- Fecha.
- Hora.
- Propiedad.
- Lead.
- Agente.
- Estado.
- Notas.

Acciones:

- Agendar visita.
- Marcar realizada.
- Reagendar.
- Cancelar.

## Pantalla: Propietarios

Listado:

- Nombre.
- Teléfono.
- Email.
- Propiedades asociadas.
- Comisión acordada.
- Última actividad.

Detalle:

- Datos de contacto.
- Propiedades asociadas.
- Leads generados.
- Estado de cada propiedad.
- Notas internas.

## Pantalla: Configuración pública

Campos:

- Nombre comercial.
- Logo.
- Teléfono.
- WhatsApp.
- Email.
- Dirección.
- Redes sociales.
- Color principal.
- Texto de presentación.
- Mensaje de contacto.
- URL pública.
- Código de integración.

Bloque de integración ejemplo:

```html
<div id="bl004-properties" data-company="altavista-demo"></div>
<script src="https://demo.bl004.cl/widget.js"></script>
```
