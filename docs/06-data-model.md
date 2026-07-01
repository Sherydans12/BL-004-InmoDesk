# 06 — Modelo de datos inicial

Este modelo es conceptual. No representa todavía un esquema definitivo de base de datos.

## Tenant / Empresa

Representa una corredora, agente independiente o inmobiliaria.

Campos sugeridos:

- id.
- commercialName.
- legalName.
- logoUrl.
- email.
- phone.
- whatsapp.
- address.
- websiteUrl.
- instagramUrl.
- facebookUrl.
- linkedinUrl.
- primaryColor.
- publicDescription.
- publicSlug.
- createdAt.
- updatedAt.

## Usuario

Representa una persona que accede al panel.

Roles iniciales:

- ADMIN.
- AGENT.
- ASSISTANT.

Campos sugeridos:

- id.
- tenantId.
- name.
- email.
- phone.
- role.
- avatarUrl.
- isActive.
- createdAt.
- updatedAt.

## Propiedad

Entidad central del sistema.

Campos sugeridos:

- id.
- tenantId.
- ownerId.
- agentId.
- title.
- slug.
- propertyType.
- operationType.
- status.
- price.
- currency.
- commonExpenses.
- region.
- city.
- commune.
- sector.
- internalAddress.
- publicAddress.
- mapUrl.
- bedrooms.
- bathrooms.
- parkingSpaces.
- storageRooms.
- builtArea.
- totalArea.
- yearBuilt.
- floor.
- orientation.
- allowsPets.
- furnished.
- hasPool.
- hasBarbecueArea.
- hasTerrace.
- hasLaundryRoom.
- hasSecurity.
- shortDescription.
- longDescription.
- highlights.
- internalNotes.
- estimatedCommission.
- isPublished.
- isFeatured.
- showPrice.
- showExactAddress.
- showCommonExpenses.
- createdAt.
- updatedAt.

## Imagen de propiedad

Campos sugeridos:

- id.
- propertyId.
- url.
- order.
- isMain.
- altText.
- isPublic.
- createdAt.

## Propietario

Campos sugeridos:

- id.
- tenantId.
- name.
- phone.
- email.
- notes.
- agreedCommission.
- commercialConditions.
- createdAt.
- updatedAt.

## Lead

Campos sugeridos:

- id.
- tenantId.
- propertyId.
- assignedAgentId.
- name.
- phone.
- email.
- message.
- source.
- status.
- nextActionAt.
- notes.
- createdAt.
- updatedAt.

Fuentes sugeridas:

- PUBLIC_WEBSITE.
- MANUAL.
- WHATSAPP.
- REFERRAL.
- EXTERNAL_PORTAL.

## Visita

Campos sugeridos:

- id.
- tenantId.
- propertyId.
- leadId.
- agentId.
- scheduledAt.
- status.
- notes.
- createdAt.
- updatedAt.

Estados:

- SCHEDULED.
- COMPLETED.
- CANCELLED.
- RESCHEDULED.

## Nota interna

Campos sugeridos:

- id.
- tenantId.
- authorUserId.
- entityType.
- entityId.
- content.
- createdAt.

## Configuración pública

Puede estar incorporada en Tenant o separada.

Campos sugeridos:

- tenantId.
- publicName.
- publicLogoUrl.
- publicPhone.
- publicWhatsapp.
- publicEmail.
- publicAddress.
- publicPrimaryColor.
- publicIntroText.
- defaultContactMessage.
- integrationKey.
- createdAt.
- updatedAt.
