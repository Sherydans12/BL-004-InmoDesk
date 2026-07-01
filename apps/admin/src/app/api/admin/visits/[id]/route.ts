import { NextResponse } from 'next/server';
import { getVisits, saveVisit } from '@/services/db';

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    const visits = getVisits();
    const existing = visits.find(v => v.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    const updatedVisit = {
      ...existing,
      ...body,
      id // Ensure ID cannot be changed
    };

    saveVisit(updatedVisit);
    return NextResponse.json(updatedVisit);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update visit' }, { status: 500 });
  }
}
