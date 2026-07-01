import { NextResponse } from 'next/server';
import { getProperties, saveProperty } from '@/services/db';
import { Property } from '@/types';

export async function GET() {
  try {
    return NextResponse.json(getProperties());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProperty: Property = {
      ...body,
      id: body.id || `prop-${Date.now()}`,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      createdAt: body.createdAt || new Date().toISOString()
    };
    saveProperty(newProperty);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save property' }, { status: 500 });
  }
}
