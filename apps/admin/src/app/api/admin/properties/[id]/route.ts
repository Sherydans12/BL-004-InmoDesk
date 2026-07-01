import { NextResponse } from 'next/server';
import { getPropertyById, saveProperty } from '@/services/db';

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const property = getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    const existing = getPropertyById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const updatedProperty = {
      ...existing,
      ...body,
      id // Ensure ID cannot be changed
    };

    saveProperty(updatedProperty);
    return NextResponse.json(updatedProperty);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}
