import { NextResponse } from 'next/server';
import { saveLead, getPropertyById, getPropertyBySlug, isPubliclyAvailableProperty } from '@/services/db';
import { Lead } from '@/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, propertyId, propertySlug, notes, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (name, email, phone)' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let targetProperty = null;

    if (propertySlug) {
      targetProperty = getPropertyBySlug(propertySlug);
      if (!targetProperty) {
        return NextResponse.json(
          { error: `Propiedad con el slug '${propertySlug}' no encontrada.` },
          { status: 400, headers: CORS_HEADERS }
        );
      }
    } else if (propertyId) {
      targetProperty = getPropertyById(propertyId);
      if (!targetProperty) {
        return NextResponse.json(
          { error: `Propiedad con el ID '${propertyId}' no encontrada.` },
          { status: 400, headers: CORS_HEADERS }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Se requiere propertySlug o propertyId para asociar el lead.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Validate that the property is publicly available
    if (!isPubliclyAvailableProperty(targetProperty)) {
      return NextResponse.json(
        { error: 'La propiedad solicitada no se encuentra disponible públicamente.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const leadNotes = notes || message || 'Lead ingresado desde formulario web público.';

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      status: 'nuevo',
      source: 'web',
      propertyId: targetProperty.id,
      agentName: targetProperty.agentName || 'Sofía Valdés',
      nextAction: 'Llamar para calificar interesado web',
      notes: leadNotes,
      createdAt: new Date().toISOString()
    };

    saveLead(newLead);

    const publicProperty = {
      id: targetProperty.id,
      slug: targetProperty.slug,
      title: targetProperty.title,
      comuna: targetProperty.comuna,
      operation: targetProperty.operation
    };

    return NextResponse.json(
      { success: true, lead: newLead, property: publicProperty },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Error in public leads API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor o cuerpo de solicitud inválido.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}
