import { NextResponse } from 'next/server';
import { getLeads, saveLead } from '@/services/db';
import { Lead } from '@/types';

export async function GET() {
  try {
    return NextResponse.json(getLeads());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLead: Lead = {
      ...body,
      id: body.id || `lead-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString()
    };
    saveLead(newLead);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
