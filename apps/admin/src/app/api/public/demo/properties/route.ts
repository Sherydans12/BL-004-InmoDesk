import { NextResponse } from 'next/server';
import { getProperties } from '@/services/db';

export async function GET() {
  try {
    const allProperties = getProperties();
    // Filter only published properties
    const publishedProperties = allProperties.filter(p => p.isPublished && p.status !== 'borrador' && p.status !== 'archivada');
    
    // Map properties to remove internal/confidential fields
    const publicProperties = publishedProperties.map(p => {
      const {
        internalNotes,
        documentationChecklist,
        ownerId,
        ...publicData
      } = p;
      return publicData;
    });

    return NextResponse.json(publicProperties, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
