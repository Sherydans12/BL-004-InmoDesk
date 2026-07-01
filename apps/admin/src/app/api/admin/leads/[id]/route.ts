import { NextResponse } from 'next/server';
import { getLeadById, saveLead } from '@/services/db';

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const lead = getLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
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
    
    const existing = getLeadById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updatedLead = {
      ...existing,
      ...body,
      id // Ensure ID cannot be changed
    };

    saveLead(updatedLead);
    return NextResponse.json(updatedLead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
