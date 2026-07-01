# Contrato de la API Pública — BL-004 InmoDesk

Este documento define formalmente el contrato de integración y los endpoints públicos expuestos por **BaseLogic InmoDesk** en su versión MVP v0 (`/api/public/demo/*`), diseñados específicamente para ser consumidos por el sitio público demo **Altavista Propiedades** u otros portales web clientes.

> [!IMPORTANT]
> Todos los endpoints públicos cuentan con soporte de **CORS (Cross-Origin Resource Sharing)** nativo habilitado a través de cabeceras en las respuestas HTTP, permitiendo el consumo seguro mediante `fetch` o `Axios` directamente desde el navegador del cliente.

---

## 1. GET `/api/public/demo/properties`

Obtiene el listado completo de las propiedades que están publicadas y disponibles en la plataforma.

* **Filtros Aplicados Internamente**:
  * `isPublished === true`
  * `status !== 'borrador'`
  * `status !== 'archivada'`

### Respuesta Exitosa (`200 OK`)

Retorna un arreglo JSON de objetos de propiedad con los campos públicos sanitizados:

```json
[
  {
    "id": "prop-1719811200000",
    "slug": "casa-moderna-san-damian",
    "title": "Moderna Casa en San Damián",
    "operation": "venta",
    "type": "casa",
    "status": "disponible",
    "priceCLP": 1250000000,
    "priceUF": 33200,
    "bedrooms": 5,
    "bathrooms": 6,
    "areaConstruida": 480,
    "areaTerreno": 1200,
    "address": "Av. San Damián 1400",
    "comuna": "Las Condes",
    "region": "Metropolitana",
    "description": "Exclusiva residencia minimalista en el sector más consolidado...",
    "mainImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    "isFeatured": true,
    "isPublished": true,
    "agentName": "Sofía Valdés",
    "createdAt": "2026-06-30T18:00:00.000Z"
  }
]
```

### Seguridad (Campos Sanitizados)
Los siguientes campos son omitidos **siempre** para garantizar la confidencialidad:
* `internalNotes` (Notas comerciales internas del corredor).
* `documentationChecklist` (Checklist de la situación legal de la propiedad).
* `ownerId` (ID del propietario mandante).
* Datos personales o comisiones asociadas del propietario.

---

## 2. GET `/api/public/demo/properties/[slug]`

Obtiene la información detallada de una propiedad específica mediante su URL amigable (`slug`).

* **Parámetros**: `slug` (String, en la ruta)
* **Regla de Negocio**: La propiedad debe existir y estar configurada como `isPublished: true`.

### Respuestas

#### Caso Exitoso (`200 OK`)
Retorna el objeto completo sanitizado de la propiedad (los mismos campos descritos en el endpoint de listado).

#### Caso No Encontrado (`404 Not Found`)
Si el slug no existe o la propiedad no está publicada:
```json
{
  "error": "Property not found or not published"
}
```

---

## 3. POST `/api/public/demo/leads`

Envía los datos de contacto del interesado captado desde el formulario del sitio web público y lo inyecta automáticamente en el pipeline de ventas interno con estado **"Nuevo"**.

### Cuerpo de la Solicitud (JSON Payload)

| Campo | Tipo | Obligatorio | Descripción |
| :--- | :--- | :---: | :--- |
| `name` | String | **Sí** | Nombre completo del prospecto. |
| `email` | String | **Sí** | Correo electrónico de contacto. |
| `phone` | String | **Sí** | Teléfono de contacto (móvil/fijo). |
| `propertySlug` | String | **Recomendado** | Slug de la propiedad por la que consulta (utilizado para resolver la asociación). |
| `propertyId` | String | **Opcional** | ID interno de la propiedad (mantenido para compatibilidad). |
| `message` | String | Opcional | Mensaje personalizado o consulta del usuario. |
| `notes` | String | Opcional | Notas del lead (se utiliza `message` preferentemente si ambos se proveen). |

> [!NOTE]
> Debe suministrarse obligatoriamente `propertySlug` o `propertyId`. Si ambos están presentes, se priorizará el `propertySlug`.

### Respuestas

#### Creación Exitosa (`201 Created`)
Registra el lead y devuelve el objeto del lead creado y los datos mínimos de la propiedad asociada:

```json
{
  "success": true,
  "lead": {
    "id": "lead-1782883000000",
    "name": "Francisca Pérez",
    "email": "francisca@correo.cl",
    "phone": "+56998765432",
    "status": "nuevo",
    "source": "web",
    "propertyId": "prop-1719811200000",
    "agentName": "Sofía Valdés",
    "nextAction": "Llamar para calificar interesado web",
    "notes": "Hola, me interesa agendar una visita a la casa.",
    "createdAt": "2026-07-01T05:20:00.000Z"
  },
  "property": {
    "id": "prop-1719811200000",
    "slug": "casa-moderna-san-damian",
    "title": "Moderna Casa en San Damián",
    "comuna": "Las Condes",
    "operation": "venta"
  }
}
```

#### Errores de Validación (`400 Bad Request`)

* **Campos Requeridos Faltantes**:
  ```json
  { "error": "Faltan campos obligatorios (name, email, phone)" }
  ```
* **Falta Identificador de Propiedad**:
  ```json
  { "error": "Se requiere propertySlug o propertyId para asociar el lead." }
  ```
* **Propiedad No Existe**:
  ```json
  { "error": "Propiedad con el slug 'slug-invalido' no encontrada." }
  ```
* **Propiedad No Publicada**:
  ```json
  { "error": "La propiedad solicitada no se encuentra publicada." }
  ```
