import { NextResponse } from 'next/server';
import { saveLead } from '@/services/db';
import { Lead } from '@/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      operationIntent,
      propertyType,
      propertyComuna,
      propertyAddress,
      estimatedPrice,
      message,
      preferredContactMethod
    } = body;

    if (!name || !email || !phone || !operationIntent || !propertyType || !propertyComuna) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (name, email, phone, operationIntent, propertyType, propertyComuna)' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      status: 'nuevo',
      source: 'web_owner',
      agentName: 'Sofía Valdés',
      nextAction: 'Contactar propietario para evaluación',
      notes: message || `Solicitud de propietario para publicar. Tipo: ${propertyType}, Operación: ${operationIntent}, Comuna: ${propertyComuna}`,
      createdAt: new Date().toISOString(),
      leadType: 'owner_capture',
      operationIntent,
      propertyType,
      propertyComuna,
      propertyAddress,
      estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
      message,
      preferredContactMethod
    };

    saveLead(newLead);

    return NextResponse.json(
      { success: true, lead: newLead },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Error in public owner leads API:', error);
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
