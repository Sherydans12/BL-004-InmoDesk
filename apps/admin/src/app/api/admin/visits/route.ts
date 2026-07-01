import { NextResponse } from 'next/server';
import { getVisits, saveVisit } from '@/services/db';
import { Visit } from '@/types';

export async function GET() {
  try {
    return NextResponse.json(getVisits());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newVisit: Visit = {
      ...body,
      id: body.id || `visit-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString()
    };
    saveVisit(newVisit);
    return NextResponse.json(newVisit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save visit' }, { status: 500 });
  }
}
