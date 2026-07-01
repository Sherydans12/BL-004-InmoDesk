import { NextResponse } from 'next/server';
import { saveLead } from '@/services/db';
import { Lead } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, propertyId, notes } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields (name, email, phone)' }, { status: 400 });
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      status: 'nuevo',
      source: 'web',
      propertyId: propertyId || undefined,
      agentName: 'Sofía Valdés', // Default assigned agent
      nextAction: 'Llamar para calificar interesado web',
      notes: notes || 'Lead ingresado desde formulario web público.',
      createdAt: new Date().toISOString()
    };

    saveLead(newLead);

    return NextResponse.json({ success: true, lead: newLead }, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body or internal error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
