import { NextResponse } from 'next/server';
import { getOwners, saveOwner } from '@/services/db';
import { Owner } from '@/types';

export async function GET() {
  try {
    return NextResponse.json(getOwners());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch owners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOwner: Owner = {
      ...body,
      id: body.id || `owner-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString()
    };
    saveOwner(newOwner);
    return NextResponse.json(newOwner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save owner' }, { status: 500 });
  }
}
