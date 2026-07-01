import { NextResponse } from 'next/server';
import { getPropertyBySlug } from '@/services/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const property = getPropertyBySlug(slug);

    if (!property || !property.isPublished) {
      return NextResponse.json(
        { error: 'Property not found or not published' },
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Strip internal/confidential fields
    const {
      internalNotes,
      documentationChecklist,
      ownerId,
      ...publicData
    } = property;

    return NextResponse.json(publicData, {
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
